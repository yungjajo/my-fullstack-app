# 📚 Instrukcja Użytkownika
## Narzędzie do Wizualizacji Przepływów Finansowych

---

## 🎯 Cel Narzędzia

To narzędzie służy do wizualizacji przepływów finansowych między podmiotami na podstawie historii transakcji z pliku CSV. Generuje grafiki wektorowe (SVG) przedstawiające diagram Sankey - typ wykresu idealny do prezentacji przepływu wartości między węzłami.

---

## 📋 Wymagania

### Minimalne wymagania techniczne:
- **Python 3.6 lub nowszy** - sprawdź wersję: `python3 --version`
- **Przeglądarka internetowa** (opcjonalnie dla interfejsu webowego)
- **Plik CSV z danymi** o przepływach finansowych

### Wymagane biblioteki:
✅ **TYLKO bezpłatne standardowe biblioteki Python:**
- `csv` - przetwarzanie plików CSV
- `json` - obsługa danych JSON  
- `datetime` - operacje na datach
- `collections` - struktury danych

---

## 📁 Format Pliku CSV

### Wymagane kolumny:

| Kolumna | Opis | Przykład |
|---------|------|----------|
| **Nadawca** | Nazwa podmiotu wysyłającego | "Firma A" |
| **Odbiorca** | Nazwa podmiotu odbierającego | "Firma B" |
| **Kwota** | Wartość transakcji | 15000.50 lub "15 000,50" |
| **Data** (opcjonalne) | Data transakcji | 2024-01-15 |
| **Opis** (opcjonalne) | Opis transakcji | "Płatność za usługi" |

### Przykładowy plik CSV:

```csv
Nadawca,Odbiorca,Kwota,Data,Opis
Firma A,Firma B,15000.50,2024-01-15,Płatność za usługi
Firma B,Firma C,8500.00,2024-01-20,Zakup materiałów
Firma A,Firma C,12000.00,2024-02-01,Inwestycja
Firma C,Firma D,5500.75,2024-02-10,Wynagrodzenie
Firma A,Firma D,7800.00,2024-02-15,Konsulting
```

### Ważne uwagi o formacie:
- ✅ Pierwsza linia musi zawierać nagłówki kolumn
- ✅ Separator: przecinek (`,`)
- ✅ Kwoty mogą zawierać przecinek (`,`) lub kropkę (`.`) jako separator dziesiętny
- ✅ Kwoty mogą zawierać spacje (zostaną usunięte automatycznie)
- ✅ Data w formacie `YYYY-MM-DD` (rok-miesiąc-dzień)
- ✅ Nazwy podmiotów mogą zawierać spacje i znaki specjalne
- ✅ Kodowanie pliku: UTF-8 (dla polskich znaków)

---

## 🚀 Sposób 1: Skrypt Python (Standalone)

### Dla użytkowników z minimalną znajomością Pythona

#### Krok 1: Przygotuj dane
Utwórz plik `dane_transakcji.csv` w tym samym folderze co skrypt.

#### Krok 2: Edytuj parametry
Otwórz plik `flows_standalone.py` w edytorze tekstu i znajdź sekcję **PARAMETRY UŻYTKOWNIKA** (około linia 30):

```python
# PARAMETRY UŻYTKOWNIKA - EDYTUJ TĘ SEKCJĘ

# Ścieżka do pliku wejściowego CSV
CSV_INPUT_FILE = 'dane_transakcji.csv'

# Ścieżka do pliku wyjściowego SVG
SVG_OUTPUT_FILE = 'wykres_przeplywow.svg'

# NAZWY KOLUMN w pliku CSV
COLUMN_SENDER = 'Nadawca'
COLUMN_RECEIVER = 'Odbiorca'
COLUMN_AMOUNT = 'Kwota'
COLUMN_DATE = 'Data'

# FILTRY
FILTER_ENTITIES = []              # np. ['Firma A', 'Firma B']
FILTER_DATE_FROM = ''             # np. '2024-01-01'
FILTER_DATE_TO = ''               # np. '2024-12-31'

# PARAMETRY WIZUALIZACJI
SVG_WIDTH = 800
SVG_HEIGHT = 600
```

#### Krok 3: Uruchom skrypt
```bash
cd python-scripts
python3 flows_standalone.py
```

#### Krok 4: Zobacz wynik
Otwórz plik `wykres_przeplywow.svg` w przeglądarce internetowej.

### Przykłady dostosowania:

