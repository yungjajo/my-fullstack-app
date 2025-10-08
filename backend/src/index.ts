// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import os from 'os';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Wykryj system operacyjny i wybierz odpowiednią komendę Python
// Na Windows: python, na Mac/Linux: python3
const PYTHON_CMD = os.platform() === 'win32' ? 'python' : 'python3';

// Upewnij się, że folder uploads istnieje
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// CORS configuration - MUSI BYĆ PRZED ENDPOINTAMI!
app.use(cors());
app.use(express.json());

// Endpoint do pobierania listy podmiotów z pliku CSV
app.get('/api/entities/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    // Wczytaj plik CSV i zwróć unikalne podmioty
    const csv = fs.readFileSync(filePath, 'utf-8');
    const lines = csv ? csv.split(/\r?\n/) : [];
    if (!lines || lines.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty' });
    }
    const header = lines[0] ? lines[0].split(',') : [];
    const idxNadawca = header.findIndex(h => h.toLowerCase().includes('nadawca'));
    const idxOdbiorca = header.findIndex(h => h.toLowerCase().includes('odbiorca'));
    if (idxNadawca === -1 || idxOdbiorca === -1) {
      return res.status(400).json({ error: 'CSV must contain Nadawca and Odbiorca columns' });
    }
    const entities = new Set();
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (typeof line !== 'string' || !line) continue;
      const row = line.split(',');
      if (row.length > Math.max(idxNadawca, idxOdbiorca)) {
        entities.add(row[idxNadawca]);
        entities.add(row[idxOdbiorca]);
      }
    }
    res.json({ entities: Array.from(entities).filter(e => !!e) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Multer configuration dla przechowywania plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Funkcja do uruchamiania skryptu Python
async function runPythonScript(filePath: string): Promise<string> {
  const scriptPath = path.join(__dirname, '../../python-scripts/process_file.py');
  const command = `${PYTHON_CMD} ${scriptPath} "${filePath}"`;
  
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error('Python stderr:', stderr);
    }
    return stdout;
  } catch (error: any) {
    throw new Error(`Python script error: ${error.message}`);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Upload file endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    
    // Uruchom skrypt Python
    const pythonResult = await runPythonScript(filePath);
    
    res.json({
      success: true,
      message: 'File uploaded and processed successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: filePath
      },
      pythonOutput: pythonResult
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all uploaded files with registry statistics
app.get('/api/files', (req, res) => {
  console.log('📁 GET /api/files called');
  try {
    const allFiles = fs.readdirSync(UPLOAD_DIR).filter(file => file !== '.gitkeep');
    const csvFiles = allFiles.filter(file => file.endsWith('.csv'));
    console.log(`Found ${allFiles.length} files, ${csvFiles.length} CSV files`);
    
    const files = allFiles.map(filename => {
      const filePath = path.join(UPLOAD_DIR, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        uploadedAt: stats.birthtime
      };
    });

    // Oblicz statystyki rejestru
    const allEntities = new Set<string>();
    const allDates: Date[] = [];

    csvFiles.forEach(filename => {
      try {
        const filePath = path.join(UPLOAD_DIR, filename);
        const csvContent = fs.readFileSync(filePath, 'utf-8');
        const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length < 2) return;
        
        const header = lines[0].split(',');
        const nadawcaIdx = header.findIndex(h => h.toLowerCase().includes('nadawca'));
        const odbiorcaIdx = header.findIndex(h => h.toLowerCase().includes('odbiorca'));
        const dataIdx = header.findIndex(h => h.toLowerCase().includes('data'));
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          
          if (nadawcaIdx >= 0 && row[nadawcaIdx]) {
            allEntities.add(row[nadawcaIdx].trim());
          }
          if (odbiorcaIdx >= 0 && row[odbiorcaIdx]) {
            allEntities.add(row[odbiorcaIdx].trim());
          }
          
          if (dataIdx >= 0 && row[dataIdx]) {
            const dateStr = row[dataIdx].trim();
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              allDates.push(date);
            }
          }
        }
      } catch (err) {
        console.error(`Error processing CSV file ${filename}:`, err);
      }
    });

    let dateFrom = null;
    let dateTo = null;
    
    if (allDates.length > 0) {
      allDates.sort((a, b) => a.getTime() - b.getTime());
      dateFrom = allDates[0].toISOString().split('T')[0];
      dateTo = allDates[allDates.length - 1].toISOString().split('T')[0];
    }

    const responseData = { 
      files,
      stats: {
        documentCount: csvFiles.length,
        entityCount: allEntities.size,
        dateFrom,
        dateTo
      }
    };
    
    console.log(`Sending response with ${files.length} files and stats:`, responseData.stats);
    res.json(responseData);
  } catch (error: any) {
    console.error('Error in /api/files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get registry statistics
app.get('/api/registry-stats', (req, res) => {
  console.log('📊 Registry stats endpoint called!');
  try {
    const csvFiles = fs.readdirSync(UPLOAD_DIR)
      .filter(file => file !== '.gitkeep' && file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      return res.json({
        documentCount: 0,
        entityCount: 0,
        dateFrom: null,
        dateTo: null
      });
    }

    const allEntities = new Set<string>();
    const allDates: Date[] = [];

    csvFiles.forEach(filename => {
      try {
        const filePath = path.join(UPLOAD_DIR, filename);
        const csvContent = fs.readFileSync(filePath, 'utf-8');
        const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length < 2) return;
        
        const header = lines[0].split(',');
        const nadawcaIdx = header.findIndex(h => h.toLowerCase().includes('nadawca'));
        const odbiorcaIdx = header.findIndex(h => h.toLowerCase().includes('odbiorca'));
        const dataIdx = header.findIndex(h => h.toLowerCase().includes('data'));
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          
          if (nadawcaIdx >= 0 && row[nadawcaIdx]) {
            allEntities.add(row[nadawcaIdx].trim());
          }
          if (odbiorcaIdx >= 0 && row[odbiorcaIdx]) {
            allEntities.add(row[odbiorcaIdx].trim());
          }
          
          if (dataIdx >= 0 && row[dataIdx]) {
            const dateStr = row[dataIdx].trim();
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              allDates.push(date);
            }
          }
        }
      } catch (err) {
        console.error(`Error processing file ${filename}:`, err);
      }
    });

    let dateFrom = null;
    let dateTo = null;
    
    if (allDates.length > 0) {
      allDates.sort((a, b) => a.getTime() - b.getTime());
      dateFrom = allDates[0].toISOString().split('T')[0];
      dateTo = allDates[allDates.length - 1].toISOString().split('T')[0];
    }

    res.json({
      documentCount: csvFiles.length,
      entityCount: allEntities.size,
      dateFrom,
      dateTo
    });
  } catch (error: any) {
    console.error('Registry stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file endpoint
app.delete('/api/files/:filename', (req, res) => {
  try {
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do generowania wykresu przepływów finansowych
app.post('/api/flows', async (req, res) => {
  try {
    const { filename, entities, from, to } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }
    const filePath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Przygotuj argumenty do flows.py
    const scriptPath = path.join(__dirname, '../../python-scripts/flows.py');
    // Zapisz parametry do pliku tymczasowego (np. JSON), bo flows.py nie przyjmuje argumentów
    const params = {
      csv_path: filePath,
      entities,
      from,
      to
    };
    const paramsPath = path.join(__dirname, '../../python-scripts/flows_params.json');
    fs.writeFileSync(paramsPath, JSON.stringify(params));

    // Uruchom flows.py
    const command = `${PYTHON_CMD} "${scriptPath}"`;
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    // Odczytaj wygenerowany plik SVG
    const svgPath = path.join(__dirname, '../../python-scripts/przeplywy_finansowe.svg');
    if (!fs.existsSync(svgPath)) {
      return res.status(500).json({ error: 'SVG file not generated' });
    }
    const svgContent = fs.readFileSync(svgPath, 'utf-8');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgContent);
  } catch (error: any) {
    console.error('Flows error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});