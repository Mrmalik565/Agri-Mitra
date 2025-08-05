import React, { useState } from 'react';
import { GOVERNMENT_SCHEMES } from '../../constants';
import { useLocalization } from '../../localization';
import { GovernmentScheme } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const SchemeCard: React.FC<{ scheme: GovernmentScheme }> = ({ scheme }) => {
    const { t } = useLocalization();
    const [isExpanded, setIsExpanded] = useState(false);

    const statusClasses = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-500/30',
        Upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ring-1 ring-inset ring-yellow-600/20 dark:ring-yellow-500/30',
        Closed: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-600/20 dark:ring-slate-500/30',
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }
    const { language } = useLocalization();

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 0.3, type: 'spring' } }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
        >
            <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{scheme.name}</h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClasses[scheme.status]}`}>{t(scheme.status.toLowerCase() as any)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{scheme.description}</p>
                 <div className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    {t('viewDetails')}
                    <motion.svg animate={{ rotate: isExpanded ? 180 : 0 }} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                            <div>
                                <h3 className="font-semibold text-slate-700 dark:text-slate-300">{t('eligibility')}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{scheme.eligibility}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 dark:text-slate-300">{t('benefits')}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{scheme.benefits}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 dark:text-slate-300">{t('registrationPeriod')}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(scheme.registrationStartDate)} - {formatDate(scheme.registrationEndDate)}</p>
                            </div>
                            {scheme.status === 'Active' && (
                                 <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold shadow-sm text-sm"
                                >
                                    {t('applyNow')}
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


const SchemesScreen: React.FC = () => {
    const { t } = useLocalization();
    const schemes = GOVERNMENT_SCHEMES;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{t('liveSchemes')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">{t('schemesDescription')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {schemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
            </div>
        </div>
    );
};

export default SchemesScreen;