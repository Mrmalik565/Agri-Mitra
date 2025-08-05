import React, { useState, useMemo, useEffect } from 'react';
import { ActiveScreen, GovernmentScheme, UserProfile, Theme } from '../../types';
import CropPricesScreen from './CropPricesScreen';
import DiseaseDiagnosisScreen from './DiseaseDiagnosisScreen';
import ChatbotScreen from './ChatbotScreen';
import PesticideFinderScreen from './PesticideFinderScreen';
import SchemesScreen from './SchemesScreen';
import { PriceTagIcon, CameraIcon, ChatIcon, KisanDoctorLogo, PesticideIcon, DocumentTextIcon, BellIcon, XIcon, UserCircleIcon, Cog8ToothIcon, CheckCircleIcon } from '../ui/Icons';
import { useLocalization } from '../../localization';
import { useSettings } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';
import { GOVERNMENT_SCHEMES, CHATBOT_VOICES } from '../../constants';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}> = ({ icon, label, isActive, onClick, isMobile = false }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-center transition-all duration-300 ease-in-out group ${isMobile ? 'flex-col flex-1 py-2' : 'sm:flex-row space-x-2 px-3 py-2 rounded-lg'}`}
  >
    {isActive && !isMobile && (
        <motion.div
            layoutId="active-nav-item-desktop"
            className="absolute inset-0 bg-emerald-600 rounded-lg shadow-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
    )}
    <span className={`relative z-10 transition-colors ${isActive ? (isMobile ? 'text-emerald-600 dark:text-emerald-400' : 'text-white') : 'text-gray-600 dark:text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'}`}>{icon}</span>
    <span className={`relative z-10 text-xs font-medium transition-colors ${isActive ? (isMobile ? 'text-emerald-600 dark:text-emerald-400' : 'text-white') : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'}`}>{label}</span>
     {isActive && isMobile && (
        <motion.div
            layoutId="active-nav-item-mobile"
            className="absolute bottom-0 h-1 w-8 bg-emerald-600 dark:bg-emerald-400 rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
    )}
  </button>
);

const NotificationPopup: React.FC<{ notification: GovernmentScheme, onClose: () => void }> = ({ notification, onClose }) => {
    const { t } = useLocalization();
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-24 sm:bottom-5 right-5 z-50 w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <BellIcon className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('notificationTitle')}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('notificationBody').replace('{schemeName}', notification.name)}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={onClose} className="rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="sr-only">Close</span>
                            <XIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const WelcomePopup: React.FC<{ name: string, onVanish: () => void }> = ({ name, onVanish }) => {
    const { t } = useLocalization();
    useEffect(() => {
        const timer = setTimeout(onVanish, 2500);
        return () => clearTimeout(timer);
    }, [onVanish]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.5 } }}
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 p-4 rounded-xl bg-emerald-600 text-white shadow-lg"
        >
            <CheckCircleIcon className="w-8 h-8"/>
            <span className="font-semibold text-lg">{t('welcomeUser').replace('{name}', name.split(' ')[0])}</span>
        </motion.div>
    )
}

