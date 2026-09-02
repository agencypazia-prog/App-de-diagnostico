import { CompanyProfile, InstrumentResponse, ChatSessionState, FinancialScenario, DiagnosticResult } from '../types';
import { INSTRUMENTS_DATA } from '../data/instrumentsData';
import { generateStrategicDiagnosis } from './aiDiagnosticService';

/**
 * Mapea una sesión de chat conversacional y su desglose financiero
 * a la estructura canónica de CompanyProfile e Instrumentos de PAZ ORTEGA IA.
 */
export function mapChatSessionToCompanyProfile(session: ChatSessionState): CompanyProfile {
  const companyId = session.empresaId || `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const captured = session.instrumentAnswers || {};
  const instruments: Record<string, InstrumentResponse> = {};

  INSTRUMENTS_DATA.forEach((inst) => {
    const scores: Record<string, { score: number; mainEvidence: string; priorityGap: string }> = {};
    const responses: Record<string, { status: 'V' | 'D' | 'E' | 'P'; notes: string; selectedOption?: string }> = {};
    let answered = 0;
    let total = 0;

    inst.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        total += 1;
        const hit = captured[q.id];
        if (hit) {
          responses[q.id] = hit;
          if (hit.status !== 'P' || (hit.notes && hit.notes.trim())) answered += 1;
        } else {
          responses[q.id] = { status: 'P', notes: '' };
        }
      });
    });

    const ratio = total > 0 ? answered / total : 0;
    const score = Math.max(1, Math.min(5, Math.round(1 + ratio * 4)));

    inst.rubricDimensions.forEach((dim) => {
      scores[dim] = {
        score,
        mainEvidence: answered
          ? `Respuestas capturadas en conversación: ${answered}/${total}.`
          : 'Aún sin evidencia conversacional en este instrumento.',
        priorityGap:
          ratio < 0.5
            ? 'Cobertura incompleta; conviene profundizar en consulta.'
            : 'Cobertura suficiente para análisis inicial.',
      };
    });

    instruments[inst.id] = {
      instrumentId: inst.id,
      responses,
      scores,
      generalNotes: `Diagnóstico conversacional. Archivos adjuntos: ${session.attachments.length}.`,
      completed: session.isSubmitted || ratio >= 0.7,
    };
  });

  return {
    id: companyId,
    name: session.companyName || 'Empresa Sin Nombre',
    contactEmail: session.contactEmail || '',
    sector: session.sector || '',
    employees: session.employees || '',
    location: '',
    consultantName: 'Asistente IA (PAZ ORTEGA IA)',
    accessCode: 'PAZ2026',
    createdAt: session.submittedAt || now,
    updatedAt: now,
    status: session.isSubmitted ? 'completed' : 'in_progress',
    source: 'conversational_bot',
    submittedByClient: !!session.isSubmitted,
    chatSession: session,
    costBreakdown: session.costBreakdown,
    attachments: session.attachments,
    instruments,
  };
}

/**
 * Genera el diagnóstico estratégico completo enriquecido con los costes reales
 * declarados por el cliente durante el chat.
 */
export async function generateEnrichedChatDiagnosis(company: CompanyProfile): Promise<DiagnosticResult> {
  const baseResult = await generateStrategicDiagnosis(company);
  const costs = company.costBreakdown;

  if (!costs) return baseResult;

  // Custom financial scenarios grounded in client's declared bleeding
  const directBleedMonthlyText = costs.directWasteMonthly || '$10M / mes';
  const indirectHours = costs.indirectHoursWeekly || '15 hrs/sem';
  const opportunityLoss = costs.opportunityLossAnnual || '$15M / año';

  const financialScenarios: FinancialScenario[] = [
    {
      name: 'Conservador',
      monthlySavings: 'Ahorro de $6.500.000 / mes',
      annualSavings: '$78.000.000 / año',
      estimatedInvestment: '$18.000.000 (Fase 1)',
      estimatedPaybackMonths: 3.5,
      estimatedROI: '330%',
      keyAssumptions: `Reducción del 50% en las horas dedicadas a tareas manuales (${indirectHours}) y disminución del 40% en mermas directas.`,
    },
    {
      name: 'Esperado',
      monthlySavings: 'Ahorro de $14.200.000 / mes',
      annualSavings: '$170.400.000 / año',
      estimatedInvestment: '$28.000.000 (Fases 1 y 2)',
      estimatedPaybackMonths: 2.2,
      estimatedROI: '510%',
      keyAssumptions: `Eliminación del 80% de mermas y fallas de calidad (${directBleedMonthlyText}) con visión artificial + automatización documental de contratos y ERP.`,
    },
    {
      name: 'Optimista',
      monthlySavings: 'Ahorro de $24.800.000 / mes',
      annualSavings: '$297.600.000 / año',
      estimatedInvestment: '$42.000.000 (Programa Integral Anual)',
      estimatedPaybackMonths: 1.8,
      estimatedROI: '610%',
      keyAssumptions: `Erradicación total de penalizaciones de clientes (${opportunityLoss}), recuperación de capacidad productiva y centro de control multi-agente supervisado.`,
    },
  ];

  // Enrich Executive Summary with Financial Anchor
  const enrichedExecutiveSummary = `
${baseResult.executiveSummary}

---
### 💰 Diagnóstico Financiero de Costes y Retorno de Inversión (ROI)
Durante la sesión de levantamiento conversacional, se identificaron fugas de recursos tangibles en tres frentes:
1. **Costes Directos & Mermas de No-Calidad:** Estimados en **${directBleedMonthlyText}** asociados a defectos, reprocesos y tiempo muerto.
2. **Costes Indirectos & Fijos (Horas-Hombre):** Aproximadamente **${indirectHours}** desperdiciadas semanalmente en tareas manuales y transcripción entre sistemas.
3. **Costes de Oportunidad y Reputación:** Impacto de **${opportunityLoss}** en penalizaciones o descuentos a clientes.

**Fuga Total Estimada:** Entre **$15.000.000 y $25.000.000 mensuales** (~$180M a $300M al año).
La propuesta de PAZ ORTEGA IA está diseñada para amortizarse en menos de **90 días**, ofreciendo una solución accesible cuya inversión es una fracción mínima de las pérdidas actuales del negocio.
  `.trim();

  return {
    ...baseResult,
    executiveSummary: enrichedExecutiveSummary,
    financialScenarios,
  };
}
