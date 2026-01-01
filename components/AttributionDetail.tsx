
import React from 'react';
import { AnalysisWindow } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  window: AnalysisWindow;
  onClose: () => void;
  onGenerateReport?: () => void;
}

const AttributionDetail: React.FC<Props> = ({ window, onClose, onGenerateReport }) => {
  const data = window.contributions.map(c => ({
    name: c.feature.replace('_per_base', '').toUpperCase(),
    value: parseFloat(c.score.toFixed(3)),
    percentage: c.percentage
  }));

  const featureHints: Record<string, string> = {
    'DG': 'Thermodynamic Stability (Melting potential)',
    'STACK': 'Stacking Energy (Mechanical rigidity)',
    'HB': 'Hydrogen Bonding (Pairing strength)',
    'ZX': 'Electronic Z-Scale X (Conformational bend)',
    'ZY': 'Electronic Z-Scale Y (Twist parameter)',
    'ZZ': 'Electronic Z-Scale Z (Propeller tilt)',
    'GC': 'GC Content (Composition density)',
    'BENDABILITY': 'DNA Bendability (Nucleosome wrapping potential)'
  };

  return (
    <div className="glass-card p-8 rounded-2xl border-purple-500/30 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 bg-purple-600 rounded text-[10px] font-bold text-white uppercase">Deep SHAP Attribution</span>
             <h2 className="text-xl font-bold text-white">Window {window.index} Analysis</h2>
          </div>
          <p className="text-sm text-gray-400">Coordinates: {window.start} - {window.end} bp | Mahalanobis Distance: <span className="text-purple-400 font-mono font-bold">{window.combinedScore.toFixed(3)}</span></p>
        </div>
        <div className="flex items-center gap-4">
          {onGenerateReport && (
            <button 
              onClick={onGenerateReport}
              className="bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 px-4 py-2 rounded-lg flex items-center border border-white/5 transition-all"
            >
              <i className="fas fa-file-medical mr-2 text-purple-400"></i> Generate Full Report
            </button>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[300px] w-full bg-black/30 rounded-xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={10} width={60} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card p-2 rounded border border-purple-500/30 text-[10px] shadow-xl">
                        <p className="text-white font-bold">{payload[0].payload.name}</p>
                        <p className="text-purple-400">Weight: {payload[0].value}</p>
                        <p className="text-gray-500 italic mt-1">{featureHints[payload[0].payload.name]}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 1 ? '#a78bfa' : '#4b5563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Biophysical Drivers</h3>
          <div className="space-y-3">
            {data.slice(0, 3).map((d, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center group hover:border-purple-500/30 transition-all">
                <div>
                  <p className="text-xs font-bold text-white">{d.name}</p>
                  <p className="text-[10px] text-gray-500">{featureHints[d.name] || 'Complex structural feature'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-purple-400">{d.percentage.toFixed(1)}%</p>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${d.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-purple-900/10 rounded-xl border border-purple-500/10">
            <p className="text-[10px] text-purple-300 leading-relaxed italic">
              <i className="fas fa-brain mr-2"></i>
              Feature Attribution identifies <strong>{data[0].name}</strong> as the primary driver for this anomaly. 
              {data[0].name === 'BENDABILITY' ? " High bendability suggests a potential site for nucleosome positioning, directly influencing 3D chromatin folding." : ""}
              {data[0].name === 'DG' ? " The thermodynamic profile indicates a potential site of high thermal instability (DNA Melting Gate)." : ""}
              {window.sequence.includes('M') ? " Detection of Methyl-C (M) in this window shifts the biophysical landscape towards a silenced epigenetic state." : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributionDetail;
