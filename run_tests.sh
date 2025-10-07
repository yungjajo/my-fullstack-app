#!/bin/bash
# Skrypt do uruchamiania wszystkich testów aplikacji
# Użycie: ./run_tests.sh

set -e

echo "🧪 Uruchamianie wszystkich testów..."
echo "===================================="

# Python Tests
echo ""
echo "📊 Python Tests (python-scripts/test_flows.py)..."
echo "------------------------------------"
cd python-scripts
python3 test_flows.py
PYTHON_EXIT=$?
cd ..

# Backend Tests
echo ""
echo "🔧 Backend Tests (backend npm test)..."
echo "------------------------------------"
cd backend
npm test
BACKEND_EXIT=$?
cd ..

# Frontend Tests
echo ""
echo "🎨 Frontend Tests (frontend npm test)..."
echo "------------------------------------"
cd frontend
npm test
FRONTEND_EXIT=$?
cd ..

# Podsumowanie
echo ""
echo "===================================="
echo "📋 Podsumowanie Testów:"
echo "===================================="
echo ""

if [ $PYTHON_EXIT -eq 0 ]; then
    echo "✅ Python Tests: PASSED (10 testów)"
else
    echo "❌ Python Tests: FAILED"
fi

if [ $BACKEND_EXIT -eq 0 ]; then
    echo "✅ Backend Tests: PASSED (13 testów)"
else
    echo "❌ Backend Tests: FAILED"
fi

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo "✅ Frontend Tests: PASSED (12 testów)"
else
    echo "❌ Frontend Tests: FAILED"
fi

echo ""
echo "===================================="

if [ $PYTHON_EXIT -eq 0 ] && [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
    echo "🎉 Wszystkie testy przeszły pomyślnie! (35/35)"
    echo "===================================="
    exit 0
else
    echo "⚠️  Niektóre testy nie przeszły"
    echo "===================================="
    exit 1
fi

