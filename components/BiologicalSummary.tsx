
import React from 'react';
import { BiologicalSummary as SummaryType } from '../types';

interface Props {
  summary: SummaryType;
}

const BiologicalSummary: React.FC<Props> = ({ summary }) => {
  const stats = [
    { label: 'Promoter Potential', value: summary.promoterPotential, icon: 'fa-door-open', color: 'text-orange-400' },
    { label: 'Structural Anchors', value: summary.structuralAnchors, icon: 'fa-anchor', color: 'text-emerald-400' },
    { label: 'Z-DNA Sites', value: summary.zDnaSites, icon: 'fa-helix', color: 'text-blue-400' },
    { label: 'Avg Melting Temp', value: `${summary.avgTm.toFixed(1)}°C`, icon: 'fa-temperature-high', color: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
            <div className="text-xl font-mono text-white">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BiologicalSummary;
