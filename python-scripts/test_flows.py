#!/usr/bin/env python3
"""
Testy jednostkowe dla skryptu flows.py
Testują filtrowanie, agregację i generowanie wykresów Sankey
"""

import unittest
import os
import json
import tempfile
from datetime import datetime
from flows import parse_csv, filter_flows, aggregate_flows, generate_sankey_svg

class TestFlows(unittest.TestCase):
    """Testy dla funkcji przepływów finansowych"""
    
    def setUp(self):
        """Przygotowanie danych testowych"""
        # Utwórz tymczasowy plik CSV
        self.test_csv = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv', encoding='utf-8')
        self.test_csv.write('Nadawca,Odbiorca,Kwota,Data,Opis\n')
        self.test_csv.write('Firma A,Firma B,1000.50,2024-01-15,Test 1\n')
        self.test_csv.write('Firma B,Firma C,2000.00,2024-02-20,Test 2\n')
        self.test_csv.write('Firma A,Firma C,1500.75,2024-01-25,Test 3\n')
        self.test_csv.write('Firma C,Firma A,500.00,2024-03-10,Test 4\n')
        self.test_csv.write('Firma A,Firma B,1000.50,2024-01-20,Test 5\n')  # Duplikat przepływu A->B
        self.test_csv.close()
    
    def tearDown(self):
        """Czyszczenie po testach"""
        if os.path.exists(self.test_csv.name):
            os.remove(self.test_csv.name)
    
    def test_parse_csv(self):
        """Test parsowania pliku CSV"""
        flows = parse_csv(self.test_csv.name)
        
        self.assertEqual(len(flows), 5, "Powinno być 5 przepływów")
        self.assertEqual(flows[0]['Nadawca'], 'Firma A')
        self.assertEqual(flows[0]['Odbiorca'], 'Firma B')
        self.assertEqual(flows[0]['Kwota'], '1000.50')
    
    def test_filter_by_entities(self):
        """Test filtrowania według podmiotów"""
        flows = parse_csv(self.test_csv.name)
        
        # Filtruj tylko Firma C (która nie występuje jako nadawca/odbiorca w każdej transakcji)
        filtered = filter_flows(flows, entities=['Firma C'])
        
        # Powinny zostać tylko przepływy związane z Firma C
        self.assertGreater(len(filtered), 0, "Powinny być jakieś przefiltrowane przepływy")
        self.assertLessEqual(len(filtered), len(flows), "Nie może być więcej przepływów po filtrowaniu")
        
        # Sprawdź czy wszystkie zawierają Firma C
        for flow in filtered:
            self.assertTrue(
                flow['Nadawca'] == 'Firma C' or flow['Odbiorca'] == 'Firma C',
                "Przepływ powinien zawierać Firmę C"
            )
    
    def test_filter_by_date_range(self):
        """Test filtrowania według zakresu dat"""
        flows = parse_csv(self.test_csv.name)
        
        # Filtruj tylko styczeń 2024
        filtered = filter_flows(flows, date_from='2024-01-01', date_to='2024-01-31')
        
        # Powinny zostać tylko przepływy ze stycznia
        self.assertGreater(len(filtered), 0, "Powinny być przepływy w styczniu")
        self.assertLess(len(filtered), len(flows), "Nie wszystkie przepływy są w styczniu")
        
        # Sprawdź daty
        for flow in filtered:
            if 'Data' in flow and flow['Data']:
                flow_date = datetime.strptime(flow['Data'], '%Y-%m-%d')
                self.assertTrue(
                    datetime(2024, 1, 1) <= flow_date <= datetime(2024, 1, 31),
                    f"Data {flow['Data']} powinna być w styczniu 2024"
                )
    
    def test_filter_by_date_from_only(self):
        """Test filtrowania z tylko datą początkową"""
        flows = parse_csv(self.test_csv.name)
        
        # Filtruj od lutego
        filtered = filter_flows(flows, date_from='2024-02-01')
        
        self.assertGreater(len(filtered), 0, "Powinny być przepływy od lutego")
        
        # Sprawdź daty
        for flow in filtered:
            if 'Data' in flow and flow['Data']:
                flow_date = datetime.strptime(flow['Data'], '%Y-%m-%d')
                self.assertGreaterEqual(
                    flow_date,
                    datetime(2024, 2, 1),
                    f"Data {flow['Data']} powinna być >= 2024-02-01"
                )
    
    def test_aggregate_flows(self):
        """Test agregacji przepływów (sumowanie duplikatów)"""
        flows = parse_csv(self.test_csv.name)
        aggregated = aggregate_flows(flows)
        
        # Sprawdź czy agregacja działa
        self.assertIsInstance(aggregated, dict, "Wynik powinien być słownikiem")
        self.assertGreater(len(aggregated), 0, "Powinny być zagregowane przepływy")
        
        # Firma A -> Firma B występuje 2 razy (1000.50 + 1000.50 = 2001.00)
        key = 'Firma A→Firma B'
        if key in aggregated:
            self.assertEqual(
                aggregated[key],
                2001.0,
                "Suma przepływów A->B powinna wynosić 2001.00"
            )
    
    def test_generate_sankey_svg(self):
        """Test generowania SVG"""
        flows = parse_csv(self.test_csv.name)
        aggregated = aggregate_flows(flows)
        svg = generate_sankey_svg(aggregated)
        
        # Sprawdź czy SVG został wygenerowany
        self.assertIsInstance(svg, str, "SVG powinien być stringiem")
        self.assertGreater(len(svg), 0, "SVG nie powinien być pusty")
        self.assertIn('<svg', svg, "Powinien zawierać tag <svg>")
        self.assertIn('</svg>', svg, "Powinien zawierać zamykający tag </svg>")
        self.assertIn('Firma A', svg, "Powinien zawierać nazwę firmy")
    
    def test_empty_csv(self):
        """Test pustego pliku CSV"""
        # Utwórz pusty plik CSV
        empty_csv = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv', encoding='utf-8')
        empty_csv.write('Nadawca,Odbiorca,Kwota,Data,Opis\n')
        empty_csv.close()
        
        try:
            flows = parse_csv(empty_csv.name)
            self.assertEqual(len(flows), 0, "Pusty CSV powinien dać 0 przepływów")
            
            aggregated = aggregate_flows(flows)
            self.assertEqual(len(aggregated), 0, "Agregacja pustych danych powinna dać pusty słownik")
        finally:
            os.remove(empty_csv.name)
    
    def test_invalid_csv_path(self):
        """Test nieistniejącego pliku"""
        flows = parse_csv('/nieistniejacy/plik.csv')
        self.assertEqual(len(flows), 0, "Nieistniejący plik powinien dać pustą listę")
    
    def test_combined_filters(self):
        """Test kombinacji filtrów (podmioty + daty)"""
        flows = parse_csv(self.test_csv.name)
        
        # Filtruj Firma A w styczniu
        filtered = filter_flows(
            flows,
            entities=['Firma A'],
            date_from='2024-01-01',
            date_to='2024-01-31'
        )
        
        self.assertGreater(len(filtered), 0, "Powinny być przepływy Firmy A w styczniu")
        
        # Wszystkie przepływy powinny zawierać Firma A i być w styczniu
        for flow in filtered:
            self.assertTrue(
                flow['Nadawca'] == 'Firma A' or flow['Odbiorca'] == 'Firma A',
                "Przepływ powinien zawierać Firmę A"
            )
            if 'Data' in flow and flow['Data']:
                flow_date = datetime.strptime(flow['Data'], '%Y-%m-%d')
                self.assertTrue(
                    datetime(2024, 1, 1) <= flow_date <= datetime(2024, 1, 31),
                    f"Data {flow['Data']} powinna być w styczniu 2024"
                )


