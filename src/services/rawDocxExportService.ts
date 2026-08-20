import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { CompanyProfile } from '../types';
import { INSTRUMENTS_DATA } from '../data/instrumentsData';

/**
 * Exporta TODO el cuestionario y las respuestas en bruto a un documento Word (.docx)
 * con el detalle de las 149 preguntas, estados de evidencia, opciones y observaciones.
 */
export async function exportRawQuestionnaireToDocx(company: CompanyProfile): Promise<void> {
  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ID', bold: true })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Pregunta / Criterio', bold: true })] })], width: { size: 40, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Evid.', bold: true })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Opción / Observaciones en Planta', bold: true })] })], width: { size: 40, type: WidthType.PERCENTAGE } }),
      ],
    }),
  ];

  INSTRUMENTS_DATA.forEach((inst) => {
    const instResp = company.instruments?.[inst.id];

    // Section title row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `INSTRUMENTO ${inst.id} — ${inst.title.toUpperCase()} (Responsable: ${inst.role})`,
                    bold: true,
                    color: '05352E',
                  }),
                ],
              }),
            ],
            columnSpan: 4,
          }),
        ],
      })
    );

    inst.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const resp = instResp?.responses?.[q.id];
        const status = resp?.status || 'P';
        const option = resp?.selectedOption ? `[Opción: ${resp.selectedOption}]\n` : '';
        const notes = resp?.notes || 'Sin notas registradas';

        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: q.id })] }),
              new TableCell({ children: [new Paragraph({ text: q.text })] }),
              new TableCell({ children: [new Paragraph({ text: status })] }),
              new TableCell({ children: [new Paragraph({ text: `${option}${notes}` })] }),
            ],
          })
        );
      });
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'PAZ ORTEGA IA — CAPTURA EN BRUTO DE INSTRUMENTOS',
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `CUESTIONARIO Y DECLARACIONES EN PLANTA: ${company.name.toUpperCase()}`,
                bold: true,
                size: 28,
                color: '05352E',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Sector: ${company.sector || 'General'} | Empleados: ${company.employees} | Consultor: ${company.consultantName || 'Asignado'} | Fecha: ${new Date().toLocaleDateString('es-CO')}`,
            spacing: { after: 300 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = company.name.replace(/[^a-zA-Z0-9]/g, '_');
  saveAs(blob, `Cuestionario_Bruto_${cleanName}_PazOrtega.docx`);
}
