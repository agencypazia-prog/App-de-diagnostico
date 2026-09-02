import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createDataStore } from './dataStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadDotEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv();

function getDeepseekKey() {
  return process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY || '';
}

// --- Consultant auth (token protects listing/reading/deleting all client data) ---
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me';
if (!process.env.AUTH_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('AVISO: AUTH_SECRET no está configurado. Define esta variable de entorno en producción.');
}
const CONSULTANT_CODES = (
  process.env.CONSULTANT_ACCESS_CODES || 'PAZ2026,ORTEGA_IA,CONSULTOR_PAZ,DEMO_PLANTA'
)
  .split(',')
  .map((s) => s.trim().toUpperCase())
  .filter(Boolean);
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', AUTH_SECRET).update(body).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function requireConsultant(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'unauthorized' });
  req.consultant = payload;
  next();
}

// --- CORS: restrict to ALLOWED_ORIGINS when set. Left open by default because the
// frontend is normally served by this same Express app (true same-origin), and dev
// tooling (the Vite proxy) forwards the browser's Origin header to this server even
// for same-origin requests, so a strict default breaks local dev. The endpoints that
// actually expose client data require a consultant auth token regardless of origin. ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (allowedOrigins.length === 0) {
  console.warn('AVISO: ALLOWED_ORIGINS no está configurado — CORS permite cualquier origen.');
}

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_DIR = path.join(__dirname, 'data');
const INSTRUMENT_CATALOG_FILE = path.join(DATA_DIR, 'instruments_catalog.json');

const store = await createDataStore(DATA_DIR);

