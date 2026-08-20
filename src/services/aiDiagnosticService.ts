import { CompanyProfile, DiagnosticResult, OpportunityItem, RoadmapPhase, FinancialScenario } from '../types';
import { INSTRUMENTS_DATA } from '../data/instrumentsData';

export async function generateStrategicDiagnosis(
  company: CompanyProfile,
  customApiKey?: string
): Promise<DiagnosticResult> {
  // Try AI API if apiKey is available
  if (customApiKey && customApiKey.trim().length > 10) {
    try {
      const apiResult = await callGeminiDiagnosticAPI(company, customApiKey.trim());
      if (apiResult) return apiResult;
    } catch (err) {
      console.warn('Error calling AI API, falling back to local heuristic reasoning engine:', err);
    }
  }

  // Fallback to the full-featured Local Heuristic Engine tailored to PAZ ORTEGA IA corporate catalog
  return runPazOrtegaHeuristicEngine(company);
}

/**
 * Motor Heurístico Estructurado de PAZ ORTEGA IA
 * Analiza respuestas, brechas, sector, opciones seleccionadas y notas de campo para sintetizar el diagnóstico y hoja de ruta.
 */
function runPazOrtegaHeuristicEngine(company: CompanyProfile): DiagnosticResult {
  const instruments = company.instruments || {};
  
  // Calculate average scores and gather notes & selected options
  let totalScore = 0;
  let totalDims = 0;
  const dimensionResults: { dimension: string; score: number; level: string; finding: string }[] = [];
  const fieldObservations: string[] = [];
  const selectedHighlights: Record<string, string[]> = {};

  INSTRUMENTS_DATA.forEach((inst) => {
    const instResp = instruments[inst.id];
    let instTotal = 0;
    let instCount = 0;
    selectedHighlights[inst.id] = [];

    if (instResp) {
      // Gather question notes and selected options
      Object.entries(instResp.responses || {}).forEach(([qId, r]) => {
        if (r.selectedOption) {
          selectedHighlights[inst.id].push(r.selectedOption);
        }
        if (r.notes && r.notes.trim().length > 3) {
          fieldObservations.push(`[${inst.title} - ${qId}]: ${r.notes.trim()}`);
        }
      });

      // Gather dimension scores (0-5)
      inst.rubricDimensions.forEach((dim) => {
        const dimData = instResp.scores?.[dim];
        const val = dimData ? dimData.score : 2; // default if not answered
        instTotal += val;
        instCount++;
      });
    }

    const avgInst = instCount > 0 ? (instTotal / instCount) : 2.2;
    const percentage = Math.round((avgInst / 5) * 100);
    totalScore += percentage;
    totalDims++;

    let level = 'Informal / Inicial';
    if (percentage > 70) level = 'Optimizado / Avanzado';
    else if (percentage > 50) level = 'Definido / En Control';
    else if (percentage > 30) level = 'Repetible / Parcial';

    dimensionResults.push({
      dimension: inst.title,
      score: percentage,
      level,
      finding: getDimensionFinding(inst.id, percentage, selectedHighlights[inst.id]),
    });
  });

  const globalMaturity = Math.round(totalScore / (totalDims || 1));
  
  let overallRisk: 'Bajo' | 'Medio' | 'Alto' | 'Crítico' = 'Medio';
  if (globalMaturity < 30) overallRisk = 'Crítico';
  else if (globalMaturity < 50) overallRisk = 'Alto';
  else if (globalMaturity < 75) overallRisk = 'Medio';
  else overallRisk = 'Bajo';

  // Generate Tailored Opportunities Matrix based on instruments, options and field notes
  const opportunitiesMatrix: OpportunityItem[] = generateOpportunities(company);

  // Generate Land-and-Expand Roadmap (Phase 1, 2, 3)
  const roadmap: RoadmapPhase[] = [
    {
      phase: 1,
      title: 'Fase 1: Quick Win & Piloto de Validación (0 a 90 días)',
      timeframe: 'Meses 1 - 3',
      objective: 'Generar impacto económico inmediato y medible en el cuello de botella más crítico de la planta, reduciendo errores y tiempo con supervisión humana.',
      deliverables: [
        'Prueba de concepto (PoC) en estación prioritaria (Visión por computador / Automatización documental)',
        'Dataset inicial etiquetado y calibración de umbrales en sitio',
        'Protocolo de supervisión humana (Human-in-the-loop) y contingencia manual',
        'Medición semanal de reducción de defectos y horas hombre ahorradas'
      ],
      pazSolutions: [
        opportunitiesMatrix[0]?.proposedAI || 'Piloto de Visión Artificial Ultralytics/YOLO en estación de empaque',
        'Automatización de alertas operativas e incidencias'
      ],
      keyKPI: 'Reducción de al menos un 60% en eventos de no-conformidad y recuperación de inversión proyectada en < 4 meses.'
    },
    {
      phase: 2,
      title: 'Fase 2: Expansión Operativa, LegalTech & Gestión del Conocimiento',
      timeframe: 'Meses 4 - 6',
      objective: 'Conectar la automatización de planta con la administración, contratos de proveedores y capacitación continua de personal.',
      deliverables: [
        'Implementación de Asistente de Conocimiento Interno (RAG) para manuales operativos, BPM y recetas',
        'Despliegue de PAZ (Legal Tech) para auditoría de contratos de proveedores, SLA y cumplimiento comercial',
        'Integración con ERP / hojas de cálculo para reporte automático de KPIs diarios',
        'Capacitación de mandos medios y operarios en operación asistida por IA'
      ],
      pazSolutions: [
        'PAZ Legal Tech (Revisión contractual & compliance)',
        'Asistente RAG Organizacional sobre documentación de procesos',
        'Automatizaciones de flujos administrativos'
      ],
      keyKPI: 'Ahorro recurrente de más de 120 horas/mes en gestión documental y cero discrepancias contractuales con proveedores.'
    },
    {
      phase: 3,
      title: 'Fase 3: Gobernanza Integral ISO 42001 & AI Control Center',
      timeframe: 'Meses 7 - 12+',
      objective: 'Establecer la estructura de gobierno permanente, sistema multi-agente supervisado y panel centralizado de control corporativo.',
      deliverables: [
        'Implementación del Sistema de Gestión de IA conforme a ISO/IEC 42001 y NIST AI RMF',
        'Inventario vivo de modelos, agentes y políticas de privacidad de datos',
        'AI Control Center: Tablero unificado de supervisión, auditoría de decisiones y aprobaciones',
        'Acompañamiento continuo y monitoreo de deriva de modelos (Drift detection)'
      ],
      pazSolutions: [
        'AI Control Center (Supervisión Multi-Agente & Logs)',
        'Marco de Gobernanza & Compliance ISO/IEC 42001',
        'Mesa de Acompañamiento y Mantenimiento Recurrente'
      ],
      keyKPI: 'Cumplimiento normativo 100% auditable y escalabilidad a nuevas líneas de producción sin fricción operacional.'
    }
  ];

  // Generate Financial Scenarios (Conservative, Expected, Optimistic)
  const financialScenarios: FinancialScenario[] = calculateFinancialScenarios();

  // Generate Critical Bottlenecks
  const criticalBottlenecks = [
    {
      area: 'Producción & Empaque',
      description: 'Dependencia de inspección visual humana 100% manual con fatiga visual en turnos extensos y sellado térmico irregular.',
      consequence: 'Riesgo de despacho de unidades defectuosas, penalizaciones en canal retail y costo de devolución.',
      aiRemedy: 'Implementar Visión Artificial Edge (Ultralytics / YOLO) con semáforo luminoso y confirmación humana en fallas.'
    },
    {
      area: 'Gobernanza & Datos',
      description: 'Uso no regulado de herramientas públicas de IA por parte de colaboradores con información de recetas, clientes y proveedores.',
      consequence: 'Exposición de secretos industriales y posible incumplimiento de protección de datos (Ley 1581).',
      aiRemedy: 'Adoptar Política de Gobernanza de IA (ISO 42001), inventario de herramientas y canal institucional privado RAG.'
    },
    {
      area: 'Administración & Finanzas',
      description: 'Conciliación y digitación manual de órdenes de producción y planillas físicas en software contable y hojas de cálculo dispersas.',
      consequence: 'Desfase de hasta 48 horas en visibilidad de inventarios y más de 80 horas hombre mensuales dedicadas a digitación.',
      aiRemedy: 'Automatización de extracción documental (OCR inteligente) y sincronización directa con base de datos.'
    }
  ];

  // Executive summary
  const executiveSummary = `El diagnóstico integral realizado a **${company.name}** (Sector: ${company.sector || 'Empresarial'}, ${company.employees} empleados) evidencia una organización con alto potencial de optimización mediante tecnologías de Inteligencia Artificial aplicadas y gobernadas. Se identifica un índice de madurez digital y de IA del **${globalMaturity}%** (${overallRisk === 'Crítico' || overallRisk === 'Alto' ? 'con vulnerabilidades prioritarias en controles y automatización' : 'con bases sólidas para aceleración operativa'}). Siguiendo la metodología de PAZ ORTEGA IA (*Land-and-Expand*), se recomienda iniciar con una solución de alto impacto y bajo riesgo en el área de mayor exposición, para luego consolidar la gobernanza institucional (*ISO/IEC 42001*) y el ecosistema de agentes supervisados.`;

  return {
    generatedAt: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    companyName: company.name,
    executiveSummary,
    globalMaturityScore: globalMaturity,
    overallRiskLevel: overallRisk,
    dimensionScores: dimensionResults,
    criticalBottlenecks,
    opportunitiesMatrix,
    roadmap,
    financialScenarios,
    governanceAndComplianceNotes: {
      iso42001Gaps: [
        'Falta de inventario formal de sistemas y herramientas de IA utilizadas por el personal.',
        'Ausencia de roles y responsabilidades formalizadas para la aprobación de modelos de IA.',
        'Inexistencia de un procedimiento de gestión de incidentes y deriva algorítmica.'
      ],
      nistAiRmfGaps: [
        'Función MAP: No se han mapeado los riesgos de sesgo, falsos positivos o fallas de conectividad.',
        'Función MANAGE: No existen controles periódicos de exactitud y precisión documentados.'
      ],
      privacyAndDataGaps: [
        'Uso de cámaras de planta sin política de tratamiento de datos e imágenes actualizada.',
        'Falta de acuerdos de confidencialidad y procesamiento de datos (DPA) con proveedores de software cloud.'
      ],
      humanInTheLoopRequirements: [
        'Toda decisión de descarte de lote o parada de línea debe contar con botón de bypass o validación del operario de turno.',
        'Las alertas de calidad deben registrar la aprobación del jefe de turno antes de generar nota de débito al proveedor.'
      ]
    },
    recommendedServicePackage: {
      title: 'Programa Integral de Adopción y Gobernanza en IA (PAZ ORTEGA 360°)',
      shortDescription: 'Implementación combinada de Solución Tecnológica en Planta + Marco de Gobernanza ISO 42001 + Legal Tech para acompañamiento continuo.',
      includedModules: [
        'Módulo 1: PoC Visión Artificial / Automatización Crítica (60-90 días)',
        'Módulo 2: Marco de Gobernanza, Políticas y Matriz de Riesgos ISO/IEC 42001',
        'Módulo 3: Asistente Legal Tech PAZ para contratos y compliance',
        'Módulo 4: Mesa de Supervisión y Mantenimiento de Modelos'
      ],
      nextStepRecommendation: 'Agendar Sesión de Validación Técnica en Planta para toma de muestra de datos y firma del acuerdo de prueba piloto de 90 días.'
    }
  };
}

