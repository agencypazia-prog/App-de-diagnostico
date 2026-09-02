import { INSTRUMENTS_DATA } from '../data/instrumentsData';
import type {
  ChatMessage,
  ChatSessionState,
  FinancialCostBreakdown,
  QuestionResponse,
} from '../types';

export interface FlatQuestion {
  instrumentId: string;
  instrumentTitle: string;
  sectionTitle: string;
  id: string;
  text: string;
  options?: string[];
}

const SKIP_RE =
  /prefiero pasar|no aplica|no s[eé]|paso esta|siguiente pregunta|omitir/i;

export function flattenInstrumentQuestions(): FlatQuestion[] {
  const out: FlatQuestion[] = [];
  for (const inst of INSTRUMENTS_DATA) {
    for (const sec of inst.sections) {
      for (const q of sec.questions) {
        out.push({
          instrumentId: inst.id,
          instrumentTitle: inst.title,
          sectionTitle: sec.title,
          id: q.id,
          text: q.text,
          options: q.options,
        });
      }
    }
  }
  return out;
}

const ALL_QUESTIONS = flattenInstrumentQuestions();

export function totalInstrumentQuestions(): number {
  return ALL_QUESTIONS.length;
}

export function answeredInstrumentCount(answers: Record<string, QuestionResponse>): number {
  return Object.keys(answers || {}).length;
}

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export interface AiChatTurnResult {
  reply: string;
  options?: string[];
  mappedAnswers?: Array<{
    questionId: string;
    status?: 'V' | 'D' | 'E' | 'P';
    notes?: string;
    selectedOption?: string;
  }>;
  companyName?: string;
  contactName?: string;
  contactEmail?: string;
  sector?: string;
  readyToClose?: boolean;
}

export function buildChatTurnPayload(session: ChatSessionState, userText: string) {
  const answered = session.instrumentAnswers || {};
  return {
    userText,
    profile: {
      companyName: session.companyName,
      contactName: session.contactName,
      contactEmail: session.contactEmail,
      sector: session.sector,
    },
    answered,
    recentMessages: session.messages.slice(-16).map((m) => ({
      role: m.sender === 'bot' ? 'assistant' : 'user',
      text: m.text,
    })),
  };
}

export function applyAiTurn(
  session: ChatSessionState,
  userText: string,
  ai: AiChatTurnResult
): ChatSessionState {
  const last = session.messages[session.messages.length - 1];
  const alreadyHasUser =
    last?.sender === 'user' && last.text === (userText.trim() || '(sin texto)');
  const userMsg: ChatMessage = {
    id: newId('msg_user'),
    sender: 'user',
    text: userText.trim() || '(sin texto)',
    timestamp: nowTime(),
  };

  const answers = { ...(session.instrumentAnswers || {}) };
  for (const mapped of ai.mappedAnswers || []) {
    if (!mapped.questionId) continue;
    answers[mapped.questionId] = {
      status: mapped.status || 'D',
      notes: mapped.notes || userText,
      selectedOption: mapped.selectedOption,
    };
  }

  const nextUnanswered = firstUnanswered(answers);
  const ready = !!ai.readyToClose;
  const options = ai.options && ai.options.length > 0 ? ai.options.slice(0, 6) : undefined;

  return {
    ...session,
    companyName: ai.companyName || session.companyName,
    contactName: ai.contactName || session.contactName,
    contactEmail: ai.contactEmail || session.contactEmail,
    sector: ai.sector || session.sector,
    instrumentAnswers: answers,
    activeQuestionIds: nextUnanswered ? [nextUnanswered.id] : [],
    phase: ready ? 'done' : 'instrument',
    isCompleted: ready,
    currentStageIndex: session.currentStageIndex + 1,
    messages: [
      ...session.messages,
      ...(alreadyHasUser ? [] : [userMsg]),
      botMessage(ai.reply, options, ready ? { isFinalConfirmation: true } : undefined),
    ],
  };
}

