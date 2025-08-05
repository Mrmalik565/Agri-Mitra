import React, { useState, useEffect, createContext, useContext } from 'react';
import AuthScreen from './components/screens/AuthScreen';
import MainApp from './components/screens/MainApp';
import { KisanDoctorLogo } from './components/ui/Icons';
import { LocalizationProvider, useLocalization } from './localization';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, UserProfile, FontSize } from './types';
import { MOCK_USER_PROFILE, CHATBOT_VOICES } from './constants';

// --- Settings Context ---
type SettingsContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  voice: string;
  setVoice: (voice: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
};
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [voice, setVoice] = useState<string>(CHATBOT_VOICES[0].name);
  const [fontSize, setFontSizeState] = useState<FontSize>('base');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setThemeState(savedTheme);
    
    const savedVoice = localStorage.getItem('voice');
    if (savedVoice) setVoice(savedVoice);

    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    if (savedFontSize) setFontSizeState(savedFontSize);
  }, []);
  
  const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('fontSize', newSize);
  };

  useEffect(() => {
    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        if (t === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', prefersDark);
        } else {
            root.classList.toggle('dark', t === 'dark');
        }
    };

    applyTheme(theme);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme(theme);

    if (theme === 'system') {
        mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
        mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  const handleSetVoice = (newVoice: string) => {
      setVoice(newVoice);
      localStorage.setItem('voice', newVoice);
  }

  return (
    <SettingsContext.Provider value={{ theme, setTheme, voice, setVoice: handleSetVoice, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// --- Landing Screen ---
const LandingScreen: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
    const { t } = useLocalization();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')"}}>
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            <motion.div 
                className="relative z-10 text-center text-white max-w-4xl p-8 bg-black/30 backdrop-blur-sm rounded-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <KisanDoctorLogo className="w-24 h-24 mx-auto text-emerald-400" />
                <h1 className="text-4xl md:text-6xl font-bold mt-4 leading-tight">Kisan Mitra</h1>
                <p className="text-lg md:text-2xl mt-4 text-emerald-100">{t('landingTitle')}</p>
                <p className="mt-4 text-gray-300 max-w-2xl mx-auto">{t('landingSubtitle')}</p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={onLaunch} 
                        className="btn-animated px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg shadow-lg text-lg"
                    >
                        {t('launchWebApp')}
                    </button>
                     <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('Simulated APK download!'); }}
                        className="btn-animated px-8 py-4 bg-white/20 border border-white/50 text-white font-bold rounded-lg shadow-lg text-lg"
                    >
                        {t('downloadApk')}
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main App Component ---
const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'auth' | 'main'>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleLaunchApp = () => {
      setAppState('auth');
  };

  const handleLoginSuccess = () => {
    setUser(MOCK_USER_PROFILE);
    setAppState('main');
  };

  return (
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
            <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                 <LandingScreen onLaunch={handleLaunchApp} />
            </motion.div>
        )}
        {appState === 'auth' && (
             <motion.div 
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <AuthScreen onLoginSuccess={handleLoginSuccess} />
            </motion.div>
        )}
        {appState === 'main' && user && (
            <motion.div 
                key="main-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
               <MainApp user={user} onUpdateUser={setUser} />
            </motion.div>
        )}
      </AnimatePresence>
  );
}


const App: React.FC = () => {
  return (
    <LocalizationProvider>
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    </LocalizationProvider>
  )
}


export default App;