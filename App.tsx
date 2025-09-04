
import React, { useState, useEffect } from 'react';
import type { SelectedItem } from './types';
import Step1Upload from './components/Step1Upload';
import Step2SelectItems from './components/Step2SelectItems';
import Step3Result from './components/Step3Result';

type Step = 'upload' | 'select' | 'result';

const SAVED_DESIGN_KEY = 'ai_interior_designer_saved_design';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [hasSavedDesign, setHasSavedDesign] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SAVED_DESIGN_KEY)) {
      setHasSavedDesign(true);
    }
  }, []);

  const handleSaveDesign = (itemsToSave: SelectedItem[]) => {
    localStorage.setItem(SAVED_DESIGN_KEY, JSON.stringify(itemsToSave));
    setHasSavedDesign(true);
  };

  const handleLoadDesign = () => {
    const saved = localStorage.getItem(SAVED_DESIGN_KEY);
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved) as SelectedItem[];
        setSelectedItems(parsedItems);
      } catch (e) {
        console.error("Failed to parse saved design", e);
      }
    }
  };

  const handleStep1Complete = (origImg: string, cleanImg: string) => {
    setOriginalImage(origImg);
    setCleanedImage(cleanImg);
    setStep('select');
  };

  const handleStep2Complete = (items: SelectedItem[]) => {
    setSelectedItems(items);
    setStep('result');
  };

  const handleBackToStep1 = () => {
    // Keep original image if user wants to re-clean or use it again
    setCleanedImage(null);
    setSelectedItems([]);
    setStep('upload');
  };
  
  const handleBackToStep2 = () => {
    // Keep selected items so user can tweak them
    setStep('select');
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <Step1Upload onComplete={handleStep1Complete} initialImage={originalImage} />;
      case 'select':
        if (!cleanedImage || !originalImage) {
          // Safety check, should not happen in normal flow
          setStep('upload');
          return null;
        }
        return <Step2SelectItems 
          cleanedImage={cleanedImage} 
          onComplete={handleStep2Complete} 
          onBack={handleBackToStep1} 
          initialSelections={selectedItems}
          onSave={handleSaveDesign}
          onLoad={handleLoadDesign}
          hasSavedDesign={hasSavedDesign}
        />;
      case 'result':
         if (!cleanedImage || selectedItems.length === 0) {
          // Safety check
          setStep('select');
          return null;
        }
        return <Step3Result cleanedImage={cleanedImage} selectedItems={selectedItems} onBack={handleBackToStep2} />;
      default:
        return <Step1Upload onComplete={handleStep1Complete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI 空間設計師
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            上傳您房間的照片，清理空間，並用 AI 重新佈置您的夢想家園。
          </p>
        </header>
        <main>
          {renderStep()}
        </main>
      </div>
    </div>
  );
};

export default App;
