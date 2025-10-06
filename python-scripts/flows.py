
import pandas as pd
import plotly.graph_objects as go
import networkx as nx
import os
import json

# --- 1. WCZYTYWANIE PARAMETRÓW Z flows_params.json ---
params_path = os.path.join(os.path.dirname(__file__), 'flows_params.json')
if not os.path.exists(params_path):
    print("Brak pliku flows_params.json z parametrami!")
    exit(1)
with open(params_path, 'r', encoding='utf-8') as f:
    params = json.load(f)

csv_path = params.get('csv_path', 'transakcje.csv')
wybrane_podmioty = params.get('entities', [])
start_date = params.get('from', '1900-01-01')
end_date = params.get('to', '2100-12-31')

if os.path.exists(csv_path):
    try:
        df = pd.read_csv(csv_path)
        df['DataTransakcji'] = pd.to_datetime(df['DataTransakcji'])
    except Exception as e:
        print(f"Błąd podczas wczytywania pliku CSV: {e}")
        exit(1)
else:
    print(f"Brak pliku CSV: {csv_path}")
    exit(1)

# --- 2. FILTROWANIE DANYCH ---
df_filtered = df[
    (df['DataTransakcji'] >= start_date) & 
    (df['DataTransakcji'] <= end_date)
].copy()
if wybrane_podmioty:
    df_filtered = df_filtered[
        df_filtered['Nadawca'].isin(wybrane_podmioty) | 
        df_filtered['Odbiorca'].isin(wybrane_podmioty)
    ].copy()

if df_filtered.empty:
    print("Brak danych po filtracji. Przerywam działanie skryptu.")
    exit(0)

# --- 3. PRZYGOTOWANIE DANYCH DO WIZUALIZACJI ---
df_sankey = df_filtered.groupby(['Nadawca', 'Odbiorca'])['Kwota'].sum().reset_index()
df_sankey.rename(columns={'Kwota': 'value'}, inplace=True)

wszystkie_podmioty = list(set(df_sankey['Nadawca'].unique()) | set(df_sankey['Odbiorca'].unique()))
podmiot_na_numer = {name: i for i, name in enumerate(wszystkie_podmioty)}

df_sankey['source'] = df_sankey['Nadawca'].map(podmiot_na_numer)
df_sankey['target'] = df_sankey['Odbiorca'].map(podmiot_na_numer)

# --- 4. ANALIZA STRUKTURY GRAFU ---
print("\nKrok 4: Analiza struktury przepływów (NetworkX)...")
G = nx.DiGraph()
for index, row in df_sankey.iterrows():
    G.add_edge(row['Nadawca'], row['Odbiorca'], weight=row['value'])

in_degree = G.in_degree(weight='weight')
out_degree = G.out_degree(weight='weight')
print(f"Liczba transakcji w grafie: {G.number_of_edges()}")
print(f"Największy odbiorca (In-Degree): {max(in_degree, key=lambda x: x[1])}")
print(f"Największy nadawca (Out-Degree): {max(out_degree, key=lambda x: x[1])}")

# --- 5. GENEROWANIE DIAGRAMU SANKEYA ---
print("\nKrok 5: Generowanie Diagramu Sankeya (Plotly)...")

# Kolory węzłów (przykład: firmy na niebiesko, dostawcy na zielono)
kolory = []
for podmiot in wszystkie_podmioty:
    if 'Firma' in podmiot:
        kolory.append('cornflowerblue')
    elif 'Dostawca' in podmiot:
        kolory.append('mediumseagreen')
    else:
        kolory.append('gray')

fig = go.Figure(data=[go.Sankey(
    node=dict(
        pad=15,
        thickness=20,
        line=dict(color="black", width=0.5),
        label=wszystkie_podmioty,
        color=kolory
    ),
    link=dict(
        source=df_sankey['source'].tolist(),
        target=df_sankey['target'].tolist(),
        value=df_sankey['value'].tolist(),
        hovertemplate='Przepływ od %{source.label} do %{target.label}: <b>%{value:,.0f} PLN</b><extra></extra>'
    )
)])

fig.update_layout(
    title_text=f"Przepływy Finansowe w Okresie {start_date} - {end_date}", 
    font_size=10
)

# --- 6. EKSPORT GRAFIKI ---
nazwa_pliku_svg = "przeplywy_finansowe.svg"
nazwa_pliku_png = "przeplywy_finansowe_HD.png"

try:
    fig.write_image(nazwa_pliku_svg)
    print(f"\nKrok 6: Eksport ukończony. Plik wektorowy (SVG) zapisany jako: {nazwa_pliku_svg}")
    fig.write_image(nazwa_pliku_png, scale=3)
    print(f"Plik rastrowy (PNG) w wysokiej rozdzielczości zapisany jako: {nazwa_pliku_png}")
except Exception as e:
    print(f"Błąd podczas eksportu grafiki: {e}\nCzy masz zainstalowany pakiet 'kaleido'?")

print("\nSkrypt zakończony. Sprawdź wygenerowane pliki!")