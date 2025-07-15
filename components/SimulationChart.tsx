
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SimulationDataPoint } from '../types';

interface SimulationChartProps {
  data: SimulationDataPoint[];
  inflation: number; // as a percentage, e.g., 2.0
  viewMode: 'real' | 'nominal';
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-lg">
        <p className="font-bold text-white">{`Age: ${label}`}</p>
        <p className="text-cyan-300">{`90th Percentile: ${formatCurrency(payload.find((p: any) => p.dataKey === 'p90').value)}`}</p>
        <p className="text-green-300">{`Median: ${formatCurrency(payload.find((p: any) => p.dataKey === 'p50').value)}`}</p>
        <p className="text-amber-300">{`10th Percentile: ${formatCurrency(payload.find((p: any) => p.dataKey === 'p10').value)}`}</p>
      </div>
    );
  }
  return null;
};

export const SimulationChart: React.FC<SimulationChartProps> = ({ data, inflation, viewMode }) => {
  const chartData = useMemo(() => {
    if (viewMode === 'real') {
      return data;
    }
    const inflationDecimal = inflation / 100;
    const startAge = data[0]?.age || 0;
    return data.map(d => {
      const years = d.age - startAge;
      const inflationMultiplier = Math.pow(1 + inflationDecimal, years);
      return {
        ...d,
        p10: d.p10 * inflationMultiplier,
        p50: d.p50 * inflationMultiplier,
        p90: d.p90 * inflationMultiplier,
      };
    });
  }, [data, inflation, viewMode]);

  if (!data || data.length === 0) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center h-[400px] flex items-center justify-center">
            <p className="text-gray-400">Run a simulation to see your portfolio projection.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Portfolio Value Over Time ({viewMode === 'real' ? "Today's Dollars" : 'Nominal Dollars'})</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="age" stroke="#9ca3af" name="Age" />
            <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{color: '#e5e7eb'}} />
            <Area type="monotone" dataKey="p90" stackId="1" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} name="90th Percentile" />
            <Area type="monotone" dataKey="p50" stackId="2" stroke="#34d399" fill="#34d399" fillOpacity={0.2} name="Median (50th)" />
            <Area type="monotone" dataKey="p10" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="10th Percentile" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
