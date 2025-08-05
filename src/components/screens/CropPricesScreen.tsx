import React, { useState } from 'react';
import { CROP_PRICES } from '../../constants';
import { useLocalization } from '../../localization';
import Spinner from '../ui/Spinner';
import { CropPrice } from '../../types';
import { motion } from 'framer-motion';

const CropPricesScreen: React.FC = () => {
  const { t } = useLocalization();
  const [prices, setPrices] = useState<CropPrice[]>(CROP_PRICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newPrices = prices.map(crop => {
        const fluctuation = (Math.random() - 0.5) * 50;
        return {
          ...crop,
          avgPrice: Math.max(100, Math.round(crop.avgPrice + fluctuation))
        };
      });
      setPrices(newPrices);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{t('gohanaMandiPrices')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('todaysLiveMarketRates')}</p>
        </div>
        <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors shadow-sm">
            {isRefreshing ? <><Spinner className="w-5 h-5 mr-2" /> {t('refreshing')}</> : t('refresh')}
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">{t('cropName')}</th>
              <th scope="col" className="px-6 py-4 font-semibold hidden sm:table-cell">{t('variety')}</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right hidden md:table-cell">{t('minPrice')}</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right hidden md:table-cell">{t('maxPrice')}</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">{t('avgPrice')}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((crop, index) => (
              <motion.tr 
                key={crop.id} 
                className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div>
                        {crop.name}
                        <div className="font-normal text-slate-500 sm:hidden">{crop.variety}</div>
                    </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">{crop.variety}</td>
                <td className="px-6 py-4 text-right hidden md:table-cell">{crop.minPrice.toLocaleString('en-IN')} / {crop.unit}</td>
                <td className="px-6 py-4 text-right hidden md:table-cell">{crop.maxPrice.toLocaleString('en-IN')} / {crop.unit}</td>
                <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  {crop.avgPrice.toLocaleString('en-IN')} / {crop.unit}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
       <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">{t('pricesDisclaimer')} {t('lastUpdated')}: {lastUpdated.toLocaleTimeString()}</p>
    </div>
  );
};

export default CropPricesScreen;