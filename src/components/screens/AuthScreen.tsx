import React from 'react';
import { KisanDoctorLogo, GoogleIcon, PhoneIcon, MailIcon } from '../ui/Icons';
import { useLocalization } from '../../localization';
import { motion } from 'framer-motion';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthButton: React.FC<{ children: React.ReactNode; className?: string; onClick: () => void; icon: React.ReactNode; }> = ({ children, className = '', onClick, icon }) => (
    <button
        onClick={onClick}
        className={`btn-animated w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-sm hover:shadow-md bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/50 ${className}`}
    >
        {icon}
        <span className="ml-3">{children}</span>
    </button>
);


const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { t } = useLocalization();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-4">
      <motion.div 
        className="w-full max-w-sm mx-auto bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <KisanDoctorLogo className="w-20 h-20 mx-auto text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">{t('welcomeTo')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('yourAIFarmingAssistant')}</p>
        </div>
        <div className="space-y-4">
           <AuthButton onClick={onLoginSuccess} icon={<GoogleIcon className="w-5 h-5" />}>
                {t('signInWithGoogle')}
            </AuthButton>
            <AuthButton onClick={onLoginSuccess} icon={<PhoneIcon className="w-5 h-5 text-blue-500" />}>
                {t('signInWithPhone')}
            </AuthButton>
             <AuthButton onClick={onLoginSuccess} icon={<MailIcon className="w-5 h-5 text-slate-500" />}>
                {t('signInWithEmail')}
            </AuthButton>
        </div>
        
        <div className="flex items-center text-center">
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500 font-medium">OR</span>
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        </div>

        <div className="text-center">
          <button
            onClick={onLoginSuccess}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium transition-colors"
          >
            {t('continueAsGuest')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;