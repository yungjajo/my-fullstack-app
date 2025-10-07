# 📊 Aplikacja do Wizualizacji Przepływów Finansowych

Kompleksowa aplikacja fullstack do przesyłania, analizowania i wizualizacji przepływów finansowych za pomocą wykresów Sankey.

## 🎯 Opis

Aplikacja umożliwia:
- ✅ Wgrywanie plików CSV z danymi transakcji finansowych
- ✅ Automatyczne generowanie interaktywnych wykresów Sankey
- ✅ Filtrowanie przepływów według podmiotów i zakresów dat
- ✅ Zarządzanie dokumentami finansowymi (dodawanie, usuwanie, przeglądanie szczegółów)
- ✅ Wyświetlanie statystyk i podsumowań

## 🖥️ Kompatybilność

✅ **macOS** - w pełni wspierane  
✅ **Windows** - w pełni wspierane (automatyczna detekcja systemu)  
✅ **Linux** - w pełni wspierane

Aplikacja automatycznie wykrywa system operacyjny i dostosowuje komendy (np. `python` vs `python3`).

---

## 🚀 Szybki Start - Instrukcja Krok po Kroku

### Wymagania Wstępne

Przed rozpoczęciem upewnij się, że masz zainstalowane:

1. **Node.js** (v18 lub nowszy)
   - Sprawdź: `node --version`
   - Pobierz z: https://nodejs.org

2. **Python 3** (v3.9 lub nowszy)
   - Sprawdź: `python3 --version` (Mac/Linux) lub `python --version` (Windows)
   - Pobierz z: https://www.python.org

3. **Git** (opcjonalnie, jeśli klonujesz repozytorium)
   - Sprawdź: `git --version`

---

### KROK 1: Pobranie i Przygotowanie Projektu

#### Jeśli klonujesz repozytorium:
```bash
git clone <URL_REPOZYTORIUM>
cd my-fullstack-app
```

#### Jeśli masz pobrany folder:
```bash
cd ścieżka/do/my-fullstack-app
```

---

### KROK 2: Instalacja Zależności

**Na macOS/Linux:**

```bash
# Instalacja zależności backendu
cd backend
npm install

# Instalacja zależności frontendu
cd ../frontend
npm install

# Instalacja zależności Python
cd ../python-scripts
pip3 install -r requirements.txt

# Powrót do głównego folderu
cd ..
```

**Na Windows:**

```cmd
# Instalacja zależności backendu
cd backend
npm install

# Instalacja zależności frontendu
cd ..\frontend
npm install

# Instalacja zależności Python
cd ..\python-scripts
pip install -r requirements.txt

# Powrót do głównego folderu
cd ..
```

> **Uwaga dla Windows:** Jeśli `pip` nie działa, spróbuj `python -m pip install -r requirements.txt`

---

### KROK 3: Uruchomienie Aplikacji

Potrzebujesz **dwóch osobnych terminali** (lub dwóch zakładek w terminalu).

#### **Terminal 1 - Backend (Port 3001)**

**macOS/Linux:**
```bash
cd backend
npm run dev
```

**Windows:**
```cmd
cd backend
npm run dev
```

Poczekaj, aż zobaczysz komunikat:
```
🚀 Backend server running on http://localhost:3001
```

#### **Terminal 2 - Frontend (Port 3000)**

**macOS/Linux:**
```bash
cd frontend
npm run dev
```

**Windows:**
```cmd
cd frontend
npm run dev
```

Poczekaj, aż zobaczysz komunikat:
```
▲ Next.js 15.5.4 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in XXXms
```

---

### KROK 4: Otwórz Aplikację w Przeglądarce

Otwórz przeglądarkę i wejdź na:

```
http://localhost:3000
```

Aplikacja jest gotowa do użycia! 🎉

---

## 📖 Jak Korzystać z Aplikacji

### 1️⃣ Dodawanie Dokumentów

1. Przejdź do zakładki **"Rejestr Dokumentów Finansowych"**
2. Kliknij **"Wybierz plik"** i wybierz plik CSV
3. Kliknij **"Wyślij"**
4. Plik zostanie automatycznie przetworzony

### 2️⃣ Generowanie Diagramu Przepływów

1. Przejdź do zakładki **"Diagram Przepływów"**
2. (Opcjonalnie) Ustaw zakres dat "Od" i "Do"
3. (Opcjonalnie) Wybierz konkretne podmioty do wizualizacji
4. Kliknij **"Wygeneruj Diagram"**
5. Wykres Sankey zostanie wyświetlony poniżej wraz z podsumowaniem

