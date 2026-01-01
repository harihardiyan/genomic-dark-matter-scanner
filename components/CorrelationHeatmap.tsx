
import React from 'react';
import { CorrelationPoint } from '../types';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

interface Props {
  data: CorrelationPoint[];
  title?: string;
}

const CorrelationHeatmap: React.FC<Props> = ({ data, title = "H-Bond vs Stacking Interaction Map" }) => {
  // Convert correlation to color
  // 1 (Strong Pos) -> Cyan
  // 0 (No Corr) -> Dark Gray
  // -1 (Strong Neg) -> Orange/Red
  const getColor = (corr: number) => {
    if (corr > 0.5) return '#22d3ee'; // Cyan
    if (corr > 0) return '#0891b2'; // Dark Cyan
    if (corr < -0.5) return '#f43f5e'; // Rose
    if (corr < 0) return '#9f1239'; // Dark Red
    return '#1f2937'; // Gray
  };

  const formattedData = data.map(d => ({
    x: d.index,
    y: 1, // Heatmap row
    val: d.correlation,
    size: Math.abs(d.correlation) * 100 + 20
  }));

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-gray-500">Local Pearson correlation coefficient (Moving window: 5)</p>
        </div>
        <div className="flex gap-4 text-[9px] font-mono">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> POSITIVE</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> NEGATIVE</div>
        </div>
      </div>

      <div className="h-[120px] w-full bg-black/30 rounded-xl p-4 border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" domain={[0, 2]} hide />
            <ZAxis type="number" dataKey="size" range={[50, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card p-2 rounded border border-white/10 text-[10px] font-mono">
                      <p className="text-gray-400">Window: {payload[0].payload.x}</p>
                      <p className="text-white">Corr: {payload[0].payload.val.toFixed(3)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Correlation" data={formattedData}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.val)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] text-gray-600 font-mono">
        <span>WINDOW START</span>
        <span>SEQUENCE SCALE</span>
        <span>WINDOW END</span>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
