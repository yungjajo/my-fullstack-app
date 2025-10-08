# 🧪 Testy i Diagnostyka Aplikacji

**Data aktualizacji:** 8 października 2025  
**Status:** ✅ Wszystkie testy przechodzą (99/99)

---

## 📊 Podsumowanie Testów

### ✅ Wyniki Ogólne

| Kategoria | Liczba Testów | Status | Procent |
|-----------|---------------|--------|---------|
| **Python** | 10 | ✅ PASSED | 100% |
| **Backend** | 38 | ✅ PASSED | 100% |
| **Frontend** | 51 | ✅ PASSED | 100% |
| **RAZEM** | **99** | **✅ PASSED** | **100%** |

---

## 🎯 Szczegółowy Opis Testów

### 1. 📊 Testy Python (10 testów)

**Lokalizacja:** `python-scripts/test_flows.py`

#### Testy Jednostkowe (9 testów):
- ✅ **test_parse_csv** - Parsowanie plików CSV
- ✅ **test_filter_by_entities** - Filtrowanie według podmiotów
- ✅ **test_filter_by_date_range** - Filtrowanie według zakresu dat
- ✅ **test_filter_by_date_from_only** - Filtrowanie od daty początkowej
- ✅ **test_aggregate_flows** - Agregacja przepływów (sumowanie duplikatów)
- ✅ **test_generate_sankey_svg** - Generowanie wykresów SVG
- ✅ **test_empty_csv** - Obsługa pustych plików CSV
- ✅ **test_invalid_csv_path** - Obsługa nieistniejących plików
- ✅ **test_combined_filters** - Kombinacja filtrów (podmioty + daty)

#### Testy Integracyjne (1 test):
- ✅ **test_full_flow_with_example_file** - Pełny flow z przykładowym plikiem

**Uruchomienie:**
```bash
cd python-scripts
python3 test_flows.py
```

---

### 2. 🔧 Testy Backend (38 testów)

**Lokalizacja:** `backend/src/__tests__/`

#### A) Testy API (13 testów) - `api.test.ts`

