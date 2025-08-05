import React, { useState } from 'react';
import { GOVERNMENT_SCHEMES } from '../../constants';
import { useLocalization } from '../../localization';
import { GovernmentScheme } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const SchemeCard: React.FC<{ scheme: GovernmentScheme }> = ({ scheme }) => {
    const { t } = useLocalization();
    const [isExpanded, setIsExpanded] = useState(false);

    const statusClasses = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(t('english') === 'English' ? 'en-GB' : 'hi-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 0.3, type: 'spring' } }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
        >
            <div className="p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{scheme.name}</h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClasses[scheme.status]}`}>{t(scheme.status.toLowerCase() as any)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                 <motion.button className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    {t('viewDetails')}
                    <motion.svg animate={{ rotate: isExpanded ? 180 : 0 }} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </motion.button>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="px-5 pb-5 border-t border-gray-200 dark:border-slate-700"
                    >
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{t('eligibility')}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.eligibility}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{t('benefits')}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.benefits}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{t('registrationPeriod')}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(scheme.registrationStartDate)} - {formatDate(scheme.registrationEndDate)}</p>
                            </div>
                            {scheme.status === 'Active' && (
                                 <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold"
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
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">{t('liveSchemes')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">{t('schemesDescription')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
            </div>
        </div>
    );
};

export default SchemesScreen;
