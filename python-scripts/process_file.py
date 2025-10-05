# python-scripts/process_file.py
import sys
import os
import json
from datetime import datetime

def process_file(file_path):
    """
    Przetwarza plik i zwraca informacje o nim.
    Tutaj możesz dodać swoją własną logikę przetwarzania.
    """
    
    if not os.path.exists(file_path):
        return {
            "error": "File not found",
            "file_path": file_path
        }
    
    # Pobierz informacje o pliku
    file_stats = os.stat(file_path)
    file_size = file_stats.st_size
    file_name = os.path.basename(file_path)
    file_ext = os.path.splitext(file_name)[1]
    
    # Podstawowe przetwarzanie - zlicz linie dla plików tekstowych
    line_count = None
    word_count = None
    content_preview = None
    
    text_extensions = ['.txt', '.csv', '.json', '.xml', '.html', '.py', '.js', '.ts']
    
    if file_ext.lower() in text_extensions:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                line_count = len(lines)
                word_count = len(content.split())
                # Pobierz pierwsze 200 znaków jako podgląd
                content_preview = content[:200] + "..." if len(content) > 200 else content
        except Exception as e:
            content_preview = f"Error reading file: {str(e)}"
    
    # Przygotuj wynik
    result = {
        "status": "success",
        "processed_at": datetime.now().isoformat(),
        "file_info": {
            "name": file_name,
            "path": file_path,
            "size_bytes": file_size,
            "size_kb": round(file_size / 1024, 2),
            "extension": file_ext,
            "is_text_file": file_ext.lower() in text_extensions
        },
        "analysis": {
            "line_count": line_count,
            "word_count": word_count,
            "content_preview": content_preview
        }
    }
    
    return result

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = process_file(file_path)
    
    # Wyświetl wynik jako JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()