### 3️⃣ Zarządzanie Dokumentami

W zakładce **"Rejestr Dokumentów Finansowych"**:
- **Przycisk "i"** - wyświetla szczegóły pliku (data dodania, liczba wpisów, firm, transakcji)
- **Przycisk kosza** - usuwa dokument (wymaga potwierdzenia)

---

## 📄 Format Pliku CSV

Aby aplikacja mogła poprawnie przetworzyć plik CSV, musi on zawierać odpowiednie kolumny:

### Wymagana Struktura:

```csv
Nadawca,Odbiorca,Kwota,Data,Opis
Firma A,Firma B,15000.50,2024-01-15,Płatność za usługi
Firma B,Firma C,8500.00,2024-01-20,Zakup materiałów
Firma C,Firma A,12000.00,2024-02-01,Zwrot zaliczki
```

### Wymagane Kolumny:

| Kolumna | Opis | Przykład |
|---------|------|----------|
| `Nadawca` | Nazwa podmiotu wysyłającego | `Firma A` |
| `Odbiorca` | Nazwa podmiotu odbierającego | `Firma B` |
| `Kwota` | Wartość przepływu (liczba) | `15000.50` |

### Opcjonalne Kolumny:

| Kolumna | Opis | Format | Przykład |
|---------|------|--------|----------|
| `Data` | Data transakcji | `YYYY-MM-DD` | `2024-01-15` |
| `Opis` | Opis transakcji | tekst | `Płatność za usługi` |

> **Uwaga:** Nazwy kolumn mogą być w różnych językach, ale muszą zawierać słowa kluczowe jak "Nadawca", "Sender", "Odbiorca", "Receiver", itp.

---

## 📁 Przykładowe Dane

W folderze `przyklady_csv/` znajdziesz 10 przykładowych plików CSV do przetestowania aplikacji:

```bash
przyklady_csv/
├── 01_lancuch_dostaw.csv          # Łańcuch dostaw w produkcji
├── 02_ekosystem_startupowy.csv    # Finansowanie startupów
├── 03_platforma_ecommerce.csv     # E-commerce
├── 04_agencja_kreatywna.csv       # Agencja reklamowa
├── 05_sektor_energetyczny.csv     # Handel energią
├── 06_ekosystem_edukacyjny.csv    # Edukacja i szkolenia
├── 07_eksport_import.csv          # Handel międzynarodowy
├── 08_siec_franczyzowa.csv        # Franczyzy gastronomiczne
├── 09_fundusz_inwestycyjny.csv    # Fundusze VC
└── 10_platforma_streamingowa.csv  # Streaming muzyczny
```

Możesz wgrać te pliki przez interfejs aplikacji, aby zobaczyć różne typy przepływów finansowych!

---

## 🏗️ Architektura Aplikacji

```
┌─────────────────────────────────────────────────┐
│           Przeglądarka (localhost:3000)          │
│              Frontend - Next.js 15               │
│         React 19 + TypeScript + Tailwind         │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST API
                     │ Axios
┌────────────────────▼────────────────────────────┐
│         Backend API (localhost:3001)            │
│         Express 5 + TypeScript (ESM)            │
│    Multer (upload) + CORS + File Management    │
└────────────────────┬────────────────────────────┘
                     │ Child Process
                     │ exec()
┌────────────────────▼────────────────────────────┐
│              Python Scripts                     │
│     process_file.py + flows.py (Sankey)        │
│    CSV parsing + matplotlib + networkx         │
└─────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

Backend udostępnia następujące endpointy REST:

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/` | Status API |
| `POST` | `/api/upload` | Upload pliku CSV |
| `GET` | `/api/files` | Lista wszystkich plików |
| `DELETE` | `/api/files/:filename` | Usuń plik |
| `GET` | `/api/entities/:filename` | Pobierz listę podmiotów z pliku |
| `POST` | `/api/flows` | Wygeneruj wykres Sankey |

### Przykłady Wywołań API:

#### Upload pliku:
```bash
curl -X POST -F "file=@dane.csv" http://localhost:3001/api/upload
```

#### Lista plików:
```bash
curl http://localhost:3001/api/files
```

#### Generowanie wykresu:
```bash
curl -X POST http://localhost:3001/api/flows \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "dane.csv",
    "entities": ["Firma A", "Firma B"],
    "from": "2024-01-01",
    "to": "2024-12-31"
  }'
```

---

## 🛠️ Technologie

