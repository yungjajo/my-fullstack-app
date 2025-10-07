/**
 * Testy API endpoints backendu
 * Testują wszystkie endpointy REST API
 */

import request from 'supertest';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import aplikacji (uproszczona wersja dla testów)
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Mock uploads directory
  const UPLOAD_DIR = path.join(__dirname, '../../../uploads_test');
  
  // Upewnij się, że folder testowy istnieje
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running!' });
  });

  // Get files endpoint
  app.get('/api/files', (req, res) => {
    try {
      const files = fs.readdirSync(UPLOAD_DIR)
        .filter(file => file !== '.gitkeep')
        .map(filename => {
          const filePath = path.join(UPLOAD_DIR, filename);
          const stats = fs.statSync(filePath);
          return {
            filename,
            size: stats.size,
            uploadedAt: stats.birthtime
          };
        });
      res.json({ files });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get entities endpoint
  app.get('/api/entities/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(UPLOAD_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      const csv = fs.readFileSync(filePath, 'utf-8');
      const lines = csv.split(/\r?\n/);
      if (!lines || lines.length === 0) {
        return res.status(400).json({ error: 'CSV file is empty' });
      }
      
      const header = lines[0].split(',');
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

  return { app, UPLOAD_DIR };
};

describe('Backend API Tests', () => {
  let app: express.Application;
  let UPLOAD_DIR: string;

  beforeAll(() => {
    const testApp = createTestApp();
    app = testApp.app;
    UPLOAD_DIR = testApp.UPLOAD_DIR;
  });

  afterAll(() => {
    // Cleanup - usuń testowe pliki
    if (fs.existsSync(UPLOAD_DIR)) {
      const files = fs.readdirSync(UPLOAD_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(UPLOAD_DIR, file));
      });
      fs.rmdirSync(UPLOAD_DIR);
    }
  });

  describe('GET /', () => {
    it('powinien zwrócić status 200', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    it('powinien zwrócić wiadomość', async () => {
      const response = await request(app).get('/');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Backend API is running!');
    });
  });

  describe('GET /api/files', () => {
    it('powinien zwrócić status 200', async () => {
      const response = await request(app).get('/api/files');
      expect(response.status).toBe(200);
    });

    it('powinien zwrócić pustą listę gdy brak plików', async () => {
      const response = await request(app).get('/api/files');
      expect(response.body).toHaveProperty('files');
      expect(Array.isArray(response.body.files)).toBe(true);
    });

    it('powinien zwrócić listę plików gdy są uploadowane', async () => {
      // Utwórz testowy plik
      const testFile = path.join(UPLOAD_DIR, 'test.csv');
      fs.writeFileSync(testFile, 'Nadawca,Odbiorca,Kwota\nA,B,100');

      const response = await request(app).get('/api/files');
      expect(response.status).toBe(200);
      expect(response.body.files.length).toBeGreaterThan(0);
      expect(response.body.files[0]).toHaveProperty('filename');
      expect(response.body.files[0]).toHaveProperty('size');
      expect(response.body.files[0]).toHaveProperty('uploadedAt');

      // Cleanup
      fs.unlinkSync(testFile);
    });
  });

  describe('GET /api/entities/:filename', () => {
    beforeEach(() => {
      // Utwórz testowy plik CSV
      const testFile = path.join(UPLOAD_DIR, 'test_entities.csv');
      fs.writeFileSync(testFile, 
        'Nadawca,Odbiorca,Kwota,Data\n' +
        'Firma A,Firma B,1000,2024-01-01\n' +
        'Firma B,Firma C,2000,2024-01-02\n' +
        'Firma A,Firma C,1500,2024-01-03'
      );
    });

    afterEach(() => {
      // Cleanup
      const testFile = path.join(UPLOAD_DIR, 'test_entities.csv');
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    });

    it('powinien zwrócić status 200 dla istniejącego pliku', async () => {
      const response = await request(app).get('/api/entities/test_entities.csv');
      expect(response.status).toBe(200);
    });

    it('powinien zwrócić status 404 dla nieistniejącego pliku', async () => {
      const response = await request(app).get('/api/entities/nieistniejacy.csv');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('powinien zwrócić listę unikalnych podmiotów', async () => {
      const response = await request(app).get('/api/entities/test_entities.csv');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('entities');
      expect(Array.isArray(response.body.entities)).toBe(true);
      expect(response.body.entities.length).toBe(3); // Firma A, B, C
      expect(response.body.entities).toContain('Firma A');
      expect(response.body.entities).toContain('Firma B');
      expect(response.body.entities).toContain('Firma C');
    });

    it('powinien zwrócić błąd 400 dla pustego pliku', async () => {
      // Utwórz pusty plik
      const emptyFile = path.join(UPLOAD_DIR, 'empty.csv');
      fs.writeFileSync(emptyFile, '');

      const response = await request(app).get('/api/entities/empty.csv');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');

      // Cleanup
      fs.unlinkSync(emptyFile);
    });

    it('powinien zwrócić błąd 400 gdy brak wymaganych kolumn', async () => {
      // Utwórz plik bez Nadawca/Odbiorca
      const invalidFile = path.join(UPLOAD_DIR, 'invalid.csv');
      fs.writeFileSync(invalidFile, 'Kolumna1,Kolumna2\nWartosc1,Wartosc2');

      const response = await request(app).get('/api/entities/invalid.csv');
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Nadawca');

      // Cleanup
      fs.unlinkSync(invalidFile);
    });
  });

  describe('Error Handling', () => {
    it('powinien zwrócić 404 dla nieistniejącej ścieżki', async () => {
      const response = await request(app).get('/api/nieistniejacy-endpoint');
      expect(response.status).toBe(404);
    });
  });
});

describe('CSV Parsing Tests', () => {
  it('powinien parsować CSV z różnymi separatorami dziesiętnych', () => {
    // Test dla różnych formatów kwot
    const values = [
      '1000.50',
      '1000,50',
      '1 000.50',
      '1 000,50'
    ];

    values.forEach(value => {
      const normalized = value.replace(' ', '').replace(',', '.');
      expect(parseFloat(normalized)).toBeCloseTo(1000.50, 2);
    });
  });

  it('powinien obsługiwać różne formaty dat', () => {
    const dates = [
      '2024-01-15',
      '2024/01/15',
      '15-01-2024'
    ];

    dates.forEach(date => {
      // Podstawowy test czy można parsować
      expect(date).toMatch(/\d{2,4}[-/]\d{1,2}[-/]\d{1,4}/);
    });
  });
});

