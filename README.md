# 📊 Aplikacja Fullstack do Analizy Przepływów Finansowych

Aplikacja do przesyłania, analizowania plików i wizualizacji przepływów finansowych za pomocą wykresów Sankey.

## 🏗️ Architektura

### Backend (Express + TypeScript)
- Port: `3001`
- Upload plików
- Analiza plików przez Python
- Generowanie wykresów Sankey
- API REST

### Frontend (Next.js 15 + React 19)
- Port: `3002` (lub `3000` jeśli dostępny)
- Interfejs użytkownika
- Upload plików
- Wizualizacja wyników
- Filtry dla wykresów

### Python Scripts
- Analiza plików tekstowych
- Generowanie wykresów SVG (Sankey)

## 🚀 Uruchomienie

### 1. Instalacja zależności

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Python
cd ../python-scripts
pip install -r requirements.txt
```

### 2. Uruchomienie aplikacji

**Terminal 1 - Backend:**
```bash
cd backend
node --loader ts-node/esm src/index.ts
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Otwarcie aplikacji

- Frontend: http://localhost:3002 (lub http://localhost:3000)
- Backend API: http://localhost:3001

## 📋 Funkcjonalności

### ✅ Upload plików
- Przesyłanie plików przez interfejs webowy
- Obsługa plików tekstowych (TXT, CSV, JSON, itp.)
- Automatyczna analiza po uploadzieu

### ✅ Analiza plików
- Liczba linii i słów
- Podgląd zawartości
- Informacje o pliku (rozmiar, typ)

### ✅ Wykresy Sankey (przepływy finansowe)
- Wizualizacja przepływów między podmiotami
- Filtrowanie według:
  - Podmiotów (nadawca/odbiorca)
  - Zakresu dat
- Dynamiczne generowanie SVG

### ✅ Zarządzanie plikami
- Lista wszystkich uploadowanych plików
- Możliwość usuwania plików
- Informacje o dacie uploadu i rozmiarze

## 🔌 API Endpoints

### `GET /`
Sprawdzenie statusu API
```bash
curl http://localhost:3001
```

### `POST /api/upload`
Upload pliku
```bash
curl -X POST -F "file=@plik.txt" http://localhost:3001/api/upload
```

### `GET /api/files`
Lista uploadowanych plików
```bash
curl http://localhost:3001/api/files
```

### `DELETE /api/files/:filename`
Usunięcie pliku
```bash
curl -X DELETE http://localhost:3001/api/files/nazwa_pliku.txt
```

### `GET /api/entities/:filename`
Pobierz listę podmiotów z pliku CSV
```bash
curl http://localhost:3001/api/entities/plik.csv
```

### `POST /api/flows`
Wygeneruj wykres Sankey
```bash
curl -X POST http://localhost:3001/api/flows \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "plik.csv",
    "entities": ["Firma A", "Firma B"],
    "from": "2024-01-01",
    "to": "2024-12-31"
  }'
```

## 📄 Format pliku CSV dla wykresów Sankey

Plik CSV powinien zawierać następujące kolumny:

```csv
Nadawca,Odbiorca,Kwota,Data,Opis
Firma A,Firma B,15000.50,2024-01-15,Płatność za usługi
Firma B,Firma C,8500.00,2024-01-20,Zakup materiałów
```

**Wymagane kolumny:**
- `Nadawca` - nazwa podmiotu wysyłającego
- `Odbiorca` - nazwa podmiotu odbierającego
- `Kwota` (lub `Amount`, `Value`, `Wartość`) - wartość przepływu

**Opcjonalne kolumny:**
- `Data` - data przepływu (format: YYYY-MM-DD)
- `Opis` - opis transakcji

## 🛠️ Technologie

### Backend
- Node.js
- Express 5
- TypeScript
- Multer (upload plików)
- CORS

### Frontend
- Next.js 15 (Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Axios

### Python
- Python 3.9+
- Standardowe biblioteki (csv, json, datetime)

## 📁 Struktura projektu

```
my-fullstack-app/
├── backend/
│   ├── src/
│   │   └── index.ts         # Główny plik serwera
│   ├── uploads/              # Folder na uploadowane pliki
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── FileUpload.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   └── tsconfig.json
├── python-scripts/
│   ├── process_file.py      # Analiza plików
│   ├── flows.py             # Generowanie wykresów Sankey
│   └── requirements.txt
└── README.md
```

## 🐛 Rozwiązywanie problemów

### Backend nie uruchamia się
```bash
# Upewnij się, że port 3001 nie jest zajęty
lsof -i :3001

# Jeśli jest zajęty, zabij proces
kill -9 <PID>
```

### Frontend nie uruchamia się na porcie 3000
```bash
# Uruchom na innym porcie
PORT=3002 npm run dev
```

### Python nie działa
```bash
# Na macOS użyj python3 zamiast python
python3 --version

# Zainstaluj zależności
pip3 install -r requirements.txt
```

### Problemy z ts-node
```bash
# Uruchom backend bezpośrednio
cd backend
node --loader ts-node/esm src/index.ts
```

## 📝 Notatki deweloperskie

- Backend używa ESM (ES Modules), stąd konieczność użycia `node --loader ts-node/esm`
- Frontend automatycznie wykrywa zajęte porty i używa następnego dostępnego
- Pliki uploadowane są przechowywane w folderze `backend/uploads/`
- Wykresy SVG są generowane w `python-scripts/przeplywy_finansowe.svg`

## ✅ Przetestowane funkcjonalności

- ✅ Upload plików (tekstowych i CSV)
- ✅ Analiza plików przez Python
- ✅ Lista i usuwanie plików
- ✅ Pobieranie podmiotów z CSV
- ✅ Generowanie wykresów Sankey
- ✅ Filtrowanie wykresów według podmiotów i dat
- ✅ Responsywny interfejs użytkownika

## 📦 Wersje

- Node.js: v14+
- Python: 3.9+
- Next.js: 15.5.4
- React: 19.1.0
- Express: 5.1.0

---

**Autor:** Aplikacja fullstack  
**Data:** Październik 2025  
**Status:** ✅ W pełni funkcjonalna

