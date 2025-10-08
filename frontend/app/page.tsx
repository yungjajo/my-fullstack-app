import FileUpload from './components/FileUpload';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Wizualizacja Przepływów Finansowych
            </h1>
            <p className="text-gray-600 mt-1">
              Narzędzie do analizy i wizualizacji transakcji finansowych z plików CSV
            </p>
          </div>
          
          {/* Ikona pomocy */}
          <Link 
            href="/pomoc"
            className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all shadow-md hover:shadow-lg group relative"
            title="Pomoc i instrukcje"
          >
            <span className="group-hover:scale-110 transition-transform">ℹ️</span>
            <div className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Pomoc
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FileUpload />
      </div>
    </div>
  );
}
