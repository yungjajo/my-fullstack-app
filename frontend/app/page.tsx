import FileUpload from './components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Wizualizacja Przepływów Finansowych
          </h1>
          <p className="text-gray-600 mt-1">
            Narzędzie do analizy i wizualizacji transakcji finansowych z plików CSV
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FileUpload />
      </div>
    </div>
  );
}
