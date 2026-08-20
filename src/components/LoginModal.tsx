import React, { useState } from 'react';
import { Shield, KeyRound, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { checkAccessCode, VALID_ACCESS_CODES } from '../utils/storage';

interface LoginModalProps {
  onSuccess: (code: string, consultantName: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [consultantName, setConsultantName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAccessCode(code)) {
      setError(`Código no válido. Códigos autorizados de ejemplo: ${VALID_ACCESS_CODES.slice(0, 3).join(', ')}`);
      return;
    }
    setError('');
    onSuccess(code.trim().toUpperCase(), consultantName.trim() || 'Consultor PAZ ORTEGA IA');
  };

  const handleQuickFill = (validCode: string) => {
    setCode(validCode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211B1D]/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FDF2E4] border border-[#05352E]/20 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-[#182A21]">
        {/* Header with Brand */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#05352E] text-[#85BCB0] mx-auto flex items-center justify-center mb-3 shadow-md border-2 border-[#85BCB0]/30">
            <Shield className="w-8 h-8" />
          </div>
          <span className="font-mono text-xs text-[#05352E] uppercase tracking-widest font-semibold block mb-1">
            Plataforma Profesional de Diagnóstico
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#05352E]">
            PAZ ORTEGA IA
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4843] mt-2">
            Acceso seguro para consultores y analistas estratégicos de planta.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#05352E]" />
              Código Personal de Acceso (PIN)
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa tu código (ej. PAZ2026)"
              required
              className="w-full px-4 py-3 bg-white border border-[#D5D2C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#05352E] font-mono tracking-widest text-[#182A21]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#05352E]" />
              Nombre del Consultor / Analista
            </label>
            <input
              type="text"
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              placeholder="Ej. Juan Pérez (Opcional)"
              className="w-full px-4 py-3 bg-white border border-[#D5D2C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Quick Access Badges */}
          <div className="pt-1">
            <span className="text-[11px] text-[#8C8A83] block mb-1.5">Acceso rápido con claves activas:</span>
            <div className="flex flex-wrap gap-1.5">
              {['PAZ2026', 'ADMIN', 'HERMES'].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleQuickFill(c)}
                  className="px-2.5 py-1 bg-white hover:bg-[#85BCB0]/20 border border-[#D5D2C9] rounded-lg text-xs font-mono text-[#05352E] transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#0F6E56]" />
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#FDDC42]" />
            <span>Ingresar al Sistema de Diagnóstico</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#D5D2C9] text-center">
          <p className="text-[11px] text-[#8C8A83] font-mono">
            De la norma al código · ISO/IEC 42001 · NIST AI RMF
          </p>
        </div>
      </div>
    </div>
  );
};
