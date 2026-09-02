import React, { useState } from 'react';
import {
  X,
  Bot,
  User,
  Paperclip,
  Download,
  FileText,
  Image as ImageIcon,
  DollarSign,
  TrendingDown,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { CompanyProfile, ChatAttachment } from '../types';
import { formatFileSize } from '../services/fileUploadService';
import { generateEnrichedChatDiagnosis } from '../services/chatDiagnosticMapper';
import { exportDiagnosisToDocx } from '../services/exportService';
import { exportConversationTranscript } from '../utils/storage';

interface ConsultantChatReviewModalProps {
  company: CompanyProfile;
  isOpen: boolean;
  onClose: () => void;
  onDiagnosticUpdated: (updatedCompany: CompanyProfile) => void;
}

export function ConsultantChatReviewModal({
  company,
  isOpen,
  onClose,
  onDiagnosticUpdated,
}: ConsultantChatReviewModalProps) {
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ChatAttachment | null>(null);

  if (!isOpen) return null;

  const chatSession = company.chatSession;
  const costs = company.costBreakdown || chatSession?.costBreakdown || {};
  const attachments = company.attachments || chatSession?.attachments || [];
  const messages = chatSession?.messages || [];

  const handleDownloadAttachment = (att: ChatAttachment) => {
    if (!att.dataUrl && !att.url) {
      alert('Enlace de archivo no disponible.');
      return;
    }

    const downloadUrl = att.dataUrl || att.url;
    const a = document.createElement('a');
    a.href = downloadUrl!;
    a.download = att.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleGenerateOfficialDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      // 1. Generate enriched diagnosis with custom cost models
      const diagnosticResult = await generateEnrichedChatDiagnosis(company);

      const updatedCompany: CompanyProfile = {
        ...company,
        status: 'analyzed',
        diagnosticResult,
      };

      // 2. Export directly to professional Word DOCX
      await exportDiagnosisToDocx(updatedCompany, diagnosticResult);

      onDiagnosticUpdated(updatedCompany);
      alert('¡Diagnóstico Estratégico y Propuesta Comercial generada y descargada en Word (.docx) con éxito!');
    } catch (err: any) {
      console.error('Error generating diagnostic docx:', err);
      alert('Error al generar el diagnóstico: ' + (err.message || err));
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{company.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  Diagnóstico Conversacional
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {company.sector} · {company.employees} · Enviado el {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateOfficialDocx}
              disabled={isGeneratingDocx}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isGeneratingDocx ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando Informe...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Generar Informe Word (.docx)
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Financial Breakdown Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Desglose de Costes y Fugas Económicas Declaradas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Mermas & Fallos Directos</span>
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-sm font-bold text-rose-300">
                  {costs.directWasteMonthly || 'No especificado'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Costos de no-calidad en planta</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Horas Perdidas / Reprocesos</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-sm font-bold text-amber-300">
                  {costs.indirectHoursWeekly || 'No especificado'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Costos indirectos y mano de obra</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Multas & Coste de Oportunidad</span>
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-sm font-bold text-cyan-300">
                  {costs.opportunityLossAnnual || 'No especificado'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Penalizaciones e impacto comercial</p>
              </div>
            </div>
          </div>

          {/* Attached Files & Documents */}
          {attachments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4" />
                  Archivos y Evidencias Adjuntadas por el Cliente ({attachments.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-start gap-2.5">
                      {att.type === 'image' ? (
                        <div
                          onClick={() => setSelectedPhoto(att)}
                          className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer shrink-0 relative group-hover:opacity-90 transition-opacity"
                        >
                          <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                          {att.name.endsWith('.xlsx') || att.name.endsWith('.csv') ? (
                            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <FileText className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>
                      )}
                      <div className="truncate flex-1">
                        <p className="text-xs font-semibold text-slate-200 truncate" title={att.name}>
                          {att.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{formatFileSize(att.size)}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end gap-1">
                      {att.type === 'image' && (
                        <button
                          onClick={() => setSelectedPhoto(att)}
                          className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadAttachment(att)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/20 hover:bg-cyan-950/70 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Descargar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Conversation Transcript */}
          <div>
            <div className="flex items-center justify-between mb-3 gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Transcripción de la Entrevista Conversacional
              </h3>
              <button
                onClick={() => exportConversationTranscript(company)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/20 hover:bg-cyan-950/70 transition-colors flex items-center gap-1 shrink-0"
              >
                <Download className="w-3 h-3" />
                Descargar conversación
              </button>
            </div>
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto">
              {messages.map((msg, i) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="w-6 h-6 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-line ${
                        isBot
                          ? 'bg-slate-900 text-slate-300 border border-slate-800'
                          : 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30 font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {!isBot && (
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            {messages.length} mensajes registrados · {attachments.length} archivo(s) adjuntos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportConversationTranscript(company)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar conversación
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleGenerateOfficialDocx}
              disabled={isGeneratingDocx}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Informe Word (.docx)
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-3xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.dataUrl}
              alt={selectedPhoto.name}
              className="max-h-[80vh] max-w-full rounded-xl object-contain border border-slate-700 shadow-2xl"
            />
            <p className="text-center text-xs text-slate-300 mt-2 font-medium">{selectedPhoto.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
