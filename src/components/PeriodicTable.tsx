import React from 'react';
import { elements } from '../data/elements';
import { PeriodicElement, ElementCategory } from '../types/element';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'diatomic-nonmetal': 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-800',
  'noble-gas': 'bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-800',
  'alkali-metal': 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-800',
  'alkaline-earth-metal': 'bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100 border-orange-300 dark:border-orange-800',
  'metalloid': 'bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-100 border-teal-300 dark:border-teal-800',
  'polyatomic-nonmetal': 'bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 border-green-300 dark:border-green-800',
  'post-transition-metal': 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600',
  'transition-metal': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800',
  'lanthanide': 'bg-pink-200 dark:bg-pink-900 text-pink-900 dark:text-pink-100 border-pink-300 dark:border-pink-800',
  'actinide': 'bg-fuchsia-200 dark:bg-fuchsia-900 text-fuchsia-900 dark:text-fuchsia-100 border-fuchsia-300 dark:border-fuchsia-800',
  'unknown': 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700',
};

interface ElementTileProps {
  element: PeriodicElement;
  onClick: (element: PeriodicElement) => void;
}

const ElementTile: React.FC<ElementTileProps & { highlight?: boolean }> = ({ element, onClick, highlight }) => {
  return (
    <button
      onClick={() => onClick(element)}
      className={cn(
        "flex flex-col items-center justify-center p-1 border rounded transition-all hover:scale-105 hover:z-10 hover:shadow-lg active:scale-95",
        CATEGORY_COLORS[element.category] || CATEGORY_COLORS.unknown,
        "w-full h-full aspect-square",
        highlight === false && "opacity-20 grayscale"
      )}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
      }}
    >
      <span className="text-[0.6rem] self-start leading-none">{element.number}</span>
      <span className="text-sm font-bold leading-tight">{element.symbol}</span>
      <span className="text-[0.5rem] truncate w-full text-center leading-none">{element.name_ko}</span>
    </button>
  );
};

export const PeriodicTable: React.FC<{ 
  onElementSelect: (el: PeriodicElement) => void;
  searchQuery?: string;
}> = ({ onElementSelect, searchQuery = '' }) => {
  const query = searchQuery.toLowerCase();
  
  return (
    <div className="grid grid-cols-18 gap-1 min-w-[800px]">
      {elements.map((element) => {
        const matches = 
          element.name.toLowerCase().includes(query) || 
          element.name_ko.includes(query) ||
          element.symbol.toLowerCase().includes(query) ||
          element.number.toString().includes(query);
          
        return (
          <ElementTile 
            key={element.number} 
            element={element} 
            onClick={onElementSelect}
            highlight={query ? matches : undefined}
          />
        );
      })}
    </div>
  );
};
