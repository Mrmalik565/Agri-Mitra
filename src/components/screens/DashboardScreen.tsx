import React from 'react';
import { useLocalization } from '../../localization';
import { motion } from 'framer-motion';
import { CameraIcon, ChatIcon, DocumentTextIcon, PriceTagIcon, SunIcon, CloudIcon, CloudRainIcon } from '../ui/Icons';
import { CROP_PRICES } from '../../constants';
import { UserProfile, ActiveScreen } from '../../types';

interface DashboardScreenProps {
    user: UserProfile;
    setActiveScreen: (screen: ActiveScreen) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; className?: string }> = ({ icon, label, value, className }) => (
    <div className={`flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl ${className}`}>
        <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; }> = ({ icon, title, subtitle, onClick }) => (
    <motion.button
        onClick={onClick}
        className="w-full p-6 text-left bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl dark:hover:bg-slate-700/50 transition-all duration-300 border border-slate-200 dark:border-slate-700"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className="p-3 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
    </motion.button>
);


const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, setActiveScreen }) => {
    const { t } = useLocalization();
    const name = user.name.split(' ')[0];

    const weatherForecast = [
        { day: 'Today', temp: '34°C', icon: <SunIcon className="w-8 h-8 text-yellow-500"/> },
        { day: 'Tomorrow', temp: '32°C', icon: <CloudIcon className="w-8 h-8 text-slate-400"/> },
        { day: 'Day After', temp: '29°C', icon: <CloudRainIcon className="w-8 h-8 text-blue-500"/> },
    ];

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
                    {t('welcomeBack')}, {name}!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your farm's summary for today.</p>
            </motion.div>

            {/* Weather & Quick Stats */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="font-bold text-xl mb-4 text-slate-800 dark:text-slate-100">Gohana, Haryana Forecast</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {weatherForecast.map(item => (
                            <div key={item.day} className="flex flex-col items-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                                <p className="font-semibold text-slate-600 dark:text-slate-300">{item.day}</p>
                                <div className="my-2">{item.icon}</div>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{item.temp}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                     <h2 className="font-bold text-xl mb-2 text-slate-800 dark:text-slate-100">Market Snapshot</h2>
                     {CROP_PRICES.slice(0, 2).map(crop => (
                         <div key={crop.id} className="flex justify-between items-center text-sm">
                             <p className="font-semibold text-slate-600 dark:text-slate-300">{crop.name}</p>
                             <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{crop.avgPrice}/{crop.unit}</p>
                         </div>
                     ))}
                     <button onClick={() => setActiveScreen(ActiveScreen.PRICES)} className="w-full text-center text-sm font-semibold text-emerald-600 hover:underline">View all prices</button>
                </div>
            </motion.div>

            {/* Quick Actions */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
             >
                <h2 className="font-bold text-2xl mb-4 text-slate-800 dark:text-slate-100">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActionCard 
                        icon={<CameraIcon className="w-8 h-8"/>}
                        title={t('diagnose')}
                        subtitle="Upload crop photo for analysis"
                        onClick={() => setActiveScreen(ActiveScreen.DIAGNOSIS)}
                    />
                    <ActionCard 
                        icon={<ChatIcon className="w-8 h-8"/>}
                        title={t('chatbot')}
                        subtitle="Ask our AI assistant anything"
                        onClick={() => setActiveScreen(ActiveScreen.CHATBOT)}
                    />
                     <ActionCard 
                        icon={<DocumentTextIcon className="w-8 h-8"/>}
                        title={t('schemes')}
                        subtitle="View latest government schemes"
                        onClick={() => setActiveScreen(ActiveScreen.SCHEMES)}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardScreen;