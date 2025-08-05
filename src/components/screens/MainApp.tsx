import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { ActiveScreen, GovernmentScheme, UserProfile } from '../../types';
import Spinner from '../ui/Spinner';
import { HomeIcon, PriceTagIcon, CameraIcon, ChatIcon, KisanDoctorLogo, PesticideIcon, DocumentTextIcon, BellIcon, XIcon, UserCircleIcon, Cog8ToothIcon, CheckCircleIcon } from '../ui/Icons';
import { useLocalization } from '../../localization';
import { useSettings } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';
import { GOVERNMENT_SCHEMES } from '../../constants';

// Lazy load screens for better performance
const DashboardScreen = React.lazy(() => import('./DashboardScreen'));
const CropPricesScreen = React.lazy(() => import('./CropPricesScreen'));
const DiseaseDiagnosisScreen = React.lazy(() => import('./DiseaseDiagnosisScreen'));
const ChatbotScreen = React.lazy(() => import('./ChatbotScreen'));
const PesticideFinderScreen = React.lazy(() => import('./PesticideFinderScreen'));
const SchemesScreen = React.lazy(() => import('./SchemesScreen'));
const SettingsModal = React.lazy(() => import('./SettingsModal'));

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isMobile = false }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`relative flex items-center justify-center transition-all duration-300 group 
      ${isMobile 
        ? 'flex-col flex-1 py-2 text-xs' 
        : 'w-full aspect-square flex-col text-xs'
      } 
      ${isActive 
        ? 'text-emerald-600 dark:text-emerald-400' 
        : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'}`
    }
  >
    {isActive && (
        <motion.div
            layoutId={isMobile ? "active-nav-mobile" : "active-nav-desktop"}
            className={`absolute ${isMobile ? 'bottom-0 h-1 w-8' : 'inset-0 bg-emerald-500/10 dark:bg-emerald-400/10'} rounded-full`}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
    )}
    <span className="relative z-10">{icon}</span>
    <span className="relative z-10 mt-1">{label}</span>
  </button>
);


interface MainAppProps {
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, onUpdateUser }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(ActiveScreen.DASHBOARD);
  const { t } = useLocalization();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navItems = useMemo(() => [
    { id: ActiveScreen.DASHBOARD, icon: <HomeIcon className="w-6 h-6" />, label: t('dashboard') },
    { id: ActiveScreen.DIAGNOSIS, icon: <CameraIcon className="w-6 h-6" />, label: t('diagnose') },
    { id: ActiveScreen.CHATBOT, icon: <ChatIcon className="w-6 h-6" />, label: t('chatbot') },
    { id: ActiveScreen.PRICES, icon: <PriceTagIcon className="w-6 h-6" />, label: t('prices') },
    { id: ActiveScreen.PESTICIDE_FINDER, icon: <PesticideIcon className="w-6 h-6" />, label: t('pesticideInfo') },
    { id: ActiveScreen.SCHEMES, icon: <DocumentTextIcon className="w-6 h-6" />, label: t('schemes') },
  ], [t]);

  const ScreenComponent = useMemo(() => {
    switch (activeScreen) {
      case ActiveScreen.DASHBOARD: return <DashboardScreen user={user} setActiveScreen={setActiveScreen} />;
      case ActiveScreen.PRICES: return <CropPricesScreen />;
      case ActiveScreen.DIAGNOSIS: return <DiseaseDiagnosisScreen />;
      case ActiveScreen.CHATBOT: return <ChatbotScreen />;
      case ActiveScreen.PESTICIDE_FINDER: return <PesticideFinderScreen />;
      case ActiveScreen.SCHEMES: return <SchemesScreen />;
      default: return <DashboardScreen user={user} setActiveScreen={setActiveScreen}/>;
    }
  }, [activeScreen, user]);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-24 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-2 justify-between">
        <div>
            <div className="p-4 flex justify-center">
                <KisanDoctorLogo className="h-10 w-10 text-emerald-600" />
            </div>
            <nav className="flex flex-col items-center space-y-2 mt-4">
                {navItems.map(item => (
                <NavItem key={item.id} {...item} isActive={activeScreen === item.id} onClick={() => setActiveScreen(item.id)} />
                ))}
            </nav>
        </div>
        <div className="pb-2">
             <button onClick={() => setIsProfileOpen(true)} className="w-full aspect-square flex items-center justify-center">
                <img src={user.profilePicUrl} alt="User profile" className="w-12 h-12 rounded-full object-cover"/>
            </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
                <KisanDoctorLogo className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Kisan Mitra</h1>
            </div>
            <button onClick={() => setIsProfileOpen(true)} className="p-1">
                <img src={user.profilePicUrl} alt="User profile" className="w-8 h-8 rounded-full object-cover"/>
            </button>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Suspense fallback={
                <div className="flex justify-center items-center h-full w-full">
                <Spinner className="w-16 h-16" />
                </div>
            }>
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeScreen} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }} 
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                    {ScreenComponent}
                    </motion.div>
                </AnimatePresence>
            </Suspense>
        </main>
      </div>


      {/* --- Mobile Bottom Nav --- */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30">
        <nav className="flex justify-around items-center">
          {navItems.map(item => (
            <NavItem key={item.id} {...item} isActive={activeScreen === item.id} onClick={() => setActiveScreen(item.id)} isMobile />
          ))}
        </nav>
      </footer>
      
      {/* Profile and Settings Modal */}
      <Suspense>
        <SettingsModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            user={user}
            onUpdateUser={onUpdateUser}
        />
      </Suspense>
    </div>
  );
};

export default MainApp;