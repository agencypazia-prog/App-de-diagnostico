import React, { useState } from 'react';
import { Shield, KeyRound, User, ArrowRight, Sparkles } from 'lucide-react';
import { loginConsultant, AuthSession } from '../utils/storage';

interface LoginModalProps {
  onSuccess: (session: AuthSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [consultantName, setConsultantName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const session = await loginConsultant(code, consultantName.trim() || 'Consultor PAZ ORTEGA IA');
      onSuccess(session);
    } catch {
      setError('Código no válido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211B1D]/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FDF2E4] border border-[#05352E]/20 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-[#182A21]">
        {/* Header with Brand */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#05352E] text-white mx-auto flex items-center justify-center mb-3 shadow-md">
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
              Código Personal de Consultor (PIN)
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group text-sm disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4 text-[#FDDC42]" />
            <span>{isSubmitting ? 'Verificando...' : 'Ingresar como Consultor'}</span>
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
