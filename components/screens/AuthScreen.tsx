import React from 'react';
import { KisanDoctorLogo } from '../ui/Icons';
import { useLocalization } from '../../localization';
import { motion } from 'framer-motion';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthButton: React.FC<{ children: React.ReactNode; className: string; onClick: () => void }> = ({ children, className, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-in-out ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { t } = useLocalization();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-900 dark:to-emerald-950 p-4">
      <motion.div 
        className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <KisanDoctorLogo className="w-20 h-20 mx-auto text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('welcomeTo')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('yourAIFarmingAssistant')}</p>
        </div>
        <div className="space-y-4">
          <AuthButton onClick={onLoginSuccess} className="bg-red-500 text-white hover:bg-red-600">
            {t('signInWithGoogle')}
          </AuthButton>
          <AuthButton onClick={onLoginSuccess} className="bg-blue-500 text-white hover:bg-blue-600">
            {t('signInWithPhone')}
          </AuthButton>
          <AuthButton onClick={onLoginSuccess} className="bg-gray-800 text-white hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600">
            {t('signInWithEmail')}
          </AuthButton>
        </div>
        <div className="text-center">
          <button
            onClick={onLoginSuccess}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 font-medium transition-colors"
          >
            {t('continueAsGuest')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;