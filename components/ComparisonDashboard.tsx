
import React from 'react';
import { ComparisonResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  comparison: ComparisonResult;
}

const ComparisonDashboard: React.FC<Props> = ({ comparison }) => {
  const chartData = comparison.deltas.map(d => ({
    name: d.index,
    dG_delta: parseFloat(d.diff.dG_per_base.toFixed(3)),
    stacking_delta: parseFloat(d.diff.stack_per_base.toFixed(3)),
    hb_delta: parseFloat(d.diff.hb_per_base.toFixed(3))
  }));

  const metrics = [
    { key: 'dG_delta', label: 'Thermodynamic Delta (ΔdG)', color: '#3b82f6', value: comparison.avgDelta.dG_per_base },
    { key: 'stacking_delta', label: 'Stacking Energy Delta (ΔE)', color: '#a78bfa', value: comparison.avgDelta.stack_per_base },
    { key: 'hb_delta', label: 'H-Bond Shift', color: '#f43f5e', value: comparison.avgDelta.hb_per_base }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map(m => (
          <div key={m.key} className="glass-card p-6 rounded-2xl border-t-2" style={{ borderTopColor: m.color }}>
            <div className="text-xs font-semibold text-gray-400 uppercase mb-2">{m.label}</div>
            <div className={`text-4xl font-mono ${m.value > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {m.value > 0 ? '+' : ''}{m.value.toFixed(4)}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Avg shift per window across domain</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-2">Genomic "Texture" Shift Map</h3>
        <p className="text-sm text-gray-400 mb-8">Visualization of biophysical divergence between reference and target sequences.</p>
        
        <div className="space-y-12">
          {metrics.map(m => (
            <div key={m.key} className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{m.label}</span>
                <span className="text-[10px] text-gray-600">PEAK SHIFT: {Math.max(...chartData.map(d => Math.abs((d as any)[m.key]))).toFixed(3)}</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                      itemStyle={{ color: m.color }}
                    />
                    <ReferenceLine y={0} stroke="#ffffff22" />
                    <Area 
                      type="monotone" 
                      dataKey={m.key} 
                      stroke={m.color} 
                      strokeWidth={2}
                      fill={`url(#grad-${m.key})`} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonDashboard;
