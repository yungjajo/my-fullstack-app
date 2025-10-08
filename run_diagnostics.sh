#!/bin/bash
# Skrypt diagnostyczny aplikacji - pełna weryfikacja
# Uruchamia wszystkie testy + dodatkowe testy diagnostyczne

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 DIAGNOSTYKA APLIKACJI - Pełna Weryfikacja"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
date
echo ""

# Kolory dla outputu
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania sekcji
print_section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Funkcja do sprawdzania statusu
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Liczniki
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# =============================================================================
# 1. DIAGNOSTYKA ŚRODOWISKA
# =============================================================================
print_section "🔧 1. DIAGNOSTYKA ŚRODOWISKA"

echo "System operacyjny:"
uname -a
echo ""

echo "Node.js version:"
node --version || echo "Node.js nie jest zainstalowany!"
echo ""

echo "Python version:"
python3 --version || python --version || echo "Python nie jest zainstalowany!"
echo ""

echo "npm version:"
npm --version || echo "npm nie jest zainstalowany!"
echo ""

echo "Struktura projektu:"
ls -la
echo ""

# =============================================================================
# 2. SPRAWDZENIE ZALEŻNOŚCI
# =============================================================================
print_section "📦 2. SPRAWDZENIE ZALEŻNOŚCI"

echo "Backend dependencies:"
cd backend
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Backend node_modules istnieją${NC}"
else
    echo -e "${RED}❌ Backend node_modules NIE istnieją - uruchom: npm install${NC}"
fi
cd ..

echo ""
echo "Frontend dependencies:"
cd frontend
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Frontend node_modules istnieją${NC}"
else
    echo -e "${RED}❌ Frontend node_modules NIE istnieją - uruchom: npm install${NC}"
fi
cd ..

echo ""
echo "Python dependencies:"
cd python-scripts
if python3 -c "import csv" 2>/dev/null; then
    echo -e "${GREEN}✅ Python standardowe biblioteki dostępne${NC}"
else
    echo -e "${RED}❌ Problem z Python${NC}"
fi
cd ..

# =============================================================================
# 3. TESTY PYTHON
# =============================================================================
print_section "📊 3. TESTY PYTHON"

cd python-scripts
echo "Uruchamianie testów Python..."
if python3 test_flows.py 2>&1; then
    PYTHON_EXIT=0
    echo -e "${GREEN}✅ Python Tests PASSED${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 10))
else
    PYTHON_EXIT=1
    echo -e "${RED}❌ Python Tests FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 10))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 10))
cd ..

# =============================================================================
# 4. TESTY BACKEND
# =============================================================================
print_section "🔧 4. TESTY BACKEND (Unit + Diagnostics)"

cd backend
echo "Uruchamianie testów backendu..."
if npm test 2>&1; then
    BACKEND_EXIT=0
    echo -e "${GREEN}✅ Backend Tests PASSED${NC}"
    # Policz testy (13 unit + nowe diagnostyczne)
    BACKEND_COUNT=$(npm test 2>&1 | grep -o "Tests:.*passed" | grep -o "[0-9]*" | head -1 || echo "13")
    PASSED_TESTS=$((PASSED_TESTS + BACKEND_COUNT))
    TOTAL_TESTS=$((TOTAL_TESTS + BACKEND_COUNT))
else
    BACKEND_EXIT=1
    echo -e "${RED}❌ Backend Tests FAILED${NC}"
    BACKEND_COUNT=13
    FAILED_TESTS=$((FAILED_TESTS + BACKEND_COUNT))
    TOTAL_TESTS=$((TOTAL_TESTS + BACKEND_COUNT))
fi
cd ..

# =============================================================================
# 5. TESTY FRONTEND
# =============================================================================
print_section "🎨 5. TESTY FRONTEND (Unit + Diagnostics)"

cd frontend
echo "Uruchamianie testów frontendu..."
if npm test 2>&1; then
    FRONTEND_EXIT=0
    echo -e "${GREEN}✅ Frontend Tests PASSED${NC}"
    # Policz testy (12 unit + nowe diagnostyczne)
    FRONTEND_COUNT=$(npm test 2>&1 | grep -o "Tests:.*passed" | grep -o "[0-9]*" | head -1 || echo "12")
    PASSED_TESTS=$((PASSED_TESTS + FRONTEND_COUNT))
    TOTAL_TESTS=$((TOTAL_TESTS + FRONTEND_COUNT))
else
    FRONTEND_EXIT=1
    echo -e "${RED}❌ Frontend Tests FAILED${NC}"
    FRONTEND_COUNT=12
    FAILED_TESTS=$((FAILED_TESTS + FRONTEND_COUNT))
    TOTAL_TESTS=$((TOTAL_TESTS + FRONTEND_COUNT))
fi
cd ..

# =============================================================================
# 6. DIAGNOSTYKA PLIKÓW
# =============================================================================
print_section "📁 6. DIAGNOSTYKA STRUKTURY PLIKÓW"

