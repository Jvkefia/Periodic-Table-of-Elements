import React, { useState } from 'react'
import { PeriodicTable } from './components/PeriodicTable'
import { ElementDetail } from './components/ElementDetail'
import { PeriodicElement } from './types/element'
import { Search } from 'lucide-react'

function App() {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          주기율표 학습 도우미
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
          원소를 클릭하여 상세 정보를 확인하고 화학의 기초를 다져보세요.
        </p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="원소 이름이나 기호 검색..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 md:p-8 overflow-x-auto border border-slate-200 dark:border-slate-800">
          <PeriodicTable onElementSelect={setSelectedElement} searchQuery={searchQuery} />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-2">💡 학습 팁</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              같은 족(세로줄)의 원소들은 비슷한 화학적 성질을 가집니다.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-2">🧪 색상 구분</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              배경 색상은 금속, 비금속, 준금속 등 원소의 분류를 나타냅니다.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-2">📚 원소 번호</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              원소 번호는 원자핵 속에 있는 양성자의 수를 의미합니다.
            </p>
          </div>
        </div>
      </main>

      <ElementDetail 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)} 
      />

      <footer className="mt-20 pb-10 text-center text-slate-500 text-sm">
        <p>© 2026 주기율표 학습 사이트. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
