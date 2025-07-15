import React from 'react';
import { SimulationResult } from '../types';
import { FireIcon } from './icons';

interface ResultsDisplayProps {
  result: SimulationResult | null;
  isLoading: boolean;
  progress: number;
  lifeExpectancy: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, progress, lifeExpectancy }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
        <h2 className="text-xl font-bold text-white mb-4">Running Simulation...</h2>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div className="bg-brand-accent h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-center text-gray-300 mt-2">{Math.round(progress)}% Complete</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-white mb-2">Ready to Calculate</h2>
        <p className="text-gray-400">Adjust your portfolio and settings, then press "Fire It Up!" to run the simulation.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FireIcon /> Results</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Annual Withdrawal (in Today's Dollars)</p>
          <p className="text-4xl font-bold text-brand-accent">{formatCurrency(result.safeWithdrawal)}</p>
          <p className="text-sm text-gray-400">This is your sustainable annual spending power. The actual amount you withdraw will increase each year to keep up with inflation.</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Simulation Success Rate</p>
          <p className="text-2xl font-semibold text-white">{(result.successRate * 100).toFixed(1)}%</p>
           <p className="text-sm text-gray-400">Percentage of simulations where the portfolio did not run out before age {lifeExpectancy}.</p>
        </div>
      </div>
    </div>
  );
};
