
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend, ReferenceLine 
} from 'recharts';
import { AnalysisWindow } from '../types';

interface Props {
  windows: AnalysisWindow[];
  onSelectWindow?: (window: AnalysisWindow) => void;
}

const Visualizations: React.FC<Props> = ({ windows, onSelectWindow }) => {
  const [activeMetric, setActiveMetric] = useState<'dG_per_base' | 'stack_per_base' | 'bendability'>('dG_per_base');

  const chartData = windows.map(w => ({
    name: w.index,
    dG: parseFloat(w.features.dG_per_base.toFixed(3)),
    stacking: parseFloat(w.features.stack_per_base.toFixed(3)),
    hb: parseFloat(w.features.hb_per_base.toFixed(3)),
    bend: parseFloat(w.features.bendability.toFixed(3)),
    zx: parseFloat(w.features.zx.toFixed(3)),
    zy: parseFloat(w.features.zy.toFixed(3)),
    zz: parseFloat(w.features.zz.toFixed(3)),
    isAnomalous: w.isAnomalous,
    fullData: w
  }));

  const handleChartClick = (e: any) => {
    if (e && e.activePayload && onSelectWindow) {
      onSelectWindow(e.activePayload[0].payload.fullData);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 rounded-lg border-blue-500/30 text-xs shadow-2xl pointer-events-none">
          <p className="font-bold text-blue-400 mb-1">Window {label}</p>
          <div className="space-y-1">
            <p className="text-gray-300">Value: <span className="font-mono">{payload[0].value}</span></p>
            {data.isAnomalous && (
              <p className="text-yellow-400 font-bold uppercase text-[10px] tracking-widest">
                <i className="fas fa-radiation mr-1"></i> Anomaly Detected
              </p>
            )}
            <p className="text-gray-500 italic mt-1 text-[9px]">Click for Deep SHAP Attribution</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white">Biophysical Topology Profile</h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">Model: Nearest-Neighbor (SantaLucia '98) | Raw Data (No Smoothing)</p>
          </div>
          <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
            {[
              { id: 'dG_per_base', label: 'Thermodynamics' },
              { id: 'stack_per_base', label: 'Stacking Energy' },
              { id: 'bendability', label: 'Bendability (3D)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMetric(tab.id as any)}
                className={`px-4 py-1.5 text-xs rounded-md transition-all ${
                  activeMetric === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} onClick={handleChartClick}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="linear" 
                dataKey={activeMetric === 'dG_per_base' ? 'dG' : activeMetric === 'stack_per_base' ? 'stacking' : 'bend'} 
                stroke="#3b82f6" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                isAnimationActive={false}
              />
              {chartData.map((d, i) => d.isAnomalous && (
                <ReferenceLine key={i} x={d.name} stroke="#ef444477" strokeWidth={1} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Electronic Topology Fingerprinting</h3>
        <p className="text-sm text-gray-400 mb-8">Z-scale coordinates indicating DNA conformation shifts (includes Methylation effects)</p>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="linear" dataKey="zx" stroke="#60a5fa" strokeWidth={1.2} dot={false} isAnimationActive={false} />
              <Line type="linear" dataKey="zy" stroke="#a78bfa" strokeWidth={1.2} dot={false} isAnimationActive={false} />
              <Line type="linear" dataKey="zz" stroke="#f472b6" strokeWidth={1.2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
