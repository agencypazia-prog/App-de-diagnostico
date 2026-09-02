import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  User,
  ShieldCheck,
  Shield,
  X,
  RefreshCw,
} from 'lucide-react';
import { ChatAttachment, ChatSessionState } from '../types';
import { processFileForChat, formatFileSize } from '../services/fileUploadService';
import {
  applyAiTurn,
  buildChatTurnPayload,
  coverageLabel,
  createInitialChatSession,
} from '../services/instrumentChatConductor';
import { mapChatSessionToCompanyProfile } from '../services/chatDiagnosticMapper';
import { requestInstrumentChatTurn, saveCompany } from '../utils/storage';

const CHAT_STORAGE_KEY = 'paz_ortega_client_chat_session_v4';

interface ClientChatAssistantProps {
  onDiagnosticSubmitted: (sessionState: ChatSessionState) => void;
}

export function ClientChatAssistant({
  onDiagnosticSubmitted,
}: ClientChatAssistantProps) {
  // Session State
  const [session, setSession] = useState<ChatSessionState>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSessionState;
        if (parsed.empresaId && parsed.phase) return parsed;
      }
    } catch (e) {
      console.error('Error loading chat session:', e);
    }
    return createInitialChatSession();
  });

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(session.isSubmitted);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, pendingAttachments, isThinking]);

  // Persist session in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Error saving chat session:', e);
    }
  }, [session]);

  // Voice recording with Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'es-ES';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recog.onerror = () => {
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta dictado por voz directo. Puedes escribir tu respuesta en el campo de texto.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  // Handle file uploads (Images & Documents)
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const processed: ChatAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const att = await processFileForChat(file);
        processed.push(att);
      }

      setPendingAttachments((prev) => [...prev, ...processed]);
      setSession((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...processed],
      }));
    } catch (err: any) {
      alert(err.message || 'Error al procesar archivo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
    setSession((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  const persistSession = (next: ChatSessionState, includeFiles = false) => {
    const profile = mapChatSessionToCompanyProfile(next);
    if (!includeFiles) {
      profile.attachments = (profile.attachments || []).map((a) => ({ ...a, dataUrl: undefined }));
      if (profile.chatSession) {
        profile.chatSession = {
          ...profile.chatSession,
          attachments: profile.attachments,
          messages: profile.chatSession.messages.map((m) => ({
            ...m,
            attachments: m.attachments?.map((a) => ({ ...a, dataUrl: undefined })),
          })),
        };
      }
    }
    saveCompany(profile);
  };

  const handleSendMessage = async (overrideText?: string) => {
    const messageText = overrideText !== undefined ? overrideText : inputVal.trim();
    if ((!messageText && pendingAttachments.length === 0) || isThinking || session.isSubmitted) return;

    const currentAttachments = [...pendingAttachments];
    setPendingAttachments([]);
    setInputVal('');
    setIsThinking(true);

    const userOnlyText = messageText || 'Adjunto archivo(s).';
    const pendingUser = {
      id: `msg_user_${Date.now()}`,
      sender: 'user' as const,
      text: userOnlyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAttachments.length ? currentAttachments : undefined,
    };
    const sessionWithUser = {
      ...session,
      messages: [...session.messages, pendingUser],
      attachments: currentAttachments.length
        ? [...session.attachments, ...currentAttachments]
        : session.attachments,
    };
    setSession(sessionWithUser);

    try {
      const payload = buildChatTurnPayload(sessionWithUser, userOnlyText);
      const ai = await requestInstrumentChatTurn(payload);
      const next = applyAiTurn(sessionWithUser, userOnlyText, {
        reply: ai.reply,
        options: ai.options,
        mappedAnswers: ai.mappedAnswers,
        companyName: ai.companyName || undefined,
        contactName: ai.contactName || undefined,
        contactEmail: ai.contactEmail || undefined,
        sector: ai.sector || undefined,
        readyToClose: ai.readyToClose,
      });
      setSession(next);
      persistSession(next, false);
    } catch (err: any) {
      const hint =
        err?.status === 503
          ? 'El asistente de IA aún no está conectado en el servidor. Falta DEEPSEEK_API_KEY en el archivo .env.'
          : 'No pude continuar ahora. Intenta de nuevo en un momento.';
      setSession((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg_bot_${Date.now()}_err`,
            sender: 'bot',
            text: hint,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    } finally {
      setIsThinking(false);
    }
  };

  // Final submission action
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const completedSession: ChatSessionState = {
      ...session,
      isCompleted: true,
      isSubmitted: true,
      submittedAt: new Date().toISOString(),
      phase: 'done',
    };

    setSession(completedSession);
    persistSession(completedSession, true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      onDiagnosticSubmitted(completedSession);
    }, 400);
  };

  const handleRestartChat = () => {
    if (confirm('¿Deseas reiniciar la conversación de diagnóstico? Se borrará el progreso no enviado.')) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      window.location.reload();
    }
  };

  const lastBotMessage = session.messages.filter((m) => m.sender === 'bot').slice(-1)[0];
  const isFinalStep = lastBotMessage?.isFinalConfirmation || session.isCompleted;

  return (
    <div className="min-h-screen bg-[#FDF2E4] text-[#182A21] flex flex-col font-body selection:bg-[#85BCB0] selection:text-[#05352E]">
      <header className="bg-[#05352E] text-[#FDF2E4] border-b border-[#182A21]/30 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#85BCB0]/20 flex items-center justify-center border border-[#85BCB0]/40">
            <Shield className="w-5 h-5 text-[#85BCB0]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display text-base font-bold tracking-tight text-[#FDF2E4]">
                PAZ ORTEGA IA
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#85BCB0]/15 text-[#85BCB0] border border-[#85BCB0]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#85BCB0] mr-1.5 animate-pulse"></span>
                Diagnóstico
              </span>
            </div>
            <p className="text-xs text-[#85BCB0]">{coverageLabel(session)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRestartChat}
            title="Reiniciar conversación"
            className="p-2 rounded-lg text-[#85BCB0] hover:text-[#FDF2E4] hover:bg-[#182A21]/60 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between">
        {/* Messages List */}
        <div className="space-y-4 pb-6">
          {session.messages.map((msg, idx) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id || idx}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-[#05352E] flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-[#85BCB0]" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-card whitespace-pre-line text-sm leading-relaxed ${
                      isBot
                        ? 'bg-white border border-[#D5D2C9] text-[#182A21] rounded-tl-sm'
                        : 'bg-[#05352E] text-[#FDF2E4] rounded-tr-sm'
                    }`}
                  >
                    {msg.text}

                    {/* Attached files in message */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#D5D2C9] space-y-2">
                        <p className="text-xs font-semibold text-[#4A4843] flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-[#0F6E56]" />
                          Archivos adjuntados ({msg.attachments.length}):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-[#FDF2E4] border border-[#D5D2C9] text-xs"
                            >
                              {att.type === 'image' ? (
                                <img
                                  src={att.dataUrl}
                                  alt={att.name}
                                  className="w-10 h-10 object-cover rounded border border-[#D5D2C9]"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-[#05352E]/10 flex items-center justify-center text-[#05352E]">
                                  <FileText className="w-5 h-5" />
                                </div>
                              )}
                              <div className="truncate flex-1">
                                <p className="font-medium text-[#182A21] truncate">{att.name}</p>
                                <p className="text-[10px] text-[#8C8A83]">{formatFileSize(att.size)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#8C8A83] mt-1 px-1">{msg.timestamp}</span>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-[#85BCB0]/30 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-[#05352E]" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#05352E] flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-[#85BCB0]" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white border border-[#D5D2C9] text-[#8C8A83] text-sm shadow-card rounded-tl-sm">
                Pensando…
              </div>
            </div>
          )}

          {!isFinalStep && !isThinking && lastBotMessage?.options && lastBotMessage.options.length > 0 ? (
            <div className="pl-11 pr-4 pt-2 flex flex-wrap gap-2">
              {lastBotMessage.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(opt)}
                  className="text-xs px-3.5 py-2 rounded-xl bg-white border border-[#05352E]/20 text-[#05352E] hover:bg-[#05352E] hover:text-[#FDF2E4] transition-all shadow-sm active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : null}

          {/* Final Submission Banner */}
          {isFinalStep && !session.isSubmitted && (
            <div className="mt-6 p-6 rounded-2xl bg-white border border-[#D5D2C9] shadow-card text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#05352E] flex items-center justify-center mx-auto text-[#85BCB0]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#05352E]">Listo para enviar</h3>
                <p className="text-sm text-[#4A4843] max-w-lg mx-auto mt-1">
                  La conversación queda guardada para que el consultor inicie el análisis.
                </p>
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] font-semibold text-sm shadow-md flex items-center justify-center gap-2 mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Enviando información...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Diagnóstico Completo
                  </>
                )}
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Attachments Bar */}
        {!session.isSubmitted && (
          <div className="sticky bottom-4 z-20 bg-white rounded-2xl border border-[#D5D2C9] p-3 shadow-elevated">
            {pendingAttachments.length > 0 && (
              <div className="mb-2 pb-2 border-b border-[#D5D2C9] flex flex-wrap gap-2">
                {pendingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FDF2E4] border border-[#D5D2C9] text-xs text-[#182A21]"
                  >
                    {att.type === 'image' ? (
                      <ImageIcon className="w-3.5 h-3.5 text-[#0F6E56]" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-[#05352E]" />
                    )}
                    <span className="max-w-[120px] truncate">{att.name}</span>
                    <button
                      onClick={() => removePendingAttachment(att.id)}
                      className="text-[#8C8A83] hover:text-[#C8392B] ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                className="hidden"
              />

              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Adjuntar fotos de planta o documentos (PDF, Excel, Word)"
                className="p-2.5 rounded-xl text-[#8C8A83] hover:text-[#05352E] hover:bg-[#FDF2E4] transition-colors shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isRecording ? 'Escuchando tu voz...' : 'Escribe tu respuesta...'}
                className="flex-1 bg-transparent border-0 focus:ring-0 text-sm text-[#182A21] placeholder-[#8C8A83] px-2 py-1.5 outline-none"
              />

              {/* Voice Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                title={isRecording ? 'Detener dictado' : 'Dictar por voz'}
                className={`p-2.5 rounded-xl transition-all shrink-0 ${
                  isRecording
                    ? 'bg-red-100 text-[#C8392B] border border-red-200 animate-pulse'
                    : 'text-[#8C8A83] hover:text-[#05352E] hover:bg-[#FDF2E4]'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isThinking || (!inputVal.trim() && pendingAttachments.length === 0)}
                className="p-2.5 rounded-xl bg-[#05352E] hover:bg-[#0F6E56] disabled:opacity-40 disabled:hover:bg-[#05352E] text-[#FDF2E4] transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#211B1D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDF2E4] border border-[#05352E]/20 rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#05352E] flex items-center justify-center mx-auto text-[#85BCB0]">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#05352E]">Diagnóstico enviado</h2>
              <p className="text-sm text-[#4A4843] leading-relaxed">
                Recibimos la información de <strong className="text-[#05352E]">{session.companyName || 'tu empresa'}</strong>.
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-[#D5D2C9] text-xs text-[#4A4843] text-left space-y-1.5 mt-3">
                <p className="flex items-center text-[#182A21] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0F6E56] mr-2 shrink-0" />
                  Conversación guardada.
                </p>
                <p className="flex items-center text-[#182A21] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0F6E56] mr-2 shrink-0" />
                  {session.attachments.length} archivo(s) almacenados.
                </p>
                <p className="flex items-center text-[#182A21] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0F6E56] mr-2 shrink-0" />
                  Lista para revisión del consultor.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-[#8C8A83]">
                El equipo revisará los resultados para iniciar el diagnóstico.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
