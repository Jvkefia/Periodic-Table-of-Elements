import React, { useState, useEffect, useMemo } from 'react'
import { PeriodicTable } from './components/PeriodicTable'
import { ElementDetail } from './components/ElementDetail'
import { PeriodicElement } from './types/element'
import { Search, RotateCcw } from 'lucide-react'
import { elements as originalElements } from './data/elements'

const STORAGE_KEY = 'periodic-table-edits';

function App() {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedElements, setEditedElements] = useState<Record<number, PeriodicElement>>({});

  // Load edited elements from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEditedElements(parsed);
      } catch (e) {
        console.error('Failed to load edited elements:', e);
      }
    }
  }, []);

  // Merge original elements with edited ones
  const elements = useMemo(() => {
    return originalElements.map(element => {
      const edited = editedElements[element.number];
      return edited || element;
    });
  }, [editedElements]);

  const handleElementUpdate = (updatedElement: PeriodicElement) => {
    const newEditedElements = {
      ...editedElements,
      [updatedElement.number]: updatedElement
    };
    setEditedElements(newEditedElements);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEditedElements));
    
    // Update selected element if it's the one being edited
    if (selectedElement?.number === updatedElement.number) {
      setSelectedElement(updatedElement);
    }
  };

  const handleResetEdits = () => {
    if (confirm('모든 편집 내용을 초기화하시겠습니까?')) {
      setEditedElements({});
      localStorage.removeItem(STORAGE_KEY);
      if (selectedElement) {
        const original = originalElements.find(e => e.number === selectedElement.number);
        if (original) {
          setSelectedElement(original);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          주기율표 학습 도우미
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          원소를 클릭하여 상세 정보를 확인하고 편집할 수 있습니다. 화학의 기초를 다져보세요.
        </p>
        
        {Object.keys(editedElements).length > 0 && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleResetEdits}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              편집 내용 초기화 ({Object.keys(editedElements).length}개 편집됨)
            </button>
          </div>
        )}

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="원소 이름이나 기호 검색..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-400 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-4 md:p-8 overflow-x-auto border border-slate-700">
          <PeriodicTable 
            elements={elements} 
            onElementSelect={setSelectedElement} 
            searchQuery={searchQuery}
            editedElementNumbers={new Set(Object.keys(editedElements).map(Number))}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-slate-900 rounded-xl shadow-md border border-slate-700">
            <h3 className="font-bold mb-2 text-white">💡 학습 팁</h3>
            <p className="text-sm text-slate-300">
              같은 족(세로줄)의 원소들은 비슷한 화학적 성질을 가집니다.
            </p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl shadow-md border border-slate-700">
            <h3 className="font-bold mb-2 text-white">🧪 색상 구분</h3>
            <p className="text-sm text-slate-300">
              배경 색상은 금속, 비금속, 준금속 등 원소의 분류를 나타냅니다.
            </p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl shadow-md border border-slate-700">
            <h3 className="font-bold mb-2 text-white">📚 원소 번호</h3>
            <p className="text-sm text-slate-300">
              원소 번호는 원자핵 속에 있는 양성자의 수를 의미합니다.
            </p>
          </div>
        </div>
      </main>

      <ElementDetail 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)}
        onUpdate={handleElementUpdate}
      />

      <footer className="mt-20 pb-10 text-center text-slate-400 text-sm">
        <p>© 2026 주기율표 학습 사이트. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
