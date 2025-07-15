
export enum RiskLevel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export interface Asset {
  id: string;
  name: string;
  principal: number;
  rate: number; // Expected compound rate in percentage
  risk: RiskLevel;
}

export interface Portfolio {
  assets: Asset[];
  startAge: number;
  lifeExpectancy: number;
  inflation: number;
}

export interface SimulationParams {
  startAge: number;
  inflation: number; // as a decimal, e.g., 0.02 for 2%
  runs: number;
  years: number;
  successThreshold: number; // e.g., 0.9 for 90%
}

export interface SimulationDataPoint {
  age: number;
  p10: number;
  p50: number;
  p90: number;
}

export interface SimulationResult {
  safeWithdrawal: number;
  successRate: number;
  simulationPaths: SimulationDataPoint[];
}