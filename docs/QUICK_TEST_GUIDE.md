# ⚡ Szybki Przewodnik Testowania

## 🚀 Uruchomienie Testów (5 sekund)

### Wszystkie testy na raz:
```bash
./run_tests.sh
```

**Oczekiwany wynik:**
```
✅ Python Tests: PASSED (10 testów)
✅ Backend Tests: PASSED (38 testów)  
✅ Frontend Tests: PASSED (51 testów)
🎉 Wszystkie testy przeszły pomyślnie! (99/99)
```

---

## 🔍 Pełna Diagnostyka (10 sekund)

```bash
./run_diagnostics.sh
```

**Co sprawdza:**
- ✅ Środowisko (Node, Python, npm)
- ✅ Zależności (node_modules)
- ✅ Wszystkie 99 testów
- ✅ Struktura plików
- ✅ Porty i procesy
- ✅ Connectivity (jeśli app działa)

---

## 📊 Testy Poszczególnych Części

### Python (2 sekundy):
```bash
cd python-scripts && python3 test_flows.py
```

### Backend (1 sekunda):
```bash
cd backend && npm test
```

### Frontend (1 sekunda):
```bash
cd frontend && npm test
```

---

## ✅ Szybka Weryfikacja

### Sprawdź czy wszystko działa:

```bash
# 1. Testy przechodzą?
./run_tests.sh

# 2. Aplikacja uruchamia się?
cd backend && npm run dev &
cd frontend && npm run dev &

# 3. Frontend odpowiada?
curl http://localhost:3000

# 4. Backend odpowiada?
curl http://localhost:3001/api/files
```

---

## 🐛 Szybkie Rozwiązywanie Problemów

### ❌ Testy nie przechodzą?

```bash
# Przeinstaluj zależności
cd backend && npm install
cd frontend && npm install
cd python-scripts && pip3 install -r requirements.txt
```

### ❌ Backend nie startuje?

```bash
# Sprawdź czy tsx jest zainstalowane
cd backend && npm list tsx

# Jeśli brak, zainstaluj
npm install --save-dev tsx
```

### ❌ Frontend nie startuje?

```bash
# Sprawdź port
lsof -i :3000

# Zabij proces jeśli zajęty
kill -9 <PID>
```

---

## 📈 Interpretacja Wyników

### ✅ Wszystko OK:
```
Tests: 99 passed, 99 total
🎉 Wszystkie testy przeszły pomyślnie!
```

### ⚠️ Niektóre failed:
```
Tests: 95 passed, 4 failed, 99 total
⚠️ Niektóre testy nie przeszły
```
**Akcja:** Przeczytaj szczegóły błędów wyżej w output

### ❌ Wszystkie failed:
```
Tests: 0 passed, 99 failed, 99 total
```
**Akcja:** Sprawdź zależności i środowisko

---

## 🎯 Co Testuje Każda Część?

### Python (10 testów):
- Parsowanie CSV
- Filtrowanie danych
- Agregacja przepływów
- Generowanie SVG

### Backend (38 testów):
- API endpoints
- Obsługa plików
- Integracja Python
- Bezpieczeństwo
- Performance

### Frontend (51 testów):
- Komponenty UI
- Walidacje
- Formatowanie
- Obsługa błędów
- Kompatybilność

---

## 💡 Pro Tips

1. **Uruchamiaj testy przed każdym commitem**
   ```bash
   ./run_tests.sh && git commit -m "..."
   ```

2. **Używaj watch mode podczas developmentu**
   ```bash
   cd backend && npm run test:watch
   cd frontend && npm run test -- --watch
   ```

3. **Sprawdzaj coverage**
   ```bash
   cd backend && npm run test:coverage
   ```

4. **Diagnostyka gdy coś nie działa**
   ```bash
   ./run_diagnostics.sh > diagnostic_report.txt
   ```

---

## ⏱️ Czasy Wykonania

| Komenda | Czas | Co robi |
|---------|------|---------|
| `./run_tests.sh` | ~3s | Wszystkie testy |
| `./run_diagnostics.sh` | ~8s | Testy + diagnostyka |
| `python3 test_flows.py` | ~0.01s | Tylko Python |
| `npm test` (backend) | ~1s | Tylko backend |
| `npm test` (frontend) | ~0.5s | Tylko frontend |

---

## 🎉 Wszystko Działa?

Jeśli:
- ✅ `./run_tests.sh` pokazuje 99/99 passed
- ✅ Backend startuje bez błędów
- ✅ Frontend startuje bez błędów
- ✅ Możesz otworzyć http://localhost:3000



