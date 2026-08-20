import { CompanyProfile, EvidenceStatus, InstrumentResponse } from '../types';
import { INSTRUMENTS_DATA } from '../data/instrumentsData';

export function generateFullSimulationData(company: CompanyProfile): CompanyProfile {
  const simulatedInstruments: Record<string, InstrumentResponse> = {};

  // Sample realistic field notes by instrument & question category
  const sampleNotes: Record<string, string> = {
    'G01': 'Meta central: triplicar exportación a canal retail en 18 meses manteniendo margen operativo.',
    'G06': '70% pedidos canal mayorista y 30% Horeca. Reclamos de despacho por error en SKU.',
    'G11': 'Usan Siigo contable pero producción y logística operan en 8 hojas de Excel no integradas.',
    'G16': 'Costeo por lote se recalcula a fin de mes; no conocen merma exacta en tiempo real.',
    'G21': 'Varios diseñadores y administrativos usan ChatGPT personal con recetas y cotizaciones.',
    'RH01': 'Organigrama familiar; alta dependencia de Don Carlos (jefe de horneado y formulación).',
    'RH06': 'No hay manuales digitales; operario nuevo aprende mirando al veterano durante 3 semanas.',
    'RH11': 'Turnos rotativos se gestionan en cartilla física y Excel con frecuentes errores de liquidación.',
    'RH16': 'Hay 6 cámaras de seguridad en nave; los operarios no han firmado política de privacidad.',
    'P01': 'Abastecimiento de cacao y frutos secos sufre por quiebres de stock no alertados a tiempo.',
    'P06': 'Orden de producción se imprime y se llena a mano con lapicero; datos se pierden.',
    'P11': 'Estación de empaque y sellado es el principal cuello de botella de la planta.',
    'P16': 'Puntos de control HACCP se registran en planillas de papel al final del turno.',
    'P21': 'Merma estimada en 4.5% por roturas de empaque y desbalance de peso en dosificado.',
    'CV01': 'Sellado térmico falla 3 a 5 veces por hora; operario revisa al azar 1 bolsa de cada 20.',
    'CV06': 'Conteo de cajas al final de línea es manual; discrepancias frecuentes con remisiones.',
    'CV11': 'Iluminación cenital disponible en banda transportadora; apto para cámara industrial.',
    'CV16': 'Desean que el sistema active luz roja / buzzer sonoro y operario retire la unidad defectuosa.',
    'CV21': 'Tienen muestras de empaque arrugado, mal sellado y etiqueta torcida para entrenar modelo.',
    'GO01': 'Gerente General y Director de Calidad liderarán el comité de IA.',
    'GO05': 'No existe inventario de IA; identificaron 4 herramientas usadas sin control corporativo.',
    'GO09': 'Datos de clientes en facturas y base de datos de proveedores no cuentan con DPIA.',
    'GO13': 'Falso positivo detendría empaque; falso negativo enviaría producto defectuoso al cliente.',
    'GO14': 'Criterio Human-in-the-loop: el operario de turno valida la alerta antes de descartar lote.',
    'R01': 'Estación crítica: Sellado y rotulado de bolsas doypack de 250g y 500g.',
    'R04': 'Costo de lote devuelto por gran superficie: ~$850 USD por penalización logística.',
    'R06': 'Objetivo: Reducir devoluciones en un 80% y ahorrar 45 horas/mes en digitación.',
    'R11': 'Presupuesto inicial estimado: $4,500 - $6,000 USD para cámara, edge device y piloto 90d.',
    'R16': 'Escenario conservador: recuperación de inversión en 3.5 meses con solo ahorro en mermas.',
  };

  INSTRUMENTS_DATA.forEach((inst, instIdx) => {
    const responses: Record<string, { status: EvidenceStatus; selectedOption?: string; notes: string }> = {};
    const scores: Record<string, { score: number; mainEvidence: string; priorityGap: string }> = {};

    // Fill all questions
    inst.sections.forEach((sec) => {
      sec.questions.forEach((q, qIdx) => {
        // Pick smart status
        const statuses: EvidenceStatus[] = ['V', 'D', 'E', 'V', 'D'];
        const status = statuses[(instIdx + qIdx) % statuses.length];

        // Pick matching option
        const options = q.options || ['Opción A', 'Opción B', 'Opción C'];
        const selectedOption = options[qIdx % options.length];

        // Pick matching note or auto-generate
        const note = sampleNotes[q.id] || `Declarado por encargado en visita: "${selectedOption}". Evidencia en planta evaluada bajo estándar ${status}.`;

        responses[q.id] = {
          status,
          selectedOption,
          notes: note,
        };
      });
    });

    // Fill rubric dimensions (scores between 1 and 4)
    const baseScores = [2, 3, 2, 1, 3, 2];
    inst.rubricDimensions.forEach((dim, dIdx) => {
      const score = Math.max(1, Math.min(4, (baseScores[instIdx] || 2) + ((dIdx % 2 === 0) ? 1 : -1)));
      scores[dim] = {
        score,
        mainEvidence: `Registrado en formulario ${inst.id} con evidencias V/D.`,
        priorityGap: `Mejora requerida en estandarización y gobernanza de ${dim}.`,
      };
    });

    simulatedInstruments[inst.id] = {
      instrumentId: inst.id,
      responses,
      scores,
      completed: true,
    };
  });

  return {
    ...company,
    status: 'completed',
    instruments: simulatedInstruments,
  };
}