function botMessage(text: string, options?: string[], extra?: Partial<ChatMessage>): ChatMessage {
  return {
    id: newId('msg_bot'),
    sender: 'bot',
    text,
    timestamp: nowTime(),
    options: options && options.length > 0 ? options : undefined,
    ...extra,
  };
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchOption(userText: string, options?: string[]): string | undefined {
  if (!options?.length) return undefined;
  const n = normalize(userText);
  let best: { opt: string; len: number } | undefined;
  for (const opt of options) {
    const no = normalize(opt);
    if (!no) continue;
    if (n === no || n.includes(no) || (no.includes(n) && n.length > 16)) {
      if (!best || no.length > best.len) best = { opt, len: no.length };
    }
  }
  return best?.opt;
}

function parseIdentity(text: string): { companyName: string; contactName: string } {
  const parts = text
    .split(/[,;]|\s+y\s+|\bsoy\b|\bme llamo\b|\btrabajo (?:en|como)\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    companyName: parts[0] || text.trim(),
    contactName: parts.slice(1).join(' — ') || text.trim(),
  };
}

function parseEmail(text: string): string {
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0] : text.trim();
}

function firstUnanswered(answers: Record<string, QuestionResponse>): FlatQuestion | undefined {
  return ALL_QUESTIONS.find((q) => !answers[q.id]);
}

function autoCoverFromText(
  answers: Record<string, QuestionResponse>,
  userText: string,
  fromQuestion: FlatQuestion
): Record<string, QuestionResponse> {
  const next = { ...answers };
  for (const q of ALL_QUESTIONS) {
    if (q.instrumentId !== fromQuestion.instrumentId || q.sectionTitle !== fromQuestion.sectionTitle) {
      continue;
    }
    if (q.id === fromQuestion.id) continue;
    const existing = next[q.id];
    if (existing && existing.status !== 'P') continue;
    const selected = matchOption(userText, q.options);
    if (selected) {
      next[q.id] = {
        status: 'D',
        selectedOption: selected,
        notes: userText,
      };
    }
  }
  return next;
}

function applyAnswer(
  answers: Record<string, QuestionResponse>,
  question: FlatQuestion,
  userText: string
): Record<string, QuestionResponse> {
  const skipped = SKIP_RE.test(userText);
  const selected = skipped ? undefined : matchOption(userText, question.options);
  const next: Record<string, QuestionResponse> = {
    ...answers,
    [question.id]: {
      status: skipped ? 'P' : selected ? 'D' : 'D',
      selectedOption: selected,
      notes: userText,
    },
  };
  if (!skipped) {
    return autoCoverFromText(next, userText, question);
  }
  return next;
}

function extractCosts(
  costs: FinancialCostBreakdown,
  question: FlatQuestion,
  userText: string
): FinancialCostBreakdown {
  const updated = { ...costs };
  const section = question.sectionTitle.toLowerCase();
  if (section.includes('costo') || section.includes('línea base') || section.includes('linea base')) {
    updated.clientObservations = [updated.clientObservations, userText].filter(Boolean).join('\n');
  }
  if (/merma|defect|pérdida|perdida|reproceso/i.test(question.text) && !updated.directWasteMonthly) {
    updated.directWasteMonthly = userText;
  }
  if (/hora|productividad|manual/i.test(question.text) && !updated.indirectHoursWeekly) {
    updated.indirectHoursWeekly = userText;
  }
  if (/multa|penaliz|oportunidad|cliente perdido/i.test(question.text) && !updated.opportunityLossAnnual) {
    updated.opportunityLossAnnual = userText;
  }
  return updated;
}

function promptForQuestion(
  question: FlatQuestion,
  prevInstrumentId?: string,
  companyName?: string
): ChatMessage {
  const who = companyName ? `en ${companyName}` : '';
  let text = question.text;
  if (prevInstrumentId && prevInstrumentId !== question.instrumentId) {
    text = `Pasemos a ${question.instrumentTitle}${who ? ` ${who}` : ''}.\n\n${question.text}`;
  }
  return botMessage(text, question.options, { stageId: question.id });
}

function closingMessage(companyName: string): ChatMessage {
  const name = companyName || 'tu empresa';
  return botMessage(
    `Con esto queda cubierto el instrumento para ${name}. Si quieres añadir algo más, escríbelo; si no, envía el diagnóstico y queda guardado para el consultor.`,
    undefined,
    { isFinalConfirmation: true }
  );
}

export const WELCOME_TEXT =
  'Hola, soy el asistente de diagnóstico de PAZ ORTEGA IA. Vamos a conversar sobre cómo trabaja tu empresa para que logremos darle un nuevo enfoque y más valor a lo que haces.\n\n¿Cómo se llama tu empresa y qué haces ahí?';

