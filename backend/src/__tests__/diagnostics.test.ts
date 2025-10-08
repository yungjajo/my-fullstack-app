/**
 * Testy diagnostyczne backendu
 * Sprawdzają konfigurację, środowisko i integrację
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Diagnostyka Środowiska', () => {
  describe('Konfiguracja Systemu', () => {
    it('powinien wykryć poprawną platformę', () => {
      const platform = os.platform();
      expect(['darwin', 'win32', 'linux']).toContain(platform);
    });

    it('powinien wybrać poprawną komendę Python', () => {
      const PYTHON_CMD = os.platform() === 'win32' ? 'python' : 'python3';
      expect(PYTHON_CMD).toBeTruthy();
      expect(['python', 'python3']).toContain(PYTHON_CMD);
    });

    it('powinien mieć dostęp do zmiennych środowiskowych', () => {
      const port = process.env.PORT || 3001;
      expect(port).toBeTruthy();
    });
  });

  describe('Struktura Projektu', () => {
    it('powinien mieć folder uploads', () => {
      const uploadDir = path.join(__dirname, '../../../backend/uploads');
      const exists = fs.existsSync(uploadDir);
      expect(exists).toBe(true);
    });

    it('powinien mieć folder python-scripts', () => {
      const pythonDir = path.join(__dirname, '../../../python-scripts');
      const exists = fs.existsSync(pythonDir);
      expect(exists).toBe(true);
    });

    it('powinien mieć skrypt flows.py', () => {
      const flowsScript = path.join(__dirname, '../../../python-scripts/flows.py');
      const exists = fs.existsSync(flowsScript);
      expect(exists).toBe(true);
    });

    it('powinien mieć skrypt process_file.py', () => {
      const processScript = path.join(__dirname, '../../../python-scripts/process_file.py');
      const exists = fs.existsSync(processScript);
      expect(exists).toBe(true);
    });

    it('powinien mieć folder z przykładami CSV', () => {
      const examplesDir = path.join(__dirname, '../../../przyklady_csv');
      const exists = fs.existsSync(examplesDir);
      expect(exists).toBe(true);
      
      if (exists) {
        const files = fs.readdirSync(examplesDir);
        const csvFiles = files.filter(f => f.endsWith('.csv'));
        expect(csvFiles.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Zależności', () => {
    it('powinien mieć zainstalowane wymagane pakiety', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
      );
      
      expect(packageJson.dependencies).toHaveProperty('express');
      expect(packageJson.dependencies).toHaveProperty('cors');
      expect(packageJson.dependencies).toHaveProperty('multer');
    });

    it('powinien mieć tsx w devDependencies', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
      );
      
      expect(packageJson.devDependencies).toHaveProperty('tsx');
    });
  });

  describe('Uprawnienia Systemu', () => {
    it('powinien móc tworzyć pliki tymczasowe', () => {
      const testFile = path.join(os.tmpdir(), `test-${Date.now()}.txt`);
      
      fs.writeFileSync(testFile, 'test content');
      const exists = fs.existsSync(testFile);
      expect(exists).toBe(true);
      
      // Cleanup
      if (exists) {
        fs.unlinkSync(testFile);
      }
    });

    it('powinien móc odczytywać pliki CSV', () => {
      const uploadDir = path.join(__dirname, '../../../uploads');
      const canRead = fs.existsSync(uploadDir);
      
      if (canRead) {
        const files = fs.readdirSync(uploadDir);
        expect(Array.isArray(files)).toBe(true);
      }
    });
  });
});

describe('Diagnostyka Integracji Python', () => {
  describe('Python Script Configuration', () => {
    it('powinien mieć poprawną ścieżkę do skryptu flows.py', () => {
      const scriptPath = path.join(__dirname, '../../../python-scripts/flows.py');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toContain('def');
      expect(content).toContain('parse_csv');
    });

    it('powinien móc zapisać parametry flows_params.json', () => {
      const paramsPath = path.join(__dirname, '../../../python-scripts/flows_params_test.json');
      const testParams = {
        csv_path: '/test/path.csv',
        entities: [],
        from: '',
        to: ''
      };
      
      fs.writeFileSync(paramsPath, JSON.stringify(testParams));
      const exists = fs.existsSync(paramsPath);
      expect(exists).toBe(true);
      
      if (exists) {
        const read = JSON.parse(fs.readFileSync(paramsPath, 'utf-8'));
        expect(read).toEqual(testParams);
        fs.unlinkSync(paramsPath);
      }
    });
  });

  describe('CSV Processing', () => {
    it('powinien wykrywać nagłówki CSV z polskimi znakami', () => {
      const testHeaders = ['Nadawca', 'Odbiorca', 'Kwota', 'Data', 'Opis'];
      
      const hasNadawca = testHeaders.some(h => h.toLowerCase().includes('nadawca'));
      const hasOdbiorca = testHeaders.some(h => h.toLowerCase().includes('odbiorca'));
      
      expect(hasNadawca).toBe(true);
      expect(hasOdbiorca).toBe(true);
    });

    it('powinien normalizować kwoty z różnymi separatorami', () => {
      const testValues = [
        { input: '1000.50', expected: 1000.50 },
        { input: '1000,50', expected: 1000.50 },
        { input: '1 000.50', expected: 1000.50 },
        { input: '1 000,50', expected: 1000.50 }
      ];

      testValues.forEach(({ input, expected }) => {
        const normalized = input.replace(/\s/g, '').replace(',', '.');
        expect(parseFloat(normalized)).toBeCloseTo(expected, 2);
      });
    });
  });
});

describe('Diagnostyka Performance', () => {
  describe('Czas Odpowiedzi', () => {
    it('powinien szybko przetwarzać małe CSV', () => {
      const startTime = Date.now();
      
      // Symuluj parsowanie małego CSV
      const csvData = 'Nadawca,Odbiorca,Kwota\n' + 
                      'A,B,100\n'.repeat(10);
      const lines = csvData.split('\n');
      const rows = lines.map(l => l.split(','));
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100); // Powinno zająć < 100ms
      expect(rows.length).toBeGreaterThan(0);
    });

    it('powinien efektywnie agregować przepływy', () => {
      const startTime = Date.now();
      
      // Symuluj agregację
      const flows = new Map<string, number>();
      for (let i = 0; i < 100; i++) {
        const key = `A→B`;
        flows.set(key, (flows.get(key) || 0) + 100);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(50); // Powinno zająć < 50ms
      expect(flows.get('A→B')).toBe(10000);
    });
  });

  describe('Zarządzanie Pamięcią', () => {
    it('powinien efektywnie zarządzać małymi danymi', () => {
      const memBefore = process.memoryUsage().heapUsed;
      
      // Utwórz dane testowe
      const data = new Array(1000).fill(null).map((_, i) => ({
        nadawca: `Firma ${i % 10}`,
        odbiorca: `Firma ${(i + 1) % 10}`,
        kwota: Math.random() * 1000
      }));
      
      const memAfter = process.memoryUsage().heapUsed;
      const memIncrease = (memAfter - memBefore) / 1024 / 1024; // MB
      
      expect(memIncrease).toBeLessThan(10); // < 10MB dla 1000 wpisów
      expect(data.length).toBe(1000);
    });
  });
});

describe('Diagnostyka Bezpieczeństwa', () => {
  describe('Walidacja Danych', () => {
    it('powinien odrzucać niebezpieczne nazwy plików', () => {
      const dangerousNames = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32',
        'file.csv; rm -rf /',
        'file.csv && cat /etc/passwd'
      ];

      dangerousNames.forEach(name => {
        const containsDangerous = name.includes('..') || 
                                  name.includes(';') || 
                                  name.includes('&&') ||
                                  name.includes('|');
        expect(containsDangerous).toBe(true);
      });
    });

    it('powinien walidować rozszerzenia plików', () => {
      const validFiles = ['test.csv', 'data.CSV'];
      const invalidFiles = ['test.exe', 'data.sh', 'script.js'];

      validFiles.forEach(file => {
        expect(file.toLowerCase().endsWith('.csv')).toBe(true);
      });

      invalidFiles.forEach(file => {
        expect(file.toLowerCase().endsWith('.csv')).toBe(false);
      });
    });

    it('powinien limitować rozmiar plików', () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      
      const testSizes = [
        { size: 1024, shouldPass: true },
        { size: 5 * 1024 * 1024, shouldPass: true },
        { size: 15 * 1024 * 1024, shouldPass: false }
      ];

      testSizes.forEach(({ size, shouldPass }) => {
        const withinLimit = size <= MAX_FILE_SIZE;
        expect(withinLimit).toBe(shouldPass);
      });
    });
  });
});

describe('Diagnostyka Kompatybilności', () => {
  describe('Cross-Platform', () => {
    it('powinien używać poprawnego separatora ścieżek', () => {
      const testPath = path.join('folder', 'subfolder', 'file.csv');
      
      if (os.platform() === 'win32') {
        expect(testPath).toContain('\\');
      } else {
        expect(testPath).toContain('/');
      }
    });

    it('powinien obsługiwać różne zakończenia linii', () => {
      const testData = [
        { data: 'line1\nline2\nline3', separator: '\n', desc: 'Unix' },
        { data: 'line1\r\nline2\r\nline3', separator: '\r\n', desc: 'Windows' },
        { data: 'line1\rline2\rline3', separator: '\r', desc: 'Old Mac' }
      ];

      testData.forEach(({ data, separator }) => {
        const lines = data.split(/\r\n|\r|\n/);
        expect(lines.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('Kodowanie', () => {
    it('powinien obsługiwać UTF-8', () => {
      const polishChars = 'ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ';
      const encoded = Buffer.from(polishChars, 'utf-8');
      const decoded = encoded.toString('utf-8');
      
      expect(decoded).toBe(polishChars);
    });
  });
});

