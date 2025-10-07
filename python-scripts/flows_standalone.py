#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=================================================================================
NARZĘDZIE DO WIZUALIZACJI PRZEPŁYWÓW FINANSOWYCH - WERSJA STANDALONE
=================================================================================

Autor: Zadanie konkursowe - Wizualizacja przepływów finansowych
Data: Październik 2025
Licencja: Bezpłatna (używa tylko standardowych bibliotek Python)

OPIS:
    To narzędzie generuje wykresy Sankey (diagramy przepływów) na podstawie
    danych o transakcjach finansowych z pliku CSV.

WYMAGANIA:
    - Python 3.6 lub nowszy
    - Tylko standardowe biblioteki (csv, json, datetime)

JAK UŻYWAĆ:
    1. Przygotuj plik CSV z danymi (patrz sekcja FORMAT DANYCH poniżej)
    2. Edytuj sekcję PARAMETRY UŻYTKOWNIKA poniżej
    3. Uruchom skrypt: python3 flows_standalone.py
    4. Plik SVG zostanie zapisany w lokalizacji określonej w parametrach

=================================================================================
"""

import csv
import os
from datetime import datetime
from collections import defaultdict

# =============================================================================
# PARAMETRY UŻYTKOWNIKA - EDYTUJ TĘ SEKCJĘ
# =============================================================================

# Ścieżka do pliku wejściowego CSV
CSV_INPUT_FILE = 'dane_transakcji.csv'

# Ścieżka do pliku wyjściowego SVG
SVG_OUTPUT_FILE = 'wykres_przeplywow.svg'

# NAZWY KOLUMN w pliku CSV (dostosuj do swojego pliku)
COLUMN_SENDER = 'Nadawca'          # Kolumna z nadawcą transakcji
COLUMN_RECEIVER = 'Odbiorca'       # Kolumna z odbiorcą transakcji
COLUMN_AMOUNT = 'Kwota'            # Kolumna z kwotą (może być też: Amount, Value, Wartość)
COLUMN_DATE = 'Data'               # Kolumna z datą (opcjonalne, format: YYYY-MM-DD)

# FILTRY (pozostaw puste [] lub '' aby nie filtrować)
FILTER_ENTITIES = []               # Lista podmiotów do analizy, np. ['Firma A', 'Firma B']
                                    # Jeśli pusta [] - analizuj wszystkie podmioty
FILTER_DATE_FROM = ''              # Data początkowa, format: 'YYYY-MM-DD', np. '2024-01-01'
FILTER_DATE_TO = ''                # Data końcowa, format: 'YYYY-MM-DD', np. '2024-12-31'

# PARAMETRY WIZUALIZACJI
SVG_WIDTH = 800                    # Szerokość wykresu w pikselach
SVG_HEIGHT = 600                   # Wysokość wykresu w pikselach
SVG_MARGIN = 100                   # Margines wokół wykresu w pikselach
NODE_WIDTH = 20                    # Szerokość węzła (podmiotu) w pikselach

# =============================================================================
# KONIEC SEKCJI PARAMETRÓW - KOD PROGRAMU PONIŻEJ
# =============================================================================


def parse_csv(csv_path):
    """
    Wczytuje dane z pliku CSV i zwraca listę wierszy jako słowniki.
    
    Args:
        csv_path (str): Ścieżka do pliku CSV
        
    Returns:
        list: Lista słowników, każdy reprezentuje jeden wiersz danych
    """
    flows = []
    
    print(f"📂 Wczytywanie pliku: {csv_path}")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                flows.append(row)
        
        print(f"✅ Wczytano {len(flows)} rekordów")
        return flows
        
    except FileNotFoundError:
        print(f"❌ BŁĄD: Nie znaleziono pliku: {csv_path}")
        print(f"   Sprawdź czy plik istnieje i czy ścieżka jest poprawna.")
        return []
    except Exception as e:
        print(f"❌ BŁĄD podczas wczytywania pliku: {e}")
        return []


def filter_flows(flows, entities=None, date_from=None, date_to=None):
    """
    Filtruje przepływy według podmiotów i zakresu dat.
    
    Args:
        flows (list): Lista wszystkich przepływów
        entities (list): Lista podmiotów do uwzględnienia (None = wszystkie)
        date_from (str): Data początkowa w formacie 'YYYY-MM-DD' (None = bez ograniczenia)
        date_to (str): Data końcowa w formacie 'YYYY-MM-DD' (None = bez ograniczenia)
        
    Returns:
        list: Przefiltrowana lista przepływów
    """
    filtered = flows
    
    # Filtrowanie według podmiotów
    if entities and len(entities) > 0:
        print(f"🔍 Filtrowanie według {len(entities)} podmiotów: {entities}")
        filtered = [
            f for f in filtered 
            if f.get(COLUMN_SENDER) in entities or f.get(COLUMN_RECEIVER) in entities
        ]
    
    # Filtrowanie według dat
    if date_from or date_to:
        print(f"📅 Filtrowanie według zakresu dat: {date_from or '(brak)'} → {date_to or '(brak)'}")
        filtered_by_date = []
        
        for f in filtered:
            if COLUMN_DATE in f and f[COLUMN_DATE]:
                try:
                    flow_date = datetime.strptime(f[COLUMN_DATE], '%Y-%m-%d')
                    
                    # Sprawdź datę początkową
                    if date_from:
                        start_date = datetime.strptime(date_from, '%Y-%m-%d')
                        if flow_date < start_date:
                            continue
                    
                    # Sprawdź datę końcową
                    if date_to:
                        end_date = datetime.strptime(date_to, '%Y-%m-%d')
                        if flow_date > end_date:
                            continue
                    
                    filtered_by_date.append(f)
                except ValueError:
                    # Jeśli nie można sparsować daty, dodaj przepływ
                    filtered_by_date.append(f)
            else:
                # Jeśli brak daty, dodaj przepływ
                filtered_by_date.append(f)
        
        filtered = filtered_by_date
    
    print(f"✅ Po filtrowaniu: {len(filtered)} rekordów")
    return filtered


def aggregate_flows(flows):
    """
    Agreguje przepływy między tymi samymi podmiotami (sumuje kwoty).
    
    Args:
        flows (list): Lista przepływów do agregacji
        
    Returns:
        dict: Słownik {klucz: kwota}, gdzie klucz to 'Nadawca→Odbiorca'
    """
    aggregated = defaultdict(float)
    
    print(f"📊 Agregowanie przepływów...")
    
    # Możliwe nazwy kolumn z kwotą
    amount_columns = [COLUMN_AMOUNT, 'Amount', 'Value', 'Wartość', 'Wartosc']
    
    for flow in flows:
        sender = flow.get(COLUMN_SENDER, 'Nieznany')
        receiver = flow.get(COLUMN_RECEIVER, 'Nieznany')
        
        # Znajdź kwotę w dostępnych kolumnach
        amount = 0
        for col in amount_columns:
            if col in flow and flow[col]:
                try:
                    # Usuń spacje i zastąp przecinek kropką
                    amount_str = str(flow[col]).replace(' ', '').replace(',', '.')
                    amount = float(amount_str)
                    break
                except ValueError:
                    continue
        
        # Dodaj do agregacji tylko jeśli kwota > 0
        if amount > 0 and sender and receiver and sender != 'Nieznany' and receiver != 'Nieznany':
            key = f"{sender}→{receiver}"
            aggregated[key] += amount
    
    print(f"✅ Zagregowano do {len(aggregated)} unikalnych przepływów")
    return aggregated


def generate_sankey_svg(aggregated_flows, width=800, height=600, margin=100, node_width=20):
    """
    Generuje wykres Sankey w formacie SVG.
    
    Args:
        aggregated_flows (dict): Słownik zagregowanych przepływów
        width (int): Szerokość wykresu
        height (int): Wysokość wykresu
        margin (int): Margines
        node_width (int): Szerokość węzła
        
    Returns:
        str: Kod SVG jako string
    """
    print(f"🎨 Generowanie wykresu SVG ({width}x{height})...")
    
    if not aggregated_flows:
        return generate_empty_svg(width, height)
    
    # Zbierz wszystkie węzły (podmioty)
    nodes = set()
    for key in aggregated_flows.keys():
        sender, receiver = key.split('→')
        nodes.add(sender)
        nodes.add(receiver)
    
    nodes_list = sorted(list(nodes))
    print(f"   Znaleziono {len(nodes_list)} podmiotów")
    
    # Podziel węzły na lewą i prawą stronę
    left_nodes = []
    right_nodes = []
    
    for node in nodes_list:
        is_sender = any(key.startswith(f"{node}→") for key in aggregated_flows.keys())
        is_receiver = any(key.endswith(f"→{node}") for key in aggregated_flows.keys())
        
        if is_sender and not is_receiver:
            left_nodes.append(node)
        elif is_receiver and not is_sender:
            right_nodes.append(node)
        else:
            # Węzeł jest zarówno nadawcą jak i odbiorcą
            left_nodes.append(node)
            right_nodes.append(node)
    
    # Usuń duplikaty zachowując kolejność
    left_nodes = list(dict.fromkeys(left_nodes))
    right_nodes = list(dict.fromkeys(right_nodes))
    
    # Jeśli nie ma podziału, umieść połowę po lewej, połowę po prawej
    if not left_nodes or not right_nodes:
        mid = len(nodes_list) // 2
        left_nodes = nodes_list[:mid] if mid > 0 else nodes_list
        right_nodes = nodes_list[mid:] if mid > 0 else nodes_list
    
    # Oblicz pozycje Y dla węzłów
    left_y = {node: margin + i * (height - 2*margin) / max(len(left_nodes)-1, 1) 
              for i, node in enumerate(left_nodes)}
    right_y = {node: margin + i * (height - 2*margin) / max(len(right_nodes)-1, 1) 
               for i, node in enumerate(right_nodes)}
    
    # Połącz pozycje
    node_positions = {}
    for node in left_nodes:
        node_positions[node] = (margin, left_y[node])
    for node in right_nodes:
        node_positions[node] = (width - margin, right_y[node])
    
    # Znajdź maksymalną wartość dla normalizacji szerokości przepływów
    max_value = max(aggregated_flows.values()) if aggregated_flows else 1
    total_value = sum(aggregated_flows.values())
    
    print(f"   Maksymalna wartość przepływu: {max_value:,.2f}")
    print(f"   Suma wszystkich przepływów: {total_value:,.2f}")
    
    # Generuj kod SVG
    svg_parts = [
        f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">',
        '<!-- Gradien dla przepływów -->',
        '<defs>',
        '<linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">',
        '<stop offset="0%" style="stop-color:rgb(99,102,241);stop-opacity:0.6" />',
        '<stop offset="100%" style="stop-color:rgb(139,92,246);stop-opacity:0.6" />',
        '</linearGradient>',
        '</defs>',
        '',
        '<!-- Tło -->',
        '<rect width="100%" height="100%" fill="#f9fafb"/>',
        '',
        '<!-- Tytuł -->',
        '<text x="' + str(width//2) + '" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1f2937">',
        'Diagram Przepływów Finansowych',
        '</text>'
    ]
    
    # Rysuj połączenia (przepływy) - od największych do najmniejszych
    svg_parts.append('\n<!-- Przepływy -->')
    for key, value in sorted(aggregated_flows.items(), key=lambda x: x[1], reverse=True):
        sender, receiver = key.split('→')
        
        if sender not in node_positions or receiver not in node_positions:
            continue
        
        x1, y1 = node_positions[sender]
        x2, y2 = node_positions[receiver]
        
        # Szerokość przepływu proporcjonalna do wartości
        stroke_width = max(2, (value / max_value) * 30)
        
        # Oblicz punkty kontrolne dla krzywej Beziera
        cx1 = x1 + (x2 - x1) * 0.5
        cx2 = x1 + (x2 - x1) * 0.5
        
        # Ścieżka przepływu (krzywa Beziera)
        path = f'M {x1+node_width} {y1} C {cx1} {y1}, {cx2} {y2}, {x2-node_width} {y2}'
        
        svg_parts.extend([
            f'<path d="{path}" stroke="url(#flowGradient)" ',
            f'stroke-width="{stroke_width}" fill="none" opacity="0.7">',
            f'<title>{sender} → {receiver}: {value:,.2f} PLN</title>',
            '</path>'
        ])
    
    # Rysuj węzły (podmioty)
    svg_parts.append('\n<!-- Węzły (podmioty) -->')
    for node, (x, y) in node_positions.items():
        svg_parts.extend([
            f'<rect x="{x-node_width/2}" y="{y-30}" width="{node_width}" height="60" ',
            'fill="#6366f1" rx="5"/>',
            f'<text x="{x + (node_width if x < width/2 else -node_width) + (10 if x < width/2 else -10)}" ',
            f'y="{y+5}" font-size="14" font-weight="500" fill="#1f2937" ',
            f'text-anchor="{"start" if x < width/2 else "end"}">{node}</text>'
        ])
    
    # Dodaj legendę
    legend_y = height - 50
    svg_parts.extend([
        '\n<!-- Legenda -->',
        f'<text x="20" y="{legend_y}" font-size="12" fill="#6b7280">',
        f'Maksymalna wartość: {max_value:,.2f} PLN',
        '</text>',
        f'<text x="20" y="{legend_y + 20}" font-size="12" fill="#6b7280">',
        f'Liczba przepływów: {len(aggregated_flows)} | Suma: {total_value:,.2f} PLN',
        '</text>'
    ])
    
    svg_parts.append('</svg>')
    
    print(f"✅ Wykres SVG wygenerowany pomyślnie")
    return '\n'.join(svg_parts)


def generate_empty_svg(width=800, height=600):
    """
    Generuje pusty wykres SVG z komunikatem o braku danych.
    
    Args:
        width (int): Szerokość wykresu
        height (int): Wysokość wykresu
        
    Returns:
        str: Kod SVG jako string
    """
    return f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <text x="{width//2}" y="{height//2-20}" text-anchor="middle" font-size="18" fill="#6b7280">
            Brak danych do wyświetlenia
        </text>
        <text x="{width//2}" y="{height//2+10}" text-anchor="middle" font-size="14" fill="#9ca3af">
            Sprawdź filtry lub format pliku CSV
        </text>
    </svg>'''


def main():
    """
    Główna funkcja programu - wykonuje cały proces generowania wykresu.
    """
    print("=" * 80)
    print("NARZĘDZIE DO WIZUALIZACJI PRZEPŁYWÓW FINANSOWYCH")
    print("=" * 80)
    print()
    
    # Sprawdź czy plik wejściowy istnieje
    if not os.path.exists(CSV_INPUT_FILE):
        print(f"❌ BŁĄD: Nie znaleziono pliku wejściowego: {CSV_INPUT_FILE}")
        print()
        print("PRZYKŁADOWY FORMAT PLIKU CSV:")
        print("-" * 80)
        print("Nadawca,Odbiorca,Kwota,Data,Opis")
        print("Firma A,Firma B,15000.50,2024-01-15,Płatność za usługi")
        print("Firma B,Firma C,8500.00,2024-01-20,Zakup materiałów")
        print("-" * 80)
        print()
        print("INSTRUKCJA:")
        print("1. Utwórz plik CSV z powyższym formatem")
        print(f"2. Zapisz go jako: {CSV_INPUT_FILE}")
        print("3. Uruchom ponownie ten skrypt")
        return
    
    # Krok 1: Wczytaj dane z CSV
    flows = parse_csv(CSV_INPUT_FILE)
    if not flows:
        print("❌ Nie udało się wczytać danych. Sprawdź format pliku CSV.")
        return
    
    # Krok 2: Filtruj dane
    filtered_flows = filter_flows(
        flows, 
        entities=FILTER_ENTITIES if FILTER_ENTITIES else None,
        date_from=FILTER_DATE_FROM if FILTER_DATE_FROM else None,
        date_to=FILTER_DATE_TO if FILTER_DATE_TO else None
    )
    
    if not filtered_flows:
        print("⚠️  Po filtrowaniu nie pozostały żadne dane.")
        print("   Spróbuj zmienić filtry w sekcji PARAMETRY UŻYTKOWNIKA.")
        return
    
    # Krok 3: Agreguj przepływy
    aggregated = aggregate_flows(filtered_flows)
    
    if not aggregated:
        print("⚠️  Nie znaleziono żadnych przepływów do wyświetlenia.")
        print("   Sprawdź czy plik CSV zawiera poprawne dane (kwoty, nadawców, odbiorców).")
        return
    
    # Krok 4: Generuj wykres SVG
    svg_content = generate_sankey_svg(
        aggregated,
        width=SVG_WIDTH,
        height=SVG_HEIGHT,
        margin=SVG_MARGIN,
        node_width=NODE_WIDTH
    )
    
    # Krok 5: Zapisz wykres do pliku
    try:
        with open(SVG_OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print()
        print("=" * 80)
        print(f"✅ SUKCES! Wykres zapisano jako: {SVG_OUTPUT_FILE}")
        print("=" * 80)
        print()
        print("PODSUMOWANIE:")
        print(f"  • Wczytano rekordów: {len(flows)}")
        print(f"  • Po filtrowaniu: {len(filtered_flows)}")
        print(f"  • Unikalnych przepływów: {len(aggregated)}")
        print(f"  • Rozmiar pliku: {os.path.getsize(SVG_OUTPUT_FILE) / 1024:.2f} KB")
        print()
        print(f"Otwórz plik {SVG_OUTPUT_FILE} w przeglądarce aby zobaczyć wykres!")
        
    except Exception as e:
        print(f"❌ BŁĄD podczas zapisywania pliku: {e}")


# =============================================================================
# URUCHOMIENIE PROGRAMU
# =============================================================================

if __name__ == "__main__":
    main()