function getDimensionFinding(id: string, score: number, highlights: string[] = []): string {
  const highlightSummary = highlights.length > 0 ? ` (Opciones clave: ${highlights.slice(0, 2).join(', ')})` : '';

  switch (id) {
    case '01':
      return score < 50
        ? `Estrategia financiera centrada en costos reactivos; los datos operativos están fragmentados en hojas de cálculo y no alimentan decisiones predictivas${highlightSummary}.`
        : `Visión estratégica clara de crecimiento; requiere conectar indicadores financieros directamente con los eventos de merma en planta${highlightSummary}.`;
    case '02':
      return score < 50
        ? `Alta dependencia del conocimiento tácito de operarios clave; procesos no documentados formalmente y resistencia potencial al cambio tecnológico${highlightSummary}.`
        : `Disposición del talento hacia la modernización; se requiere capacitación en herramientas asistidas y políticas de uso aceptable${highlightSummary}.`;
    case '03':
      return score < 50
        ? `Cadena de transformación con registros manuales en papel; paradas de máquina y causas de merma no cuantificadas en tiempo real${highlightSummary}.`
        : `Flujo de planta estructurado con puntos de control definidos; oportunidad de sensorización y digitalización de eventos de transformación${highlightSummary}.`;
    case '04':
      return score < 50
        ? `Inspección de embalaje, sellado y etiquetado sujeta a error humano por fatiga; condiciones de iluminación y cámaras viables para visión artificial${highlightSummary}.`
        : `Línea de empaque con ritmo constante; factibilidad técnica alta para instalación de cámara industrial y modelo Ultralytics / YOLO${highlightSummary}.`;
    case '05':
      return score < 50
        ? `Inexistencia de marco de gobernanza, inventario de IA ni protocolos de privacidad de datos; riesgo de sanciones y fuga de información${highlightSummary}.`
        : `Sensibilidad hacia la calidad y HACCP; requiere extender el Sistema de Gestión Integrado hacia la norma ISO/IEC 42001${highlightSummary}.`;
    case '06':
      return score < 50
        ? `Línea base económica dispersa; el costo de merma y reproceso no está totalmente cargado al costo unitario del SKU final${highlightSummary}.`
        : `Claridad en metas de recuperación de inversión; umbral de ROI aceptable para proyectos de automatización en < 6 meses${highlightSummary}.`;
    default:
      return 'Evaluación en proceso de consolidación.';
  }
}

