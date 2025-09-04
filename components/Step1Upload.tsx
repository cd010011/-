import React, { useState, useCallback, useRef } from 'react';
import { fileToBase64, resizeImage, downloadImage } from '../utils/imageUtils';
import { cleanImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import SparklesIcon from './icons/SparklesIcon';
import TrashIcon from './icons/TrashIcon';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';

interface Step1UploadProps {
  onComplete: (originalImage: string, cleanedImage: string) => void;
  initialImage?: string | null;
}

const ImageDisplay: React.FC<{src: string, alt: string, label: string}> = ({src, alt, label}) => (
    <div className="w-full">
        <p className="text-center text-lg font-medium text-gray-300 mb-2">{label}</p>
        <img src={src} alt={alt} className="rounded-lg shadow-xl w-full h-auto object-contain max-h-[60vh]" />
    </div>
);


const Step1Upload: React.FC<Step1UploadProps> = ({ onComplete, initialImage = null }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(initialImage);
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setCleanedImage(null);
      setIsLoading(true);
      try {
        const base64 = await fileToBase64(file);
        const resized = await resizeImage(base64);
        setOriginalImage(resized);
      } catch (err) {
        setError('無法處理圖片，請嘗試其他圖片。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const handleCleanImage = useCallback(async () => {
    if (isLoading) return;

    if (cleanedImage) {
        // Re-cleaning: Use the current cleaned image as the new source.
        const imageToReClean = cleanedImage;
        setOriginalImage(imageToReClean);
        setCleanedImage(null);
        
        setError(null);
        setIsLoading(true);
        try {
            const result = await cleanImage(imageToReClean);
            setCleanedImage(result);
        } catch (err) {
            setError('AI 重新清理時發生錯誤，請稍後再試。');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    } else if (originalImage) {
        // First clean: Use the uploaded original image.
        setError(null);
        setIsLoading(true);
        try {
            const result = await cleanImage(originalImage);
            setCleanedImage(result);
        } catch (err) {
            setError('AI 清理時發生錯誤，請稍後再試。');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }
  }, [originalImage, cleanedImage, isLoading]);
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-2">第一步：上傳並清理您的空間</h2>
      <p className="text-center text-gray-400 mb-6">上傳一張室內照片，我們將用 AI 為您移除所有傢俱和雜物。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg h-full">
          {isLoading && !originalImage && <Spinner text="正在載入圖片..."/>}
          {!isLoading && originalImage && <ImageDisplay src={originalImage} alt="Original room" label="原始圖片" />}
          {!isLoading && !originalImage && (
            <div className="text-center">
              <p className="mb-4 text-gray-400">點擊下方按鈕選擇圖片</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              <button
                onClick={triggerFileSelect}
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-300"
              >
                上傳圖片
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg min-h-[300px] h-full">
            {isLoading && originalImage && <Spinner text="AI 正在清理空間..."/>}
            {!isLoading && cleanedImage && <ImageDisplay src={cleanedImage} alt="Cleaned room" label="清理後成果"/>}
            {!isLoading && !cleanedImage && (
                <div className="text-center text-gray-500">
                    <p>清理後的圖片將會顯示在這裡</p>
                </div>
            )}
        </div>
      </div>

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleCleanImage}
          disabled={!originalImage || isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <SparklesIcon className="h-5 w-5" />
          {cleanedImage ? '重新清理' : '開始清理'}
        </button>
        {cleanedImage && (
            <button
                onClick={() => downloadImage(cleanedImage, 'cleaned-room.jpg')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
            >
                <ArrowDownTrayIcon className="h-5 w-5" />
                下載圖片
            </button>
        )}
        <button
          onClick={() => {
            setOriginalImage(null);
            setCleanedImage(null);
          }}
          disabled={!originalImage || isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <TrashIcon className="h-5 w-5" />
          清除
        </button>
      </div>
      
      {cleanedImage && originalImage && (
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <button
            onClick={() => onComplete(originalImage, cleanedImage)}
            className="bg-green-600 text-white font-bold py-3 px-12 text-lg rounded-lg hover:bg-green-500 transition-colors duration-300"
          >
            下一步
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1Upload;