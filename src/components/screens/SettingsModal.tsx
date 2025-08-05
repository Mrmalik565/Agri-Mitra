import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Theme, FontSize } from '../../types';
import { useLocalization } from '../../localization';
import { useSettings } from '../../App';
import { CHATBOT_VOICES } from '../../constants';
import { XIcon } from '../ui/Icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
    const { t, language, setLanguage } = useLocalization();
    const { theme, setTheme, voice, setVoice, fontSize, setFontSize } = useSettings();
    const [editableUser, setEditableUser] = useState(user);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser(editableUser);
        alert(t('profileUpdated'));
        onClose();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditableUser(prev => ({...prev, profilePicUrl: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('myProfile')} & {t('settings')}</h2>
                            <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex-grow overflow-y-auto p-6">
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <img src={editableUser.profilePicUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                                    <div>
                                        <label htmlFor="photo-upload" className="cursor-pointer text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-4 py-2 rounded-lg btn-animated">
                                            {t('uploadNewPhoto')}
                                        </label>
                                        <input type="file" id="photo-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('fullName')}</label>
                                        <input type="text" value={editableUser.name} onChange={e => setEditableUser({ ...editableUser, name: e.target.value })} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('emailAddress')}</label>
                                        <input type="email" value={editableUser.email} onChange={e => setEditableUser({ ...editableUser, email: e.target.value })} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('phoneNumber')}</label>
                                        <input type="tel" value={editableUser.phone} onChange={e => setEditableUser({ ...editableUser, phone: e.target.value })} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('dateOfBirth')}</label>
                                        <input type="date" value={editableUser.dob} onChange={e => setEditableUser({ ...editableUser, dob: e.target.value })} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('appTheme')}</label>
                                        <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                                            {(['light', 'dark', 'system'] as Theme[]).map(th => (
                                                <button key={th} type="button" onClick={() => setTheme(th)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${theme === th ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>{t(th)}</button>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('fontSize')}</label>
                                        <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                                            {(['sm', 'base', 'lg'] as FontSize[]).map(size => (
                                                <button 
                                                key={size} 
                                                type="button" 
                                                onClick={() => setFontSize(size)} 
                                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${fontSize === size ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
                                                >
                                                {t(size === 'sm' ? 'small' : size === 'base' ? 'medium' : 'large')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('appLanguage')}</label>
                                        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                                            <button type="button" onClick={() => setLanguage('en')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${language === 'en' ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>{t('english')}</button>
                                            <button type="button" onClick={() => setLanguage('hi')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${language === 'hi' ? 'bg-white dark:bg-slate-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>{t('hindi')}</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="voice-select" className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('chatbotVoice')}</label>
                                        <select id="voice-select" value={voice} onChange={e => setVoice(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                                            {CHATBOT_VOICES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                     <button type="submit" className="w-full py-2.5 px-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 btn-animated">{t('updateProfile')}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;