function loadInstrumentCatalog() {
  try {
    if (!fs.existsSync(INSTRUMENT_CATALOG_FILE)) return [];
    return JSON.parse(fs.readFileSync(INSTRUMENT_CATALOG_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error loading instrument catalog:', err);
    return [];
  }
}

const INSTRUMENT_CATALOG = loadInstrumentCatalog();

function buildSystemPrompt() {
  return `Eres el acompañante de diagnóstico de PAZ ORTEGA IA. Estás con una persona que habla de su empresa. Tu trabajo es entender cómo trabaja de verdad, con calma y atención, para que después el consultor pueda darle un enfoque nuevo y más valor.

No eres un formulario. No eres un encuestador. Eres alguien que escucha y, cuando hace falta, pregunta.

Cómo hablar:
- Español natural, de tú a tú, frases cortas.
- Antes de preguntar, reacciona en media frase a lo que acaba de decir — algo específico a SU respuesta (una observación, una conexión con lo anterior, un matiz), nunca un halago genérico. Esa reacción es lo que hace que se sienta escuchado, no la pregunta en sí.
- No repitas la misma fórmula de entrada turno tras turno (nada de empezar siempre con "¿Y..."). Varía cómo entras: a veces una afirmación corta y luego la pregunta, a veces retomas una palabra exacta que usó la persona, a veces la pregunta sola porque la reacción ya fue implícita.
- Prefiere preguntas abiertas. Enumerar 2-3 alternativas dentro de la misma frase ("¿te preocupa más A, B o C?") es válido de vez en cuando si de verdad ayuda a concretar, pero no lo repitas turno tras turno o vuelve a sonar a formulario con otro disfraz.
- Una sola pregunta por turno. Que se sienta como la pregunta que haría un consultor sentado a su lado, no como un ítem de lista.
- No copies el texto del instrumento. Tradúcelo a la vida de esa empresa, con sus palabras.
- Nunca menciones IDs, “la siguiente pregunta”, “el instrumento”, “149” ni que estás cubriendo un cuestionario.
- Nada de muletillas: Excelente, Perfecto, Muy claro, Entendido, ¡Genial!, “gracias por compartir”, “me hace mucho sentido”. La calidez viene de la reacción específica de la que hablamos arriba, no de una palabra de relleno.
- No adules. No vendas. No expliques tu método.
- Si ya se entiende algo, no lo preguntes otra vez: anótalo en mappedAnswers y sigue.
- Nombre, rol o correo: encájalos cuando el hilo lo permita, no como campos.
- Opciones (2 a 5) solo si le ahorran esfuerzo. Si la respuesta pide relato, options = [].
- Recorre las seis áreas con fluidez, según lo que la persona va abriendo, no en orden rígido.

Ejemplo de ritmo (referencia de tono, no lo copies literal):
Persona: "soy asesor de procesos, veo temas de máquinas, pedidos y lotes"
Mal (lo que NO quieres — puro interrogatorio): "¿Y qué procesos son los que más te toca asesorar?"
Bien: "Ahí se cruzan varias cosas a la vez. ¿Cuál de esas tres te quita más tiempo en el día a día?"
La diferencia es la primera frase: nota algo real de lo que dijo antes de preguntar.
- Debes resolver TODO el mapa antes de cerrar, una conversación real de decenas de turnos — no de uno. Resolver no es recitar: si una respuesta ya cubre varios puntos del MISMO tema, anótalos todos en mappedAnswers (máximo unos pocos por turno) y no los vuelvas a preguntar.
- "P" (no aplica) es solo para algo que la persona ya dijo explícitamente que no aplica o no sabe — nunca lo uses para adelantar preguntas que no se han hecho. No marques varias preguntas de temas distintos como "P" en el mismo turno solo por avanzar.
- Nunca invites a enviar mientras queden puntos pendientes. readyToClose = true SOLO cuando pendiente esté vacío Y la conversación ya cubrió de verdad las seis áreas — nunca en los primeros turnos.

Mapa interno (no lo recites; úsalo para saber qué aún no se ha dicho):
${JSON.stringify(INSTRUMENT_CATALOG)}

Al terminar cada turno, responde SOLO JSON:
{
  "reply": "lo que le dices a la persona",
  "options": [],
  "mappedAnswers": [{"questionId":"G01","status":"D","notes":"evidencia en sus palabras","selectedOption":"si aplica"}],
  "companyName": "string o null",
  "contactName": "string o null",
  "contactEmail": "string o null",
  "sector": "string o null",
  "readyToClose": false
}`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

function flattenCatalogQuestions(catalog) {
  const out = [];
  for (const area of catalog || []) {
    for (const sec of area.secciones || []) {
      for (const q of sec.preguntas || []) {
        if (q?.id) out.push({ id: q.id, area: area.area, texto: q.texto });
      }
    }
  }
  return out;
}

const ALL_INSTRUMENT_QUESTIONS = flattenCatalogQuestions(INSTRUMENT_CATALOG);
const VALID_QUESTION_IDS = new Set(ALL_INSTRUMENT_QUESTIONS.map((q) => q.id));

// Guardrail: the model self-reports which questions got answered each turn, and
// nothing else checks that report before it drives readyToClose. Left unbounded, a
// single turn can (and, in testing, occasionally does) mark the entire 149-question
// map as answered/not-applicable at once and close the conversation prematurely.
// Cap how much a single turn can resolve — a rich answer can legitimately cover a
// handful of related questions, but not the whole instrument.
const MAX_MAPPED_PER_TURN = 8;
const MAX_NOT_APPLICABLE_PER_TURN = 3;

function capMappedAnswers(rawMapped, alreadyAnswered) {
  let total = 0;
  let notApplicable = 0;
  const out = [];
  for (const item of rawMapped) {
    if (!item?.questionId || !VALID_QUESTION_IDS.has(item.questionId)) continue;
    if (alreadyAnswered[item.questionId]) continue;
    if (total >= MAX_MAPPED_PER_TURN) continue;
    if (item.status === 'P') {
      if (notApplicable >= MAX_NOT_APPLICABLE_PER_TURN) continue;
      notApplicable += 1;
    }
    out.push(item);
    total += 1;
  }
  return out;
}

function remainingQuestionIds(answered) {
  const groups = {};
  let count = 0;
  for (const q of ALL_INSTRUMENT_QUESTIONS) {
    if (answered[q.id]) continue;
    if (!groups[q.area]) groups[q.area] = [];
    groups[q.area].push(q.id);
    count += 1;
  }
  return { groups, count };
}

function conversationToChatSession(conv) {
  if (!conv) return undefined;
  return {
    currentStageIndex: conv.messages?.length || 0,
    messages: conv.messages || [],
    companyName: conv.companyName || '',
    contactName: conv.contactName || '',
    contactEmail: conv.contactEmail || '',
    sector: conv.sector || '',
    employees: conv.employees || '',
    costBreakdown: conv.costBreakdown || {},
    attachments: conv.attachments || [],
    isCompleted: !!conv.isCompleted,
    isSubmitted: !!conv.isSubmitted,
    submittedAt: conv.submittedAt,
    empresaId: conv.empresaId,
    conversacionId: conv.id,
    instrumentAnswers: conv.instrumentAnswers || {},
    activeQuestionIds: conv.activeQuestionIds || [],
    phase: conv.phase,
  };
}

function hydrateEmpresa(empresa, conversaciones) {
  const conv =
    conversaciones.find((c) => c.empresaId === empresa.id && c.isSubmitted) ||
    conversaciones.find((c) => c.empresaId === empresa.id);
  if (!conv) return empresa;
  return {
    ...empresa,
    chatSession: conversationToChatSession(conv),
    costBreakdown: empresa.costBreakdown || conv.costBreakdown,
    attachments: empresa.attachments?.length ? empresa.attachments : conv.attachments,
  };
}

function splitCompanyPayload(company) {
  const chat = company.chatSession;
  const empresa = { ...company };
  let conversacion = null;
  if (chat) {
    conversacion = {
      id: chat.conversacionId || `conv_${company.id}`,
      empresaId: company.id,
      messages: chat.messages || [],
      instrumentAnswers: chat.instrumentAnswers || {},
      activeQuestionIds: chat.activeQuestionIds || [],
      phase: chat.phase,
      companyName: chat.companyName || company.name,
      contactName: chat.contactName || '',
      contactEmail: chat.contactEmail || company.contactEmail,
      sector: chat.sector || company.sector,
      employees: chat.employees || company.employees,
      costBreakdown: chat.costBreakdown || company.costBreakdown || {},
      attachments: chat.attachments || company.attachments || [],
      isCompleted: !!chat.isCompleted,
      isSubmitted: !!chat.isSubmitted,
      submittedAt: chat.submittedAt,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
  return { empresa, conversacion };
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'paz-ortega-diagnostico',
    tables: ['empresas', 'conversaciones'],
    ai: Boolean(getDeepseekKey()),
  });
});

app.post('/api/auth/login', (req, res) => {
  const code = String(req.body?.code || '').trim().toUpperCase();
  const consultantName = String(req.body?.consultantName || '').trim() || 'Consultor PAZ ORTEGA IA';
  if (!code || !CONSULTANT_CODES.includes(code)) {
    return res.status(401).json({ error: 'invalid_code' });
  }
  const payload = { code, consultantName, iat: Date.now(), exp: Date.now() + TOKEN_TTL_MS };
  res.json({ token: signToken(payload), code, consultantName });
});

function parseModelJson(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Respuesta de IA no es JSON válido');
  }
}

async function callDeepseekJson(apiKey, systemPrompt, userPrompt) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`DeepSeek: ${res.status} ${res.statusText} ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  return parseModelJson(raw);
}

app.post('/api/chat/turn', async (req, res) => {
  const apiKey = getDeepseekKey();
  if (!apiKey) {
    return res.status(503).json({ error: 'missing_ai_key' });
  }

  const body = req.body || {};
  const profile = body.profile || {};
  const answered = body.answered || {};
  const recent = Array.isArray(body.recentMessages) ? body.recentMessages : [];
  const pending = remainingQuestionIds(answered);

  const userPrompt = `Esta es la conversación en curso. El mapa completo ya está en tu instrucción de sistema.

Persona y empresa:
${JSON.stringify(profile)}

Ya anotado (no lo preguntes otra vez):
${JSON.stringify(answered)}

Aún pendiente — debes cubrirlo antes de cerrar, sin decírselo a la persona. Usa el mapa para preguntar con naturalidad. Si esta respuesta ya resuelve varios IDs, anótalos todos ahora:
${JSON.stringify(pending.groups)}
Quedan ${pending.count} puntos.

Historial reciente:
${JSON.stringify(recent)}

Acaba de decir:
${JSON.stringify(body.userText || '')}

Sigue el hilo. Acompaña. Pregunta una sola cosa.`;

  try {
    const ai = await callDeepseekJson(apiKey, SYSTEM_PROMPT, userPrompt);
    if (!ai || typeof ai.reply !== 'string' || !ai.reply.trim()) {
      return res.status(500).json({ error: 'ai_empty_reply' });
    }
    const rawMapped = Array.isArray(ai.mappedAnswers) ? ai.mappedAnswers : [];
    const mappedAnswers = capMappedAnswers(rawMapped, answered);
    const answeredAfter = { ...answered };
    for (const item of mappedAnswers) {
      if (item?.questionId) answeredAfter[item.questionId] = item;
    }
    const left = remainingQuestionIds(answeredAfter).count;
    const readyToClose = left === 0;

    res.json({
      reply: ai.reply.trim(),
      options: Array.isArray(ai.options) ? ai.options.filter(Boolean).slice(0, 6) : [],
      mappedAnswers,
      companyName: ai.companyName || null,
      contactName: ai.contactName || null,
      contactEmail: ai.contactEmail || null,
      sector: ai.sector || null,
      readyToClose,
      coverage: {
        answered: ALL_INSTRUMENT_QUESTIONS.length - left,
        total: ALL_INSTRUMENT_QUESTIONS.length,
      },
    });
  } catch (err) {
    console.error('DeepSeek chat turn error:', err);
    res.status(500).json({ error: 'ai_turn_failed', message: String(err.message || err) });
  }
});

app.get('/api/empresas', requireConsultant, async (req, res) => {
  const conversaciones = await store.listConversaciones();
  const empresas = await store.listEmpresas();
  res.json(empresas.map((e) => hydrateEmpresa(e, conversaciones)));
});

app.get('/api/empresas/:id', requireConsultant, async (req, res) => {
  const empresa = await store.getEmpresa(req.params.id);
  if (!empresa) return res.status(404).json({ error: 'Empresa not found' });
  res.json(hydrateEmpresa(empresa, await store.listConversaciones(empresa.id)));
});

app.post('/api/empresas', async (req, res) => {
  const empresa = req.body;
  if (!empresa || !empresa.id) {
    return res.status(400).json({ error: 'Invalid empresa payload' });
  }
  empresa.updatedAt = new Date().toISOString();
  await store.saveEmpresa(empresa);
  res.json({ success: true, empresa });
});

app.get('/api/conversaciones', requireConsultant, async (req, res) => {
  const list = await store.listConversaciones(req.query.empresaId);
  res.json(list);
});

app.post('/api/conversaciones', async (req, res) => {
  const conversacion = req.body;
  if (!conversacion || !conversacion.id || !conversacion.empresaId) {
    return res.status(400).json({ error: 'Invalid conversacion payload' });
  }
  conversacion.updatedAt = new Date().toISOString();
  if (!conversacion.createdAt) conversacion.createdAt = conversacion.updatedAt;
  await store.saveConversacion(conversacion);
  res.json({ success: true, conversacion });
});

app.get('/api/conversaciones/:id/transcript', requireConsultant, async (req, res) => {
  const conv = await store.getConversacion(req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversacion not found' });
  const lines = (conv.messages || []).map((m) => {
    const who = m.sender === 'bot' ? 'Asistente' : 'Cliente';
    return `[${m.timestamp || ''}] ${who}: ${m.text || ''}`;
  });
  const body = `Empresa: ${conv.companyName || conv.empresaId}\nConversación: ${conv.id}\n\n${lines.join('\n\n')}\n`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=Conversacion_${(conv.companyName || conv.empresaId).replace(/[^a-zA-Z0-9]/g, '_')}.txt`
  );
  res.send(body);
});