interface MainAppProps {
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, onUpdateUser }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(ActiveScreen.DIAGNOSIS);
  const { t, language, setLanguage } = useLocalization();
  const { theme, setTheme, voice, setVoice } = useSettings();
  
  const [activeNotification, setActiveNotification] = useState<GovernmentScheme | null>(null);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editableUser, setEditableUser] = useState(user);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const activeScheme = GOVERNMENT_SCHEMES.find(scheme => scheme.registrationStartDate === todayStr && scheme.status !== 'Closed');
    
    if (activeScheme) {
        const hasBeenShown = sessionStorage.getItem(`notif_${activeScheme.id}`);
        if (!hasBeenShown) {
            setActiveNotification(activeScheme);
            sessionStorage.setItem(`notif_${activeScheme.id}`, 'true');
        }
    }
  }, []);

  const closeNotification = () => activeNotification && setActiveNotification(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateUser(editableUser);
      alert(t('profileUpdated'));
      setIsProfileOpen(false);
  }

  const navItems = [
    { id: ActiveScreen.DIAGNOSIS, icon: <CameraIcon className="w-6 h-6" />, label: t('diagnose') },
    { id: ActiveScreen.SCHEMES, icon: <DocumentTextIcon className="w-6 h-6" />, label: t('schemes') },
    { id: ActiveScreen.PRICES, icon: <PriceTagIcon className="w-6 h-6" />, label: t('prices') },
    { id: ActiveScreen.CHATBOT, icon: <ChatIcon className="w-6 h-6" />, label: t('chatbot') },
    { id: ActiveScreen.PESTICIDE_FINDER, icon: <PesticideIcon className="w-6 h-6" />, label: t('pesticideInfo') },
  ];

  const ScreenComponent = useMemo(() => {
    switch (activeScreen) {
      case ActiveScreen.PRICES: return <CropPricesScreen />;
      case ActiveScreen.DIAGNOSIS: return <DiseaseDiagnosisScreen />;
      case ActiveScreen.CHATBOT: return <ChatbotScreen />;
      case ActiveScreen.PESTICIDE_FINDER: return <PesticideFinderScreen />;
      case ActiveScreen.SCHEMES: return <SchemesScreen />;
      default: return <DiseaseDiagnosisScreen />;
    }
  }, [activeScreen]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* --- Desktop Header --- */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm sticky top-0 z-30 p-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <KisanDoctorLogo className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Kisan Mitra</h1>
          </div>
          <nav className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-900/50 p-1 rounded-xl">
            {navItems.map(item => (
              <NavItem key={item.id} icon={item.icon} label={item.label} isActive={activeScreen === item.id} onClick={() => setActiveScreen(item.id)} />
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsProfileOpen(true)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <img src={user.profilePicUrl} alt="User profile" className="w-8 h-8 rounded-full object-cover"/>
            </button>
          </div>
        </div>
      </header>

       {/* --- Mobile Header --- */}
      <header className="sm:hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-30 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <KisanDoctorLogo className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Kisan Mitra</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 sm:pb-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeScreen} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {ScreenComponent}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- Mobile Bottom Nav --- */}
      <footer className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-30">
        <nav className="flex justify-around items-center">
          {navItems.map(item => (
            <NavItem key={item.id} icon={item.icon} label={item.label} isActive={activeScreen === item.id} onClick={() => setActiveScreen(item.id)} isMobile={true} />
          ))}
        </nav>
      </footer>
      
      {/* Floating Profile Button for Mobile */}
      <motion.button 
        onClick={() => setIsProfileOpen(true)}
        className="sm:hidden fixed bottom-20 right-5 z-40 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open Profile"
      >
        <UserCircleIcon className="w-9 h-9" />
      </motion.button>
      
      {/* Popups and Modals */}
      <AnimatePresence>
        {isWelcomeVisible && <WelcomePopup name={user.name} onVanish={() => setIsWelcomeVisible(false)} />}
        {activeNotification && <NotificationPopup notification={activeNotification} onClose={closeNotification} />}
        
        {(isProfileOpen || isSettingsOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }}
          >
            <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                  <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('myProfile')}</h2>
                      <div>
                          <button onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(true); }} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><Cog8ToothIcon className="w-6 h-6"/></button>
                          <button onClick={() => setIsProfileOpen(false)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><XIcon className="w-6 h-6"/></button>
                      </div>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                          <img src={editableUser.profilePicUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover"/>
                          <button type="button" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{t('uploadNewPhoto')}</button>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('fullName')}</label>
                          <input type="text" value={editableUser.name} onChange={e => setEditableUser({...editableUser, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('emailAddress')}</label>
                          <input type="email" value={editableUser.email} onChange={e => setEditableUser({...editableUser, email: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('phoneNumber')}</label>
                          <input type="tel" value={editableUser.phone} onChange={e => setEditableUser({...editableUser, phone: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                      </div>
                       <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dateOfBirth')}</label>
                          <input type="date" value={editableUser.dob} onChange={e => setEditableUser({...editableUser, dob: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                      </div>
                      <button type="submit" className="w-full py-2.5 px-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">{t('updateProfile')}</button>
                  </form>
              </motion.div>
            )}
            
            {isSettingsOpen && (
                <motion.div
                    key="settings"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                        <button onClick={() => { setIsSettingsOpen(false); setIsProfileOpen(true); }} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-sm font-semibold flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                            {t('goBack')}
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('settings')}</h2>
                        <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('appTheme')}</label>
                            <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-slate-700 p-1">
                                {(['light', 'dark', 'system'] as Theme[]).map(th => (
                                    <button key={th} onClick={() => setTheme(th)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${theme === th ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}>{t(th)}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('appLanguage')}</label>
                            <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 dark:bg-slate-700 p-1">
                                <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${language === 'en' ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}>{t('english')}</button>
                                <button onClick={() => setLanguage('hi')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${language === 'hi' ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}>{t('hindi')}</button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="voice-select" className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('chatbotVoice')}</label>
                            <select id="voice-select" value={voice} onChange={e => setVoice(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                                {CHATBOT_VOICES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainApp;