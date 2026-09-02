import React, { useState } from 'react';
import { Shield, Building2, UserCheck, LogOut, FileSpreadsheet, Sparkles, Share2 } from 'lucide-react';
import { CompanyProfile } from '../types';

interface NavbarProps {
  consultantName: string;
  currentCompany: CompanyProfile | null;
  onLogout: () => void;
  onNewCompany: () => void;
  onSelectCompanyList: () => void;
  activeView: 'capture' | 'dashboard' | 'companies';
  setActiveView: (view: 'capture' | 'dashboard' | 'companies') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  consultantName,
  currentCompany,
  onLogout,
  onNewCompany,
  onSelectCompanyList,
  activeView,
  setActiveView,
}) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyClientLink = async () => {
    const url = `${window.location.origin}/diagnostico`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copia este enlace para el cliente', url);
    }
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#05352E] text-[#FDF2E4] border-b border-[#182A21]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('companies')}>
            <div className="w-10 h-10 rounded-full bg-[#85BCB0]/20 flex items-center justify-center border border-[#85BCB0]/40">
              <Shield className="w-5 h-5 text-[#85BCB0]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight block text-[#FDF2E4]">
                PAZ ORTEGA IA
              </span>
              <span className="font-mono text-[10px] text-[#85BCB0] uppercase tracking-wider block">
                Diagnóstico & Gobernanza
              </span>
            </div>
          </div>

          {/* Active Company Status & View Switcher */}
          {currentCompany && (
            <div className="hidden md:flex items-center space-x-2 bg-[#182A21]/60 px-3 py-1.5 rounded-full border border-[#85BCB0]/20">
              <Building2 className="w-4 h-4 text-[#85BCB0]" />
              <span className="text-xs font-medium text-white max-w-[180px] truncate">
                {currentCompany.name}
              </span>
              <span className="text-[11px] text-[#85BCB0] px-1.5 py-0.5 rounded bg-[#85BCB0]/10 font-mono">
                {currentCompany.sector || 'General'}
              </span>

              <div className="h-4 w-px bg-gray-600 mx-2" />

              <button
                onClick={() => setActiveView('capture')}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                  activeView === 'capture'
                    ? 'bg-[#85BCB0] text-[#05352E] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Instrumentos
              </button>

              <button
                onClick={() => setActiveView('dashboard')}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                  activeView === 'dashboard'
                    ? 'bg-[#FDDC42] text-[#211B1D] font-semibold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Dashboard IA
              </button>
            </div>
          )}

          {/* Right actions: New Company, Client Chat Assistant Link & Consultant Info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleCopyClientLink}
              title="Copiar enlace del chatbot para enviárselo al cliente"
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm border border-indigo-400/30"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">{linkCopied ? 'Enlace copiado' : 'Copiar enlace cliente'}</span>
              <span className="sm:hidden">{linkCopied ? 'Copiado' : 'Enlace'}</span>
            </button>

            <button
              onClick={onNewCompany}
              className="bg-[#85BCB0] hover:bg-[#85BCB0]/90 text-[#05352E] text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Nueva</span> Empresa
            </button>

            <button
              onClick={onSelectCompanyList}
              className="bg-[#182A21]/70 hover:bg-[#182A21] text-gray-200 text-xs px-3 py-1.5 rounded-full transition-colors border border-gray-700 hidden sm:flex items-center gap-1"
            >
              Empresas
            </button>

            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-gray-300 pl-2 border-l border-gray-700">
              <UserCheck className="w-3.5 h-3.5 text-[#85BCB0]" />
              <span className="font-mono text-[11px] truncate max-w-[100px]">{consultantName}</span>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 text-gray-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
