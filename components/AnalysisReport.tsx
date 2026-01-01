
import React from 'react';
import { AnalysisWindow } from '../types';

interface Props {
  anomalousWindows: AnalysisWindow[];
  onWindowClick?: (win: AnalysisWindow) => void;
  onMutate?: (win: AnalysisWindow) => void;
}

const AnalysisReport: React.FC<Props> = ({ anomalousWindows, onWindowClick, onMutate }) => {
  const getHint = (type: string) => {
    switch(type) {
      case 'Thermal Dip': return "Likely TATA-Box or melting gate. High thermal accessibility.";
      case 'Structural Shift': return "Possible Histon wrapping site. Sharp conformation shift.";
      case 'Stacking Anchor': return "Strong base-stacking stabilize. Potential structural anchor.";
      case 'Multivariate Deviation': return "Atypical multi-feature signature. High regulatory potential.";
      default: return "Biophysical deviation detected.";
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Thermal Dip': return "bg-orange-900/40 text-orange-400 border-orange-500/30";
      case 'Structural Shift': return "bg-blue-900/40 text-blue-400 border-blue-500/30";
      case 'Stacking Anchor': return "bg-emerald-900/40 text-emerald-400 border-emerald-500/30";
      default: return "bg-purple-900/40 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div className="space-y-12">
      <div className="glass-card p-8 rounded-2xl border-l-4 border-l-blue-500 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Biophysical Anomaly Report</h3>
          <p className="text-gray-300 leading-relaxed text-sm">
            Mapping outliers across 11 biophysical dimensions. Click a window to view <strong>Deep SHAP Attribution</strong>.
          </p>
        </div>
        <div className="text-[10px] text-gray-500 font-mono text-right">
          SCAN TYPE: MULTIVARIATE<br/>
          ENGINE: JAX-MONOLITH V3.5 (ULTIMATE)
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Anomalous Region Map</h3>
            <p className="text-sm text-gray-400">Coordinate mapping of physical outliers and biological archetypes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {anomalousWindows.map((win) => (
            <div 
              key={win.index} 
              className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-1">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${getTypeColor(win.anomalyType)}`}>
                  {win.anomalyType}
                </span>
                <span className="text-[7px] text-gray-500 font-mono font-bold bg-white/5 px-1 rounded">
                  Tm: {win.tm.toFixed(1)}°C
                </span>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-500">COORD: {win.start} - {win.end}</span>
              </div>

              <div 
                className="font-mono text-lg text-blue-300 mb-1 tracking-widest break-all group-hover:text-white transition-colors cursor-pointer"
                onClick={() => onWindowClick && onWindowClick(win)}
              >
                {win.sequence}
              </div>
              
              <div className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-4">
                Archetype: {win.archetype}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-[9px]">
                  <p className="text-gray-500 uppercase">Primary Driver</p>
                  <p className="text-white font-bold">{win.contributions[0]?.feature.replace('_per_base', '').toUpperCase()}</p>
                </div>
                <div className="text-[9px]">
                  <p className="text-gray-500 uppercase">M-Distance</p>
                  <p className="text-purple-400 font-bold">{win.combinedScore.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                 <p className="text-[9px] text-gray-400 italic">
                   <i className="fas fa-microscope mr-2 text-blue-500"></i> {getHint(win.anomalyType)}
                 </p>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => onWindowClick && onWindowClick(win)}
                      className="text-[9px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-gray-400 hover:text-white transition-all"
                      title="Deep SHAP Analysis"
                    >
                      <i className="fas fa-chart-pie"></i>
                    </button>
                    {onMutate && (
                      <button 
                        onClick={() => onMutate(win)}
                        className="text-[9px] bg-purple-900/20 hover:bg-purple-600 px-2 py-1 rounded text-purple-400 hover:text-white transition-all"
                        title="Run Virtual Mutation Test"
                      >
                        <i className="fas fa-flask"></i>
                      </button>
                    )}
                 </div>
              </div>
            </div>
          ))}
          {anomalousWindows.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <i className="fas fa-ghost text-4xl text-gray-800"></i>
              <p className="text-gray-600 italic">No significant physical anomalies detected. Try decreasing the sigma sensitivity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