**Zmiana nazw kolumn:**
```python
COLUMN_SENDER = 'From'           # Jeśli w CSV kolumna nazywa się 'From'
COLUMN_RECEIVER = 'To'           # Jeśli w CSV kolumna nazywa się 'To'
COLUMN_AMOUNT = 'Amount'         # Jeśli w CSV kolumna nazywa się 'Amount'
```

**Filtrowanie według podmiotów:**
```python
FILTER_ENTITIES = ['Firma A', 'Firma B', 'Firma C']
```

**Filtrowanie według dat:**
```python
FILTER_DATE_FROM = '2024-01-01'
FILTER_DATE_TO = '2024-06-30'
```

**Zmiana rozmiaru wykresu:**
```python
SVG_WIDTH = 1200    # Szerszy wykres
SVG_HEIGHT = 800    # Wyższy wykres
```

---

## 🌐 Sposób 2: Aplikacja Webowa

### Dla użytkowników preferujących interfejs graficzny

#### Krok 1: Uruchom backend
```bash
cd backend
node --loader ts-node/esm src/index.ts
```
Backend będzie dostępny na: http://localhost:3001

#### Krok 2: Uruchom frontend
```bash
cd frontend
npm run dev
```
Frontend będzie dostępny na: http://localhost:3000 lub http://localhost:3002

#### Krok 3: Użyj aplikacji
1. Otwórz przeglądarkę: http://localhost:3002
2. Prześlij plik CSV
3. Wybierz plik z listy dokumentów
4. Wybierz filtry (podmioty, zakres dat)
5. Kliknij "Wygeneruj Wykres Przepływów"
6. Zobacz wykres Sankey po prawej stronie

---

## 📊 Interpretacja Wykresu Sankey

### Elementy wykresu:

**Węzły (prostokąty):**
- Reprezentują podmioty (firmy, osoby)
- Po lewej: nadawcy
- Po prawej: odbiorcy

**Przepływy (krzywe):**
- Reprezentują transfery pieniędzy
- Szerokość = wielkość kwoty
- Kolor: gradient niebiesko-fioletowy

**Legenda:**
- Maksymalna wartość przepływu
- Liczba unikalnych przepływów
- Suma wszystkich transakcji

### Wskazówki do analizy:

✅ **Grubsze przepływy** = większe kwoty  
✅ **Położenie** = kierunek przepływu (lewo→prawo)  
✅ **Tooltip** = najedź myszką aby zobaczyć szczegóły  

---

## 🔧 Rozwiązywanie Problemów

### Problem: "python: command not found"
**Rozwiązanie:** Użyj `python3` zamiast `python`
```bash
python3 flows_standalone.py
```

### Problem: "Nie znaleziono pliku CSV"
**Rozwiązanie:** Sprawdź:
1. Czy plik istnieje w tym samym folderze co skrypt
2. Czy nazwa pliku jest poprawna (uwaga na wielkość liter)
3. Czy ścieżka w `CSV_INPUT_FILE` jest poprawna

### Problem: "Brak danych po filtrowaniu"
**Rozwiązanie:**
1. Usuń filtry (ustaw puste wartości: `[]` i `''`)
2. Sprawdź czy nazwy podmiotów w filtrach są identyczne jak w CSV
3. Sprawdź format dat (musi być `YYYY-MM-DD`)

### Problem: "Wykres jest pusty"
**Rozwiązanie:** Sprawdź czy:
1. Kolumna z kwotą zawiera liczby (nie tekst)
2. Kolumny Nadawca i Odbiorca zawierają dane
3. Nazwy kolumn w parametrach odpowiadają nazwom w pliku CSV

### Problem: "Błąd kodowania (polskie znaki)"
**Rozwiązanie:** Zapisz plik CSV w kodowaniu UTF-8:
- W Excelu: "Zapisz jako" → "CSV UTF-8 (rozdzielany przecinkami)"
- W Notatniku: "Zapisz jako" → Kodowanie: UTF-8

---

## 💡 Najlepsze Praktyki

### Przygotowanie danych:
1. ✅ Upewnij się, że wszystkie kwoty są liczbami
2. ✅ Usuń puste wiersze z CSV
3. ✅ Używaj spójnych nazw podmiotów (bez literówek)
4. ✅ Daty w jednolitym formacie
5. ✅ Backup oryginalnych danych przed modyfikacją

### Tworzenie wykresów:
1. ✅ Zacznij od wykresu bez filtrów (całość danych)
2. ✅ Następnie stosuj filtry aby skupić się na interesujących podmiotach
3. ✅ Użyj filtrów dat aby zobaczyć zmiany w czasie
4. ✅ Zapisuj wygenerowane wykresy z opisowymi nazwami
5. ✅ Porównuj różne okresy lub grupy podmiotów

