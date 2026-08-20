import React, { useState } from 'react';
import {
  Sparkles,
  Printer,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Lock,
  Target,
  FileJson,
  FileDown
} from 'lucide-react';
import type { CompanyProfile, DiagnosticResult } from '../types';
import { RadarChart } from './RadarChart';
import { exportDiagnosisToDocx } from '../services/exportService';
import { exportRawQuestionnaireToDocx } from '../services/rawDocxExportService';
import { exportCompanyRawJson } from '../utils/storage';

interface InfographicDashboardProps {
  company: CompanyProfile;
  result: DiagnosticResult;
  onBackToEdit: () => void;
}

export const InfographicDashboard: React.FC<InfographicDashboardProps> = ({
  company,
  result,
  onBackToEdit,
}) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingRawDocx, setIsExportingRawDocx] = useState(false);

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportDiagnosisToDocx(company, result);
    } catch (err) {
      console.error('Error exporting DOCX:', err);
      alert('Hubo un error al generar el informe ejecutivo.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportRawDocx = async () => {
    setIsExportingRawDocx(true);
    try {
      await exportRawQuestionnaireToDocx(company);
    } catch (err) {
      console.error('Error exporting raw DOCX:', err);
      alert('Hubo un problema al exportar el cuestionario a Word.');
    } finally {
      setIsExportingRawDocx(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    exportCompanyRawJson(company);
  };

  const radarData = result.dimensionScores.map((d) => ({
    label: d.dimension.split(' ')[0] || d.dimension,
    value: d.score,
  }));

  const riskColor =
    result.overallRiskLevel === 'Crítico'
      ? 'bg-[#C8392B] text-white'
      : result.overallRiskLevel === 'Alto'
      ? 'bg-[#EC532A] text-white'
      : result.overallRiskLevel === 'Medio'
      ? 'bg-[#C07A13] text-white'
      : 'bg-[#0F6E56] text-white';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="no-print bg-[#05352E] text-[#FDF2E4] p-4 rounded-2xl shadow-elevated flex flex-wrap items-center justify-between gap-4 border border-[#85BCB0]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDDC42] text-[#211B1D] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Dictamen Estratégico & Hoja de Ruta
            </h2>
            <p className="text-xs text-[#85BCB0]">
              Empresa: <strong>{company.name}</strong> • Fecha: {result.generatedAt}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBackToEdit}
            className="px-3 py-2 bg-[#182A21] hover:bg-[#211B1D] text-xs font-semibold rounded-xl text-gray-200 border border-gray-700 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Editar Instrumentos
          </button>

          {/* Raw JSON Data */}
          <button
            onClick={handleExportJson}
            className="px-3 py-2 bg-[#182A21] hover:bg-[#211B1D] text-xs font-semibold rounded-xl text-gray-200 border border-gray-700 transition-colors flex items-center gap-1.5"
            title="Descargar base de datos completa en formato JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-[#85BCB0]" />
            <span>Datos JSON</span>
          </button>

          {/* Full Raw Questionnaire Word Docx */}
          <button
            onClick={handleExportRawDocx}
            disabled={isExportingRawDocx}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#FDF2E4] border border-[#85BCB0]/40 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            title="Descargar cuestionario completo de 149 preguntas y respuestas en Word (.docx)"
          >
            <FileDown className="w-3.5 h-3.5 text-[#FDDC42]" />
            <span>{isExportingRawDocx ? 'Generando...' : 'Cuestionario Bruto (.docx)'}</span>
          </button>

          {/* Executive Report Word Export */}
          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="px-3.5 py-2 bg-[#85BCB0] hover:bg-[#85BCB0]/90 text-[#05352E] text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isExportingDocx ? 'Generando...' : 'Informe Ejecutivo (.docx)'}</span>
          </button>

          {/* Print / PDF Export */}
          <button
            onClick={handlePrintPdf}
            className="px-3.5 py-2 bg-[#FDDC42] hover:bg-[#FDDC42]/90 text-[#211B1D] text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Infographic Paper Container (Optimized for Screen & Print) */}
      <div className="bg-[#FDF2E4] border border-[#D5D2C9] rounded-3xl p-6 sm:p-10 shadow-card space-y-10">
        
        {/* Cover Header (Print Page 1 Header) */}
        <div className="print-avoid-break border-b-2 border-[#05352E] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05352E] bg-[#85BCB0]/30 px-3 py-1 rounded-full inline-block mb-2">
                PAZ ORTEGA IA · INFORME EJECUTIVO DE ADOPCIÓN & GOBERNANZA
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#05352E] tracking-tight">
                {company.name}
              </h1>
              <p className="text-sm text-[#4A4843] mt-1 font-medium">
                Sector: <strong className="text-[#182A21]">{company.sector}</strong> • {company.employees} •{' '}
                {company.location || 'Sede Principal'}
              </p>
            </div>

            <div className="flex flex-row sm:flex-col items-end gap-2 text-right">
              <div className="p-3 bg-white border border-[#D5D2C9] rounded-2xl text-center shadow-sm">
                <span className="text-[10px] text-[#8C8A83] uppercase tracking-wider block font-bold">
                  Madurez de IA
                </span>
                <span className="font-display text-3xl font-extrabold text-[#05352E]">
                  {result.globalMaturityScore}%
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider ${riskColor}`}>
                Riesgo: {result.overallRiskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="print-avoid-break bg-white border-l-4 border-[#05352E] p-5 sm:p-6 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#05352E]">
            <Shield className="w-5 h-5" />
            <h3 className="font-display text-lg font-bold">Dictamen Ejecutivo y Enfoque de Solución</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#182A21] leading-relaxed">
            {result.executiveSummary}
          </p>
        </div>

        {/* Diagnostic Infographic Radar & Key Dimensions */}
        <div className="print-avoid-break grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#D5D2C9] shadow-sm">
          {/* Radar Chart */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <span className="font-mono text-xs text-[#8C8A83] uppercase tracking-wider font-bold mb-1">
              Perfil de Madurez por Ejes (0–100%)
            </span>
            <RadarChart data={radarData} size={300} />
          </div>

          {/* Dimension score cards */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="font-display text-base font-bold text-[#05352E] mb-2">
              Hallazgos por Dimensión de Operación:
            </h4>
            <div className="space-y-2.5">
              {result.dimensionScores.map((dim, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FDF2E4]/70 border border-[#D5D2C9] rounded-xl text-xs space-y-1 hover:bg-[#FDF2E4] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#05352E]">{dim.dimension}</span>
                    <span className="font-mono font-bold text-[#0F6E56] bg-white px-2 py-0.5 rounded border border-[#D5D2C9]">
                      {dim.score}% ({dim.level})
                    </span>
                  </div>
                  <p className="text-[#4A4843] text-[11px] leading-relaxed">{dim.finding}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Break for Print before Bottlenecks & Matrix */}
        <div className="print-page-break" />

        {/* Critical In-Plant Bottlenecks */}
        <div className="print-avoid-break space-y-4">
          <div className="flex items-center gap-2 text-[#05352E]">
            <AlertTriangle className="w-5 h-5 text-[#C8392B]" />
            <h3 className="font-display text-xl font-bold">Cuellos de Botella y Puntos Críticos en Planta</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.criticalBottlenecks.map((b, idx) => (
              <div
                key={idx}
                className="bg-white border-t-4 border-[#C8392B] p-5 rounded-2xl border-x border-b border-[#D5D2C9] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C8392B] bg-red-50 px-2 py-0.5 rounded">
                    {b.area}
                  </span>
                  <h4 className="font-display text-sm font-bold text-[#182A21]">{b.description}</h4>
                  <p className="text-xs text-[#8C8A83] italic">Impacto: {b.consequence}</p>
                </div>
                <div className="p-2.5 bg-[#85BCB0]/20 rounded-xl border border-[#85BCB0]/40 text-xs text-[#05352E]">
                  <strong className="block text-[10px] uppercase tracking-wider text-[#05352E] font-bold mb-0.5">
                    Solución IA Recomendada:
                  </strong>
                  {b.aiRemedy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities Matrix */}
        <div className="print-avoid-break space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#05352E]">
              <Target className="w-5 h-5 text-[#0F6E56]" />
              <h3 className="font-display text-xl font-bold">Matriz de Oportunidades y Priorización</h3>
            </div>
            <span className="text-xs text-[#8C8A83] font-mono hidden sm:inline">
              Foco en ROI y Viabilidad Técnica
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#D5D2C9] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-[#D5D2C9] text-left text-xs">
              <thead className="bg-[#05352E] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-mono text-[11px]">Proceso & Problema</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-mono text-[11px]">Solución IA Propuesta</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-mono text-[11px]">Categoría</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-mono text-[11px]">Impacto / Prioridad</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-mono text-[11px]">Beneficio Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5D2C9] bg-white text-[#182A21]">
                {result.opportunitiesMatrix.map((opp) => (
                  <tr key={opp.id} className="hover:bg-[#FDF2E4]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="block text-[#05352E] text-xs">{opp.process}</strong>
                      <span className="text-[11px] text-[#4A4843]">{opp.problem}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#05352E]">
                      {opp.proposedAI}
                      <span className="block text-[10px] text-[#8C8A83] font-mono mt-0.5">
                        Inversión: {opp.estimatedCost}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#85BCB0]/20 text-[#05352E] border border-[#85BCB0]/40">
                        {opp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#C8392B] block">{opp.impact}</span>
                      <span className="text-[10px] text-[#8C8A83] font-mono">{opp.priority}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#0F6E56]">
                      {opp.estimatedBenefit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page Break for Print before Roadmap & Financials */}
        <div className="print-page-break" />

        {/* Visual Roadmap Land-and-Expand */}
        <div className="print-avoid-break space-y-4">
          <div className="flex items-center gap-2 text-[#05352E]">
            <TrendingUp className="w-5 h-5 text-[#5B86FF]" />
            <h3 className="font-display text-xl font-bold">
              Hoja de Ruta de Implementación (Estrategia Land-and-Expand)
            </h3>
          </div>
          <p className="text-xs text-[#4A4843]">
            De un Quick Win inicial con retorno inmediato hasta el control integral de agentes y gobernanza corporativa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {result.roadmap.map((phase) => (
              <div
                key={phase.phase}
                className="bg-white border border-[#D5D2C9] rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#05352E]" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#05352E] bg-[#85BCB0]/30 px-2 py-0.5 rounded-md">
                      FASE {phase.phase}
                    </span>
                    <span className="font-mono text-xs text-[#8C8A83]">{phase.timeframe}</span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-[#05352E]">{phase.title}</h4>
                  <p className="text-xs text-[#4A4843] leading-relaxed">{phase.objective}</p>

                  <div className="pt-2 border-t border-[#D5D2C9]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8A83] block mb-1">
                      Entregables Clave:
                    </span>
                    <ul className="space-y-1 text-xs text-[#182A21]">
                      {phase.deliverables.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6E56] flex-shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D5D2C9] text-xs">
                  <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#0F6E56] block">
                    KPI Clave:
                  </span>
                  <p className="text-[#05352E] font-medium text-[11px]">{phase.keyKPI}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Scenarios & ROI */}
        <div className="print-avoid-break space-y-4">
          <div className="flex items-center gap-2 text-[#05352E]">
            <DollarSign className="w-5 h-5 text-[#0F6E56]" />
            <h3 className="font-display text-xl font-bold">Casos de Negocio y Estimación de ROI</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {result.financialScenarios.map((scen, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
                  scen.name === 'Esperado'
                    ? 'bg-[#05352E] text-[#FDF2E4] border-[#05352E] ring-2 ring-[#FDDC42]/60'
                    : 'bg-white text-[#182A21] border-[#D5D2C9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      scen.name === 'Esperado' ? 'bg-[#FDDC42] text-[#211B1D]' : 'bg-[#F3F1EA] text-[#05352E]'
                    }`}
                  >
                    Escenario {scen.name}
                  </span>
                  <span className="font-mono text-xs opacity-75">Payback: ~{scen.estimatedPaybackMonths} meses</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] opacity-75 block">Ahorro Anual Estimado:</span>
                  <div className="font-display text-2xl font-extrabold">{scen.annualSavings}</div>
                  <span className="font-mono text-xs font-semibold opacity-90 block">
                    ROI Anual: {scen.estimatedROI}
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${scen.name === 'Esperado' ? 'bg-white/10' : 'bg-[#FDF2E4]'}`}>
                  <strong>Supuesto:</strong> {scen.keyAssumptions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance, ISO 42001 & Human-in-the-loop */}
        <div className="print-avoid-break bg-white border border-[#D5D2C9] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#05352E]">
            <Lock className="w-5 h-5 text-[#3C3489]" />
            <h3 className="font-display text-lg font-bold">
              Gobernanza, Privacidad y Principios Human-in-the-loop
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F3F1EA] rounded-xl space-y-2 border border-[#D5D2C9]">
              <span className="font-mono font-bold text-[#05352E] uppercase text-[10px] block">
                Principio Human-in-the-loop:
              </span>
              <p className="text-[#182A21]">
                La IA ejecuta lo repetible, asiste lo complejo y <strong>la persona decide lo crítico</strong>.
              </p>
              <ul className="list-disc list-inside text-[#4A4843] space-y-1 pt-1">
                {result.governanceAndComplianceNotes.humanInTheLoopRequirements.map((req, rIdx) => (
                  <li key={rIdx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#F3F1EA] rounded-xl space-y-2 border border-[#D5D2C9]">
              <span className="font-mono font-bold text-[#05352E] uppercase text-[10px] block">
                Brechas Normativas Prioritarias (ISO/IEC 42001):
              </span>
              <ul className="list-disc list-inside text-[#4A4843] space-y-1">
                {result.governanceAndComplianceNotes.iso42001Gaps.map((gap, gIdx) => (
                  <li key={gIdx}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Next Step Banner */}
        <div className="print-avoid-break bg-[#05352E] text-[#FDF2E4] p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-3 border-2 border-[#85BCB0]/40">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FDDC42]">
            PROPUESTA DE CIERRE COMERCIAL
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            {result.recommendedServicePackage.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#85BCB0] max-w-2xl mx-auto">
            {result.recommendedServicePackage.shortDescription}
          </p>
          <div className="pt-2">
            <p className="text-xs text-white/90 bg-[#182A21] px-4 py-2 rounded-xl inline-block font-medium border border-gray-700">
              👉 {result.recommendedServicePackage.nextStepRecommendation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#D5D2C9] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8A83] font-mono gap-2">
          <span>PAZ ORTEGA IA — De la norma al código</span>
          <span>Bogotá, Colombia · pazortega.ia</span>
        </div>
      </div>
    </div>
  );
};
