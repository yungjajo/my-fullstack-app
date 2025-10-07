#!/usr/bin/env python3
# python-scripts/flows.py

import json
import os
import csv
from datetime import datetime
from collections import defaultdict

def load_params():
    """Wczytuje parametry z pliku JSON"""
    params_path = os.path.join(os.path.dirname(__file__), 'flows_params.json')
    if not os.path.exists(params_path):
        return {
            'csv_path': '',
            'entities': [],
            'from': '',
            'to': ''
        }
    
    with open(params_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def parse_csv(csv_path):
    """Parsuje plik CSV i zwraca dane przepływów"""
    flows = []
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                flows.append(row)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []
    
    return flows

def filter_flows(flows, entities=None, date_from=None, date_to=None):
    """Filtruje przepływy według podmiotów i dat"""
    filtered = flows
    
    # Filtruj według podmiotów
    if entities and len(entities) > 0:
        filtered = [
            f for f in filtered 
            if f.get('Nadawca') in entities or f.get('Odbiorca') in entities
        ]
    
    # Filtruj według dat (jeśli kolumna 'Data' istnieje)
    if date_from or date_to:
        filtered_by_date = []
        for f in filtered:
            if 'Data' in f:
                try:
                    flow_date = datetime.strptime(f['Data'], '%Y-%m-%d')
                    if date_from and datetime.strptime(date_from, '%Y-%m-%d') > flow_date:
                        continue
                    if date_to and datetime.strptime(date_to, '%Y-%m-%d') < flow_date:
                        continue
                    filtered_by_date.append(f)
                except:
                    filtered_by_date.append(f)
            else:
                filtered_by_date.append(f)
        filtered = filtered_by_date
    
    return filtered

def aggregate_flows(flows):
    """Agreguje przepływy między podmiotami"""
    aggregated = defaultdict(float)
    
    for flow in flows:
        sender = flow.get('Nadawca', 'Unknown')
        receiver = flow.get('Odbiorca', 'Unknown')
        
        # Spróbuj znaleźć kolumnę z kwotą
        amount = 0
        for key in ['Kwota', 'Amount', 'Value', 'Wartość']:
            if key in flow:
                try:
                    # Usuń spacje i zastąp przecinek kropką
                    amount_str = str(flow[key]).replace(' ', '').replace(',', '.')
                    amount = float(amount_str)
                    break
                except:
                    continue
        
        if amount > 0 and sender and receiver:
            key = f"{sender}→{receiver}"
            aggregated[key] += amount
    
    return aggregated

def generate_sankey_svg(aggregated_flows):
    """Generuje prosty wykres Sankey w formacie SVG"""
    
    if not aggregated_flows:
        return generate_empty_svg()
    
    # Zbierz wszystkie węzły
    nodes = set()
    for key in aggregated_flows.keys():
        sender, receiver = key.split('→')
        nodes.add(sender)
        nodes.add(receiver)
    
    nodes_list = sorted(list(nodes))
    node_index = {node: i for i, node in enumerate(nodes_list)}
    
    # Parametry SVG
    width = 800
    height = 600
    margin = 100
    node_width = 20
    
    # Pozycje węzłów
    left_nodes = []
    right_nodes = []
    
    for node in nodes_list:
        # Określ czy węzeł jest po lewej czy prawej stronie
        is_sender = any(key.startswith(f"{node}→") for key in aggregated_flows.keys())
        is_receiver = any(key.endswith(f"→{node}") for key in aggregated_flows.keys())
        
        if is_sender and not is_receiver:
            left_nodes.append(node)
        elif is_receiver and not is_sender:
            right_nodes.append(node)
        else:
            # Węzeł jest zarówno nadawcą jak i odbiorcą - dodaj do obu stron
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
    
    # Znajdź maksymalną wartość dla normalizacji
    max_value = max(aggregated_flows.values()) if aggregated_flows else 1
    
    # Generuj SVG
    svg_parts = [
        f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">',
        '<defs>',
        '<linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">',
        '<stop offset="0%" style="stop-color:rgb(99,102,241);stop-opacity:0.6" />',
        '<stop offset="100%" style="stop-color:rgb(139,92,246);stop-opacity:0.6" />',
        '</linearGradient>',
        '</defs>',
        '<rect width="100%" height="100%" fill="#f9fafb"/>',
        '<text x="400" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1f2937">',
        'Diagram przepływów finansowych',
        '</text>'
    ]
    
    # Rysuj połączenia (przepływy)
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
        
        # Ścieżka przepływu
        path = f'M {x1+node_width} {y1} C {cx1} {y1}, {cx2} {y2}, {x2-node_width} {y2}'
        
        svg_parts.append(
            f'<path d="{path}" stroke="url(#flowGradient)" '
            f'stroke-width="{stroke_width}" fill="none" opacity="0.7">'
            f'<title>{sender} → {receiver}: {value:,.2f}</title>'
            f'</path>'
        )
    
    # Rysuj węzły
    for node, (x, y) in node_positions.items():
        svg_parts.extend([
            f'<rect x="{x-node_width/2}" y="{y-30}" width="{node_width}" height="60" '
            f'fill="#6366f1" rx="5"/>',
            f'<text x="{x + (node_width if x < width/2 else -node_width) + (10 if x < width/2 else -10)}" '
            f'y="{y+5}" font-size="14" font-weight="500" fill="#1f2937" '
            f'text-anchor="{"start" if x < width/2 else "end"}">{node}</text>'
        ])
    
    # Dodaj legendę
    legend_y = height - 50
    svg_parts.extend([
        f'<text x="20" y="{legend_y}" font-size="12" fill="#6b7280">',
        f'Maksymalna wartość: {max_value:,.2f}',
        '</text>',
        f'<text x="20" y="{legend_y + 20}" font-size="12" fill="#6b7280">',
        f'Liczba przepływów: {len(aggregated_flows)}',
        '</text>'
    ])
    
    svg_parts.append('</svg>')
    
    return '\n'.join(svg_parts)

def generate_empty_svg():
    """Generuje SVG z komunikatem o braku danych"""
    return '''<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <text x="400" y="300" text-anchor="middle" font-size="18" fill="#6b7280">
            Brak danych do wyświetlenia
        </text>
        <text x="400" y="330" text-anchor="middle" font-size="14" fill="#9ca3af">
            Sprawdź filtry lub prześlij plik z danymi
        </text>
    </svg>'''

def main():
    """Główna funkcja generująca wykres"""
    # Wczytaj parametry
    params = load_params()
    
    csv_path = params.get('csv_path', '')
    entities = params.get('entities', [])
    date_from = params.get('from', '')
    date_to = params.get('to', '')
    
    # Parsuj CSV
    flows = parse_csv(csv_path)
    
    # Filtruj przepływy
    filtered_flows = filter_flows(flows, entities, date_from, date_to)
    
    # Agreguj przepływy
    aggregated = aggregate_flows(filtered_flows)
    
    # Generuj SVG
    svg_content = generate_sankey_svg(aggregated)
    
    # Zapisz SVG
    output_path = os.path.join(os.path.dirname(__file__), 'przeplywy_finansowe.svg')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    print(f"Wykres zapisany: {output_path}")
    print(f"Liczba przepływów: {len(aggregated)}")

if __name__ == "__main__":
    main()
