import React, { useState, useEffect } from 'react';
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
      // Simulate price fluctuations
      const newPrices = prices.map(crop => {
        const fluctuation = (Math.random() - 0.5) * 50;
        return {
          ...crop,
          avgPrice: Math.round(crop.avgPrice + fluctuation)
        };
      });
      setPrices(newPrices);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">{t('gohanaMandiPrices')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('todaysLiveMarketRates')}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('lastUpdated')}: {lastUpdated.toLocaleTimeString()}
        </p>
        <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {isRefreshing ? <><Spinner className="w-5 h-5 mr-2" /> {t('refreshing')}</> : t('refresh')}
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">{t('cropName')}</th>
              <th scope="col" className="px-6 py-3">{t('variety')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('minPrice')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('maxPrice')}</th>
              <th scope="col" className="px-6 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{t('avgPrice')}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((crop, index) => (
              <motion.tr 
                key={crop.id} 
                className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {crop.name}
                </th>
                <td className="px-6 py-4">{crop.variety}</td>
                <td className="px-6 py-4 text-right">{crop.minPrice.toLocaleString('en-IN')}/{crop.unit}</td>
                <td className="px-6 py-4 text-right">{crop.maxPrice.toLocaleString('en-IN')}/{crop.unit}</td>
                <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  {crop.avgPrice.toLocaleString('en-IN')}/{crop.unit}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
       <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">{t('pricesDisclaimer')}</p>
    </div>
  );
};

export default CropPricesScreen;