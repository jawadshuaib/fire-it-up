
import { RiskLevel } from './types';

export const SIMULATION_RUNS = 1000;
export const SUCCESS_THRESHOLD = 0.9; // 90% success rate

export const RISK_STD_DEV: { [key in RiskLevel]: number } = {
  [RiskLevel.Low]: 0.02,
  [RiskLevel.Medium]: 0.05,
  [RiskLevel.High]: 0.10,
};

export const DEFAULT_START_AGE = 40;
export const DEFAULT_LIFE_EXPECTANCY = 120;
export const DEFAULT_INFLATION = 2.0;