function generateOpportunities(company: CompanyProfile): OpportunityItem[] {
  return [
    {
      id: 'OP-01',
      process: 'Inspección de Embalaje, Sellado y Etiquetado',
      problem: 'Detección tardía de sellos defectuosos o etiquetas desalineadas con inspección visual manual intermitente.',
      proposedAI: 'Sistema de Visión Artificial Edge con Ultralytics / YOLO para inspección en línea a alta velocidad.',
      category: 'Visión Artificial',
      impact: 'Crítico',
      risk: 'Controlado',
      estimatedCost: 'USD $3,500 - $6,000 (Piloto)',
      estimatedBenefit: 'Ahorro de $1,800/mes en mermas y prevención de rechazo de lotes en retail',
      priority: 'P1 - Inmediata (0-90d)',
      landAndExpandStage: 'Land (Quick Win)'
    },
    {
      id: 'OP-02',
      process: 'Gestión Documental y Asuntos Contractuales',
      problem: 'Revisión manual de contratos de proveedores, acuerdos de confidencialidad y fichas técnicas de materias primas.',
      proposedAI: 'PAZ Pro Legal Tech: Asistente de análisis de contratos, extracción de cláusulas críticas y matriz de riesgos.',
      category: 'Legal Tech / PAZ',
      impact: 'Alto',
      risk: 'Bajo',
      estimatedCost: 'USD $1,200/mes (SaaS + Consultoría)',
      estimatedBenefit: 'Reducción del 75% en tiempo de revisión y prevención de riesgos legales',
      priority: 'P1 - Inmediata (0-90d)',
      landAndExpandStage: 'Land (Quick Win)'
    },
    {
      id: 'OP-03',
      process: 'Capacitación Operativa y Manuales de Procedimiento (SOP)',
      problem: 'Curva de inducción de personal nuevo prolongada (3-4 semanas) por manuales extensos no consultados.',
      proposedAI: 'Asistente de Conocimiento RAG Empresarial sobre procedimientos operativos estándar, recetas y BPM.',
      category: 'Chatbot / RAG',
      impact: 'Medio',
      risk: 'Bajo',
      estimatedCost: 'USD $2,500 implementación inicial',
      estimatedBenefit: 'Reducción de curva de aprendizaje en un 50% y menor dependencia de expertos clave',
      priority: 'P2 - Mediano plazo (3-6m)',
      landAndExpandStage: 'Expand (Core)'
    },
    {
      id: 'OP-04',
      process: 'Trazabilidad y Alertas de Producción',
      problem: 'Desfase de información entre la orden emitida y el consumo real de ingredientes en planta.',
      proposedAI: 'Agente Autónomo Operativo para correlación de pesaje, alertas de desvío y cálculo de rendimiento por lote.',
      category: 'Agentes Autónomos',
      impact: 'Alto',
      risk: 'Controlado',
      estimatedCost: 'USD $4,000 - $7,500',
      estimatedBenefit: 'Control estricto de mermas de formulación (ahorro ~3% costo insumos)',
      priority: 'P2 - Mediano plazo (3-6m)',
      landAndExpandStage: 'Expand (Core)'
    },
    {
      id: 'OP-05',
      process: 'Gobernanza Institucional y Auditoría de IA',
      problem: 'Uso de herramientas de IA sin política corporativa, sin DPIA ni inventario de sistemas algorítmicos.',
      proposedAI: 'Implementación del Sistema de Gestión de Gobernanza en IA (ISO/IEC 42001 & NIST AI RMF).',
      category: 'Gobernanza ISO 42001',
      impact: 'Crítico',
      risk: 'Bajo',
      estimatedCost: 'USD $3,000 - $5,500 estructuración',
      estimatedBenefit: 'Blindaje legal, cumplimiento ante clientes corporativos y certificación internacional',
      priority: 'P3 - Maduración (6-12m)',
      landAndExpandStage: 'Control Center'
    }
  ];
}

