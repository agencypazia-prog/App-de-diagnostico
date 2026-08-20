import React, { useState, useEffect } from 'react';
import { CompanyProfile, DiagnosticResult } from './types';
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  getAllCompanies,
  getCompanyById,
  saveCompany,
  deleteCompany,
  getCurrentCompanyId,
  setCurrentCompanyId,
  saveDiagnosticResult,
} from './utils/storage';
import { generateStrategicDiagnosis } from './services/aiDiagnosticService';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { CompanyRegistrationModal } from './components/CompanyRegistrationModal';
import { CompanyList } from './components/CompanyList';
import { InstrumentCapture } from './components/InstrumentCapture';
import { InfographicDashboard } from './components/InfographicDashboard';

export function App() {
  const [session, setSession] = useState<{ code: string; consultantName: string } | null>(null);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [currentCompany, setCurrentCompany] = useState<CompanyProfile | null>(null);
  const [activeView, setActiveView] = useState<'capture' | 'dashboard' | 'companies'>('companies');
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize session & companies on mount
  useEffect(() => {
    const savedSession = getAuthSession();
    if (savedSession) {
      setSession(savedSession);
    }
    const all = getAllCompanies();
    setCompanies(all);

    const currId = getCurrentCompanyId();
    if (currId) {
      const found = getCompanyById(currId);
      if (found) {
        setCurrentCompany(found);
        setActiveView(found.diagnosticResult ? 'dashboard' : 'capture');
      }
    }
  }, []);

  const handleLoginSuccess = (code: string, consultantName: string) => {
    saveAuthSession(code, consultantName);
    setSession({ code, consultantName });
    const all = getAllCompanies();
    setCompanies(all);
    if (all.length > 0) {
      setActiveView('companies');
    } else {
      setIsNewCompanyModalOpen(true);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
    setCurrentCompany(null);
    setActiveView('companies');
  };

  const handleCreateCompany = (newCompany: CompanyProfile) => {
    saveCompany(newCompany);
    setCompanies(getAllCompanies());
    setCurrentCompany(newCompany);
    setActiveView('capture');
  };

  const handleSelectCompany = (comp: CompanyProfile) => {
    setCurrentCompanyId(comp.id);
    setCurrentCompany(comp);
    setActiveView(comp.diagnosticResult ? 'dashboard' : 'capture');
  };

  const handleUpdateCompany = (updated: CompanyProfile) => {
    saveCompany(updated);
    setCurrentCompany(updated);
    setCompanies(getAllCompanies());
  };

  const handleDeleteCompany = (id: string) => {
    deleteCompany(id);
    setCompanies(getAllCompanies());
    if (currentCompany?.id === id) {
      setCurrentCompany(null);
      setActiveView('companies');
    }
  };

  const handleGenerateDiagnosis = async () => {
    if (!currentCompany) return;
    setIsAnalyzing(true);
    try {
      const result: DiagnosticResult = await generateStrategicDiagnosis(currentCompany);
      saveDiagnosticResult(currentCompany.id, result);
      const reloaded = getCompanyById(currentCompany.id);
      if (reloaded) {
        setCurrentCompany(reloaded);
        setCompanies(getAllCompanies());
      }
      setActiveView('dashboard');
    } catch (err) {
      console.error('Error generating diagnosis:', err);
      alert('Error al generar el diagnóstico.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!session) {
    return <LoginModal onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#FDF2E4] text-[#182A21] flex flex-col font-body selection:bg-[#85BCB0] selection:text-[#05352E]">
      <Navbar
        consultantName={session.consultantName}
        currentCompany={currentCompany}
        onLogout={handleLogout}
        onNewCompany={() => setIsNewCompanyModalOpen(true)}
        onSelectCompanyList={() => setActiveView('companies')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 pb-16">
        {activeView === 'companies' && (
          <CompanyList
            companies={companies}
            onSelectCompany={handleSelectCompany}
            onNewCompany={() => setIsNewCompanyModalOpen(true)}
            onDeleteCompany={handleDeleteCompany}
          />
        )}

        {activeView === 'capture' && currentCompany && (
          <InstrumentCapture
            company={currentCompany}
            onUpdateCompany={handleUpdateCompany}
            onGenerateDiagnosis={handleGenerateDiagnosis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeView === 'dashboard' && currentCompany && currentCompany.diagnosticResult && (
          <InfographicDashboard
            company={currentCompany}
            result={currentCompany.diagnosticResult}
            onBackToEdit={() => setActiveView('capture')}
          />
        )}

        {activeView === 'dashboard' && currentCompany && !currentCompany.diagnosticResult && (
          <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-[#D5D2C9] rounded-2xl text-center space-y-4 shadow-card">
            <h3 className="font-display text-xl font-bold text-[#05352E]">
              Diagnóstico no generado aún
            </h3>
            <p className="text-xs text-[#4A4843]">
              Debes registrar las respuestas de los instrumentos y presionar "Generar Diagnóstico" para ver el informe de IA.
            </p>
            <button
              onClick={() => setActiveView('capture')}
              className="bg-[#05352E] text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Ir a Captura de Instrumentos
            </button>
          </div>
        )}
      </main>

      <CompanyRegistrationModal
        isOpen={isNewCompanyModalOpen}
        onClose={() => setIsNewCompanyModalOpen(false)}
        onSave={handleCreateCompany}
        consultantName={session.consultantName}
        accessCode={session.code}
      />
    </div>
  );
}

export default App;
