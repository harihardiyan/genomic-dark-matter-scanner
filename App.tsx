
import React, { useState } from 'react';
import { analyzeSequence, compareSequences } from './services/biophysics';
import { ScannerResult, ComparisonResult, AnalysisWindow } from './types';
import Header from './components/Header';
import SequenceInput from './components/SequenceInput';
import Visualizations from './components/Visualizations';
import AnalysisReport from './components/AnalysisReport';
import ComparisonDashboard from './components/ComparisonDashboard';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import AttributionDetail from './components/AttributionDetail';
import DiagnosticReport from './components/DiagnosticReport';

const App: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [threshold, setThreshold] = useState(3.0);
  const [saltConcentration, setSaltConcentration] = useState(0.1);
  const [result, setResult] = useState<ScannerResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<AnalysisWindow | null>(null);
  const [showFullReport, setShowFullReport] = useState<AnalysisWindow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleScan = async (sequenceA: string, sequenceB?: string) => {
    if (sequenceA.length < 50 || (mode === 'compare' && (!sequenceB || sequenceB.length < 50))) {
      setError("Sequence too short. Please provide at least 50 bases for all inputs.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setWarning(null);
    setResult(null);
    setComparison(null);
    setSelectedWindow(null);
    setShowFullReport(null);
    
    try {
      let currentThreshold = threshold;
      let resA = analyzeSequence(sequenceA, currentThreshold, 15, 5, saltConcentration);
      
      if (resA.windows.filter(w => w.isAnomalous).length === 0 && currentThreshold > 2.0) {
        currentThreshold = 2.5;
        resA = analyzeSequence(sequenceA, currentThreshold, 15, 5, saltConcentration);
        if (resA.windows.filter(w => w.isAnomalous).length > 0) {
          setWarning("Low Confidence: Zero anomalies at 3σ. Lowered threshold to 2.5σ to identify potential signals.");
        }
      }

      if (mode === 'compare' && sequenceB) {
        const resB = analyzeSequence(sequenceB, currentThreshold, 15, 5, saltConcentration);
        const comp = compareSequences(resA, resB);
        setComparison(comp);
      }

      setResult({
        windows: resA.windows,
        stats: resA.stats,
        anomalies: resA.windows.filter(w => w.isAnomalous).map(w => w.index),
        correlationMap: resA.correlationMap,
        thresholdUsed: currentThreshold,
        multivariateScores: resA.multivariateScores
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during scanning.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleVirtualMutation = (originalSeq: string, index: number) => {
    const bases = ['A', 'C', 'G', 'T'];
    const seqArray = originalSeq.split('');
    const originalBase = seqArray[index] || seqArray[0];
    const newBase = bases.find(b => b !== originalBase) || 'A';
    seqArray[index] = newBase;
    const mutated = seqArray.join('');
    
    setMode('compare');
    handleScan(originalSeq, mutated);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            <button 
              onClick={() => setMode('single')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Single Scan
            </button>
            <button 
              onClick={() => setMode('compare')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'compare' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Comparative Genomics & Mutation Test
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 bg-black/30 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="uppercase tracking-widest text-blue-400 font-bold">Sensitivity (σ):</span>
              <input 
                type="range" min="1.0" max="4.0" step="0.1" 
                value={threshold} 
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-32 accent-blue-500"
              />
              <span className="w-8 text-blue-400 font-bold">{threshold.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="uppercase tracking-widest text-emerald-400 font-bold">Salt [Na+] (M):</span>
              <input 
                type="range" min="0.01" max="1.0" step="0.01" 
                value={saltConcentration} 
                onChange={(e) => setSaltConcentration(parseFloat(e.target.value))}
                className="w-32 accent-emerald-500"
              />
              <span className="w-12 text-emerald-400 font-bold">{saltConcentration.toFixed(2)}M</span>
            </div>
          </div>
        </div>

        <section>
          <SequenceInput onScan={handleScan} isLoading={isScanning} isComparison={mode === 'compare'} />
        </section>

        {warning && (
          <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-500 text-sm flex items-center">
            <i className="fas fa-triangle-exclamation mr-3"></i> {warning}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 animate-pulse">
            <i className="fas fa-exclamation-triangle mr-2"></i> {error}
          </div>
        )}

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-xl font-light text-blue-400 animate-pulse">
              {mode === 'single' ? 'Deep-Scanning Dark Matter Topology...' : 'Aligning Cross-Species DNA Deltas...'}
            </div>
          </div>
        )}

        {result && !isScanning && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {mode === 'single' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <div className="text-sm font-semibold text-gray-400 uppercase mb-2">Sensitivity</div>
                    <div className="text-4xl font-mono text-white">{result.thresholdUsed.toFixed(1)}σ</div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl border-emerald-500/30">
                    <div className="text-sm font-semibold text-emerald-400 uppercase mb-2">Salt [Na+]</div>
                    <div className="text-4xl font-mono text-emerald-500">{saltConcentration.toFixed(2)}M</div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl border-yellow-500/30">
                    <div className="text-sm font-semibold text-yellow-400 uppercase mb-2">Anomalies</div>
                    <div className="text-4xl font-mono text-yellow-500">{result.anomalies.length}</div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl border-blue-500/30">
                    <div className="text-sm font-semibold text-blue-400 uppercase mb-2">Avg M-Dist</div>
                    <div className="text-4xl font-mono text-blue-500">{(result.multivariateScores.reduce((a,b)=>a+b,0)/result.multivariateScores.length).toFixed(2)}</div>
                  </div>
                </div>

                <Visualizations windows={result.windows} onSelectWindow={setSelectedWindow} />
                
                {selectedWindow && (
                  <AttributionDetail 
                    window={selectedWindow} 
                    onClose={() => setSelectedWindow(null)} 
                    onGenerateReport={() => setShowFullReport(selectedWindow)}
                  />
                )}

                <CorrelationHeatmap data={result.correlationMap || []} />
                <AnalysisReport 
                  anomalousWindows={result.windows.filter(w => result.anomalies.includes(w.index))} 
                  onWindowClick={setSelectedWindow}
                  onMutate={(win) => handleVirtualMutation(result.windows.map(w => w.sequence.charAt(0)).join(''), win.start)}
                />
              </>
            ) : (
              comparison && (
                <>
                  <ComparisonDashboard comparison={comparison} />
                  <CorrelationHeatmap data={result.correlationMap || []} title="Local Cross-Correlation Map (Healthy Base)" />
                  <AnalysisReport 
                    anomalousWindows={result.windows.filter(w => result.anomalies.includes(w.index))} 
                    onWindowClick={setSelectedWindow}
                  />
                </>
              )
            )}
          </div>
        )}

        {showFullReport && (
          <DiagnosticReport window={showFullReport} onClose={() => setShowFullReport(null)} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 glass-card py-4 border-t border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs text-gray-500">
          <div><i className="fas fa-microchip mr-1"></i> Engine: JAX-Monolith Attribution Port</div>
          <div className="flex gap-4">
             <span className="flex items-center"><i className="fas fa-circle text-blue-500 mr-1 text-[8px]"></i> Mutation Lab Active</span>
             <span className="flex items-center"><i className="fas fa-circle text-emerald-500 mr-1 text-[8px]"></i> Salt Correction Enabled</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