async function saveCompanyRecord(company) {
  const { empresa, conversacion } = splitCompanyPayload(company);
  empresa.updatedAt = new Date().toISOString();
  await store.saveEmpresa(empresa);
  if (conversacion) {
    await store.saveConversacion(conversacion);
  }
  return hydrateEmpresa(empresa, await store.listConversaciones(empresa.id));
}

app.get('/api/companies', requireConsultant, async (req, res) => {
  const conversaciones = await store.listConversaciones();
  const empresas = await store.listEmpresas();
  res.json(empresas.map((e) => hydrateEmpresa(e, conversaciones)));
});

app.get('/api/companies/:id', requireConsultant, async (req, res) => {
  const empresa = await store.getEmpresa(req.params.id);
  if (!empresa) return res.status(404).json({ error: 'Company not found' });
  res.json(hydrateEmpresa(empresa, await store.listConversaciones(empresa.id)));
});

app.post('/api/companies', async (req, res) => {
  const company = req.body;
  if (!company || !company.id) {
    return res.status(400).json({ error: 'Invalid company payload' });
  }
  const saved = await saveCompanyRecord(company);
  res.json({ success: true, company: saved });
});

app.delete('/api/companies/:id', requireConsultant, async (req, res) => {
  await store.deleteEmpresa(req.params.id);
  await store.deleteConversacionesByEmpresa(req.params.id);
  res.json({ success: true });
});

