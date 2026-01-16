import React from 'react';
import { PeriodicElement, ElementCategory } from '../types/element';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ElementDetailProps {
  element: PeriodicElement | null;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'diatomic-nonmetal': '이원자 비금속',
  'noble-gas': '비활성 기체',
  'alkali-metal': '알칼리 금속',
  'alkaline-earth-metal': '알칼리 토금속',
  'metalloid': '준금속',
  'polyatomic-nonmetal': '다원자 비금속',
  'post-transition-metal': '전이후 금속',
  'transition-metal': '전이 금속',
  'lanthanide': '란타넘족',
  'actinide': '악티늄족',
  'unknown': '알 수 없음',
};

export const ElementDetail: React.FC<ElementDetailProps> = ({ element, onClose }) => {
  if (!element) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className={cn(
              "w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg",
              "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            )}>
              <span className="text-xl font-medium text-slate-400">{element.number}</span>
              <span className="text-5xl font-bold mb-1">{element.symbol}</span>
              <span className="text-sm font-medium text-slate-500">{element.atomic_mass.toFixed(3)}</span>
            </div>
          </div>

          <div className="flex-grow">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-2 inline-block">
                {CATEGORY_LABELS[element.category]}
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{element.name_ko}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{element.name}</p>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {element.summary_ko || element.summary}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">상태</span>
                <span className="text-sm font-medium">{element.phase}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">발견자</span>
                <span className="text-sm font-medium">{element.discovered_by || '알려지지 않음'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">밀도</span>
                <span className="text-sm font-medium">{element.density ? `${element.density} g/cm³` : 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">녹는점</span>
                <span className="text-sm font-medium">{element.melt ? `${element.melt} K` : 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">끓는점</span>
                <span className="text-sm font-medium">{element.boil ? `${element.boil} K` : 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">전자 배치</span>
                <span className="text-sm font-medium">{element.electron_configuration}</span>
              </div>
            </div>

            <div className="mt-8">
              <a 
                href={element.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm font-medium"
              >
                위키백과에서 더 보기 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