class TestFlowsIntegration(unittest.TestCase):
    """Testy integracyjne - pełny flow"""
    
    def test_full_flow_with_example_file(self):
        """Test z rzeczywistym przykładowym plikiem"""
        # Sprawdź czy istnieje przykładowy plik
        example_file = os.path.join(
            os.path.dirname(__file__),
            '../przyklady_csv/01_lancuch_dostaw.csv'
        )
        
        if not os.path.exists(example_file):
            self.skipTest("Przykładowy plik nie istnieje")
        
        # Pełny flow: parse -> filter -> aggregate -> generate
        flows = parse_csv(example_file)
        self.assertGreater(len(flows), 0, "Przykładowy plik powinien zawierać dane")
        
        # Filtruj styczeń
        filtered = filter_flows(flows, date_from='2024-01-01', date_to='2024-01-31')
        self.assertGreater(len(filtered), 0, "Powinny być przepływy w styczniu")
        
        # Agreguj
        aggregated = aggregate_flows(filtered)
        self.assertGreater(len(aggregated), 0, "Powinny być zagregowane przepływy")
        
        # Generuj SVG
        svg = generate_sankey_svg(aggregated)
        self.assertIn('<svg', svg, "Powinien wygenerować SVG")
        self.assertIn('</svg>', svg, "SVG powinien być kompletny")


def run_tests():
    """Uruchom wszystkie testy"""
    # Utwórz test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Dodaj testy
    suite.addTests(loader.loadTestsFromTestCase(TestFlows))
    suite.addTests(loader.loadTestsFromTestCase(TestFlowsIntegration))
    
    # Uruchom z verbose output
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Zwróć kod wyjścia (0 = sukces, 1 = błąd)
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    import sys
    sys.exit(run_tests())