app.get('/api/companies/:id/raw-csv', requireConsultant, async (req, res) => {
  const empresa = await store.getEmpresa(req.params.id);
  const company = empresa ? hydrateEmpresa(empresa, await store.listConversaciones(empresa.id)) : null;
  if (!company?.id) return res.status(404).json({ error: 'Company not found' });

  let csv = 'Instrumento,ID Pregunta,Estado Evidencia,Opción Seleccionada,Notas y Observaciones de Campo\n';
  Object.entries(company.instruments || {}).forEach(([instId, instData]) => {
    Object.entries(instData.responses || {}).forEach(([qId, r]) => {
      const cleanNotes = (r.notes || '').replace(/"/g, '""');
      const cleanOption = (r.selectedOption || '').replace(/"/g, '""');
      csv += `"${instId}","${qId}","${r.status || ''}","${cleanOption}","${cleanNotes}"\n`;
    });
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=Diagnostico_${String(company.name || 'empresa').replace(/[^a-zA-Z0-9]/g, '_')}_DatosBrutos.csv`
  );
  res.send(csv);
});

if (fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));

  // Client-facing diagnostic chatbot: its own bundle/page, no consultant code shipped.
  app.use((req, res, next) => {
    if (req.path === '/diagnostico' || req.path.startsWith('/diagnostico/')) {
      return res.sendFile(path.join(__dirname, 'dist', 'chat.html'));
    }
    next();
  });

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Catch-all error handler: an unhandled rejection in a route (e.g. a data-store
// write failure) must not just drop the connection with no explanation.
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'internal_error', message: String(err?.message || err) });
});

app.listen(PORT, () => {
  console.log(`PAZ ORTEGA IA Backend Server running on http://localhost:${PORT}`);
  console.log(getDeepseekKey() ? 'IA: DeepSeek conectado' : 'IA: falta DEEPSEEK_API_KEY en .env');
  console.log(`Instrumento en system prompt: ${INSTRUMENT_CATALOG.length} áreas, ${ALL_INSTRUMENT_QUESTIONS.length} preguntas`);
});
