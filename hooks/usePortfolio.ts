
import { useState, useEffect, useCallback } from 'react';
import { Asset, Portfolio, RiskLevel } from '../types';
import { DEFAULT_INFLATION, DEFAULT_START_AGE, DEFAULT_LIFE_EXPECTANCY } from '../constants';

const LOCAL_STORAGE_KEY = 'fire-it-up-portfolio';

const getInitialState = (): Portfolio => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      // Basic validation
      if (parsed.assets && typeof parsed.startAge === 'number' && typeof parsed.inflation === 'number') {
        // Ensure lifeExpectancy exists for backwards compatibility
        if (typeof parsed.lifeExpectancy !== 'number') {
            parsed.lifeExpectancy = DEFAULT_LIFE_EXPECTANCY;
        }
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
  
  return {
    assets: [
      { id: crypto.randomUUID(), name: "S&P 500", principal: 500000, rate: 8, risk: RiskLevel.Medium },
      { id: crypto.randomUUID(), name: "Bonds", principal: 500000, rate: 4, risk: RiskLevel.Low },
    ],
    startAge: DEFAULT_START_AGE,
    lifeExpectancy: DEFAULT_LIFE_EXPECTANCY,
    inflation: DEFAULT_INFLATION,
  };
};

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(getInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolio));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [portfolio]);

  const updateAsset = useCallback((updatedAsset: Asset) => {
    setPortfolio(p => ({
      ...p,
      assets: p.assets.map(a => a.id === updatedAsset.id ? updatedAsset : a),
    }));
  }, []);

  const addAsset = useCallback((newAsset: Omit<Asset, 'id'>) => {
    setPortfolio(p => ({
      ...p,
      assets: [...p.assets, { ...newAsset, id: crypto.randomUUID() }],
    }));
  }, []);

  const deleteAsset = useCallback((assetId: string) => {
    setPortfolio(p => ({
      ...p,
      assets: p.assets.filter(a => a.id !== assetId),
    }));
  }, []);

  const updateStartAge = useCallback((age: number) => {
    setPortfolio(p => ({ ...p, startAge: age }));
  }, []);

  const updateLifeExpectancy = useCallback((age: number) => {
    setPortfolio(p => ({ ...p, lifeExpectancy: age }));
  }, []);

  const updateInflation = useCallback((inflation: number) => {
    setPortfolio(p => ({ ...p, inflation }));
  }, []);
  
  const resetPortfolio = useCallback(() => {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPortfolio({
       assets: [],
       startAge: DEFAULT_START_AGE,
       lifeExpectancy: DEFAULT_LIFE_EXPECTANCY,
       inflation: DEFAULT_INFLATION,
    });
  }, []);


  return {
    ...portfolio,
    updateAsset,
    addAsset,
    deleteAsset,
    updateStartAge,
    updateLifeExpectancy,
    updateInflation,
    resetPortfolio,
  };
};