### Dokumentacja:
1. ✅ Zapisz parametry użyte do stworzenia wykresu
2. ✅ Dodaj opis do nazwy pliku SVG (np. `wykres_Q1_2024.svg`)
3. ✅ Przechowuj oryginalne pliki CSV razem z wykresami

---

## 📖 Przykłady Użycia

### Przykład 1: Analiza całości przepływów

**Cel:** Zobacz wszystkie przepływy bez ograniczeń

**Parametry:**
```python
CSV_INPUT_FILE = 'transakcje_2024.csv'
SVG_OUTPUT_FILE = 'wszystkie_przeplyw.svg'
FILTER_ENTITIES = []
FILTER_DATE_FROM = ''
FILTER_DATE_TO = ''
```

---

### Przykład 2: Analiza konkretnych firm

**Cel:** Sprawdź przepływy między wybranymi firmami

**Parametry:**
```python
CSV_INPUT_FILE = 'transakcje_2024.csv'
SVG_OUTPUT_FILE = 'firmy_ABC.svg'
FILTER_ENTITIES = ['Firma A', 'Firma B', 'Firma C']
FILTER_DATE_FROM = ''
FILTER_DATE_TO = ''
```

---

### Przykład 3: Analiza kwartalna

**Cel:** Przeanalizuj jeden kwartał

**Parametry:**
```python
CSV_INPUT_FILE = 'transakcje_2024.csv'
SVG_OUTPUT_FILE = 'Q1_2024.svg'
FILTER_ENTITIES = []
FILTER_DATE_FROM = '2024-01-01'
FILTER_DATE_TO = '2024-03-31'
```

---

### Przykład 4: Fokus na jednej firmie

**Cel:** Zobacz tylko transakcje związane z jedną firmą

**Parametry:**
```python
CSV_INPUT_FILE = 'transakcje_2024.csv'
SVG_OUTPUT_FILE = 'firma_A_analiza.svg'
FILTER_ENTITIES = ['Firma A']
FILTER_DATE_FROM = ''
FILTER_DATE_TO = ''
```

---

## 📞 Wsparcie

### Częste pytania:

**Q: Czy mogę używać tego narzędzia komercyjnie?**  
A: Tak, narzędzie jest bezpłatne i używa tylko bezpłatnych bibliotek.

**Q: Jak duże pliki mogę przetwarzać?**  
A: Narzędzie radzi sobie z tysiącami rekordów. Dla bardzo dużych plików (>100k rekordów) używaj filtrów.

**Q: Czy mogę zmienić kolory wykresu?**  
A: Tak, edytuj sekcję "Gradient dla przepływów" w funkcji `generate_sankey_svg()`.

**Q: Czy wykres jest interaktywny?**  
A: Tak, tooltip pokazuje szczegóły po najechaniu myszką.

**Q: Jak eksportować wykres do PDF/PNG?**  
A: Otwórz SVG w przeglądarce i użyj funkcji "Drukuj" → "Zapisz jako PDF".

---

## 🎓 Dla Osób Uczących Się Python

### Jak modyfikować kod:

**1. Dodaj nową kolumnę do analizy:**
```python
# W funkcji parse_csv() dodaj logikę do przetworzenia nowej kolumny
COLUMN_CATEGORY = 'Kategoria'  # Nowy parametr
```

**2. Zmień kolory w wykresie:**
```python
# W generate_sankey_svg() znajdź sekcję <linearGradient>
'<stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:0.6" />'  # Czerwony
```

**3. Dodaj dodatkowe statystyki:**
```python
# W funkcji main() dodaj przed print("PODSUMOWANIE:")
średnia = total_value / len(aggregated)
print(f"  • Średnia wartość przepływu: {średnia:,.2f}")
```

**4. Eksportuj dane do JSON:**
```python
import json
with open('statystyki.json', 'w') as f:
    json.dump(aggregated, f, indent=2)
```

---

## 📝 Changelog

**Wersja 1.0** (Październik 2025)
- ✅ Podstawowa funkcjonalność wizualizacji Sankey
- ✅ Filtrowanie według podmiotów i dat
- ✅ Interfejs webowy
- ✅ Standalone skrypt Python
- ✅ Pełna dokumentacja

---

**Powodzenia w analizowaniu przepływów finansowych! 📊💰**

