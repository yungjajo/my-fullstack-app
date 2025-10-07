'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UploadedFile {
  filename: string;
  size: number;
  uploadedAt: string;
}

interface ProcessResult {
  status: string;
  processed_at: string;
  file_info: {
    name: string;
    size_bytes: number;
    size_kb: number;
    extension: string;
    is_text_file: boolean;
  };
  analysis: {
    line_count: number | null;
    word_count: number | null;
    content_preview: string | null;
  };
}

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Sankey chart SVG
  const [chartSVG, setChartSVG] = useState<string>('');
  // Filters
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{from: string; to: string}>({from: '', to: ''});
  const [entitiesOptions, setEntitiesOptions] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
      setError('');
      setProcessResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Parse Python output
      const pythonOutput = JSON.parse(response.data.pythonOutput);
      setProcessResult(pythonOutput);

      // Refresh file list
      fetchFiles();

      // Ustaw nazwę pliku do dalszej analizy
      setSelectedFileName(response.data.file.filename);

      // Pobierz podmioty do filtrów
      fetchEntities(response.data.file.filename);

      // Reset file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files`);
      setFiles(response.data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const deleteFile = async (filename: string) => {
    try {
      await axios.delete(`${API_URL}/api/files/${filename}`);
      fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Pobierz podmioty do filtrów
  const fetchEntities = async (filename: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/entities/${filename}`);
      setEntitiesOptions(response.data.entities);
    } catch (err) {
      console.error('Error fetching entities:', err);
    }
  };
  // Pobierz wykres Sankey SVG z backendu
  const fetchSankeyChart = async () => {
    if (!selectedFileName) {
      setError('Najpierw wybierz i prześlij plik!');
      return;
    }
    setChartSVG('');
    setError('');
    try {
      const response = await axios.post(`${API_URL}/api/flows`, {
        filename: selectedFileName,
        entities: selectedEntities,
        from: dateRange.from,
        to: dateRange.to
      }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
      });
      setChartSVG(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Nie udało się pobrać wykresu Sankey');
      setChartSVG('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload File</h2>
        <div className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Filtry do analizy przepływów */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Filtruj analizę przepływów</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Podmioty</label>
            <select
              multiple
              value={selectedEntities}
              onChange={e => setSelectedEntities(Array.from(e.target.selectedOptions, opt => opt.value))}
              className="w-full border rounded px-2 py-1"
            >
              {entitiesOptions.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Od</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={e => setDateRange({...dateRange, from: e.target.value})}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Do</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={e => setDateRange({...dateRange, to: e.target.value})}
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded mt-6 md:mt-0"
            onClick={fetchSankeyChart}
          >Pokaż wykres</button>
        </div>
      </div>

      {/* Sekcja wykresu przepływów finansowych */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Diagram przepływów finansowych</h2>
        {chartSVG ? (
          <div dangerouslySetInnerHTML={{ __html: chartSVG }} />
        ) : (
          <p className="text-gray-500">Brak danych do wykresu. Wybierz plik i filtry, aby wygenerować wykres.</p>
        )}
      </div>

      {/* Process Result */}
      {processResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Processing Result</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">File Name</p>
                <p className="font-semibold">{processResult.file_info.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-semibold">{processResult.file_info.size_kb} KB</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Extension</p>
                <p className="font-semibold">{processResult.file_info.extension}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Text File</p>
                <p className="font-semibold">{processResult.file_info.is_text_file ? 'Yes' : 'No'}</p>
              </div>
            </div>
            {processResult.analysis.line_count && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Lines</p>
                  <p className="font-semibold">{processResult.analysis.line_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Words</p>
                  <p className="font-semibold">{processResult.analysis.word_count}</p>
                </div>
              </div>
            )}
            {processResult.analysis.content_preview && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Content Preview</p>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">{processResult.analysis.content_preview}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Files List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>
        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.filename} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                <div>
                  <p className="font-medium">{file.filename}</p>
                  <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB • {new Date(file.uploadedAt).toLocaleString()}</p>
                </div>
                <button onClick={() => deleteFile(file.filename)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}