import React, { useState, useCallback } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckCircle2,
  Zap,
  ListFilter,
  FileText,
  FileJson
} from 'lucide-react';
import type { CompanyProfile, EvidenceStatus, InstrumentResponse } from '../types';
import { INSTRUMENTS_DATA } from '../data/instrumentsData';
import { generateFullSimulationData } from '../utils/simulation';
import { exportRawQuestionnaireToDocx } from '../services/rawDocxExportService';
import { exportCompanyRawJson } from '../utils/storage';
import { QuestionRow } from './QuestionRow';

interface InstrumentCaptureProps {
  company: CompanyProfile;
  onUpdateCompany: (updated: CompanyProfile) => void;
  onGenerateDiagnosis: () => void;
  isAnalyzing: boolean;
}

const EVIDENCE_OPTIONS = [
  { value: 'V', label: 'Verificado', color: 'bg-[#0F6E56] text-white' },
  { value: 'D', label: 'Declarado', color: 'bg-[#5B86FF] text-white' },
  { value: 'E', label: 'Estimado', color: 'bg-[#C07A13] text-white' },
  { value: 'P', label: 'Pendiente', color: 'bg-gray-300 text-gray-700' },
];

export const InstrumentCapture: React.FC<InstrumentCaptureProps> = ({
  company,
  onUpdateCompany,
  onGenerateDiagnosis,
  isAnalyzing,
}) => {
  const [activeInstIndex, setActiveInstIndex] = useState(0);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const currentInst = INSTRUMENTS_DATA[activeInstIndex];

  const currentInstResponse: InstrumentResponse = company.instruments[currentInst.id] || {
    instrumentId: currentInst.id,
    responses: {},
    scores: {},
    completed: false,
  };

  const handleSaveQuestion = useCallback((qId: string, status: EvidenceStatus, option: string | undefined, notes: string) => {
    const updatedResponses = {
      ...currentInstResponse.responses,
      [qId]: {
        status,
        selectedOption: option,
        notes,
      },
    };

    const updatedCompany: CompanyProfile = {
      ...company,
      instruments: {
        ...company.instruments,
        [currentInst.id]: {
          instrumentId: currentInst.id,
          responses: updatedResponses,
          scores: currentInstResponse.scores,
          completed: true,
        },
      },
    };
    onUpdateCompany(updatedCompany);
  }, [company, currentInst.id, currentInstResponse, onUpdateCompany]);

  const handleScoreChange = (dim: string, score: number) => {
    const existing = currentInstResponse.scores[dim] || { score: 0, mainEvidence: '', priorityGap: '' };
    const updatedScores = {
      ...currentInstResponse.scores,
      [dim]: { ...existing, score },
    };

    const updatedCompany: CompanyProfile = {
      ...company,
      instruments: {
        ...company.instruments,
        [currentInst.id]: {
          instrumentId: currentInst.id,
          responses: currentInstResponse.responses,
          scores: updatedScores,
          completed: Object.keys(currentInstResponse.responses).length > 0,
        },
      },
    };
    onUpdateCompany(updatedCompany);
  };

  const handleAutoFillSimulation = () => {
    if (confirm('¿Cargar simulación de respuestas completas al 100% para todos los instrumentos?')) {
      const fullCompany = generateFullSimulationData(company);
      onUpdateCompany(fullCompany);
    }
  };

  const handleDownloadRawDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportRawQuestionnaireToDocx(company);
    } catch (err) {
      console.error('Error downloading raw docx:', err);
      alert('Hubo un problema al exportar el cuestionario a Word.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadRawJson = () => {
    exportCompanyRawJson(company);
  };

  // Total completed questions across all instruments
  const totalQuestions = INSTRUMENTS_DATA.reduce((acc, inst) => {
    return acc + inst.sections.reduce((sAcc, s) => sAcc + s.questions.length, 0);
  }, 0);

  const answeredQuestionsCount = Object.values(company.instruments || {}).reduce((acc, instResp) => {
    return acc + Object.keys(instResp.responses || {}).length;
  }, 0);

  const completionPercent = Math.min(100, Math.round((answeredQuestionsCount / (totalQuestions || 1)) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header with Company Info and Progress */}
      <div className="bg-white border border-[#D5D2C9] rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#05352E] text-white">
                EMPRESA EN EVALUACIÓN
              </span>
              <span className="text-xs text-[#8C8A83]">ID: {company.id.slice(0, 10)}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#05352E] mt-1">
              {company.name}
            </h1>
            <p className="text-xs text-[#4A4843] mt-0.5">
              Sector: <span className="font-semibold text-[#182A21]">{company.sector}</span> •{' '}
              {company.employees} • Consultor: {company.consultantName || 'Asignado'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Raw Docx Download */}
              <button
                type="button"
                onClick={handleDownloadRawDocx}
                disabled={isExportingDocx}
                className="bg-white hover:bg-[#85BCB0]/20 text-[#05352E] border border-[#D5D2C9] text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                title="Descargar todo el cuestionario y respuestas en Word (.docx)"
              >
                <FileText className="w-3.5 h-3.5 text-[#0F6E56]" />
                <span>{isExportingDocx ? 'Generando...' : 'Descargar Cuestionario (.docx)'}</span>
              </button>

              {/* Raw JSON Download */}
              <button
                type="button"
                onClick={handleDownloadRawJson}
                className="bg-white hover:bg-[#85BCB0]/20 text-[#05352E] border border-[#D5D2C9] text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                title="Descargar base de datos en bruto (JSON)"
              >
                <FileJson className="w-3.5 h-3.5 text-[#85BCB0]" />
                <span>JSON</span>
              </button>

              {/* Simulation button */}
              <button
                type="button"
                onClick={handleAutoFillSimulation}
                className="bg-[#FDDC42]/30 hover:bg-[#FDDC42] text-[#211B1D] border border-[#C07A13]/40 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                title="Llenar automáticamente todas las preguntas con opciones y notas reales de prueba"
              >
                <Zap className="w-3.5 h-3.5 text-[#C07A13]" />
                <span className="hidden md:inline">Simular</span> 100%
              </button>

              {/* Generate AI Diagnosis */}
              <button
                onClick={onGenerateDiagnosis}
                disabled={isAnalyzing}
                className="bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 group"
              >
                <Sparkles className="w-4 h-4 text-[#FDDC42]" />
                <span>{isAnalyzing ? 'Analizando...' : 'Generar Diagnóstico'}</span>
              </button>
            </div>

            {/* Progress Counter & Bar */}
            <div className="w-full flex items-center justify-between sm:justify-end gap-2">
              <span className="font-mono text-xs text-[#4A4843]">
                Avance: <strong className="text-[#05352E]">{answeredQuestionsCount}/{totalQuestions}</strong> ({completionPercent}%)
              </span>
              <div className="w-32 bg-[#F3F1EA] h-2 rounded-full overflow-hidden border border-[#D5D2C9]">
                <div
                  className="bg-[#0F6E56] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instruments Tab Navigation (Mobile scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-5 border-t border-[#D5D2C9] mt-5 no-scrollbar">
          {INSTRUMENTS_DATA.map((inst, idx) => {
            const isCurrent = idx === activeInstIndex;
            const resp = company.instruments[inst.id];
            const hasResponses = resp && Object.keys(resp.responses || {}).length > 0;

            return (
              <button
                key={inst.id}
                onClick={() => setActiveInstIndex(idx)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  isCurrent
                    ? 'bg-[#05352E] text-white border-[#05352E] shadow-sm'
                    : hasResponses
                    ? 'bg-[#85BCB0]/20 text-[#05352E] border-[#85BCB0]/50'
                    : 'bg-[#F3F1EA] text-[#4A4843] border-[#D5D2C9] hover:bg-white'
                }`}
              >
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/10">
                  {inst.id}
                </span>
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{inst.title}</span>
                {hasResponses && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6E56]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Instrument Card */}
      <div className="bg-white border border-[#D5D2C9] rounded-2xl p-5 sm:p-7 shadow-card space-y-6">
        {/* Instrument Title & Responsible */}
        <div className="border-b border-[#D5D2C9] pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#05352E] bg-[#85BCB0]/20 px-2.5 py-1 rounded-md">
              INSTRUMENTO {currentInst.id}
            </span>
            <span className="text-xs text-[#4A4843] font-medium">
              Responsable en visita: <strong className="text-[#182A21]">{currentInst.role}</strong>
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#05352E]">
            {currentInst.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4843] mt-1">{currentInst.subtitle}</p>
          <div className="mt-3 p-3 bg-[#FDF2E4] rounded-xl border border-[#D5D2C9] text-xs text-[#182A21] leading-relaxed">
            <strong className="text-[#05352E]">Función de diagnóstico:</strong> {currentInst.function}
          </div>
        </div>

        {/* Evidence Status Legend & Quick Selection guide */}
        <div className="bg-[#F3F1EA] p-3 rounded-xl border border-[#D5D2C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-[#182A21] block mb-1 uppercase tracking-wider">
              Convención de evidencia:
            </span>
            <div className="flex flex-wrap gap-3">
              {EVIDENCE_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-1.5 text-[#4A4843]">
                  <span className={`w-4 h-4 rounded flex items-center justify-center font-mono font-bold text-[10px] ${opt.color}`}>
                    {opt.value}
                  </span>
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-[#05352E] font-medium flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-[#D5D2C9]">
            <ListFilter className="w-3.5 h-3.5 text-[#0F6E56]" />
            <span>Selecciona una opción predefinida o redacta notas detalladas</span>
          </div>
        </div>

        {/* Sections and Questions with isolated memoized QuestionRow components */}
        <div className="space-y-6">
          {currentInst.sections.map((section, sIdx) => (
            <div key={sIdx} className="border border-[#D5D2C9] rounded-xl overflow-hidden">
              <div className="bg-[#05352E]/5 px-4 py-3 border-b border-[#D5D2C9]">
                <h3 className="font-display font-semibold text-sm sm:text-base text-[#05352E]">
                  {section.title}
                </h3>
              </div>

              <div className="divide-y divide-[#D5D2C9]">
                {section.questions.map((q) => {
                  const resp = currentInstResponse.responses[q.id] || { status: 'P', notes: '' };

                  return (
                    <QuestionRow
                      key={q.id}
                      question={q}
                      initialStatus={resp.status}
                      initialSelectedOption={resp.selectedOption}
                      initialNotes={resp.notes || ''}
                      onSaveQuestion={(status, opt, notes) => handleSaveQuestion(q.id, status, opt, notes)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Rubric Evaluation (0 to 5) */}
        {currentInst.rubricDimensions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#D5D2C9] space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#05352E]" />
              <h3 className="font-display text-lg font-bold text-[#05352E]">
                Valoración Preliminar de Madurez (Escala 0 a 5)
              </h3>
            </div>
            <p className="text-xs text-[#4A4843]">
              0 = Inexistente | 1 = Informal | 2 = Repetible | 3 = Definido | 4 = Medido | 5 = Optimizado
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentInst.rubricDimensions.map((dim) => {
                const scoreObj = currentInstResponse.scores[dim] || { score: 1, mainEvidence: '', priorityGap: '' };

                return (
                  <div key={dim} className="p-3.5 bg-[#F3F1EA] rounded-xl border border-[#D5D2C9] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#182A21]">{dim}</span>
                      <span className="font-mono text-xs font-bold text-[#05352E] px-2 py-0.5 rounded bg-white border border-[#D5D2C9]">
                        Nivel {scoreObj.score} / 5
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3, 4, 5].map((lvl) => {
                        const isChosen = scoreObj.score === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleScoreChange(dim, lvl)}
                            className={`flex-1 py-1 rounded-md text-xs font-mono font-bold transition-all border ${
                              isChosen
                                ? 'bg-[#05352E] text-white border-[#05352E] shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Navigation between instruments */}
        <div className="flex items-center justify-between pt-6 border-t border-[#D5D2C9]">
          <button
            onClick={() => setActiveInstIndex(Math.max(0, activeInstIndex - 1))}
            disabled={activeInstIndex === 0}
            className="px-4 py-2 bg-[#F3F1EA] hover:bg-white text-xs font-semibold text-[#182A21] rounded-xl border border-[#D5D2C9] transition-all disabled:opacity-40 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior Instrumento
          </button>

          <button
            onClick={onGenerateDiagnosis}
            disabled={isAnalyzing}
            className="bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FDDC42]" />
            <span>Generar Diagnóstico de IA</span>
          </button>

          <button
            onClick={() => setActiveInstIndex(Math.min(INSTRUMENTS_DATA.length - 1, activeInstIndex + 1))}
            disabled={activeInstIndex === INSTRUMENTS_DATA.length - 1}
            className="px-4 py-2 bg-[#F3F1EA] hover:bg-white text-xs font-semibold text-[#182A21] rounded-xl border border-[#D5D2C9] transition-all disabled:opacity-40 flex items-center gap-1.5"
          >
            Siguiente Instrumento
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
