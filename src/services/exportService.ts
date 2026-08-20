import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { CompanyProfile, DiagnosticResult } from '../types';

export async function exportDiagnosisToDocx(company: CompanyProfile, result: DiagnosticResult): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: 'PAZ ORTEGA IA — ESTRATEGIA, GOBERNANZA & TECNOLOGÍA',
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'INFORME EJECUTIVO DE DIAGNÓSTICO Y HOJA DE RUTA EN IA',
                bold: true,
                size: 32, // 16pt
                color: '05352E',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
          }),

          // Metadata Table
          createMetadataTable(company, result),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Executive Summary
          new Paragraph({
            text: '1. Resumen Ejecutivo y Dictamen Estratégico',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: result.executiveSummary.replace(/\*\*/g, ''),
            spacing: { after: 200 },
          }),

          // Maturity Scores
          new Paragraph({
            text: '2. Evaluación de Madurez por Ejes de Operación',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          createMaturityTable(result),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Critical Bottlenecks
          new Paragraph({
            text: '3. Cuellos de Botella Críticos Identificados en Planta',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          ...result.criticalBottlenecks.map(
            (b) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `• [${b.area}]: `, bold: true, color: 'C8392B' }),
                  new TextRun({ text: `${b.description} ` }),
                  new TextRun({ text: `Impacto: ${b.consequence} `, italics: true }),
                  new TextRun({ text: `Solución IA recomendada: ${b.aiRemedy}`, bold: true, color: '0F6E56' }),
                ],
                spacing: { after: 100 },
              })
          ),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Matrix of Opportunities
          new Paragraph({
            text: '4. Matriz de Oportunidades y Priorización',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          createOpportunitiesTable(result),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Financial Scenarios & ROI
          new Paragraph({
            text: '5. Casos de Negocio y Retorno de Inversión (ROI)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          createFinancialTable(result),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Roadmap Land-and-Expand
          new Paragraph({
            text: '6. Hoja de Ruta de Implementación (Metodología Land-and-Expand)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          ...result.roadmap.flatMap((phase) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${phase.title} (${phase.timeframe})`,
                  bold: true,
                  size: 24,
                  color: '05352E',
                }),
              ],
              spacing: { before: 140, after: 80 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Objetivo: ', bold: true }),
                new TextRun({ text: phase.objective }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Entregables: ', bold: true }),
                new TextRun({ text: phase.deliverables.join(' • ') }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'KPI Clave de Éxito: ', bold: true, color: '0F6E56' }),
                new TextRun({ text: phase.keyKPI, italics: true }),
              ],
              spacing: { after: 140 },
            }),
          ]),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Governance Notes
          new Paragraph({
            text: '7. Estándares de Gobernanza y Supervisión Humana (ISO/IEC 42001)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Requerimientos Human-in-the-loop: ', bold: true }),
              new TextRun({ text: result.governanceAndComplianceNotes.humanInTheLoopRequirements.join(' • ') }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Brechas de Cumplimiento ISO 42001 / Datos: ', bold: true }),
              new TextRun({ text: result.governanceAndComplianceNotes.iso42001Gaps.join(' • ') }),
            ],
            spacing: { after: 200 },
          }),

          // Recommended Next Steps
          new Paragraph({
            children: [
              new TextRun({
                text: `Propuesta de Siguiente Paso: ${result.recommendedServicePackage.nextStepRecommendation}`,
                bold: true,
                color: '05352E',
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = company.name.replace(/[^a-zA-Z0-9]/g, '_');
  saveAs(blob, `Diagnostico_IA_${cleanName}_PazOrtega.docx`);
}

function createMetadataTable(company: CompanyProfile, result: DiagnosticResult): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Empresa Evaluada:', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ text: company.name })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sector Económico:', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ text: company.sector || 'General' })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'N° Empleados:', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ text: company.employees })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fecha de Emisión:', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ text: result.generatedAt })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Consultor Responsable:', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ text: company.consultantName || 'Equipo PAZ ORTEGA IA' })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nivel de Riesgo Global:', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${result.overallRiskLevel} (Madurez: ${result.globalMaturityScore}%)`, bold: true, color: '0F6E56' })] })] }),
        ],
      }),
    ],
  });
}

function createMaturityTable(result: DiagnosticResult): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Eje de Diagnóstico', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Puntaje', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nivel', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dictamen / Brecha Principal', bold: true })] })] }),
        ],
      }),
      ...result.dimensionScores.map(
        (d) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: d.dimension })] }),
              new TableCell({ children: [new Paragraph({ text: `${d.score}%` })] }),
              new TableCell({ children: [new Paragraph({ text: d.level })] }),
              new TableCell({ children: [new Paragraph({ text: d.finding })] }),
            ],
          })
      ),
    ],
  });
}

function createOpportunitiesTable(result: DiagnosticResult): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Proceso / Problema', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Solución IA Propuesta', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Impacto / Prioridad', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Beneficio Estimado', bold: true })] })] }),
        ],
      }),
      ...result.opportunitiesMatrix.map(
        (o) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: `${o.process}: ${o.problem}` })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: o.proposedAI, bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ text: `${o.impact} | ${o.priority}` })] }),
              new TableCell({ children: [new Paragraph({ text: o.estimatedBenefit })] }),
            ],
          })
      ),
    ],
  });
}

function createFinancialTable(result: DiagnosticResult): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Escenario', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ahorro Mensual', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Inversión Est.', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Retorno (Payback)', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ROI Anual Est.', bold: true })] })] }),
        ],
      }),
      ...result.financialScenarios.map(
        (s) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s.name, bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ text: s.monthlySavings })] }),
              new TableCell({ children: [new Paragraph({ text: s.estimatedInvestment })] }),
              new TableCell({ children: [new Paragraph({ text: `${s.estimatedPaybackMonths} meses` })] }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: s.estimatedROI, bold: true, color: '0F6E56' })],
                  }),
                ],
              }),
            ],
          })
      ),
    ],
  });
}
