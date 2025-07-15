
import { Asset, SimulationParams, SimulationResult, RiskLevel, SimulationDataPoint } from '../types';
import { RISK_STD_DEV } from '../constants';

// Box-Muller transform to get a normally distributed random number
const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * stdDev + mean;
};

const runSingleSimulationPath = (
  assets: Asset[],
  params: SimulationParams,
  annualWithdrawal: number
): { success: boolean; path: number[] } => {
  let assetValues = assets.map(a => a.principal);
  const path: number[] = [];
  
  for (let year = 0; year < params.years; year++) {
    const totalPortfolioValue = assetValues.reduce((sum, v) => sum + v, 0);
    path.push(totalPortfolioValue);

    if (totalPortfolioValue <= 0) {
      // Ran out of money early
      for (let i = year; i < params.years; i++) path.push(0);
      return { success: false, path };
    }
    
    // 1. Withdraw money
    const withdrawalThisYear = annualWithdrawal * Math.pow(1 + params.inflation, year);
    const withdrawalFraction = Math.min(1, withdrawalThisYear / totalPortfolioValue);
    assetValues = assetValues.map(v => v * (1 - withdrawalFraction));

    // 2. Apply growth
    assetValues = assetValues.map((value, i) => {
      const asset = assets[i];
      const rateDecimal = asset.rate / 100;
      const stdDev = RISK_STD_DEV[asset.risk as RiskLevel];
      const annualReturn = generateNormalRandom(rateDecimal, stdDev);
      return Math.max(0, value * (1 + annualReturn));
    });
  }

  const finalValue = assetValues.reduce((sum, v) => sum + v, 0);
  return { success: finalValue >= 0, path };
};

const runMonteCarlo = (
  assets: Asset[],
  params: SimulationParams,
  annualWithdrawal: number
): { successRate: number; portfolioPaths: number[][] } => {
  let successCount = 0;
  const portfolioPaths: number[][] = [];

  for (let i = 0; i < params.runs; i++) {
    const result = runSingleSimulationPath(assets, params, annualWithdrawal);
    if (result.success) {
      successCount++;
    }
    portfolioPaths.push(result.path);
  }

  return {
    successRate: successCount / params.runs,
    portfolioPaths,
  };
};

const getPercentilesForYear = (portfolioValuesForYear: number[], p: number[]): number[] => {
  const sorted = [...portfolioValuesForYear].sort((a, b) => a - b);
  return p.map(percent => {
    const index = Math.floor(sorted.length * percent);
    return sorted[index];
  });
};


export const findOptimalWithdrawal = async (
  assets: Asset[],
  params: SimulationParams,
  setProgress: (progress: number) => void
): Promise<SimulationResult> => {
  
  return new Promise(resolve => {
    setTimeout(() => {
        const totalPrincipal = assets.reduce((sum, a) => sum + a.principal, 0);
        if (totalPrincipal === 0 || params.years <= 0) {
            resolve({ safeWithdrawal: 0, successRate: 0, simulationPaths: [] });
            return;
        }

        let low = 0;
        let high = totalPrincipal / params.years * 2; // Generous upper bound
        let optimalWithdrawal = 0;
        let finalPaths: number[][] = [];

        const iterations = 15; // Binary search iterations, balances precision and speed
        for (let i = 0; i < iterations; i++) {
            const mid = low + (high - low) / 2;
            const { successRate, portfolioPaths } = runMonteCarlo(assets, params, mid);

            if (successRate >= params.successThreshold) {
                optimalWithdrawal = mid;
                finalPaths = portfolioPaths;
                low = mid;
            } else {
                high = mid;
            }
            setProgress(((i + 1) / iterations) * 100);
        }
        
        // Process final paths for charting
        const simulationDataPoints: SimulationDataPoint[] = [];
        for (let year = 0; year < params.years; year++) {
            const valuesForYear = finalPaths.map(path => path[year] || 0);
            const [p10, p50, p90] = getPercentilesForYear(valuesForYear, [0.1, 0.5, 0.9]);
            simulationDataPoints.push({
                age: params.startAge + year,
                p10,
                p50,
                p90,
            });
        }
        
        const finalResult = runMonteCarlo(assets, params, optimalWithdrawal);

        resolve({
            safeWithdrawal: optimalWithdrawal,
            successRate: finalResult.successRate,
            simulationPaths: simulationDataPoints,
        });
    }, 0);
  });
};
