import React, { useState, useEffect, useCallback } from 'react';
import type { SelectedItem } from '../types';
import { furnishImage } from '../services/geminiService';
import { downloadImage } from '../utils/imageUtils';
import Spinner from './common/Spinner';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';
import ArrowUturnLeftIcon from './icons/ArrowUturnLeftIcon';

interface Step3ResultProps {
  cleanedImage: string;
  selectedItems: SelectedItem[];
  onBack: () => void;
}

const Step3Result: React.FC<Step3ResultProps> = ({ cleanedImage, selectedItems, onBack }) => {
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStatus(null);
    try {
      const prompt = selectedItems
        .map((item, index) => `${index + 1}. 一個 ${item.name}: ${item.prompt}`)
        .join('\n');
      
      const result = await furnishImage(cleanedImage, prompt, setStatus);
      setFinalImage(result);
    } catch (err: any) {
        console.error(err);
        let errorMessage = "AI 生成設計圖時發生錯誤，請返回並重試。";
        if (err instanceof Error && err.message) {
            try {
                // Attempt to parse the Gemini API's JSON error response
                const errorResponse = JSON.parse(err.message);
                if (errorResponse.error && errorResponse.error.message) {
                    errorMessage = `AI 服務錯誤： ${errorResponse.error.message}`;
                } else {
                    errorMessage = `AI 生成設計圖時發生錯誤： ${err.message}`;
                }
            } catch (parseError) {
                // If it's not JSON, use the raw message
                errorMessage = `AI 生成設計圖時發生錯誤： ${err.message}`;
            }
        }
        setError(errorMessage);
    } finally {
      setIsLoading(false);
      setStatus(null);
    }
  }, [cleanedImage, selectedItems]);

  useEffect(() => {
    generateImage();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6">第三步：您的新設計！</h2>
      
      <div className="w-full max-w-4xl mx-auto">
        <div className="aspect-w-16 aspect-h-9 bg-gray-900/50 rounded-lg flex items-center justify-center min-h-[50vh]">
          {isLoading && <Spinner text={status || "AI 正在揮灑創意..."} />}
          {error && <p className="text-red-400 text-center px-4 break-words">{error}</p>}
          {!isLoading && finalImage && (
            <img src={finalImage} alt="Final furnished room" className="rounded-lg shadow-2xl object-contain max-h-[75vh]" />
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
          返回修改
        </button>
        <button
          onClick={() => finalImage && downloadImage(finalImage, 'my-new-room.jpg')}
          disabled={!finalImage || isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          下載設計圖
        </button>
      </div>
    </div>
  );
};

export default Step3Result;