### Backend
- **Node.js** v18+
- **Express** 5.1.0
- **TypeScript** 5.9+
- **Multer** 2.0+ (upload plików)
- **CORS** (Cross-Origin Resource Sharing)

### Frontend
- **Next.js** 15.5.4 (z Turbopack)
- **React** 19.1.0
- **TypeScript** 5+
- **Tailwind CSS** 4
- **Axios** 1.12+ (HTTP client)

### Python
- **Python** 3.9+
- Standardowe biblioteki (csv, json, datetime, pathlib)

---

## 🐛 Rozwiązywanie Problemów

### ❌ Backend nie uruchamia się

**Problem:** Port 3001 jest zajęty

**Rozwiązanie (macOS/Linux):**
```bash
# Znajdź proces
lsof -i :3001

# Zabij proces
kill -9 <PID>
```

**Rozwiązanie (Windows):**
```cmd
# Znajdź proces
netstat -ano | findstr :3001

# Zabij proces
taskkill /PID <PID> /F
```

---

### ❌ Frontend nie może połączyć się z backendem

**Problem:** CORS error lub `Network Error`

**Rozwiązanie:**
1. Upewnij się, że backend działa na porcie 3001
2. Sprawdź w `frontend/app/components/FileUpload.tsx` czy `API_URL` to `http://localhost:3001`
3. Zrestartuj oba serwery

---

### ❌ Python script nie działa

**Problem (macOS/Linux):** `python3: command not found`

**Rozwiązanie:**
```bash
# Sprawdź wersję
python3 --version

# Jeśli nie ma, zainstaluj Python 3
brew install python3  # macOS
sudo apt install python3  # Linux
```

**Problem (Windows):** `python: command not found`

**Rozwiązanie:**
1. Sprawdź czy Python jest w PATH: `python --version`
2. Jeśli nie, dodaj Python do zmiennej PATH
3. Lub użyj pełnej ścieżki do `python.exe`

---

### ❌ Błąd przy instalacji zależności Python

**Problem:** `pip: command not found`

**Rozwiązanie (macOS/Linux):**
```bash
python3 -m pip install -r requirements.txt
```

**Rozwiązanie (Windows):**
```cmd
python -m pip install -r requirements.txt
```

---

### ❌ TypeScript errors w backendie

**Problem:** `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"`