export function createInitialChatSession(): ChatSessionState {
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 7);
  return {
    currentStageIndex: 0,
    messages: [
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: WELCOME_TEXT,
        timestamp: nowTime(),
      },
    ],
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    sector: '',
    employees: '',
    costBreakdown: {},
    attachments: [],
    isCompleted: false,
    isSubmitted: false,
    empresaId: `emp_${stamp}_${rand}`,
    conversacionId: `conv_${stamp}_${rand}`,
    instrumentAnswers: {},
    activeQuestionIds: [],
    phase: 'identity',
  };
}

export function advanceInstrumentChat(
  session: ChatSessionState,
  userText: string
): ChatSessionState {
  const text = userText.trim();
  const userMsg: ChatMessage = {
    id: newId('msg_user'),
    sender: 'user',
    text: text || '(sin texto)',
    timestamp: nowTime(),
  };

  if (session.phase === 'done' || session.isCompleted) {
    return {
      ...session,
      messages: [
        ...session.messages,
        userMsg,
        botMessage('Quedó anotado. Cuando quieras, envía el diagnóstico.', undefined, {
          isFinalConfirmation: true,
        }),
      ],
    };
  }

  if (session.phase === 'identity' || (!session.phase && !session.companyName)) {
    const identity = parseIdentity(text);
    const afterIdentity: ChatSessionState = {
      ...session,
      companyName: identity.companyName,
      contactName: identity.contactName,
      phase: 'contact',
      messages: [
        ...session.messages,
        userMsg,
        botMessage('¿A qué correo asociamos este diagnóstico?'),
      ],
      currentStageIndex: session.currentStageIndex + 1,
    };
    return afterIdentity;
  }

  if (session.phase === 'contact' || (session.companyName && !session.contactEmail && session.phase !== 'instrument' && session.phase !== 'done')) {
    const email = parseEmail(text);
    const firstQ = firstUnanswered(session.instrumentAnswers || {});
    const afterContact: ChatSessionState = {
      ...session,
      contactEmail: email,
      phase: firstQ ? 'instrument' : 'done',
      activeQuestionIds: firstQ ? [firstQ.id] : [],
      currentStageIndex: session.currentStageIndex + 1,
      messages: [
        ...session.messages,
        userMsg,
        firstQ
          ? promptForQuestion(firstQ, undefined, session.companyName)
          : closingMessage(session.companyName),
      ],
      isCompleted: !firstQ,
    };
    return afterContact;
  }

  const answersSoFar = session.instrumentAnswers || {};
  const targetedId = session.activeQuestionIds?.[0];
  const targeted = ALL_QUESTIONS.find((q) => q.id === targetedId) || firstUnanswered(answersSoFar);

  let answers = { ...answersSoFar };
  let costs = { ...session.costBreakdown };
  let sector = session.sector;

  if (targeted) {
    answers = applyAnswer(answers, targeted, text);
    costs = extractCosts(costs, targeted, text);
    if (!sector && /sector|industria|línea|linea de/i.test(targeted.text)) {
      sector = text;
    }
  }

  const nextQ = firstUnanswered(answers);
  const done = !nextQ;
  const bot = done
    ? closingMessage(session.companyName)
    : promptForQuestion(nextQ!, targeted?.instrumentId, session.companyName);

  return {
    ...session,
    instrumentAnswers: answers,
    costBreakdown: costs,
    sector,
    phase: done ? 'done' : 'instrument',
    activeQuestionIds: nextQ ? [nextQ.id] : [],
    currentStageIndex: session.currentStageIndex + 1,
    isCompleted: done,
    messages: [...session.messages, userMsg, bot],
  };
}

export function coverageLabel(session: ChatSessionState): string {
  const activeId = session.activeQuestionIds?.[0];
  const q = ALL_QUESTIONS.find((item) => item.id === activeId);
  if (session.phase === 'identity' || session.phase === 'contact') return 'Presentación';
  if (session.phase === 'done' || session.isCompleted) return 'Cierre';
  if (q) return q.instrumentTitle;
  if (session.companyName) return session.companyName;
  return 'Conversación de diagnóstico';
}
