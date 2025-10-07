'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UploadedFile {
  filename: string;
  size: number;
  uploadedAt: string;
}

interface FileStats {
  entries: number;
  entities: number;
  transactions: number;
}

export default function FileUpload() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'registry'>('diagram');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Diagram state
  const [chartSVG, setChartSVG] = useState<string>('');
  const [dateRange, setDateRange] = useState<{from: string; to: string}>({from: '', to: ''});
  const [loadingChart, setLoadingChart] = useState(false);
  const [diagramStats, setDiagramStats] = useState<{documents: number; entities: number; transactions: number} | null>(null);
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [fileInfo, setFileInfo] = useState<any>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files`);
      setFiles(response.data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Proszę najpierw wybrać plik');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchFiles();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Pokaż komunikat sukcesu
      alert('✅ Plik został pomyślnie dodany do rejestru!');
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Błąd podczas przesyłania pliku');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (filename: string) => {
    setFileToDelete(filename);
    setShowDeleteModal(true);
  };

  const deleteFile = async () => {
    if (!fileToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/api/files/${fileToDelete}`);
      fetchFiles();
      setShowDeleteModal(false);
      setFileToDelete(null);
      setChartSVG(''); // Wyczyść diagram
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const showFileInfo = async (filename: string) => {
    try {
      // Pobierz entities dla pliku
      const entitiesResponse = await axios.get(`${API_URL}/api/entities/${filename}`);
      const file = files.find(f => f.filename === filename);
      
      setFileInfo({
        filename: filename,
        uploadedAt: file?.uploadedAt,
        size: file?.size,
        entities: entitiesResponse.data.entities.length,
        entitiesList: entitiesResponse.data.entities
      });
      setShowInfoModal(true);
    } catch (err) {
      console.error('Error fetching file info:', err);
    }
  };

  const generateDiagram = async () => {
    if (files.length === 0) {
      setError('Brak dokumentów do przetworzenia');
      return;
    }

    setLoadingChart(true);
    setError('');
    
    try {
      // Użyj pierwszego pliku CSV z rejestru
      const csvFile = files.find(f => f.filename.endsWith('.csv'));
      if (!csvFile) {
        setError('Brak plików CSV w rejestrze');
        return;
      }

      const response = await axios.post(`${API_URL}/api/flows`, {
        filename: csvFile.filename,
        entities: [], // Wszystkie podmioty
        from: dateRange.from,
        to: dateRange.to
      }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
      });
      
      setChartSVG(response.data);
      
      // Pobierz statystyki
      const entitiesResponse = await axios.get(`${API_URL}/api/entities/${csvFile.filename}`);
      
      // Szacuj liczbę transakcji (przybliżona - można by dodać endpoint do tego)
      const fileSize = files.find(f => f.filename === csvFile.filename)?.size || 0;
      const estimatedTransactions = Math.floor(fileSize / 100); // Przybliżenie
      
      setDiagramStats({
        documents: files.filter(f => f.filename.endsWith('.csv')).length,
        entities: entitiesResponse.data.entities.length,
        transactions: estimatedTransactions
      });
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Nie udało się wygenerować wykresu');
      setChartSVG('');
    } finally {
      setLoadingChart(false);
    }
  };

  // Automatycznie wygeneruj diagram gdy są pliki (tylko przy pierwszym załadowaniu)
  useEffect(() => {
    if (files.length > 0 && !chartSVG && activeTab === 'diagram') {
      generateDiagram();
    }
  }, [files]);

  return (
    <div className="space-y-6">
      {/* Zakładki */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'diagram'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Diagram Przepływów
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'registry'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            📁 Rejestr Dokumentów Finansowych
          </button>
        </div>

        {/* ZAKŁADKA 1: DIAGRAM PRZEPŁYWÓW */}
        {activeTab === 'diagram' && (
          <div className="p-6">
            {/* Filtry - zawsze widoczne na górze */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 Parametry Diagramu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Data od
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={e => setDateRange({...dateRange, from: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Data do
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={e => setDateRange({...dateRange, to: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={generateDiagram}
                    disabled={loadingChart || files.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {loadingChart ? '⏳ Generowanie...' : '📊 Wygeneruj Diagram'}
                  </button>
                </div>
              </div>
              {dateRange.from || dateRange.to ? (
                <button
                  onClick={() => {
                    setDateRange({from: '', to: ''});
                    generateDiagram();
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  🔄 Wyczyść filtry
                </button>
              ) : null}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                ⚠️ {error}
              </div>
            )}

            {/* Diagram lub komunikat */}
            {files.length === 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 text-center">
                <p className="text-6xl mb-4">📄</p>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Brak dokumentów do przetwarzania
                </p>
                <p className="text-gray-600 mb-4">
                  Przejdź do zakładki <strong>Rejestr Dokumentów</strong> i wprowadź pierwszy dokument finansowy.
                </p>
                <button
                  onClick={() => setActiveTab('registry')}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  📁 Przejdź do Rejestru
                </button>
              </div>
            ) : (
              <>
                {/* Diagram */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">
                      📈 Diagram Przepływów Finansowych (Sankey)
                    </h2>
                  </div>
                  <div className="p-6">
                    {chartSVG ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <div dangerouslySetInnerHTML={{ __html: chartSVG }} />
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-400">
                        <p className="text-6xl mb-4">📊</p>
                        <p className="text-lg font-medium text-gray-600">
                          Kliknij "Wygeneruj Diagram" aby zobaczyć wykres
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabela podsumowania - tylko gdy diagram jest wygenerowany */}
                {diagramStats && chartSVG && (
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      📊 Podsumowanie Diagramu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Dokumentów przetworzonych</p>
                            <p className="text-3xl font-bold text-blue-600">{diagramStats.documents}</p>
                          </div>
                          <div className="text-4xl">📄</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Firm w diagramie</p>
                            <p className="text-3xl font-bold text-green-600">{diagramStats.entities}</p>
                          </div>
                          <div className="text-4xl">🏢</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Transakcji</p>
                            <p className="text-3xl font-bold text-purple-600">{diagramStats.transactions}</p>
                          </div>
                          <div className="text-4xl">💰</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ZAKŁADKA 2: REJESTR DOKUMENTÓW */}
        {activeTab === 'registry' && (
          <div className="p-6">
            {/* Statystyki i upload */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    📊 Statystyki Rejestru
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Aktualnie w rejestrze: <span className="font-bold text-blue-600">{files.length}</span> dokument(ów)
                  </p>
                </div>
              </div>

              {/* Upload */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">📤 Dodaj Nowy Dokument</h4>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Format pliku:</strong> CSV z kolumnami: Nadawca, Odbiorca, Kwota, Data, Opis
                </p>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="flex-1 text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 file:cursor-pointer"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    {uploading ? '⏳ Dodawanie...' : '⬆️ Dodaj'}
                  </button>
                </div>
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Wybrany: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                ⚠️ {error}
              </div>
            )}

            {/* Lista dokumentów */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h3 className="text-xl font-semibold text-white">
                  📁 Dokumenty w Rejestrze
                </h3>
              </div>
              <div className="p-6">
                {files.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-5xl mb-3">📄</p>
                    <p className="text-lg font-medium text-gray-600">Rejestr jest pusty</p>
                    <p className="text-sm text-gray-500 mt-1">Dodaj pierwszy dokument powyżej</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={file.filename}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{file.filename.endsWith('.csv') ? '📊' : '📄'}</span>
                            <div>
                              <p className="font-medium text-gray-900">{index + 1}. {file.filename}</p>
                              <p className="text-sm text-gray-500">
                                {Math.round(file.size / 1024)} KB • Dodano: {new Date(file.uploadedAt).toLocaleString('pl-PL')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showFileInfo(file.filename)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Informacje o pliku"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(file.filename)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Usuń dokument"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Potwierdzenie usunięcia */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🗑️ Potwierdzenie usunięcia</h3>
            <p className="text-gray-600 mb-6">
              Czy na pewno chcesz usunąć dokument <strong>{fileToDelete}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ Tej operacji nie można cofnąć!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFileToDelete(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={deleteFile}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Informacje o pliku */}
      {showInfoModal && fileInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">ℹ️ Informacje o Dokumencie</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Nazwa pliku</p>
                <p className="font-semibold text-gray-900">{fileInfo.filename}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Dodano</p>
                  <p className="font-semibold text-gray-900">
                    {fileInfo.uploadedAt ? new Date(fileInfo.uploadedAt).toLocaleString('pl-PL') : 'N/A'}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Rozmiar</p>
                  <p className="font-semibold text-gray-900">
                    {fileInfo.size ? Math.round(fileInfo.size / 1024) : 0} KB
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Liczba firm w dokumencie</p>
                <p className="text-3xl font-bold text-purple-600 mb-3">{fileInfo.entities} firm</p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                    Zobacz listę firm
                  </summary>
                  <div className="mt-2 space-y-1">
                    {fileInfo.entitiesList?.map((entity: string, idx: number) => (
                      <p key={idx} className="text-gray-700">• {entity}</p>
                    ))}
                  </div>
                </details>
              </div>
            </div>
            
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