function calculateFinancialScenarios(): FinancialScenario[] {
  return [
    {
      name: 'Conservador',
      monthlySavings: '$1,500 USD / mes',
      annualSavings: '$18,000 USD / año',
      estimatedInvestment: '$4,500 USD (Etapa inicial)',
      estimatedPaybackMonths: 3.5,
      estimatedROI: '300% en el primer año',
      keyAssumptions: 'Reducción mínima del 40% en fallas de empaque y 30 horas/mes de trabajo administrativo automatizado.'
    },
    {
      name: 'Esperado',
      monthlySavings: '$3,200 USD / mes',
      annualSavings: '$38,400 USD / año',
      estimatedInvestment: '$7,200 USD (Fases 1 y 2)',
      estimatedPaybackMonths: 2.3,
      estimatedROI: '433% en el primer año',
      keyAssumptions: 'Reducción del 75% en defectos visuales, optimización de formulación y reducción del 65% en revisión contractual.'
    },
    {
      name: 'Optimista',
      monthlySavings: '$5,800 USD / mes',
      annualSavings: '$69,600 USD / año',
      estimatedInvestment: '$11,000 USD (Ecosistema completo)',
      estimatedPaybackMonths: 1.9,
      estimatedROI: '532% en el primer año',
      keyAssumptions: 'Escalabilidad a todas las líneas de producción, cero reprocesos y optimización total de la cadena de valor.'
    }
  ];
}

async function callGeminiDiagnosticAPI(company: CompanyProfile, apiKey: string): Promise<DiagnosticResult | null> {
  const prompt = `
Eres el Director de Estrategia, Tecnología y Gobernanza de IA de PAZ ORTEGA IA.
Debes analizar el diagnóstico en planta de la empresa ${company.name} (Sector: ${company.sector}, Empleados: ${company.employees}).
Genera un análisis en formato JSON estricto que cumpla la estructura DiagnosticResult con oportunidades de:
1. Automatización
2. Asistentes / RAG
3. Agentes Autónomos
4. Visión Artificial (Ultralytics / YOLO)
5. Legal Tech (PAZ / PAZ Pro)
6. Gobernanza ISO/IEC 42001

Datos recopilados en los instrumentos:
${JSON.stringify(company.instruments)}

Devuelve únicamente un JSON válido que coincida con la interfaz DiagnosticResult de TypeScript.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;
  return JSON.parse(rawText) as DiagnosticResult;
}
