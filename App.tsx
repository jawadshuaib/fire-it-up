import React, { useState, useCallback } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import { Asset, RiskLevel, SimulationResult } from './types';
import { AssetForm } from './components/AssetForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SimulationChart } from './components/SimulationChart';
import { findOptimalWithdrawal } from './services/simulation';
import { SIMULATION_RUNS, SUCCESS_THRESHOLD } from './constants';
import { PlusIcon, TrashIcon, PencilIcon, FireIcon, ChartBarIcon } from './components/icons';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

export default function App() {
  const portfolio = usePortfolio();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'real' | 'nominal'>('real');


  const handleRunSimulation = useCallback(async () => {
    if (portfolio.assets.length === 0) {
      alert("Please add at least one asset to your portfolio.");
      return;
    }
    if (portfolio.startAge >= portfolio.lifeExpectancy) {
      alert("Retirement age must be less than life expectancy.");
      return;
    }

    setIsLoading(true);
    setSimulationResult(null);
    setProgress(0);
    
    const params = {
      startAge: portfolio.startAge,
      inflation: portfolio.inflation / 100,
      runs: SIMULATION_RUNS,
      years: portfolio.lifeExpectancy - portfolio.startAge,
      successThreshold: SUCCESS_THRESHOLD,
    };

    const result = await findOptimalWithdrawal(portfolio.assets, params, setProgress);
    setSimulationResult(result);
    setIsLoading(false);
  }, [portfolio.assets, portfolio.startAge, portfolio.inflation, portfolio.lifeExpectancy]);

  const handleSaveAsset = (assetData: Asset | Omit<Asset, 'id'>) => {
    if ('id' in assetData) {
      portfolio.updateAsset(assetData as Asset);
    } else {
      portfolio.addAsset(assetData);
    }
    setIsFormOpen(false);
    setEditingAsset(null);
  };

  const totalPrincipal = portfolio.assets.reduce((sum, a) => sum + a.principal, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FireIcon className="text-brand-accent w-8 h-8"/> FIRE IT UP!
          </h1>
           <button onClick={portfolio.resetPortfolio} className="text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Reset All
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-3">Plan Your Financial Freedom</h2>
            <p className="text-gray-300 mb-2">
                <strong>FIRE IT UP!</strong> helps you determine a sustainable, inflation-adjusted annual withdrawal from your portfolio. Our goal is to ensure your savings can support you throughout your entire retirement.
            </p>
            <p className="text-gray-300">
                Using <strong>Monte Carlo simulations</strong>, the app runs thousands of projections of your portfolio's future based on your specified growth rates and risk levels. This powerful technique accounts for market volatility, providing a success probability for your withdrawal plan rather than a simple, and often misleading, single-path forecast.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            {/* Global Settings */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Global Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="startAge" className="block text-sm font-medium text-gray-300">Retirement Age</label>
                  <input type="number" id="startAge" value={portfolio.startAge} onChange={e => portfolio.updateStartAge(parseInt(e.target.value))} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white" />
                </div>
                 <div>
                  <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-300">Life Expectancy</label>
                  <input type="number" id="lifeExpectancy" value={portfolio.lifeExpectancy} onChange={e => portfolio.updateLifeExpectancy(parseInt(e.target.value))} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white" />
                </div>
                <div>
                  <label htmlFor="inflation" className="block text-sm font-medium text-gray-300">Inflation (%)</label>
                  <input type="number" id="inflation" value={portfolio.inflation} onChange={e => portfolio.updateInflation(parseFloat(e.target.value))} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white" />
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Your Assets</h2>
                <button onClick={() => { setEditingAsset(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-brand-secondary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  <PlusIcon /> Add Asset
                </button>
              </div>
              <div className="space-y-3">
                {portfolio.assets.map(asset => (
                  <div key={asset.id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{asset.name} - <span className="text-gray-300">{asset.risk} Risk</span></p>
                      <p className="text-gray-300">{formatCurrency(asset.principal)} @ {asset.rate}%</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setEditingAsset(asset); setIsFormOpen(true); }} className="text-gray-400 hover:text-white"><PencilIcon /></button>
                      <button onClick={() => portfolio.deleteAsset(asset.id)} className="text-gray-400 hover:text-red-500"><TrashIcon /></button>
                    </div>
                  </div>
                ))}
                {portfolio.assets.length === 0 && <p className="text-gray-400 text-center py-4">Add your first asset to get started.</p>}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700 text-right">
                <p className="text-lg font-bold text-white">Total Principal: {formatCurrency(totalPrincipal)}</p>
              </div>
            </div>

             <div className="flex justify-center">
                <button
                  onClick={handleRunSimulation}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <ChartBarIcon />
                  {isLoading ? 'Simulating...' : 'Calculate Safe Withdrawal'}
                </button>
              </div>
          </div>

          {/* Right Column: Outputs */}
          <div className="space-y-8">
            <ResultsDisplay result={simulationResult} isLoading={isLoading} progress={progress} lifeExpectancy={portfolio.lifeExpectancy}/>

            {simulationResult && simulationResult.simulationPaths.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Projections</h2>
                         <div className="flex items-center space-x-2 rounded-lg bg-gray-700 p-1">
                            <button
                                onClick={() => setViewMode('real')}
                                className={`px-3 py-1 text-sm font-medium rounded-md ${viewMode === 'real' ? 'bg-brand-secondary text-white' : 'text-gray-300'}`}
                            >
                                Today's $
                            </button>
                            <button
                                onClick={() => setViewMode('nominal')}
                                className={`px-3 py-1 text-sm font-medium rounded-md ${viewMode === 'nominal' ? 'bg-brand-secondary text-white' : 'text-gray-300'}`}
                            >
                                Nominal $
                            </button>
                        </div>
                    </div>
                     <SimulationChart data={simulationResult.simulationPaths} inflation={portfolio.inflation} viewMode={viewMode} />
                </div>
            )}
            
            {(!simulationResult || simulationResult.simulationPaths.length === 0) && !isLoading && (
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center">
                    <ChartBarIcon className="w-16 h-16 text-gray-600 mb-4"/>
                    <h3 className="text-lg font-semibold text-white">Your Portfolio Projection Chart</h3>
                    <p className="text-gray-400">The results of your simulation will be visualized here.</p>
                 </div>
            )}
          </div>
        </div>
        {isFormOpen && <AssetForm asset={editingAsset} onSave={handleSaveAsset} onClose={() => setIsFormOpen(false)} />}
      </main>
      <footer className="w-full py-6 mt-8 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>
            Built by Jawad Shuaib -{' '}
            <a
              href="https://j4wad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:text-brand-light transition-colors"
            >
              j4wad.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}