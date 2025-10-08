'use client';

import Link from 'next/link';

export default function PomocPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Pomoc - Instrukcja Użytkownika
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Przewodnik krok po kroku
            </p>
          </div>
          <Link 
            href="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            ← Powrót do aplikacji
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Spis treści */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Spis Treści</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#csv" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline">
              <span className="text-2xl">📄</span>
              <span>Jak przygotować plik CSV</span>
            </a>
            <a href="#rejestr" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline">
              <span className="text-2xl">📁</span>
              <span>Zarządzanie dokumentami</span>
            </a>
            <a href="#diagram" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline">
              <span className="text-2xl">📊</span>
              <span>Generowanie diagramów</span>
            </a>
          </div>
        </div>

        {/* Sekcja 1: Przygotowanie pliku CSV */}
        <section id="csv" className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📄</span>
            Jak przygotować plik CSV
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Wymagane kolumny</h3>
              <p className="text-gray-700 mb-4">
                Twój plik CSV musi zawierać następujące kolumny (mogą być w dowolnej kolejności):
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 font-semibold">Kolumna</th>
                      <th className="text-left py-2 font-semibold">Opis</th>
                      <th className="text-left py-2 font-semibold">Wymagane</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 font-mono text-blue-600">Nadawca</td>
                      <td className="py-2">Nazwa podmiotu wysyłającego środki</td>
                      <td className="py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">TAK</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-blue-600">Odbiorca</td>
                      <td className="py-2">Nazwa podmiotu odbierającego środki</td>
                      <td className="py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">TAK</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-blue-600">Kwota</td>
                      <td className="py-2">Wartość transakcji (liczba)</td>
                      <td className="py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">TAK</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-purple-600">Data</td>
                      <td className="py-2">Data transakcji (do filtrowania)</td>
                      <td className="py-2"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Opcjonalne</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-purple-600">Opis</td>
                      <td className="py-2">Opis transakcji</td>
                      <td className="py-2"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Opcjonalne</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">✍️ Przykładowy plik CSV</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono">
{`Nadawca,Odbiorca,Kwota,Data,Opis
Firma A,Firma B,15000.50,2024-01-15,Płatność za usługi
Firma B,Firma C,8500.00,2024-01-20,Zakup materiałów
Firma A,Firma C,12000.00,2024-02-01,Inwestycja
Firma C,Firma D,5500.75,2024-02-10,Wynagrodzenie`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💰 Obsługiwane formaty kwot</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <code className="text-green-700 font-semibold">15000.50</code>
                  <p className="text-xs text-gray-600 mt-1">Kropka</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <code className="text-green-700 font-semibold">15000,50</code>
                  <p className="text-xs text-gray-600 mt-1">Przecinek</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <code className="text-green-700 font-semibold">15 000.50</code>
                  <p className="text-xs text-gray-600 mt-1">Spacje + kropka</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <code className="text-green-700 font-semibold">15 000,50</code>
                  <p className="text-xs text-gray-600 mt-1">Spacje + przecinek</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📅 Obsługiwane formaty dat</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold">ZALECANE</span>
                  <code className="font-mono text-blue-600">2024-01-15</code>
                  <span className="text-gray-600">(YYYY-MM-DD)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">Akceptowane</span>
                  <code className="font-mono text-gray-600">2024/01/15</code>
                  <span className="text-gray-600">(YYYY/MM/DD)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">Akceptowane</span>
                  <code className="font-mono text-gray-600">15-01-2024</code>
                  <span className="text-gray-600">(DD-MM-YYYY)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sekcja 2: Zarządzanie dokumentami */}
        <section id="rejestr" className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📁</span>
            Zarządzanie Dokumentami w Rejestrze
          </h2>

          <div className="space-y-6">
            {/* Statystyki */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Statystyki Rejestru</h3>
              <p className="text-gray-700 mb-4">
                Na górze zakładki "Rejestr Dokumentów" zobaczysz trzy ważne informacje:
              </p>
              <div className="space-y-2 ml-4">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-gray-900">Liczba dokumentów</span>
                    <span className="text-gray-600"> - Ile plików CSV jest w rejestrze</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-gray-900">Liczba firm</span>
                    <span className="text-gray-600"> - Ile unikalnych podmiotów (Nadawców i Odbiorców)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-gray-900">Zakres dat</span>
                    <span className="text-gray-600"> - Od najstarszej do najnowszej transakcji</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Wskazówka:</strong> Statystyki aktualizują się automatycznie gdy dodajesz lub usuwasz pliki!
                </p>
              </div>
            </div>

            {/* Dodawanie dokumentu */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">➕ Jak dodać dokument</h3>
              <ol className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <span className="font-semibold">Przejdź do zakładki "Rejestr Dokumentów Finansowych"</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <span className="font-semibold">Kliknij "Wybierz plik"</span>
                    <p className="text-gray-600 text-sm mt-1">Możesz wybrać plik ze swojego komputera lub użyć przykładów z folderu przyklady_csv/</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <span className="font-semibold">Kliknij "⬆️ Dodaj"</span>
                    <p className="text-gray-600 text-sm mt-1">Plik zostanie automatycznie przetworzony i dodany do rejestru</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <div>
                    <span className="font-semibold text-green-700">Gotowe!</span>
                    <p className="text-gray-600 text-sm mt-1">Zobaczysz komunikat sukcesu, a plik pojawi się na liście</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Sprawdzanie szczegółów */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">ℹ️ Jak sprawdzić szczegóły pliku</h3>
              <ol className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <span className="font-semibold">Znajdź plik na liście dokumentów</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <span className="font-semibold">Kliknij ikonę "ℹ️" przy pliku</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <span className="font-semibold">Zobaczysz okno z informacjami:</span>
                    <ul className="text-gray-600 text-sm mt-2 space-y-1 ml-4">
                      <li>• Data dodania pliku</li>
                      <li>• Liczba wpisów (wierszy danych)</li>
                      <li>• Liczba unikalnych firm</li>
                      <li>• Liczba transakcji</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>

            {/* Usuwanie dokumentu */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🗑️ Jak usunąć dokument</h3>
              <ol className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <span className="font-semibold">Znajdź plik na liście dokumentów</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <span className="font-semibold">Kliknij ikonę kosza "🗑️" przy pliku</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <span className="font-semibold">Potwierdź usunięcie w oknie modalnym</span>
                    <p className="text-gray-600 text-sm mt-1">Kliknij "Usuń" aby potwierdzić lub "Anuluj" aby wrócić</p>
                  </div>
                </li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Uwaga:</strong> Usunięcie pliku jest nieodwracalne! Upewnij się że wybierasz właściwy plik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sekcja 3: Generowanie diagramów */}
        <section id="diagram" className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Generowanie Diagramów Przepływów
          </h2>

          <div className="space-y-6">
            {/* Informacja o zakresie dat */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                Ważne: Informacja o zakresie dat
              </h3>
              <p className="text-gray-700 mb-4">
                Pod polami wyboru dat w zakładce "Diagram Przepływów" zobaczysz <strong>niebieską ramkę z informacją</strong>:
              </p>
              <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  ℹ️ <strong>Rejestr zawiera dane z okresu od 2024-01-05 do 2024-05-01</strong>
                </p>
              </div>
              <p className="text-gray-700">
                Ta informacja mówi Ci <strong>w jakim zakresie dat możesz filtrować</strong> dane. 
                Jeśli wybierzesz daty poza tym zakresem, diagram może być pusty.
              </p>
            </div>

            {/* Podstawowe generowanie */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Generowanie diagramu (wszystkie dane)</h3>
              <ol className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <span className="font-semibold">Przejdź do zakładki "Diagram Przepływów Finansowych"</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <span className="font-semibold">Kliknij "📊 Wygeneruj Diagram"</span>
                    <p className="text-gray-600 text-sm mt-1">Bez ustawiania żadnych filtrów</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <span className="font-semibold">Poczekaj chwilę (generowanie trwa kilka sekund)</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <div>
                    <span className="font-semibold text-green-700">Wykres Sankey pojawi się poniżej!</span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Filtrowanie według dat */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📅 Filtrowanie według zakresu dat</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 mb-4 border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">💡 KROK PRZYGOTOWAWCZY - Sprawdź dostępny zakres!</p>
                <p className="text-gray-700 text-sm">
                  Przed ustawieniem filtrów, <strong>sprawdź niebieską ramkę</strong> z informacją o zakresie dat.
                  Dzięki temu będziesz wiedzieć jakie daty możesz wybrać.
                </p>
              </div>

              <ol className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <span className="font-semibold">Sprawdź zakres dat w niebieskiej ramce</span>
                    <p className="text-gray-600 text-sm mt-1">Przykład: "Rejestr zawiera dane od 2024-01-05 do 2024-05-01"</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <span className="font-semibold">Ustaw "Data od"</span>
                    <p className="text-gray-600 text-sm mt-1">Wybierz datę początkową (nie wcześniejszą niż pokazana w zakresie)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <span className="font-semibold">Ustaw "Data do"</span>
                    <p className="text-gray-600 text-sm mt-1">Wybierz datę końcową (nie późniejszą niż pokazana w zakresie)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <div>
                    <span className="font-semibold">Kliknij "📊 Wygeneruj Diagram"</span>
                  </div>
                </li>
              </ol>

              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-gray-800">
                  <strong>⚠️ Ważne:</strong> Jeśli ustawisz daty <strong>poza dostępnym zakresem</strong>, 
                  diagram może być pusty lub pokazywać tylko częściowe dane. Zawsze sprawdzaj zakres w niebieskiej ramce!
                </p>
              </div>
            </div>

            {/* Filtrowanie według firm */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🏢 Filtrowanie według firm</h3>
              <ol className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <span className="font-semibold">W sekcji "Wybierz podmioty" zaznacz interesujące Cię firmy</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <span className="font-semibold">Kliknij "📊 Wygeneruj Diagram"</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <span className="font-semibold">Diagram pokaże tylko przepływy związane z wybranymi firmami</span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Praktyczny przykład */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Przykład: Raport kwartalny Q1 2024
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Krok 1: Sprawdź statystyki</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200 text-sm">
                    <p className="text-gray-700">Przejdź do zakładki "Rejestr" i zobacz:</p>
                    <div className="mt-2 ml-4 space-y-1 font-mono text-xs">
                      <p>📁 Aktualnie w rejestrze: <span className="text-blue-600 font-bold">8</span> dokument(ów)</p>
                      <p>🏢 Liczba firm: <span className="text-green-600 font-bold">43</span></p>
                      <p>📅 Zakres dat: <span className="text-purple-600 font-bold">2024-01-05 do 2024-05-01</span></p>
                    </div>
                    <p className="text-gray-600 mt-2 italic">→ Wiesz już że Q1 (styczeń-marzec) jest dostępny!</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Krok 2: Ustaw filtry</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200 text-sm">
                    <p className="text-gray-700">W zakładce "Diagram":</p>
                    <div className="mt-2 ml-4 space-y-1">
                      <p>• Data od: <code className="bg-gray-100 px-2 py-1 rounded">2024-01-05</code></p>
                      <p>• Data do: <code className="bg-gray-100 px-2 py-1 rounded">2024-03-31</code></p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Krok 3: Wygeneruj</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200 text-sm">
                    <p className="text-gray-700">Kliknij "📊 Wygeneruj Diagram"</p>
                    <p className="text-green-700 mt-2 font-semibold">✅ Diagram pokaże tylko transakcje z Q1 2024!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Czyszczenie filtrów */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔄 Jak wyczyścić filtry</h3>
              <p className="text-gray-700 mb-3">
                Jeśli chcesz wrócić do wyświetlania wszystkich danych:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800">
                  Kliknij przycisk <strong className="text-blue-600">"🔄 Wyczyść filtry"</strong> (pojawia się gdy ustawione są jakiekolwiek filtry)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wskazówki */}
        <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg shadow-md p-8 border border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Przydatne Wskazówki
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-2">📊 Wykorzystaj statystyki rejestru</h4>
              <p className="text-gray-700 text-sm">
                Przed filtrowaniem sprawdź statystyki w zakładce "Rejestr" - dowiesz się ile firm i jaki zakres dat masz dostępny. 
                To pomoże Ci lepiej zaplanować filtry!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-2">📅 Zawsze sprawdzaj zakres dat</h4>
              <p className="text-gray-700 text-sm">
                Niebieski box pod polami dat to Twój przyjaciel! Pokazuje dokładnie jakie daty możesz wybrać.
                Jeśli Twój zakres jest poza tym, diagram może być pusty.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-2">🔄 Statystyki auto-aktualizują się</h4>
              <p className="text-gray-700 text-sm">
                Gdy dodajesz lub usuwasz plik, statystyki (liczba firm, zakres dat) aktualizują się automatycznie. 
                Nie musisz odświeżać strony!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-2">📁 Używaj przykładowych plików</h4>
              <p className="text-gray-700 text-sm">
                W folderze <code className="bg-gray-100 px-2 py-1 rounded text-xs">przyklady_csv/</code> znajdziesz 
                10 gotowych plików do testowania różnych scenariuszy biznesowych.
              </p>
            </div>
          </div>
        </section>

        {/* Przycisk powrotu */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
          >
            ← Powrót do aplikacji
          </Link>
        </div>
      </div>
    </div>
  );
}

