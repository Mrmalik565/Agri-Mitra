import React, { useState, useRef } from 'react';
import { PesticideAnalysisResult } from '../../types';
import { analyzePesticide } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import { CameraIcon, SparklesIcon, KisanDoctorLogo } from '../ui/Icons';
import { useLocalization } from '../../localization';
import { motion } from 'framer-motion';

const PesticideFinderScreen: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PesticideAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLocalization();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError(t('error_pleaseUploadPesticideImage'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePesticide(imageFile, language);
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">{t('pesticideFinder')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('uploadPesticideForInfo')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Uploader */}
        <div className="space-y-6">
          <motion.div 
            className="relative w-full aspect-square bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors cursor-pointer"
            onClick={triggerFileSelect}
            whileHover={{ scale: 1.02 }}
          >
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            {previewUrl ? (
              <img src={previewUrl} alt="Pesticide preview" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <CameraIcon className="w-16 h-16 mx-auto" />
                <p className="mt-2 font-semibold">{t('clickToUpload')}</p>
                <p className="text-xs">{t('pngOrJpg')}</p>
              </div>
            )}
          </motion.div>
          <motion.button
            onClick={handleAnalyze}
            disabled={!imageFile || isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <Spinner /> : <><SparklesIcon className="w-6 h-6 mr-2" /> {t('analyzePesticide')}</>}
          </motion.button>
        </div>

        {/* Right Side: Results */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('pesticideAnalysisResult')}</h2>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Spinner className="w-12 h-12" />
              <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">{t('aiAnalyzingPesticide')}</p>
            </div>
          )}
          {error && <div className="text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 p-4 rounded-lg">{error}</div>}
          {analysis && (
            <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300">{t('productName')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{analysis.productName}</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300">{t('activeIngredients')}</h4>
                <p className="text-gray-600 dark:text-gray-400">{analysis.activeIngredients}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300">{t('targets')}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.targetPestsAndDiseases.map(item => (
                        <span key={item} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{item}</span>
                    ))}
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-lg">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-200">{t('usageInstructions')}</h4>
                <p className="text-emerald-700 dark:text-emerald-300 mt-1"><strong>{t('dosage')}</strong> {analysis.usage.dosage}</p>
                <p className="text-emerald-700 dark:text-emerald-300 mt-1"><strong>{t('application')}</strong> {analysis.usage.applicationMethod}</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/40 p-4 rounded-lg">
                 <h4 className="font-bold text-red-800 dark:text-red-200">{t('precautions')}</h4>
                 <p className="text-red-700 dark:text-red-300 mt-1">{analysis.usage.precautions}</p>
              </div>
            </motion.div>
          )}
          {!isLoading && !error && !analysis && (
            <div className="text-center text-gray-400 dark:text-gray-500 h-full flex flex-col justify-center items-center">
              <KisanDoctorLogo className="w-24 h-24 opacity-20" />
              <p className="mt-4">{t('yourAnalysisWillAppear')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PesticideFinderScreen;