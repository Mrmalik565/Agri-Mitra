import React, { useState, useRef } from 'react';
import { AnalysisResult } from '../../types';
import { analyzeCropDisease } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import { CameraIcon, SparklesIcon, KisanDoctorLogo } from '../ui/Icons';
import { useLocalization } from '../../localization';
import { motion, AnimatePresence } from 'framer-motion';

const DiseaseDiagnosisScreen: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
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
      setError(t('error_pleaseUploadImage'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeCropDisease(imageFile, question, language);
      setAnalysis(result);
    } catch (e: any)      {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{t('cropDiseaseDiagnosis')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('uploadForAnalysis')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <motion.div 
            className="relative w-full aspect-4/3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors cursor-pointer"
            onClick={triggerFileSelect}
            whileHover={{ scale: 1.02 }}
          >
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            <AnimatePresence>
            {previewUrl ? (
              <motion.img 
                key="preview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={previewUrl} alt="Crop preview" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-500 dark:text-slate-400 p-4">
                <CameraIcon className="w-16 h-16 mx-auto" />
                <p className="mt-2 font-semibold">{t('clickToUpload')}</p>
                <p className="text-xs">{t('pngOrJpg')}</p>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
           <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('optionalQuestion')}
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            rows={2}
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={!imageFile || isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:bg-emerald-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <Spinner /> : <><SparklesIcon className="w-6 h-6 mr-2" /> {t('analyzeCrop')}</>}
          </motion.button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg min-h-[400px] border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('analysisResult')}</h2>
          <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full text-center py-10">
              <Spinner className="w-12 h-12" />
              <p className="mt-4 text-slate-600 dark:text-slate-400 animate-pulse">{t('aiAnalyzing')}</p>
            </motion.div>
          ) : error ? (
             <motion.div key="error" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 p-4 rounded-lg">{error}</motion.div>
          ) : analysis ? (
            <motion.div 
                key="analysis"
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
              <div className={`p-4 rounded-lg text-white font-bold text-lg ${analysis.isPlantHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
                <h3>{analysis.isPlantHealthy ? t('plantAppearsHealthy') : t('diseaseDetected')}</h3>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">{t('diseaseName')}</h4>
                <p className="text-slate-600 dark:text-slate-400">{analysis.diseaseName}</p>
              </div>
              
               <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">{t('description')}</h4>
                <p className="text-slate-600 dark:text-slate-400">{analysis.description}</p>
              </div>

              { !analysis.isPlantHealthy &&
                <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg space-y-2">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-200">{t('recommendedSolution')}</h4>
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm"><strong>{t('product')}</strong> {analysis.solution.recommendedProduct}</p>
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm"><strong>{t('dosage')}</strong> {analysis.solution.dosage}</p>
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm"><strong>{t('application')}</strong> {analysis.solution.applicationAdvice}</p>
                </div>
              }

              <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">{t('generalAdvice')}</h4>
                <p className="text-slate-600 dark:text-slate-400">{analysis.generalAdvice}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="initial" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-center text-slate-400 dark:text-slate-500 h-full flex flex-col justify-center items-center py-10">
              <KisanDoctorLogo className="w-24 h-24 opacity-10" />
              <p className="mt-4">{t('yourAnalysisWillAppear')}</p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDiagnosisScreen;