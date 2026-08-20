import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const DB_FILE = path.join(__dirname, 'data', 'companies_db.json');

// Ensure data folder and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function readCompanies() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading companies DB:', err);
    return [];
  }
}

function writeCompanies(list) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing companies DB:', err);
  }
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API: Get all companies
app.get('/api/companies', (req, res) => {
  const list = readCompanies();
  res.json(list);
});

// API: Get company by ID
app.get('/api/companies/:id', (req, res) => {
  const list = readCompanies();
  const found = list.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Company not found' });
  res.json(found);
});

// API: Save or update company
app.post('/api/companies', (req, res) => {
  const company = req.body;
  if (!company || !company.id) {
    return res.status(400).json({ error: 'Invalid company payload' });
  }

  const list = readCompanies();
  const index = list.findIndex((c) => c.id === company.id);
  company.updatedAt = new Date().toISOString();

  if (index >= 0) {
    list[index] = company;
  } else {
    list.unshift(company);
  }

  writeCompanies(list);
  res.json({ success: true, company });
});

// API: Delete company
app.delete('/api/companies/:id', (req, res) => {
  const list = readCompanies().filter((c) => c.id !== req.params.id);
  writeCompanies(list);
  res.json({ success: true });
});

// API: Raw CSV export of all questions & answers
app.get('/api/companies/:id/raw-csv', (req, res) => {
  const list = readCompanies();
  const company = list.find((c) => c.id === req.params.id);
  if (!company) return res.status(404).json({ error: 'Company not found' });

  let csv = 'Instrumento,ID Pregunta,Estado Evidencia,Opción Seleccionada,Notas y Observaciones de Campo\n';

  Object.entries(company.instruments || {}).forEach(([instId, instData]) => {
    Object.entries(instData.responses || {}).forEach(([qId, r]) => {
      const cleanNotes = (r.notes || '').replace(/"/g, '""');
      const cleanOption = (r.selectedOption || '').replace(/"/g, '""');
      csv += `"${instId}","${qId}","${r.status || ''}","${cleanOption}","${cleanNotes}"\n`;
    });
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=Diagnostico_${company.name.replace(/[^a-zA-Z0-9]/g, '_')}_DatosBrutos.csv`);
  res.send(csv);
});

// Serve dist in production if built
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PAZ ORTEGA IA Backend Server running on http://localhost:${PORT}`);
});
