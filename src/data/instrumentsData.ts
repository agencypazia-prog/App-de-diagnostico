import { InstrumentDefinition } from '../types';

export const INSTRUMENTS_DATA: InstrumentDefinition[] = [
  {
    "filename": "01 · Instrumento — Gerencia, administración y finanzas.docx",
    "title": "Gerencia, administración y finanzas",
    "subtitle": "Modelo de negocio, cadena de valor, sistemas, costos y prioridades estratégicas",
    "role": "Analista de gerencia y finanzas",
    "function": "Comprender dónde se crea valor, qué limita el crecimiento y qué resultados económicos debe producir cualquier inversión en IA.",
    "sections": [
      {
        "title": "A. Dirección y estrategia",
        "questions": [
          {
            "id": "G01",
            "text": "¿Cuáles son los objetivos empresariales de los próximos 12–24 meses?",
            "options": [
              "Crecimiento en ventas y expansión",
              "Reducción de costos y mermas",
              "Eficiencia operativa y digitalización",
              "Cumplimiento normativo y calidad"
            ]
          },
          {
            "id": "G02",
            "text": "¿Qué líneas, clientes, canales o presentaciones son estratégicas?",
            "options": [
              "B2B Grandes superficies / Cadenas",
              "Distribuidores y canal tradicional",
              "Canal institucional / Horeca",
              "Venta directa / E-commerce"
            ]
          },
          {
            "id": "G03",
            "text": "¿Cuáles son hoy los tres principales problemas de crecimiento, margen o servicio?",
            "options": [
              "Costeo estándar automatizado",
              "Costeo estimado por lote en Excel",
              "Costeo global sin desglose por SKU",
              "Desconocido con precisión"
            ]
          },
          {
            "id": "G04",
            "text": "¿Qué decisiones dependen de gerencia por falta de información o delegación?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G05",
            "text": "¿Cómo se aprueban actualmente inversiones en tecnología y qué periodo de recuperación esperan?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          }
        ]
      },
      {
        "title": "B. Modelo de negocio y cadena de valor",
        "questions": [
          {
            "id": "G06",
            "text": "¿Quiénes son los clientes principales y cómo llegan los pedidos?",
            "options": [
              "B2B Grandes superficies / Cadenas",
              "Distribuidores y canal tradicional",
              "Canal institucional / Horeca",
              "Venta directa / E-commerce"
            ]
          },
          {
            "id": "G07",
            "text": "¿Cómo se planea demanda, compra, producción y despacho?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          },
          {
            "id": "G08",
            "text": "¿Dónde se producen retrasos, pérdidas, reprocesos o conflictos entre áreas?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          },
          {
            "id": "G09",
            "text": "¿Qué actividades diferencian a Casta Gourmet frente a competidores?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G10",
            "text": "¿Qué proceso sería más crítico si se interrumpiera un día?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          }
        ]
      },
      {
        "title": "C. Administración y sistemas",
        "questions": [
          {
            "id": "G11",
            "text": "¿Qué ERP, software contable, hojas de cálculo, comercio electrónico o sistemas utilizan?",
            "options": [
              "ERP integral (SAP/Odoo/Oracle)",
              "Software contable local (Siigo/WorldOffice)",
              "Hojas de cálculo Excel dispersas",
              "Registros manuales en papel"
            ]
          },
          {
            "id": "G12",
            "text": "¿Qué información se digita más de una vez o se transfiere manualmente?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          },
          {
            "id": "G13",
            "text": "¿Cómo se gestionan compras, proveedores, inventarios, pedidos, cartera y devoluciones?",
            "options": [
              "B2B Grandes superficies / Cadenas",
              "Distribuidores y canal tradicional",
              "Canal institucional / Horeca",
              "Venta directa / E-commerce"
            ]
          },
          {
            "id": "G14",
            "text": "¿Qué reportes llegan tarde, requieren consolidación manual o generan dudas?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          },
          {
            "id": "G15",
            "text": "¿Qué datos existen por SKU, cliente, canal, lote, proveedor y periodo?",
            "options": [
              "B2B Grandes superficies / Cadenas",
              "Distribuidores y canal tradicional",
              "Canal institucional / Horeca",
              "Venta directa / E-commerce"
            ]
          }
        ]
      },
      {
        "title": "D. Costos y línea base financiera",
        "questions": [
          {
            "id": "G16",
            "text": "¿Cómo calculan costo unitario y rentabilidad por producto o presentación?",
            "options": [
              "Costeo estándar automatizado",
              "Costeo estimado por lote en Excel",
              "Costeo global sin desglose por SKU",
              "Desconocido con precisión"
            ]
          },
          {
            "id": "G17",
            "text": "¿Qué costos generan merma, devolución, reproceso, parada o pedido incorrecto?",
            "options": [
              "B2B Grandes superficies / Cadenas",
              "Distribuidores y canal tradicional",
              "Canal institucional / Horeca",
              "Venta directa / E-commerce"
            ]
          },
          {
            "id": "G18",
            "text": "¿Cuánto tiempo administrativo se dedica a conciliaciones, reportes y búsquedas?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G19",
            "text": "¿Qué cifras históricas podrían compartirse por mes o trimestre?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          },
          {
            "id": "G20",
            "text": "¿Qué beneficios considerarían suficientes para autorizar un piloto?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          }
        ]
      },
      {
        "title": "E. Uso actual de IA y expectativas",
        "questions": [
          {
            "id": "G21",
            "text": "¿Qué herramientas de IA, automatización o analítica usa formal o informalmente la organización?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G22",
            "text": "¿Quién las autorizó y qué información empresarial reciben?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G23",
            "text": "¿Qué resultado esperan específicamente de visión artificial en embalaje o logística?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G24",
            "text": "¿Qué restricciones de presupuesto, integración, operación o confidencialidad existen?",
            "options": [
              "Uso informal libre (ChatGPT personal)",
              "Herramientas SaaS con IA integrada",
              "Pilotos aislados sin producción",
              "Sin uso actual ni exploración"
            ]
          },
          {
            "id": "G25",
            "text": "¿Qué área y responsable podrían patrocinar un piloto de 60–90 días?",
            "options": [
              "Implementado y documentado",
              "Parcialmente implementado",
              "Informal / En desarrollo",
              "Inexistente en la actualidad"
            ]
          }
        ]
      }
    ],
    "rubricDimensions": [
      "Estrategia y liderazgo",
      "Gestión por indicadores",
      "Integración administrativa",
      "Calidad de información financiera",
      "Preparación para invertir en IA"
    ],
    "id": "01"
  },
  {
    "filename": "02 · Instrumento — Recursos humanos y gestión del cambio.docx",
    "title": "Recursos humanos y gestión del cambio",
    "subtitle": "Roles, capacidades, conocimiento, seguridad laboral y adopción responsable de IA",
    "role": "Analista de talento humano",
    "function": "Identificar cómo las personas sostienen la operación, qué competencias faltan y qué controles laborales y de cambio requiere la adopción de IA.",
    "sections": [
      {
        "title": "A. Organización y roles",
        "questions": [
          {
            "id": "RH01",
            "text": "¿Cómo está organizada la empresa y cuáles son los cargos críticos por área?",
            "options": [
              "Organigrama formal y roles claros",
              "Roles multifuncionales sin delimitación",
              "Dependencia crítica de 1-2 personas clave",
              "Alta rotación de operarios"
            ]
          },
          {
            "id": "RH02",
            "text": "¿Qué funciones dependen excesivamente de una sola persona?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          },
          {
            "id": "RH03",
            "text": "¿Dónde existen vacíos, duplicidad o falta de claridad de responsabilidades?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          },
          {
            "id": "RH04",
            "text": "¿Cómo se cubren reemplazos, ausencias y cambios de turno?",
            "options": [
              "Sistema biométrico/software de nómina",
              "Planillas de Excel manuales",
              "Libro de firmas físico en portería",
              "Reporte verbal sin trazabilidad"
            ]
          },
          {
            "id": "RH05",
            "text": "¿Qué responsables deberían participar en decisiones sobre IA?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          }
        ]
      },
      {
        "title": "B. Conocimiento y formación",
        "questions": [
          {
            "id": "RH06",
            "text": "¿Cómo se documentan y enseñan procedimientos de trabajo?",
            "options": [
              "Manuales SOP digitales actualizados",
              "Transmisión oral de operario a operario",
              "Formatos físicos de difícil consulta",
              "Sin documentación estandarizada"
            ]
          },
          {
            "id": "RH07",
            "text": "¿Cómo se realiza inducción y entrenamiento por puesto?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          },
          {
            "id": "RH08",
            "text": "¿Qué errores se asocian a falta de formación o instrucciones desactualizadas?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          },
          {
            "id": "RH09",
            "text": "¿Qué conocimientos prácticos no están documentados?",
            "options": [
              "Manuales SOP digitales actualizados",
              "Transmisión oral de operario a operario",
              "Formatos físicos de difícil consulta",
              "Sin documentación estandarizada"
            ]
          },
          {
            "id": "RH10",
            "text": "¿Qué nivel de alfabetización digital e IA tiene cada grupo de trabajadores?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          }
        ]
      },
      {
        "title": "C. Gestión administrativa de personal",
        "questions": [
          {
            "id": "RH11",
            "text": "¿Qué procesos de contratación, novedades, turnos, certificados o reportes son manuales?",
            "options": [
              "Manuales SOP digitales actualizados",
              "Transmisión oral de operario a operario",
              "Formatos físicos de difícil consulta",
              "Sin documentación estandarizada"
            ]
          },
          {
            "id": "RH12",
            "text": "¿Qué documentos se consultan repetidamente y cuánto tarda encontrarlos?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          },
          {
            "id": "RH13",
            "text": "¿Qué datos personales o sensibles se procesan y en qué sistemas?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          },
          {
            "id": "RH14",
            "text": "¿Qué indicadores se siguen sobre rotación, ausentismo, capacitación y productividad?",
            "options": [
              "Alta disposición y liderazgo activo",
              "Aceptación con necesidad de capacitación",
              "Incertidumbre o temor al reemplazo",
              "Resistencia alta en mandos medios"
            ]
          },
          {
            "id": "RH15",
            "text": "¿Qué automatización administrativa tendría valor sin afectar decisiones humanas?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          }
        ]
      },
      {
        "title": "D. Seguridad, vigilancia y cambio",
        "questions": [
          {
            "id": "RH16",
            "text": "¿Qué cámaras existen y con qué finalidad se informaron a trabajadores?",
            "options": [
              "Cámaras solo para seguridad perimetral",
              "Cámaras en línea de producción activas",
              "Sin política de privacidad informada",
              "Sin videovigilancia en planta"
            ]
          },
          {
            "id": "RH17",
            "text": "¿Cómo se gestionan seguridad y salud en el trabajo y uso de EPP?",
            "options": [
              "Cámaras solo para seguridad perimetral",
              "Cámaras en línea de producción activas",
              "Sin política de privacidad informada",
              "Sin videovigilancia en planta"
            ]
          },
          {
            "id": "RH18",
            "text": "¿Qué preocupación podrían tener los trabajadores frente a cámaras o IA?",
            "options": [
              "Cámaras solo para seguridad perimetral",
              "Cámaras en línea de producción activas",
              "Sin política de privacidad informada",
              "Sin videovigilancia en planta"
            ]
          },
          {
            "id": "RH19",
            "text": "¿Cómo se comunicarían cambios de funciones y supervisión humana?",
            "options": [
              "Alta disposición y liderazgo activo",
              "Aceptación con necesidad de capacitación",
              "Incertidumbre o temor al reemplazo",
              "Resistencia alta en mandos medios"
            ]
          },
          {
            "id": "RH20",
            "text": "¿Qué decisiones laborales deben mantenerse fuera de la automatización o requerir revisión humana?",
            "options": [
              "Capacidad instalada completa",
              "En proceso de estructuración",
              "Manejo informal",
              "Requiere intervención prioritaria"
            ]
          }
        ]
      }
    ],
    "rubricDimensions": [
      "Claridad de roles",
      "Gestión del conocimiento",
      "Competencias digitales",
      "Protección de datos laborales",
      "Preparación para el cambio"
    ],
    "id": "02"
  },
  {
    "filename": "03 · Instrumento — Producción y cadena de transformación.docx",
    "title": "Producción y cadena de transformación",
    "subtitle": "Recorrido de planta, capacidad, controles, calidad, trazabilidad y pérdidas",
    "role": "Analista de procesos productivos",
    "function": "Seguir físicamente el producto y documentar, estación por estación, dónde se transforma, controla, detiene, reprocesa o pierde valor.",
    "sections": [
      {
        "title": "A. Planeación y abastecimiento",
        "questions": [
          {
            "id": "P01",
            "text": "¿Cómo se convierte la demanda en plan de producción y compra?",
            "options": [
              "Planificación formal MRP/ERP semanal",
              "Estimación según pedidos históricos",
              "Compras reactivas ante agotados",
              "Sin planeación formal"
            ]
          },
          {
            "id": "P02",
            "text": "¿Qué materias primas son críticas y cómo se homologan proveedores?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P03",
            "text": "¿Qué problemas de disponibilidad, variabilidad o entrega afectan la producción?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P04",
            "text": "¿Cómo se inspecciona y registra la recepción?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P05",
            "text": "¿Cómo se controlan lotes, vencimientos y rotación?",
            "options": [
              "Orden digital con pesaje controlado",
              "Orden impresa con firmas manuales",
              "Receta fija conocida por operario",
              "Variabilidad no registrada"
            ]
          }
        ]
      },
      {
        "title": "B. Preparación y formulación",
        "questions": [
          {
            "id": "P06",
            "text": "¿Cómo se emite y valida una orden de producción?",
            "options": [
              "Orden digital con pesaje controlado",
              "Orden impresa con firmas manuales",
              "Receta fija conocida por operario",
              "Variabilidad no registrada"
            ]
          },
          {
            "id": "P07",
            "text": "¿Cómo se dosifican ingredientes y se previenen mezclas o referencias incorrectas?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P08",
            "text": "¿Qué registros se generan por lote y quién los verifica?",
            "options": [
              "Orden digital con pesaje controlado",
              "Orden impresa con firmas manuales",
              "Receta fija conocida por operario",
              "Variabilidad no registrada"
            ]
          },
          {
            "id": "P09",
            "text": "¿Dónde ocurren esperas, traslados o búsquedas innecesarias?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P10",
            "text": "¿Qué error en esta etapa genera mayor costo o riesgo?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          }
        ]
      },
      {
        "title": "C. Transformación y equipos",
        "questions": [
          {
            "id": "P11",
            "text": "¿Cuáles son las estaciones, máquinas y secuencia real del proceso?",
            "options": [
              "Línea continua automatizada",
              "Proceso semiautomático con paradas",
              "Operación mayormente manual",
              "Cuello de botella en estación específica"
            ]
          },
          {
            "id": "P12",
            "text": "¿Cuál es la capacidad nominal y real por hora o turno?",
            "options": [
              "Línea continua automatizada",
              "Proceso semiautomático con paradas",
              "Operación mayormente manual",
              "Cuello de botella en estación específica"
            ]
          },
          {
            "id": "P13",
            "text": "¿Qué paradas ocurren, cuánto duran y cómo se registran?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P14",
            "text": "¿Qué mantenimiento es preventivo, predictivo o reactivo?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P15",
            "text": "¿Qué variables de proceso se miden automáticamente y cuáles manualmente?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          }
        ]
      },
      {
        "title": "D. Calidad, inocuidad y HACCP",
        "questions": [
          {
            "id": "P16",
            "text": "¿Cuáles son los puntos críticos de control y cómo se documentan?",
            "options": [
              "PCC monitoreados con sensores continuos",
              "Planillas de control físico por turno",
              "Verificación visual aleatoria",
              "Registros incompletos"
            ]
          },
          {
            "id": "P17",
            "text": "¿Qué defectos o no conformidades son más frecuentes?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P18",
            "text": "¿Cómo se decide liberar, retener, reprocesar o descartar un lote?",
            "options": [
              "Orden digital con pesaje controlado",
              "Orden impresa con firmas manuales",
              "Receta fija conocida por operario",
              "Variabilidad no registrada"
            ]
          },
          {
            "id": "P19",
            "text": "¿Qué trazabilidad existe desde materia prima hasta despacho?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P20",
            "text": "¿Qué evidencias solicitan auditorías y cuánto tarda consolidarlas?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          }
        ]
      },
      {
        "title": "E. Rendimiento y pérdidas",
        "questions": [
          {
            "id": "P21",
            "text": "¿Qué volumen se produce por SKU, turno y periodo?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P22",
            "text": "¿Cuál es la merma esperada y real?",
            "options": [
              "Merma cuantificada < 2% por lote",
              "Merma estimada entre 3% y 7%",
              "Merma alta > 8% recurrente",
              "Sin medición sistemática de pérdidas"
            ]
          },
          {
            "id": "P23",
            "text": "¿Cuánto producto se reprocesa y por qué causas?",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P24",
            "text": "¿Qué cuello de botella limita la capacidad total?",
            "options": [
              "Línea continua automatizada",
              "Proceso semiautomático con paradas",
              "Operación mayormente manual",
              "Cuello de botella en estación específica"
            ]
          },
          {
            "id": "P25",
            "text": "¿Qué pérdida podría reducirse con datos, alertas o detección temprana?",
            "options": [
              "Merma cuantificada < 2% por lote",
              "Merma estimada entre 3% y 7%",
              "Merma alta > 8% recurrente",
              "Sin medición sistemática de pérdidas"
            ]
          }
        ]
      },
      {
        "title": "F. Observación estación por estación",
        "questions": [
          {
            "id": "P26",
            "text": "Registrar entrada, salida, responsable y tiempo de ciclo de cada estación observada.",
            "options": [
              "Línea continua automatizada",
              "Proceso semiautomático con paradas",
              "Operación mayormente manual",
              "Cuello de botella en estación específica"
            ]
          },
          {
            "id": "P27",
            "text": "Registrar control manual/automático y evidencia generada.",
            "options": [
              "PCC monitoreados con sensores continuos",
              "Planillas de control físico por turno",
              "Verificación visual aleatoria",
              "Registros incompletos"
            ]
          },
          {
            "id": "P28",
            "text": "Registrar defecto, frecuencia y consecuencia económica u operativa.",
            "options": [
              "Línea continua automatizada",
              "Proceso semiautomático con paradas",
              "Operación mayormente manual",
              "Cuello de botella en estación específica"
            ]
          },
          {
            "id": "P29",
            "text": "Registrar decisión tomada ante la anomalía y tiempo hasta detectar el problema.",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          },
          {
            "id": "P30",
            "text": "Marcar si la oportunidad requiere automatización, analítica, agente, cámara, sensor u otra tecnología.",
            "options": [
              "Control riguroso en tiempo real",
              "Control periódico manual",
              "Supervisión visual",
              "Sin control estandarizado"
            ]
          }
        ]
      }
    ],
    "rubricDimensions": [
      "Planificación de producción",
      "Trazabilidad",
      "Control de calidad",
      "Medición de pérdidas",
      "Automatización e integración"
    ],
    "id": "03"
  },
  {
    "filename": "04 · Instrumento — Embalaje, logística y visión artificial.docx",
    "title": "Embalaje, logística y visión artificial",
    "subtitle": "Factibilidad de cámaras, Ultralytics, sensores, integración y piloto",
    "role": "Analista técnico de visión e integración",
    "function": "Validar si un problema visible y medible puede resolverse con visión artificial y definir las condiciones de una prueba de concepto sin comprometer la operación.",
    "sections": [
      {
        "title": "A. Embalaje y control visual",
        "questions": [
          {
            "id": "CV01",
            "text": "¿Qué pasos componen envasado, sellado, etiquetado, encajado y paletizado?",
            "options": [
              "Inspección 100% visual manual",
              "Línea de envasado semiautomática",
              "Fallas frecuentes de sellado/etiqueta",
              "Empaque manual en mesas"
            ]
          },
          {
            "id": "CV02",
            "text": "¿Qué presentaciones y variaciones debe distinguir el sistema?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV03",
            "text": "¿Qué defectos son visibles en una imagen y cuáles no?",
            "options": [
              "Defectos identificables visualmente",
              "Variabilidad alta de empaque",
              "Requiere toma de dataset desde cero",
              "Defectos internos no visibles con cámara"
            ]
          },
          {
            "id": "CV04",
            "text": "¿Dónde se realiza inspección manual, con qué frecuencia y por quién?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV05",
            "text": "¿Qué ocurre cuando se detecta un error y cuánto cuesta corregirlo tarde?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          }
        ]
      },
      {
        "title": "B. Flujo y logística",
        "questions": [
          {
            "id": "CV06",
            "text": "¿Cómo se cuentan unidades, cajas y pallets?",
            "options": [
              "Conteo manual al final de línea",
              "Sensor óptico de paso simple",
              "Lectura de código de barras manual",
              "Diferencias frecuentes de inventario"
            ]
          },
          {
            "id": "CV07",
            "text": "¿Cómo se valida que SKU, lote y cantidad correspondan al pedido?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV08",
            "text": "¿Qué errores de picking, consolidación, ruta o despacho ocurren?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV09",
            "text": "¿Qué acumulaciones, esperas o recorridos afectan el flujo?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV10",
            "text": "¿Qué devoluciones o reclamaciones podrían prevenirse con evidencia visual?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          }
        ]
      },
      {
        "title": "C. Condiciones de captura",
        "questions": [
          {
            "id": "CV11",
            "text": "¿Existen cámaras aprovechables? Registrar marca, resolución, FPS, ubicación y conectividad.",
            "options": [
              "Iluminación uniforme y espacio apto",
              "Cámaras existentes reutilizables",
              "Requiere iluminación dedicada + cámara industrial",
              "Espacio muy reducido / vibraciones"
            ]
          },
          {
            "id": "CV12",
            "text": "¿La iluminación es estable? Registrar sombras, reflejos, polvo, vibración y obstrucciones.",
            "options": [
              "Iluminación uniforme y espacio apto",
              "Cámaras existentes reutilizables",
              "Requiere iluminación dedicada + cámara industrial",
              "Espacio muy reducido / vibraciones"
            ]
          },
          {
            "id": "CV13",
            "text": "¿Cuál es la velocidad de banda y cuántos objetos pasan por minuto?",
            "options": [
              "Iluminación uniforme y espacio apto",
              "Cámaras existentes reutilizables",
              "Requiere iluminación dedicada + cámara industrial",
              "Espacio muy reducido / vibraciones"
            ]
          },
          {
            "id": "CV14",
            "text": "¿Qué distancia, ángulo y campo de visión permitirían observar el defecto?",
            "options": [
              "Defectos identificables visualmente",
              "Variabilidad alta de empaque",
              "Requiere toma de dataset desde cero",
              "Defectos internos no visibles con cámara"
            ]
          },
          {
            "id": "CV15",
            "text": "¿Se permite capturar y almacenar video? ¿Durante cuánto tiempo?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          }
        ]
      },
      {
        "title": "D. Acción e integración",
        "questions": [
          {
            "id": "CV16",
            "text": "¿El sistema solo alerta, registra, desvía producto o detiene la línea?",
            "options": [
              "Alerta visual/sonora con operario (Sugerido)",
              "Desviador neumático automático",
              "Parada automática de cinta",
              "Solo registro en log para auditoría"
            ]
          },
          {
            "id": "CV17",
            "text": "¿Qué latencia máxima admite el proceso?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV18",
            "text": "¿Con qué PLC, ERP, WMS, tablero o sistema de calidad debe integrarse?",
            "options": [
              "Alerta visual/sonora con operario (Sugerido)",
              "Desviador neumático automático",
              "Parada automática de cinta",
              "Solo registro en log para auditoría"
            ]
          },
          {
            "id": "CV19",
            "text": "¿Quién confirma falsos positivos y autoriza cambios del modelo?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV20",
            "text": "¿Debe operar sin internet y qué disponibilidad se exige?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          }
        ]
      },
      {
        "title": "E. Datos, modelo y piloto",
        "questions": [
          {
            "id": "CV21",
            "text": "¿Existen imágenes representativas de producto correcto y defectuoso?",
            "options": [
              "Defectos identificables visualmente",
              "Variabilidad alta de empaque",
              "Requiere toma de dataset desde cero",
              "Defectos internos no visibles con cámara"
            ]
          },
          {
            "id": "CV22",
            "text": "¿Quién puede etiquetar ejemplos y validar las clases de defecto?",
            "options": [
              "Inspección 100% visual manual",
              "Línea de envasado semiautomática",
              "Fallas frecuentes de sellado/etiqueta",
              "Empaque manual en mesas"
            ]
          },
          {
            "id": "CV23",
            "text": "¿Qué precisión, recall y tasa de falsos positivos serían aceptables?",
            "options": [
              "Factibilidad técnica alta",
              "Factibilidad media con ajustes",
              "Requiere adecuaciones previas",
              "No viable en estado actual"
            ]
          },
          {
            "id": "CV24",
            "text": "¿Qué estación y defecto ofrecen la mejor prueba de concepto?",
            "options": [
              "Defectos identificables visualmente",
              "Variabilidad alta de empaque",
              "Requiere toma de dataset desde cero",
              "Defectos internos no visibles con cámara"
            ]
          },
          {
            "id": "CV25",
            "text": "¿Qué cámaras, cómputo, licencia, integración y soporte debe incluir el costo total?",
            "options": [
              "Iluminación uniforme y espacio apto",
              "Cámaras existentes reutilizables",
              "Requiere iluminación dedicada + cámara industrial",
              "Espacio muy reducido / vibraciones"
            ]
          }
        ]
      }
    ],
    "rubricDimensions": [
      "Visibilidad del problema",
      "Calidad de captura",
      "Datos de entrenamiento",
      "Integración",
      "Viabilidad de piloto"
    ],
    "id": "04"
  },
  {
    "filename": "05 · Instrumento — Gobernanza, datos, riesgos y cumplimiento.docx",
    "title": "Gobernanza, datos, riesgos y cumplimiento",
    "subtitle": "Preparación organizacional para implementar y supervisar sistemas de IA",
    "role": "Evidencias que debe solicitar o registrar",
    "function": "Determinar qué responsabilidades, controles, evidencias y reglas necesita Casta Gourmet para adoptar IA dentro de su Sistema de Gestión Integrado y sus prácticas de calidad.",
    "sections": [
      {
        "title": "A. Liderazgo y alcance",
        "questions": [
          {
            "id": "GO01",
            "text": "¿Quién aprueba, patrocina, usa y supervisa tecnologías de IA?",
            "options": [
              "Comité directivo / Gerencia general",
              "Área de tecnología / Innovación",
              "Responsables de área independientes",
              "Sin liderazgo formal definido"
            ]
          },
          {
            "id": "GO02",
            "text": "¿Existe política o regla interna sobre uso de IA generativa, automatización o cámaras?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          },
          {
            "id": "GO03",
            "text": "¿Qué procesos y sistemas quedarían inicialmente dentro del alcance?",
            "options": [
              "Inventario formal de software e IA",
              "Conocimiento informal de herramientas",
              "Uso no autorizado disperso",
              "Sin registro de activos de IA"
            ]
          },
          {
            "id": "GO04",
            "text": "¿Qué objetivos medibles espera la alta dirección?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          }
        ]
      },
      {
        "title": "B. Inventario y ciclo de vida",
        "questions": [
          {
            "id": "GO05",
            "text": "¿Qué sistemas con IA o decisiones automatizadas existen actualmente?",
            "options": [
              "Inventario formal de software e IA",
              "Conocimiento informal de herramientas",
              "Uso no autorizado disperso",
              "Sin registro de activos de IA"
            ]
          },
          {
            "id": "GO06",
            "text": "¿Quién es propietario de cada sistema y qué proveedor participa?",
            "options": [
              "Contratos formales con cláusulas de IA/DPA",
              "SaaS estándar sin revisión legal",
              "Licencias de código abierto sin auditar",
              "Sin acuerdos de nivel de servicio"
            ]
          },
          {
            "id": "GO07",
            "text": "¿Cómo se prueban, aprueban, cambian y retiran sistemas tecnológicos?",
            "options": [
              "Comité directivo / Gerencia general",
              "Área de tecnología / Innovación",
              "Responsables de área independientes",
              "Sin liderazgo formal definido"
            ]
          },
          {
            "id": "GO08",
            "text": "¿Qué registros permiten reconstruir una decisión o incidente?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          }
        ]
      },
      {
        "title": "C. Datos y privacidad",
        "questions": [
          {
            "id": "GO09",
            "text": "¿Qué datos de clientes, trabajadores, proveedores, producción e imágenes se usarían?",
            "options": [
              "Política de protección de datos (Ley 1581)",
              "Datos anonimizados en producción",
              "Riesgo de exposición de fórmulas/clientes",
              "Sin controles de acceso definidos"
            ]
          },
          {
            "id": "GO10",
            "text": "¿Cuál es la finalidad, base de autorización, acceso, conservación y eliminación?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          },
          {
            "id": "GO11",
            "text": "¿Cómo se controla calidad, exactitud, trazabilidad y minimización de datos?",
            "options": [
              "Política de protección de datos (Ley 1581)",
              "Datos anonimizados en producción",
              "Riesgo de exposición de fórmulas/clientes",
              "Sin controles de acceso definidos"
            ]
          },
          {
            "id": "GO12",
            "text": "¿Qué datos o imágenes no deben salir de la planta?",
            "options": [
              "Política de protección de datos (Ley 1581)",
              "Datos anonimizados en producción",
              "Riesgo de exposición de fórmulas/clientes",
              "Sin controles de acceso definidos"
            ]
          }
        ]
      },
      {
        "title": "D. Riesgo y supervisión humana",
        "questions": [
          {
            "id": "GO13",
            "text": "¿Qué daño podría causar un falso positivo, falso negativo o indisponibilidad?",
            "options": [
              "Impacto bajo (Asistente/Revisión)",
              "Impacto medio (Demoras operativas)",
              "Impacto alto (Pérdida económica/Legal)",
              "Riesgo reputacional crítico"
            ]
          },
          {
            "id": "GO14",
            "text": "¿Qué decisiones requieren confirmación humana?",
            "options": [
              "Human-in-the-loop obligatorio en toda decisión",
              "Supervisión por muestreo periódico",
              "Decisión autónoma con log de auditoría",
              "Sin mecanismo de bypass humano"
            ]
          },
          {
            "id": "GO15",
            "text": "¿Quién puede detener el sistema o volver al proceso manual?",
            "options": [
              "Human-in-the-loop obligatorio en toda decisión",
              "Supervisión por muestreo periódico",
              "Decisión autónoma con log de auditoría",
              "Sin mecanismo de bypass humano"
            ]
          },
          {
            "id": "GO16",
            "text": "¿Cómo se reportan, investigan y corrigen incidentes?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          }
        ]
      },
      {
        "title": "E. Proveedores, seguridad y licencias",
        "questions": [
          {
            "id": "GO17",
            "text": "¿Cómo se evalúan proveedores, contratos, SLA y subencargados?",
            "options": [
              "Contratos formales con cláusulas de IA/DPA",
              "SaaS estándar sin revisión legal",
              "Licencias de código abierto sin auditar",
              "Sin acuerdos de nivel de servicio"
            ]
          },
          {
            "id": "GO18",
            "text": "¿Cómo se gestionan accesos, respaldos, continuidad y ciberseguridad?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          },
          {
            "id": "GO19",
            "text": "¿Qué licencias, propiedad intelectual y restricciones de uso aplican?",
            "options": [
              "Contratos formales con cláusulas de IA/DPA",
              "SaaS estándar sin revisión legal",
              "Licencias de código abierto sin auditar",
              "Sin acuerdos de nivel de servicio"
            ]
          },
          {
            "id": "GO20",
            "text": "¿Qué evidencia debe conservarse para auditorías, HACCP y responsabilidad demostrada?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          }
        ]
      },
      {
        "title": "F. Personas, medición y mejora",
        "questions": [
          {
            "id": "GO21",
            "text": "¿Qué competencias necesita cada rol y quién debe capacitarse?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          },
          {
            "id": "GO22",
            "text": "¿Qué indicadores técnicos, operativos, financieros y de riesgo se revisarán?",
            "options": [
              "Impacto bajo (Asistente/Revisión)",
              "Impacto medio (Demoras operativas)",
              "Impacto alto (Pérdida económica/Legal)",
              "Riesgo reputacional crítico"
            ]
          },
          {
            "id": "GO23",
            "text": "¿Con qué frecuencia se evaluarán modelo, datos, controles y proveedor?",
            "options": [
              "Política de protección de datos (Ley 1581)",
              "Datos anonimizados en producción",
              "Riesgo de exposición de fórmulas/clientes",
              "Sin controles de acceso definidos"
            ]
          },
          {
            "id": "GO24",
            "text": "¿Cómo se comunicarán resultados, límites y cambios a trabajadores y directivos?",
            "options": [
              "Cumplimiento total documentado",
              "Cumplimiento parcial con brechas",
              "Riesgo legal/operativo latente",
              "Sin estructura de gobernanza"
            ]
          }
        ]
      }
    ],
    "rubricDimensions": [
      "Liderazgo y responsabilidad",
      "Inventario y ciclo de vida",
      "Datos y privacidad",
      "Riesgo y supervisión",
      "Proveedores y seguridad",
      "Medición y mejora"
    ],
    "id": "05"
  },
  {
    "filename": "06 · Instrumento — ROI, priorización y cierre comercial.docx",
    "title": "ROI, priorización y cierre comercial",
    "subtitle": "Línea base, escenarios, indicadores, caso de negocio y siguiente fase",
    "role": "Analista financiero y coordinador comercial",
    "function": "Traducir cada problema priorizado a una línea base medible, un beneficio potencial, un costo total y una decisión comercial responsable.",
    "sections": [
      {
        "title": "A. Línea base del problema",
        "questions": [
          {
            "id": "R01",
            "text": "¿Cuál es el proceso, estación y problema específico?",
            "options": [
              "Inspección y sellado en empaque",
              "Conciliación de inventarios y ERP",
              "Gestión de contratos y proveedores",
              "Capacitación y manuales operativos"
            ]
          },
          {
            "id": "R02",
            "text": "¿Con qué frecuencia ocurre y cómo se registra?",
            "options": [
              "Ocurrencia diaria en cada turno",
              "Ocurrencia semanal recurrente",
              "Ocurrencia mensual en cierres",
              "Esporádico pero de alto costo"
            ]
          },
          {
            "id": "R03",
            "text": "¿Qué volumen de unidades, lotes, pedidos u horas está expuesto?",
            "options": [
              "Ocurrencia diaria en cada turno",
              "Ocurrencia semanal recurrente",
              "Ocurrencia mensual en cierres",
              "Esporádico pero de alto costo"
            ]
          },
          {
            "id": "R04",
            "text": "¿Cuál es el costo unitario del error, merma, reproceso, devolución o parada?",
            "options": [
              "Inspección y sellado en empaque",
              "Conciliación de inventarios y ERP",
              "Gestión de contratos y proveedores",
              "Capacitación y manuales operativos"
            ]
          },
          {
            "id": "R05",
            "text": "¿Qué indicador actual demuestra el problema?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          }
        ]
      },
      {
        "title": "B. Beneficios potenciales",
        "questions": [
          {
            "id": "R06",
            "text": "¿Qué cantidad de defectos, horas o pérdidas sería razonable reducir?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R07",
            "text": "¿El beneficio proviene de ahorro, capacidad adicional, calidad, ventas o riesgo evitado?",
            "options": [
              "Ahorro directo de horas hombre",
              "Reducción de merma y reproceso",
              "Prevención de reclamos y sanciones",
              "Aumento de capacidad de producción"
            ]
          },
          {
            "id": "R08",
            "text": "¿Qué parte del beneficio puede atribuirse directamente a la solución?",
            "options": [
              "Ahorro directo de horas hombre",
              "Reducción de merma y reproceso",
              "Prevención de reclamos y sanciones",
              "Aumento de capacidad de producción"
            ]
          },
          {
            "id": "R09",
            "text": "¿Qué beneficio es cuantificable y cuál es cualitativo?",
            "options": [
              "Ahorro directo de horas hombre",
              "Reducción de merma y reproceso",
              "Prevención de reclamos y sanciones",
              "Aumento de capacidad de producción"
            ]
          },
          {
            "id": "R10",
            "text": "¿Quién validará mensualmente el beneficio realizado?",
            "options": [
              "Ahorro directo de horas hombre",
              "Reducción de merma y reproceso",
              "Prevención de reclamos y sanciones",
              "Aumento de capacidad de producción"
            ]
          }
        ]
      },
      {
        "title": "C. Costo total de propiedad",
        "questions": [
          {
            "id": "R11",
            "text": "¿Qué hardware, cámaras, sensores o infraestructura se requieren?",
            "options": [
              "Inversión baja / Piloto (< k USD)",
              "Inversión media (k - 5k USD)",
              "Modelo SaaS mensual recurrente",
              "Presupuesto pendiente de asignación"
            ]
          },
          {
            "id": "R12",
            "text": "¿Qué costos de software, licencia, nube, integración o conectividad aplican?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R13",
            "text": "¿Qué costos de dataset, etiquetado, entrenamiento y pruebas deben incluirse?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R14",
            "text": "¿Qué capacitación, soporte, monitoreo y reentrenamiento serán recurrentes?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R15",
            "text": "¿Qué costo interno tendrá el tiempo del personal de Casta Gourmet?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          }
        ]
      },
      {
        "title": "D. Escenarios y decisión",
        "questions": [
          {
            "id": "R16",
            "text": "Definir escenario conservador: mejora mínima y costos completos.",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R17",
            "text": "Definir escenario esperado: mejora probable respaldada por el piloto.",
            "options": [
              "Prioridad 1: Piloto Quick Win (60-90d)",
              "Prioridad 2: Expansión de Procesos (3-6m)",
              "Prioridad 3: Gobernanza Corporativa (6-12m)",
              "Requiere madurar datos primero"
            ]
          },
          {
            "id": "R18",
            "text": "Definir escenario optimista sin usarlo como promesa comercial.",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R19",
            "text": "¿Cuál es el ROI mínimo y plazo máximo de recuperación aceptable?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R20",
            "text": "¿Qué condición detendría o impediría escalar el piloto?",
            "options": [
              "Prioridad 1: Piloto Quick Win (60-90d)",
              "Prioridad 2: Expansión de Procesos (3-6m)",
              "Prioridad 3: Gobernanza Corporativa (6-12m)",
              "Requiere madurar datos primero"
            ]
          }
        ]
      },
      {
        "title": "E. Priorización comercial",
        "questions": [
          {
            "id": "R21",
            "text": "¿Cuál oportunidad combina mayor impacto, datos disponibles y menor riesgo?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R22",
            "text": "¿Qué puede probarse en una estación y en 60–90 días?",
            "options": [
              "Inspección y sellado en empaque",
              "Conciliación de inventarios y ERP",
              "Gestión de contratos y proveedores",
              "Capacitación y manuales operativos"
            ]
          },
          {
            "id": "R23",
            "text": "¿Qué iniciativa requiere primero mejorar datos o procesos?",
            "options": [
              "Inspección y sellado en empaque",
              "Conciliación de inventarios y ERP",
              "Gestión de contratos y proveedores",
              "Capacitación y manuales operativos"
            ]
          },
          {
            "id": "R24",
            "text": "¿Qué servicios complementarios se necesitan: automatización, agente, LegalTech o gobernanza?",
            "options": [
              "Alto impacto / Rápido retorno",
              "Medio impacto / Viable",
              "Bajo impacto / Complejo",
              "No prioritario en este momento"
            ]
          },
          {
            "id": "R25",
            "text": "¿Quién decide, quién financia y cuál es el siguiente hito?",
            "options": [
              "Prioridad 1: Piloto Quick Win (60-90d)",
              "Prioridad 2: Expansión de Procesos (3-6m)",
              "Prioridad 3: Gobernanza Corporativa (6-12m)",
              "Requiere madurar datos primero"
            ]
          }
        ]
      }
    ],
    "rubricDimensions": [
      "Impacto económico",
      "Factibilidad",
      "Disponibilidad de datos",
      "Tiempo a valor",
      "Riesgo",
      "Patrocinio interno"
    ],
    "id": "06"
  }
];
