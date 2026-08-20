import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, CheckCircle2, Save, RotateCcw, Check } from 'lucide-react';
import type { Question, EvidenceStatus } from '../types';

interface QuestionRowProps {
  question: Question;
  initialStatus: EvidenceStatus;
  initialSelectedOption?: string;
  initialNotes: string;
  onSaveQuestion: (status: EvidenceStatus, option: string | undefined, notes: string) => void;
}

const EVIDENCE_OPTIONS: { value: EvidenceStatus; label: string; short: string; color: string; desc: string }[] = [
  { value: 'V', label: 'Verificado', short: 'V', color: 'bg-[#0F6E56] text-white border-[#0F6E56]', desc: 'Evidencia documental o visual comprobada' },
  { value: 'D', label: 'Declarado', short: 'D', color: 'bg-[#5B86FF] text-white border-[#5B86FF]', desc: 'Afirmado verbalmente por el encargado' },
  { value: 'E', label: 'Estimado', short: 'E', color: 'bg-[#C07A13] text-white border-[#C07A13]', desc: 'Cálculo o aproximación razonable' },
  { value: 'P', label: 'Pendiente', short: 'P', color: 'bg-gray-300 text-gray-700 border-gray-400', desc: 'Requiere validación posterior' },
];

export const QuestionRow: React.FC<QuestionRowProps> = React.memo(({
  question,
  initialStatus,
  initialSelectedOption,
  initialNotes,
  onSaveQuestion,
}) => {
  const [status, setStatus] = useState<EvidenceStatus>(initialStatus);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(initialSelectedOption);
  const [notes, setNotes] = useState<string>(initialNotes || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const isTypingRef = useRef<boolean>(false);

  // Sync external changes (like simulation button) ONLY when user is not actively typing
  useEffect(() => {
    if (!isTypingRef.current) {
      setStatus(initialStatus);
      setSelectedOption(initialSelectedOption);
      setNotes(initialNotes || '');
    }
  }, [initialStatus, initialSelectedOption, initialNotes]);

  const handleStatusClick = (newStatus: EvidenceStatus) => {
    setStatus(newStatus);
    onSaveQuestion(newStatus, selectedOption, notes);
    triggerSavedIndicator();
  };

  const handleOptionClick = (option: string) => {
    const nextOption = selectedOption === option ? undefined : option;
    const nextStatus = status === 'P' ? 'D' : status;
    setSelectedOption(nextOption);
    setStatus(nextStatus);
    onSaveQuestion(nextStatus, nextOption, notes);
    triggerSavedIndicator();
  };

  // LOCAL ONLY change during typing — NEVER triggers parent tree re-render
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isTypingRef.current = true;
    setNotes(e.target.value);
  };

  // Save when user clicks "Guardar / Enviar"
  const handleManualSave = () => {
    isTypingRef.current = false;
    onSaveQuestion(status, selectedOption, notes);
    triggerSavedIndicator();
  };

  // Auto-save on blur (when clicking outside) without interrupting typing flow
  const handleBlur = () => {
    isTypingRef.current = false;
    onSaveQuestion(status, selectedOption, notes);
  };

  const handleClearNotes = () => {
    if (confirm('¿Deseas limpiar el texto para volver a redactar?')) {
      isTypingRef.current = false;
      setNotes('');
      onSaveQuestion(status, selectedOption, '');
    }
  };

  const triggerSavedIndicator = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-5 hover:bg-[#FDF2E4]/30 transition-colors space-y-3">
      {/* Question Header & Evidence Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          <span className="font-mono font-bold text-xs bg-[#05352E] text-white px-2 py-1 rounded-md flex-shrink-0 mt-0.5">
            {question.id}
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#182A21] leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Evidence Buttons (V, D, E, P) */}
        <div className="flex items-center gap-1.5 flex-shrink-0 self-start">
          {EVIDENCE_OPTIONS.map((opt) => {
            const isSelected = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusClick(opt.value)}
                title={`${opt.label}: ${opt.desc}`}
                className={`w-8 h-8 rounded-lg font-mono font-bold text-xs transition-all border flex items-center justify-center ${
                  isSelected
                    ? `${opt.color} shadow-sm scale-105 ring-2 ring-[#05352E]/30`
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {opt.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Multiple Choice Standardized Option Pills */}
      {question.options && question.options.length > 0 && (
        <div className="pl-0 sm:pl-8 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-[#8C8A83] uppercase tracking-wider block">
            Opciones de respuesta rápida:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {question.options.map((opt, oIdx) => {
              const isChosen = selectedOption === opt;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleOptionClick(opt)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                    isChosen
                      ? 'bg-[#05352E] text-white border-[#05352E] font-medium shadow-xs'
                      : 'bg-[#FDF2E4] text-[#182A21] border-[#D5D2C9] hover:bg-white hover:border-[#85BCB0]'
                  }`}
                >
                  {isChosen && <CheckCircle2 className="w-3 h-3 text-[#FDDC42] flex-shrink-0" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacious Live Field Notes Box — Isolated from global re-renders */}
      <div className="pl-0 sm:pl-8 space-y-2">
        <div className="relative">
          <div className="absolute top-3.5 left-3 text-gray-400 pointer-events-none">
            <MessageSquare className="w-4 h-4 text-[#05352E]/60" />
          </div>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleBlur}
            onFocus={() => { isTypingRef.current = true; }}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Escribe aquí las observaciones en vivo o lo que declaró el encargado..."
            rows={3}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D5D2C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21] transition-all resize-y shadow-2xs leading-relaxed"
          />
        </div>

        {/* Action buttons bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualSave}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-[#0F6E56] text-white border-[#0F6E56] shadow-sm'
                  : 'bg-[#05352E] text-white hover:bg-[#0F6E56] border-[#05352E]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Guardado ✓</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#85BCB0]" />
                  <span>Guardar / Enviar</span>
                </>
              )}
            </button>

            {notes.trim().length > 0 && (
              <button
                type="button"
                onClick={handleClearNotes}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg text-[#8C8A83] hover:text-[#C8392B] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reescribir / Limpiar</span>
              </button>
            )}
          </div>

          <span className="text-[11px] font-mono text-[#8C8A83]">
            {notes.trim().length > 0 ? (isSaved ? 'Sincronizado' : 'Guarda al salir o con el botón') : 'Opcional'}
          </span>
        </div>
      </div>
    </div>
  );
});