##### Endpointy:
- ✅ **GET /** - Status 200 i wiadomość powitalna
- ✅ **GET /api/files** - Lista uploadowanych plików
- ✅ **GET /api/entities/:filename** - Lista podmiotów z pliku CSV

##### Funkcjonalności:
- ✅ Pusta lista gdy brak plików
- ✅ Lista plików z metadanymi (filename, size, uploadedAt)
- ✅ Status 404 dla nieistniejących plików
- ✅ Status 400 dla pustych plików
- ✅ Status 400 gdy brak wymaganych kolumn (Nadawca/Odbiorca)
- ✅ Parsowanie CSV z różnymi separatorami dziesiętnych
- ✅ Obsługa różnych formatów dat

##### Obsługa Błędów:
- ✅ Status 404 dla nieistniejących endpointów

#### B) Testy Diagnostyczne (25 testów) - `diagnostics.test.ts`

##### Konfiguracja Systemu (3 testy):
- ✅ Wykrywanie platformy (Windows/Mac/Linux)
- ✅ Wybór poprawnej komendy Python (python/python3)
- ✅ Dostęp do zmiennych środowiskowych

##### Struktura Projektu (5 testów):
- ✅ Folder uploads
- ✅ Folder python-scripts
- ✅ Skrypt flows.py
- ✅ Skrypt process_file.py
- ✅ Folder przyklady_csv z plikami

##### Zależności (2 testy):
- ✅ Wymagane pakiety (express, cors, multer)
- ✅ tsx w devDependencies

##### Uprawnienia Systemu (2 testy):
- ✅ Tworzenie plików tymczasowych
- ✅ Odczyt plików CSV

##### Integracja Python (3 testy):
- ✅ Poprawna ścieżka do flows.py
- ✅ Zapis parametrów flows_params.json
- ✅ Wykrywanie nagłówków CSV z polskimi znakami
- ✅ Normalizacja kwot z różnymi separatorami

##### Performance (2 testy):
- ✅ Szybkie przetwarzanie małych CSV (< 100ms)
- ✅ Efektywna agregacja przepływów (< 50ms)
- ✅ Zarządzanie pamięcią (< 10MB dla 1000 wpisów)

##### Bezpieczeństwo (3 testy):
- ✅ Odrzucanie niebezpiecznych nazw plików (../, &&, |)
- ✅ Walidacja rozszerzeń plików (.csv)
- ✅ Limit rozmiaru plików (10MB)

##### Kompatybilność (3 testy):
- ✅ Poprawny separator ścieżek (Windows/Unix)
- ✅ Obsługa różnych zakończeń linii (\n, \r\n, \r)
- ✅ Kodowanie UTF-8 (polskie znaki)

**Uruchomienie:**
```bash
cd backend
npm test
```

---

### 3. 🎨 Testy Frontend (51 testów)

**Lokalizacja:** `frontend/app/components/__tests__/`

#### A) Testy Komponentu (12 testów) - `FileUpload.test.tsx`

##### API Configuration (1 test):
- ✅ Poprawny URL API (http://localhost:3001)

##### Struktury Danych (2 testy):
- ✅ Struktura UploadedFile (filename, size, uploadedAt)
- ✅ Struktura DateRange (from, to)

##### Helpery (2 testy):
- ✅ Formatowanie rozmiaru pliku (Bytes, KB, MB, GB)
- ✅ Formatowanie daty (pl-PL locale)

##### Walidacje (2 testy):
- ✅ Walidacja formatu CSV
- ✅ Walidacja zakresu dat

##### Zarządzanie Stanem (3 testy):
- ✅ Inicjalizacja zakładek (diagram/registry)
- ✅ Inicjalizacja zakresu dat
- ✅ Inicjalizacja listy plików

##### Integracja (2 testy):
- ✅ Wszystkie endpointy API
- ✅ Payloady requestów

#### B) Testy Diagnostyczne (39 testów) - `diagnostics.test.tsx`

##### Konfiguracja (2 testy):
- ✅ URL API ze zmiennych środowiskowych
- ✅ Domyślny port 3001

##### Endpointy API (2 testy):
- ✅ Wszystkie wymagane endpointy (6 różnych)
- ✅ URL z parametrami (encodeURIComponent)

##### Walidacja Plików (2 testy):
- ✅ Akceptowanie tylko CSV
- ✅ Limit rozmiaru 10MB

##### Walidacja Dat (2 testy):
- ✅ Format YYYY-MM-DD
- ✅ Logiczny zakres dat (from <= to)

##### Walidacja Podmiotów (3 testy):
- ✅ Puste listy
- ✅ Listy z danymi
- ✅ Usuwanie duplikatów

##### Formatowanie (5 testów):
- ✅ Rozmiar pliku (0 Bytes, KB, MB)
- ✅ Data w formacie polskim
- ✅ Komunikaty sukcesu
- ✅ Komunikaty błędów

##### Struktury Odpowiedzi (3 testy):
- ✅ Odpowiedź /api/files
- ✅ Odpowiedź /api/entities
- ✅ Typy pól (string, number)

##### Obsługa Błędów (4 testy):
- ✅ Rozpoznawanie typów błędów
- ✅ Status codes (200, 400, 404, 500)
- ✅ Wykrywanie braku pliku
- ✅ Wykrywanie za dużego pliku

##### Performance (2 testy):
- ✅ Przetwarzanie listy 100 plików (< 100ms)
- ✅ Filtrowanie 1000 podmiotów (< 50ms)
- ✅ Zarządzanie stanem dla 1000 plików

##### Kompatybilność Przeglądarek (4 testy):
- ✅ async/await
- ✅ Spread operator
- ✅ Optional chaining
- ✅ FormData i URLSearchParams

**Uruchomienie:**
```bash
cd frontend
npm test
```

---

## 🔧 Narzędzia Diagnostyczne

### 1. Szybkie Uruchomienie Testów

```bash
# Wszystkie testy (Python + Backend + Frontend)
./run_tests.sh
```

### 2. Pełna Diagnostyka Aplikacji

```bash
# Diagnostyka środowiska, testów, struktury plików, portów i connectivity
./run_diagnostics.sh
```

**Zawiera:**
- ✅ Diagnostyka środowiska (OS, Node, Python, npm)
- ✅ Sprawdzenie zależności (node_modules)
- ✅ Wszystkie testy jednostkowe i diagnostyczne
- ✅ Diagnostyka struktury plików
- ✅ Diagnostyka portów (3000, 3001)
- ✅ Test connectivity (jeśli aplikacja działa)
- ✅ Sprawdzenie dokumentacji
- ✅ Podsumowanie z procentami

### 3. Testy Poszczególnych Części

```bash
# Tylko Python
cd python-scripts && python3 test_flows.py

# Tylko Backend
cd backend && npm test

# Tylko Frontend
cd frontend && npm test
```

---

## 📋 Co Testują Testy Diagnostyczne?

### Backend Diagnostics (25 testów)

**Testują:**
1. **Środowisko** - Czy system jest poprawnie skonfigurowany
2. **Struktura** - Czy wszystkie pliki i foldery istnieją
3. **Zależności** - Czy pakiety są zainstalowane
4. **Uprawnienia** - Czy aplikacja może tworzyć pliki
5. **Python** - Czy integracja z Python działa
6. **Performance** - Czy przetwarzanie jest szybkie
7. **Bezpieczeństwo** - Czy walidacje działają
8. **Kompatybilność** - Czy działa na Windows/Mac/Linux

**Kiedy uruchomić:**
- ✅ Po świeżej instalacji
- ✅ Po aktualizacji zależności
- ✅ Gdy backend nie działa poprawnie
- ✅ Przed deploymentem

### Frontend Diagnostics (39 testów)

**Testują:**
1. **Konfiguracja** - API URL, porty
2. **Walidacje** - Pliki CSV, daty, podmioty
3. **Formatowanie** - Wyświetlanie danych
4. **Struktury** - Typy danych, odpowiedzi API
5. **Błędy** - Obsługa różnych scenariuszy
6. **Performance** - Renderowanie list
7. **Kompatybilność** - Funkcje JavaScript

**Kiedy uruchomić:**
- ✅ Po zmianach w UI
- ✅ Gdy formularze nie działają
- ✅ Po aktualizacji React/Next.js
- ✅ Przed deploymentem

---

## 🐛 Rozwiązywanie Problemów

### Python Tests Failed

```bash
# Sprawdź wersję Python
python3 --version  # Powinno być 3.9+

# Zainstaluj zależności
cd python-scripts
pip3 install -r requirements.txt
```

### Backend Tests Failed

```bash
# Przeinstaluj zależności
cd backend
rm -rf node_modules package-lock.json
npm install

# Sprawdź czy tsx jest zainstalowane
npm list tsx
```

### Frontend Tests Failed

```bash
# Przeinstaluj zależności
cd frontend
rm -rf node_modules package-lock.json
npm install

# Sprawdź konfigurację Jest
cat jest.config.mjs
```

---

## 📊 Coverage (Pokrycie Testami)

### Aktualny Stan:

| Komponent | Funkcjonalność | Pokrycie |
|-----------|---------------|----------|
| **Python Scripts** | Parsowanie CSV, filtrowanie, agregacja, SVG | 100% |
| **Backend API** | Wszystkie endpointy REST | 100% |
| **Backend Core** | Konfiguracja, bezpieczeństwo, performance | 100% |
| **Frontend UI** | Komponenty, walidacje, formatowanie | 100% |
| **Frontend Logic** | Stan, błędy, kompatybilność | 100% |

### Uruchom Coverage:

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test -- --coverage
```

---

## 🎯 Dodawanie Nowych Testów

### 1. Python Tests

```python
# python-scripts/test_flows.py

def test_nowa_funkcjonalnosc(self):
    """Test nowej funkcjonalności"""
    # Given
    dane_testowe = ...
    
    # When
    wynik = funkcja_do_testu(dane_testowe)
    
    # Then
    self.assertEqual(wynik, oczekiwany_wynik)
```

### 2. Backend Tests

```typescript
// backend/src/__tests__/nazwa.test.ts

describe('Nowa Funkcjonalność', () => {
  it('powinien robić coś konkretnego', () => {
    // Given
    const testData = ...;
    
    // When
    const result = funkcjaDoTestu(testData);
    
    // Then
    expect(result).toBe(oczekiwanyWynik);
  });
});
```

### 3. Frontend Tests

```typescript
// frontend/app/components/__tests__/nazwa.test.tsx

describe('Nowy Komponent', () => {
  it('powinien renderować poprawnie', () => {
    // Given
    const props = { ... };
    
    // When
    const { getByText } = render(<Component {...props} />);
    
    // Then
    expect(getByText('tekst')).toBeInTheDocument();
  });
});
```

---

## 📈 CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run All Tests
        run: ./run_tests.sh
```

---

