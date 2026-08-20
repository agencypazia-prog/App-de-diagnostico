import type { CompanyProfile, DiagnosticResult } from '../types';
import { saveAs } from 'file-saver';

const STORAGE_KEY = 'paz_ortega_companies_v1';
const AUTH_KEY = 'paz_ortega_auth_session_v1';
const CURRENT_COMPANY_KEY = 'paz_ortega_current_company_id_v1';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? '/api/companies'
  : 'https://paz-ortega-diagnostico-719167620987.us-central1.run.app/api/companies';

export const VALID_ACCESS_CODES = ['PAZ2026', 'ORTEGA_IA', 'CONSULTOR_PAZ', 'DEMO_PLANTA'];

export function checkAccessCode(code: string): boolean {
  return VALID_ACCESS_CODES.includes(code.trim().toUpperCase());
}

export function getAuthSession(): { code: string; consultantName: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(code: string, consultantName: string): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ code, consultantName, timestamp: new Date().toISOString() }));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_KEY);
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
