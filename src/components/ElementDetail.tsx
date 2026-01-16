import React, { useState } from 'react';
import { PeriodicElement, ElementCategory } from '../types/element';
import { X, Edit2, Save, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ElementDetailProps {
  element: PeriodicElement | null;
  onClose: () => void;
  onUpdate?: (updatedElement: PeriodicElement) => void;
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

export const ElementDetail: React.FC<ElementDetailProps> = ({ element, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedElement, setEditedElement] = useState<PeriodicElement | null>(null);

  if (!element) return null;

  const handleEdit = () => {
    setEditedElement({ ...element });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedElement && onUpdate) {
      onUpdate(editedElement);
    }
    setIsEditing(false);
    setEditedElement(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedElement(null);
  };

  const handleFieldChange = (field: keyof PeriodicElement, value: any) => {
    if (editedElement) {
      setEditedElement({ ...editedElement, [field]: value });
    }
  };

  const displayElement = isEditing && editedElement ? editedElement : element;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-700"
      >
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEditing ? (
            <>
              <button 
                onClick={handleEdit}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors text-white"
                title="편집"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="p-2 rounded-full hover:bg-green-800 transition-colors text-green-400"
                title="저장"
              >
                <Save className="w-5 h-5" />
              </button>
              <button 
                onClick={handleCancel}
                className="p-2 rounded-full hover:bg-red-800 transition-colors text-red-400"
                title="취소"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className={cn(
              "w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg",
              "bg-slate-800 border-slate-700"
            )}>
              <span className="text-xl font-medium text-slate-400">{element.number}</span>
              <span className="text-5xl font-bold mb-1 text-white">{element.symbol}</span>
              <span className="text-sm font-medium text-slate-400">{element.atomic_mass.toFixed(3)}</span>
            </div>
          </div>

          <div className="flex-grow">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 mb-2 inline-block">
                {CATEGORY_LABELS[displayElement.category]}
              </span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedElement?.name_ko || ''}
                    onChange={(e) => handleFieldChange('name_ko', e.target.value)}
                    className="w-full text-3xl font-bold text-white bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editedElement?.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full text-sm text-slate-400 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white">{displayElement.name_ko}</h2>
                  <p className="text-sm text-slate-400 mt-1">{displayElement.name}</p>
                </>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={editedElement?.summary_ko || editedElement?.summary || ''}
                onChange={(e) => handleFieldChange('summary_ko', e.target.value)}
                className="w-full text-slate-300 mb-6 leading-relaxed bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="요약 정보를 입력하세요"
              />
            ) : (
              <p className="text-slate-300 mb-6 leading-relaxed">
                {displayElement.summary_ko || displayElement.summary}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">상태</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedElement?.phase || ''}
                    onChange={(e) => handleFieldChange('phase', e.target.value)}
                    className="w-full text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{displayElement.phase}</span>
                )}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">발견자</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedElement?.discovered_by || ''}
                    onChange={(e) => handleFieldChange('discovered_by', e.target.value || null)}
                    className="w-full text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="알려지지 않음"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{displayElement.discovered_by || '알려지지 않음'}</span>
                )}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">밀도</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.001"
                    value={editedElement?.density || ''}
                    onChange={(e) => handleFieldChange('density', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="N/A"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{displayElement.density ? `${displayElement.density} g/cm³` : 'N/A'}</span>
                )}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">녹는점</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editedElement?.melt || ''}
                    onChange={(e) => handleFieldChange('melt', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="N/A"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{displayElement.melt ? `${displayElement.melt} K` : 'N/A'}</span>
                )}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">끓는점</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editedElement?.boil || ''}
                    onChange={(e) => handleFieldChange('boil', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="N/A"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{displayElement.boil ? `${displayElement.boil} K` : 'N/A'}</span>
                )}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">전자 배치</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedElement?.electron_configuration || ''}
                    onChange={(e) => handleFieldChange('electron_configuration', e.target.value)}
                    className="w-full text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{displayElement.electron_configuration}</span>
                )}
              </div>
            </div>

            <div className="mt-8">
              {isEditing ? (
                <input
                  type="text"
                  value={editedElement?.source || ''}
                  onChange={(e) => handleFieldChange('source', e.target.value)}
                  className="w-full text-blue-500 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="위키백과 링크"
                />
              ) : (
                <a 
                  href={displayElement.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm font-medium"
                >
                  위키백과에서 더 보기 →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
