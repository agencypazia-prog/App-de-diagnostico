import React, { useState } from 'react';
import { Building2, Plus, ArrowRight, Trash2, Clock, Sparkles, MapPin, Users, FileJson, FileText } from 'lucide-react';
import type { CompanyProfile } from '../types';
import { exportCompanyRawJson } from '../utils/storage';
import { exportRawQuestionnaireToDocx } from '../services/rawDocxExportService';

interface CompanyListProps {
  companies: CompanyProfile[];
  onSelectCompany: (company: CompanyProfile) => void;
  onNewCompany: () => void;
  onDeleteCompany: (id: string) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onSelectCompany,
  onNewCompany,
  onDeleteCompany,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadDocx = async (e: React.MouseEvent, comp: CompanyProfile) => {
    e.stopPropagation();
    setDownloadingId(comp.id);
    try {
      await exportRawQuestionnaireToDocx(comp);
    } catch (err) {
      console.error('Error exporting DOCX:', err);
      alert('Error al exportar cuestionario en Word.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#D5D2C9] shadow-card">
        <div>
          <span className="font-mono text-xs font-semibold text-[#0F6E56] uppercase tracking-wider">
            PORTAFOLIO DE DIAGNÓSTICOS EN PLANTA
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#05352E] mt-1">
            Empresas Registradas
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4843] mt-1">
            Selecciona una empresa para continuar la captura de instrumentos o ver su Dashboard de IA.
          </p>
        </div>

        <button
          onClick={onNewCompany}
          className="bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#FDDC42]" />
          <span>Registrar Nueva Empresa</span>
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D5D2C9] rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#85BCB0]/20 text-[#05352E] mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-[#05352E]">
            No hay empresas registradas todavía
          </h3>
          <p className="text-xs text-[#4A4843] max-w-md mx-auto">
            Inicia un diagnóstico registrando la empresa antes de la visita técnica o usa los datos de prueba.
          </p>
          <button
            onClick={onNewCompany}
            className="mt-2 bg-[#05352E] text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            + Crear Primer Diagnóstico
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((comp) => {
            const hasResult = !!comp.diagnosticResult;
            const answeredCount = Object.values(comp.instruments || {}).reduce(
              (acc, inst) => acc + Object.keys(inst.responses || {}).length,
              0
            );

            return (
              <div
                key={comp.id}
                className="bg-white border border-[#D5D2C9] hover:border-[#05352E] rounded-2xl p-5 shadow-card transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDF2E4] text-[#05352E] border border-[#D5D2C9]">
                      {comp.sector || 'Empresarial'}
                    </span>

                    {hasResult ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F6E56] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        <Sparkles className="w-3 h-3 text-[#FDDC42]" />
                        Analizado ({comp.diagnosticResult?.globalMaturityScore}%)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-[#C07A13] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" />
                        En captura ({answeredCount} resp.)
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#05352E] group-hover:text-[#0F6E56] transition-colors">
                    {comp.name}
                  </h3>

                  <div className="text-xs text-[#4A4843] space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#8C8A83]" />
                      <span>{comp.employees}</span>
                    </p>
                    {comp.location && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8C8A83]" />
                        <span>{comp.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="pt-3 border-t border-[#D5D2C9] flex items-center justify-between">
                  <button
                    onClick={() => onSelectCompany(comp)}
                    className="text-xs font-bold text-[#05352E] hover:text-[#0F6E56] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>{hasResult ? 'Ver Dashboard de IA' : 'Continuar Diagnóstico'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Raw Docx Export */}
                    <button
                      onClick={(e) => handleDownloadDocx(e, comp)}
                      disabled={downloadingId === comp.id}
                      className="p-1.5 text-gray-500 hover:text-[#0F6E56] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Descargar cuestionario completo en Word (.docx)"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    {/* Raw JSON Export */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportCompanyRawJson(comp);
                      }}
                      className="p-1.5 text-gray-500 hover:text-[#05352E] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Descargar datos en bruto (JSON)"
                    >
                      <FileJson className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Eliminar diagnóstico de ${comp.name}?`)) {
                          onDeleteCompany(comp.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
