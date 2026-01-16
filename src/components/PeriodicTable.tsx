import React from 'react';
import { PeriodicElement, ElementCategory } from '../types/element';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'diatomic-nonmetal': 'bg-blue-200 dark:bg-gradient-to-br dark:from-blue-950 dark:to-blue-900 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-800/60 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  'noble-gas': 'bg-purple-200 dark:bg-gradient-to-br dark:from-purple-950 dark:to-purple-900 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-800/60 dark:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  'alkali-metal': 'bg-red-200 dark:bg-gradient-to-br dark:from-red-950 dark:to-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-800/60 dark:shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  'alkaline-earth-metal': 'bg-orange-200 dark:bg-gradient-to-br dark:from-orange-950 dark:to-orange-900 text-orange-900 dark:text-orange-100 border-orange-300 dark:border-orange-800/60 dark:shadow-[0_0_15px_rgba(249,115,22,0.3)]',
  'metalloid': 'bg-teal-200 dark:bg-gradient-to-br dark:from-teal-950 dark:to-teal-900 text-teal-900 dark:text-teal-100 border-teal-300 dark:border-teal-800/60 dark:shadow-[0_0_15px_rgba(20,184,166,0.3)]',
  'polyatomic-nonmetal': 'bg-green-200 dark:bg-gradient-to-br dark:from-green-950 dark:to-green-900 text-green-900 dark:text-green-100 border-green-300 dark:border-green-800/60 dark:shadow-[0_0_15px_rgba(34,197,94,0.3)]',
  'post-transition-metal': 'bg-slate-200 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600/60 dark:shadow-[0_0_15px_rgba(148,163,184,0.2)]',
  'transition-metal': 'bg-yellow-100 dark:bg-gradient-to-br dark:from-yellow-950/80 dark:to-yellow-900/60 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800/60 dark:shadow-[0_0_15px_rgba(234,179,8,0.3)]',
  'lanthanide': 'bg-pink-200 dark:bg-gradient-to-br dark:from-pink-950 dark:to-pink-900 text-pink-900 dark:text-pink-100 border-pink-300 dark:border-pink-800/60 dark:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
  'actinide': 'bg-fuchsia-200 dark:bg-gradient-to-br dark:from-fuchsia-950 dark:to-fuchsia-900 text-fuchsia-900 dark:text-fuchsia-100 border-fuchsia-300 dark:border-fuchsia-800/60 dark:shadow-[0_0_15px_rgba(192,38,211,0.3)]',
  'unknown': 'bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700/60 dark:shadow-[0_0_10px_rgba(156,163,175,0.1)]',
};

interface ElementTileProps {
  element: PeriodicElement;
  onClick: (element: PeriodicElement) => void;
}

const ElementTile: React.FC<ElementTileProps & { highlight?: boolean; isEdited?: boolean }> = ({ element, onClick, highlight, isEdited }) => {
  return (
    <button
      onClick={() => onClick(element)}
      className={cn(
        "flex flex-col items-center justify-center p-1 border-2 rounded-lg transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-2xl active:scale-95 relative backdrop-blur-sm",
        CATEGORY_COLORS[element.category] || CATEGORY_COLORS.unknown,
        "w-full h-full aspect-square",
        highlight === false && "opacity-20 grayscale",
        "dark:hover:shadow-[0_0_25px_currentColor] dark:hover:border-opacity-100"
      )}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
      }}
    >
      {isEdited && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border border-slate-800" title="편집됨" />
      )}
      <span className="text-[0.6rem] self-start leading-none">{element.number}</span>
      <span className="text-sm font-bold leading-tight">{element.symbol}</span>
      <span className="text-[0.5rem] truncate w-full text-center leading-none">{element.name_ko}</span>
    </button>
  );
};

export const PeriodicTable: React.FC<{ 
  elements: PeriodicElement[];
  onElementSelect: (el: PeriodicElement) => void;
  searchQuery?: string;
  editedElementNumbers?: Set<number>;
}> = ({ elements, onElementSelect, searchQuery = '', editedElementNumbers }) => {
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
            isEdited={editedElementNumbers?.has(element.number)}
          />
        );
      })}
    </div>
  );
};
