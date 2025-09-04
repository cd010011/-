
import React, { useState, useEffect } from 'react';
import type { SelectedItem } from '../types';
import { ITEM_CATEGORIES } from '../constants';
import ArrowUturnLeftIcon from './icons/ArrowUturnLeftIcon';
import BookmarkSquareIcon from './icons/BookmarkSquareIcon';
import FolderOpenIcon from './icons/FolderOpenIcon';


interface Step2SelectItemsProps {
  cleanedImage: string;
  onComplete: (selectedItems: SelectedItem[]) => void;
  onBack: () => void;
  initialSelections: SelectedItem[];
  onSave: (items: SelectedItem[]) => void;
  onLoad: () => void;
  hasSavedDesign: boolean;
}

const Step2SelectItems: React.FC<Step2SelectItemsProps> = ({ cleanedImage, onComplete, onBack, initialSelections, onSave, onLoad, hasSavedDesign }) => {
  const [selected, setSelected] = useState<Record<string, SelectedItem>>(
    initialSelections.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as Record<string, SelectedItem>)
  );
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    setSelected(
      initialSelections.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
      }, {} as Record<string, SelectedItem>)
    );
  }, [initialSelections]);

  const handleToggleItem = (itemId: string, itemName: string) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      if (newSelected[itemId]) {
        delete newSelected[itemId];
      } else {
        newSelected[itemId] = { id: itemId, name: itemName, prompt: '' };
      }
      return newSelected;
    });
  };

  const handlePromptChange = (itemId: string, prompt: string) => {
    setSelected(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], prompt },
    }));
  };

  const handleSubmit = () => {
    const items = Object.values(selected).filter(item => item.prompt.trim() !== '');
    if (items.length > 0) {
      onComplete(items);
    } else {
      alert('請至少為一個選擇的項目輸入放置提示。');
    }
  };

  const handleSave = () => {
    const itemsToSave = Object.values(selected).filter(item => item.prompt.trim() !== '');
    if (itemsToSave.length > 0) {
      onSave(itemsToSave);
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 2000);
    } else {
        alert('請先選擇物品並填寫說明後再儲存。');
    }
  };

  const selectedCount = Object.values(selected).filter(item => item.prompt.trim() !== '').length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-2">第二步：選擇傢俱與電器</h2>
      <p className="text-center text-gray-400 mb-6">選擇您想添加的物品，並描述它們應該放在哪裡。</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <p className="text-center text-lg font-medium text-gray-300 mb-2">您的空白畫布</p>
          <img src={cleanedImage} alt="Cleaned room" className="rounded-lg shadow-xl w-full h-auto object-contain max-h-[70vh]" />
        </div>

        <div className="flex flex-col space-y-6">
          {ITEM_CATEGORIES.map(category => (
            <div key={category.name}>
              <h3 className="text-xl font-semibold text-purple-300 mb-3">{category.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.items.map(item => (
                  <div key={item.id}>
                    <label
                      className={`cursor-pointer block p-3 text-center rounded-lg border-2 transition-colors ${selected[item.id] ? 'bg-indigo-600 border-indigo-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                    >
                      <input
                        type="checkbox"
                        checked={!!selected[item.id]}
                        onChange={() => handleToggleItem(item.id, item.name)}
                        className="hidden"
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(selected).length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-xl font-semibold text-purple-300">放置說明</h3>
                 <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                {Object.values(selected).map(item => (
                  <div key={item.id}>
                    <label htmlFor={`prompt-${item.id}`} className="block text-sm font-medium text-gray-300 mb-1">{item.name}</label>
                    <input
                      id={`prompt-${item.id}`}
                      type="text"
                      value={item.prompt}
                      onChange={(e) => handlePromptChange(item.id, e.target.value)}
                      placeholder="例如: 放置於地面上靠左側牆壁"
                      className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
            <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
            >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                返回上一步
            </button>
            {hasSavedDesign && (
                <button
                onClick={onLoad}
                className="flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors duration-300"
                >
                <FolderOpenIcon className="h-5 w-5" />
                載入設計
                </button>
            )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
                <button
                    onClick={handleSave}
                    disabled={selectedCount === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    <BookmarkSquareIcon className="h-5 w-5" />
                    儲存設計
                </button>
                {showSaveMessage && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                        設計已儲存！
                    </span>
                )}
            </div>
            <button
                onClick={handleSubmit}
                disabled={selectedCount === 0}
                className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-12 text-lg rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
            >
                生成設計圖 ({selectedCount})
            </button>
        </div>
      </div>
    </div>
  );
};

export default Step2SelectItems;