**Rozwiązanie:**
```bash
cd backend
# Usuń node_modules i zainstaluj ponownie
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### ❌ Frontend pokazuje "Brak dokumentów do przetwarzania"

**Problem:** Brak uploadowanych plików

**Rozwiązanie:**
1. Przejdź do zakładki "Rejestr Dokumentów Finansowych"
2. Wgraj przykładowy plik CSV z folderu `przyklady_csv/`
3. Wróć do zakładki "Diagram Przepływów"

---

## 📂 Struktura Projektu

```
my-fullstack-app/
├── backend/
│   ├── src/
│   │   └── index.ts              # Główny plik backendu
│   ├── uploads/                  # Folder na wgrane pliki
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── FileUpload.tsx    # Główny komponent UI
│   │   ├── page.tsx              # Strona główna
│   │   ├── layout.tsx            # Layout aplikacji
│   │   └── globals.css           # Style globalne
│   ├── package.json
│   └── tsconfig.json
│
├── python-scripts/
│   ├── process_file.py           # Analiza plików
│   ├── flows.py                  # Generowanie wykresów Sankey
│   ├── flows_standalone.py       # Standalone wersja skryptu
│   ├── requirements.txt          # Zależności Python
│   └── flows_params.json         # Parametry (generowany)
│
├── przyklady_csv/                # 10 przykładowych plików CSV
│   ├── 01_lancuch_dostaw.csv
│   ├── 02_ekosystem_startupowy.csv
│   └── ... (8 więcej)
│
├── docs/                         # Dokumentacja
│   ├── START_TUTAJ.md
│   └── ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md
│
└── README.md                     # Ten plik
```

---

## 📝 Dodatkowe Informacje

### Bezpieczeństwo
- Limit rozmiaru pliku: **10 MB**
- Pliki przechowywane lokalnie w folderze `backend/uploads/`
- Walidacja formatu CSV przed przetworzeniem

### Wydajność
- Backend: ESM modules dla lepszej wydajności
- Frontend: Turbopack dla szybszego bundlingu
- Python: Efektywne parsowanie CSV z wykorzystaniem natywnych bibliotek

### Dostosowanie
Możesz zmienić porty w zmiennych środowiskowych:

**Backend (`.env` w folderze `backend/`):**
```env
PORT=3001
UPLOAD_DIR=./uploads
```

**Frontend:**
```bash
PORT=3000 npm run dev
```

---

## 📚 Dokumentacja Szczegółowa

Dodatkowe dokumenty znajdują się w folderze `docs/`:

- **[START_TUTAJ.md](docs/START_TUTAJ.md)** - Szybki przewodnik po projekcie
- **[ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md](docs/ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md)** - Zgodność z wymaganiami konkursu

---

## ✅ Status i Testowanie

### Przetestowane Funkcjonalności:
- ✅ Upload plików CSV
- ✅ Parsowanie danych finansowych
- ✅ Generowanie wykresów Sankey
- ✅ Filtrowanie według podmiotów
- ✅ Filtrowanie według zakresu dat
- ✅ Usuwanie dokumentów
- ✅ Wyświetlanie szczegółów plików
- ✅ Responsywny interfejs użytkownika
- ✅ Kompatybilność Windows/Mac/Linux

### Systemy Operacyjne:
- ✅ macOS (Sonoma, Sequoia)
- ✅ Windows 10/11
- ✅ Linux (Ubuntu, Debian)

---

## 🤝 Wsparcie

W przypadku problemów:
1. Sprawdź sekcję [Rozwiązywanie Problemów](#-rozwiązywanie-problemów)
2. Upewnij się, że wszystkie wymagania są spełnione
3. Sprawdź logi w terminalach backendu i frontendu

---

## 🧪 Testy

Aplikacja zawiera kompletny zestaw testów jednostkowych dla wszystkich komponentów!

### Uruchamianie Testów

#### **Python Tests** (10 testów)
```bash
cd python-scripts
python3 test_flows.py
```

**Co testujemy:**
- ✅ Parsowanie plików CSV
- ✅ Filtrowanie według podmiotów
- ✅ Filtrowanie według dat
- ✅ Agregację przepływów
- ✅ Generowanie SVG
- ✅ Obsługę błędów

#### **Backend Tests** (13 testów)
```bash
cd backend
npm test
```

**Co testujemy:**
- ✅ Wszystkie endpointy API
- ✅ Upload i listowanie plików
- ✅ Pobieranie podmiotów z CSV
- ✅ Walidację danych
- ✅ Obsługę błędów HTTP

#### **Frontend Tests** (12 testów)
```bash
cd frontend
npm test
```

**Co testujemy:**
- ✅ Konfigurację API URL
- ✅ Struktury danych
- ✅ Helpery i formatowanie
- ✅ Walidacje
- ✅ Zarządzanie stanem

### Uruchomienie Wszystkich Testów

**Opcja 1: Ręcznie (każdy moduł osobno)**
```bash
# Python
cd python-scripts && python3 test_flows.py

# Backend
cd ../backend && npm test

# Frontend
cd ../frontend && npm test
```

**Opcja 2: Skrypt zbiorczy (utwórz plik `run_tests.sh`)**
```bash
#!/bin/bash
echo "🧪 Uruchamianie wszystkich testów..."

echo "\n📊 Python Tests..."
cd python-scripts && python3 test_flows.py
PYTHON_EXIT=$?

echo "\n🔧 Backend Tests..."
cd ../backend && npm test
BACKEND_EXIT=$?

echo "\n🎨 Frontend Tests..."
cd ../frontend && npm test
FRONTEND_EXIT=$?

echo "\n📋 Podsumowanie:"
echo "Python: $PYTHON_EXIT"
echo "Backend: $BACKEND_EXIT"
echo "Frontend: $FRONTEND_EXIT"

if [ $PYTHON_EXIT -eq 0 ] && [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
    echo "\n✅ Wszystkie testy przeszły pomyślnie!"
    exit 0
else
    echo "\n❌ Niektóre testy nie przeszły"
    exit 1
fi
```

### Coverage (Pokrycie Kodem)

**Backend:**
```bash
cd backend
npm run test:coverage
```

**Frontend:**
```bash
cd frontend
npm run test:coverage
```

### Watch Mode (Automatyczne Testy)

**Backend:**
```bash
cd backend
npm run test:watch
```

**Frontend:**
```bash
cd frontend
npm run test:watch
```

### Statystyki Testów

| Moduł | Testy | Status | Pokrycie |
|-------|-------|--------|----------|
| **Python** | 10 | ✅ PASS | ~80% |
| **Backend** | 13 | ✅ PASS | ~70% |
| **Frontend** | 12 | ✅ PASS | ~60% |
| **RAZEM** | **35** | ✅ **PASS** | ~70% |

---
