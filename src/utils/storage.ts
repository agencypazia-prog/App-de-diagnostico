import type { CompanyProfile, DiagnosticResult } from '../types';
import { saveAs } from 'file-saver';

const STORAGE_KEY = 'paz_ortega_companies_v1';
const AUTH_KEY = 'paz_ortega_auth_session_v1';
const CURRENT_COMPANY_KEY = 'paz_ortega_current_company_id_v1';

// Frontend and backend are always served from the same Express instance (server.js
// serves the API and the built static assets together), so calls stay same-origin.
const API_ROOT = '/api';

const API_BASE_URL = `${API_ROOT}/companies`;

export interface AuthSession {
  code: string;
  consultantName: string;
  token: string;
}

export function getAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    const session = raw ? JSON.parse(raw) : null;
    return session?.token ? session : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ ...session, timestamp: new Date().toISOString() }));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_KEY);
}

function authHeaders(): HeadersInit {
  const session = getAuthSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

export async function loginConsultant(code: string, consultantName: string): Promise<AuthSession> {
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, consultantName }),
  });
  if (!res.ok) {
    throw new Error('Código no válido.');
  }
  const data = await res.json();
  return { code: data.code, consultantName: data.consultantName, token: data.token };
}

export function getCurrentCompanyId(): string | null {
  return localStorage.getItem(CURRENT_COMPANY_KEY);
}

export function setCurrentCompanyId(id: string | null): void {
  if (id) {
    localStorage.setItem(CURRENT_COMPANY_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_COMPANY_KEY);
  }
}

export function getAllCompanies(): CompanyProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading companies from localStorage:', err);
    return [];
  }
}

function mergeCompanyLists(remote: CompanyProfile[], local: CompanyProfile[]): CompanyProfile[] {
  const byId = new Map<string, CompanyProfile>();
  for (const item of local) byId.set(item.id, item);
  for (const item of remote) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
      continue;
    }
    const remoteTime = Date.parse(item.updatedAt || '') || 0;
    const localTime = Date.parse(existing.updatedAt || '') || 0;
    byId.set(item.id, remoteTime >= localTime ? item : existing);
  }
  return Array.from(byId.values()).sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || '')
  );
}

export async function fetchRemoteCompanies(): Promise<CompanyProfile[]> {
  try {
    const res = await fetch(API_BASE_URL, { headers: authHeaders() });
    if (res.status === 401) clearAuthSession();
    if (!res.ok) return getAllCompanies();
    const remote = (await res.json()) as CompanyProfile[];
    const merged = mergeCompanyLists(Array.isArray(remote) ? remote : [], getAllCompanies());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.warn('Backend fetch warning (offline mode):', err);
    return getAllCompanies();
  }
}

export const getStoredCompanies = getAllCompanies;

export function saveCompany(company: CompanyProfile): void {
  try {
    const list = getAllCompanies();
    const index = list.findIndex((c) => c.id === company.id);
    company.updatedAt = new Date().toISOString();

    if (index >= 0) {
      list[index] = company;
    } else {
      list.unshift(company);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Background sync with backend
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    }).catch((e) => console.warn('Backend sync warning (offline mode):', e));
  } catch (err) {
    console.error('Error saving company:', err);
  }
}

export function deleteCompany(id: string): void {
  try {
    const list = getAllCompanies().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).catch((e) => console.warn('Backend delete sync warning:', e));
  } catch (err) {
    console.error('Error deleting company:', err);
  }
}

export function getCompanyById(id: string): CompanyProfile | undefined {
  return getAllCompanies().find((c) => c.id === id);
}

export function saveDiagnosticResult(companyId: string, result: DiagnosticResult): void {
  const company = getCompanyById(companyId);
  if (company) {
    company.diagnosticResult = result;
    saveCompany(company);
  }
}

export function exportCompanyRawJson(company: CompanyProfile): void {
  const jsonStr = JSON.stringify(company, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const cleanName = company.name.replace(/[^a-zA-Z0-9]/g, '_');
  saveAs(blob, `Diagnostico_${cleanName}_DatosBrutos.json`);
}

export function exportConversationTranscript(company: CompanyProfile): void {
  const messages = company.chatSession?.messages || [];
  const lines = messages.map((m) => {
    const who = m.sender === 'bot' ? 'Asistente' : 'Cliente';
    return `[${m.timestamp || ''}] ${who}:\n${m.text || ''}`;
  });
  const header = `Conversación de diagnóstico\nEmpresa: ${company.name}\nContacto: ${company.chatSession?.contactName || ''} <${company.contactEmail || ''}>\nFecha: ${company.updatedAt || company.createdAt}\n\n`;
  const blob = new Blob([header + lines.join('\n\n') + '\n'], { type: 'text/plain;charset=utf-8' });
  const cleanName = (company.name || 'empresa').replace(/[^a-zA-Z0-9]/g, '_');
  saveAs(blob, `Conversacion_${cleanName}.txt`);
}

export async function requestInstrumentChatTurn(payload: unknown): Promise<{
  reply: string;
  options?: string[];
  mappedAnswers?: Array<{
    questionId: string;
    status?: 'V' | 'D' | 'E' | 'P';
    notes?: string;
    selectedOption?: string;
  }>;
  companyName?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  sector?: string | null;
  readyToClose?: boolean;
}> {
  const res = await fetch(`${API_ROOT}/chat/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'ai_turn_failed') as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data;
}

export function exportCompanyRawCsv(company: CompanyProfile): void {
  let csv = 'Instrumento,ID Pregunta,Estado Evidencia,Opción Seleccionada,Notas y Observaciones de Campo\n';

  Object.entries(company.instruments || {}).forEach(([instId, instData]) => {
    Object.entries(instData.responses || {}).forEach(([qId, r]) => {
      const cleanNotes = (r.notes || '').replace(/"/g, '""');
      const cleanOption = (r.selectedOption || '').replace(/"/g, '""');
      csv += `"${instId}","${qId}","${r.status || ''}","${cleanOption}","${cleanNotes}"\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const cleanName = company.name.replace(/[^a-zA-Z0-9]/g, '_');
  saveAs(blob, `Diagnostico_${cleanName}_DatosBrutos.csv`);
}