echo "Sprawdzanie kluczowych plików:"

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (brak)"
        return 1
    fi
}

check_file "backend/src/index.ts"
check_file "backend/package.json"
check_file "frontend/app/page.tsx"
check_file "frontend/package.json"
check_file "python-scripts/flows.py"
check_file "python-scripts/flows_standalone.py"
check_file "python-scripts/test_flows.py"

echo ""
echo "Sprawdzanie przykładów CSV:"
CSV_COUNT=$(ls -1 przyklady_csv/*.csv 2>/dev/null | wc -l | tr -d ' ')
if [ "$CSV_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅${NC} Znaleziono $CSV_COUNT plików CSV w przyklady_csv/"
else
    echo -e "${RED}❌${NC} Brak plików CSV w przyklady_csv/"
fi

# =============================================================================
# 7. DIAGNOSTYKA PORTÓW
# =============================================================================
print_section "🌐 7. DIAGNOSTYKA PORTÓW I PROCESÓW"

echo "Sprawdzanie dostępności portów:"

check_port() {
    PORT=$1
    NAME=$2
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -an 2>/dev/null | grep ":$PORT.*LISTEN" >/dev/null; then
        echo -e "${YELLOW}⚠️${NC}  Port $PORT ($NAME) jest zajęty"
        return 1
    else
        echo -e "${GREEN}✅${NC} Port $PORT ($NAME) jest wolny"
        return 0
    fi
}

check_port 3000 "Frontend"
check_port 3001 "Backend"

echo ""
echo "Aktywne procesy Node.js dla projektu:"
ps aux | grep -E "node.*my-fullstack-app" | grep -v grep || echo "Brak aktywnych procesów"

# =============================================================================
# 8. DIAGNOSTYKA CONNECTIVITY (jeśli aplikacja działa)
# =============================================================================
print_section "🔌 8. DIAGNOSTYKA CONNECTIVITY"

echo "Sprawdzanie czy serwery odpowiadają..."

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✅ Backend odpowiada (HTTP 200)${NC}"
    
    # Test API endpoints
    echo ""
    echo "Testowanie endpointów API:"
    
    if curl -s http://localhost:3001/api/files >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} GET /api/files"
    else
        echo -e "${RED}❌${NC} GET /api/files"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Backend nie działa na porcie 3001"
    echo "   (To jest OK jeśli nie uruchomiłeś aplikacji)"
fi

echo ""
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend odpowiada (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️${NC}  Frontend nie działa na porcie 3000"
    echo "   (To jest OK jeśli nie uruchomiłeś aplikacji)"
fi

# =============================================================================
# 9. DIAGNOSTYKA DOKUMENTACJI
# =============================================================================
print_section "📚 9. DIAGNOSTYKA DOKUMENTACJI"

echo "Sprawdzanie plików dokumentacji:"
check_file "README.md"
check_file "docs/START_TUTAJ.md"
check_file "docs/INSTRUKCJA_UŻYTKOWNIKA.md"
check_file "docs/ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md"

# =============================================================================
# 10. PODSUMOWANIE
# =============================================================================
print_section "📋 10. PODSUMOWANIE DIAGNOSTYKI"

echo ""
echo "Wyniki testów jednostkowych:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $PYTHON_EXIT -eq 0 ]; then
    echo -e "📊 Python Tests:    ${GREEN}✅ PASSED${NC} (10 testów)"
else
    echo -e "📊 Python Tests:    ${RED}❌ FAILED${NC}"
fi

if [ $BACKEND_EXIT -eq 0 ]; then
    echo -e "🔧 Backend Tests:   ${GREEN}✅ PASSED${NC} ($BACKEND_COUNT testów)"
else
    echo -e "🔧 Backend Tests:   ${RED}❌ FAILED${NC}"
fi

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "🎨 Frontend Tests:  ${GREEN}✅ PASSED${NC} ($FRONTEND_COUNT testów)"
else
    echo -e "🎨 Frontend Tests:  ${RED}❌ FAILED${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Oblicz procent
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
else
    PERCENTAGE=0
fi

echo "📊 CAŁKOWITE WYNIKI:"
echo "   Wszystkie testy:  $TOTAL_TESTS"
echo "   Przeszły:         $PASSED_TESTS"
echo "   Nie przeszły:     $FAILED_TESTS"
echo "   Procent sukcesu:  ${PERCENTAGE}%"
echo ""

if [ $PYTHON_EXIT -eq 0 ] && [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE! ($TOTAL_TESTS/$TOTAL_TESTS)${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "✅ Aplikacja jest w pełni funkcjonalna i gotowa do użycia!"
    echo ""
    echo "Aby uruchomić aplikację:"
    echo "  Terminal 1: cd backend && npm run dev"
    echo "  Terminal 2: cd frontend && npm run dev"
    echo "  Otwórz: http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  NIEKTÓRE TESTY NIE PRZESZŁY${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Sprawdź logi powyżej, aby zobaczyć szczegóły błędów."
    echo ""
    exit 1
fi

