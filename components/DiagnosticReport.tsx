
import React from 'react';
import { AnalysisWindow } from '../types';

interface Props {
  window: AnalysisWindow;
  onClose: () => void;
}

const DiagnosticReport: React.FC<Props> = ({ window, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const topDrivers = window.contributions.slice(0, 3);
  
  const getBiologicalHypothesis = (type: string, primaryDriver: string) => {
    let hypothesis = "Berdasarkan pemodelan biofisika sekuensial, wilayah ini menunjukkan karakteristik regulasi tinggi. ";
    
    if (primaryDriver === 'BENDABILITY') {
      hypothesis += "Skor Bendabilitas yang tinggi mengindikasikan potensi wrapping nucleosome yang kuat, menunjukkan peran aktif dalam organisasi arsitektur 3D kromatin. ";
    }

    if (window.sequence.includes('M')) {
      hypothesis += "Adanya 5-Methylcytosine (M) meningkatkan stabilitas heliks dan dapat memicu perekrutan protein Methyl-Binding Domain (MBD), mengindikasikan status epigenetik yang ter-silencing secara lokal. ";
    }

    if (type === 'Thermal Dip' || primaryDriver === 'dG') {
      hypothesis += "Karakteristik 'Melting Gate' atau TATA-Box terdeteksi. Aksesibilitas termal yang tinggi menunjukkan wilayah ini kemungkinan besar berfungsi sebagai Super-Enhancer atau titik awal transkripsi.";
    } else if (type === 'Structural Shift' || primaryDriver.includes('Z')) {
      hypothesis += "Perubahan pada koordinat Z-Scale menunjukkan adanya konformasi DNA yang melengkung (bent DNA), yang seringkali merupakan situs pengenalan bagi protein arsitektural kromatin.";
    } else {
      hypothesis += "Anomali multivariat ini menunjukkan kompleksitas struktural yang unik, berpotensi menjadi jangkar mekanik bagi kompleks protein regulator.";
    }
    return hypothesis + " Interpretasi ini bersifat prediktif dan disarankan untuk divalidasi melalui metode eksperimental (e.g., ChIP-seq atau ATAC-seq).";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl min-h-[11in] p-12 shadow-2xl relative print:p-0 print:shadow-none print:m-0">
        
        <div className="absolute top-4 right-4 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
          >
            <i className="fas fa-file-pdf mr-2"></i> Print / Save PDF
          </button>
          <button 
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="text-center border-b-2 border-slate-900 pb-8 mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">Genomic Diagnostic Report</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">JAX-Monolith Biophysical Core V3.0 (DeterministicNN Engine)</p>
          <div className="mt-4 flex justify-center gap-8 text-[10px] font-mono text-slate-400">
            <span>TIMESTAMP: {new Date().toLocaleString()}</span>
            <span>ENGINE: DETERMINISTIC-NEAREST-NEIGHBOR</span>
            <span>SENSITIVITY: 3.0σ (USER-DEFINED)</span>
          </div>
        </div>

        <section className="mb-10">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">1. Methodology & Data Integrity</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">
            Laporan ini dihasilkan menggunakan parameter termodinamika <strong>Nearest-Neighbor (SantaLucia, 1998)</strong>. 
            Analisis dilakukan tanpa interpolasi data (Zero-Smoothing) untuk mempertahankan integritas sinyal biofisika asli. 
            <strong> Salt Correction (Koreksi Garam)</strong> diterapkan secara dinamis untuk menyesuaikan stabilitas entropis berdasarkan konsentrasi kation monovalen yang ditentukan pengguna, memastikan model setara dengan standar perangkat lunak laboratorium profesional.
          </p>
        </section>

        <section className="mb-10">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">2. Anomaly Details (Window {window.index})</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Coordinates:</span>
                <span className="font-mono">{window.start} - {window.end} bp</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Mahalanobis Distance:</span>
                <span className="font-mono font-bold text-red-600">{window.combinedScore.toFixed(3)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Prediction Class:</span>
                <span className="font-bold uppercase text-blue-700">{window.anomalyType}</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 font-mono text-xs break-all leading-relaxed">
              <span className="text-slate-400 block mb-2 font-sans font-bold uppercase tracking-widest text-[10px]">Sequence Data (M=5mC):</span>
              {window.sequence}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">3. SHAP Attribution (Feature Weights)</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6 italic">
            Dekomposisi Jarak Mahalanobis ke dalam komponen biofisika penyusun (Attribution Weights):
          </p>
          <div className="space-y-4">
            {topDrivers.map((driver, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="w-32 font-bold text-slate-800 text-[10px] font-mono uppercase tracking-widest">
                  {driver.feature.replace('_per_base', '')}
                </div>
                <div className="flex-1 bg-slate-100 h-6 rounded overflow-hidden flex items-center relative">
                  <div 
                    className="h-full bg-slate-800" 
                    style={{ width: `${driver.percentage}%` }}
                  ></div>
                  <span className="absolute right-3 text-[10px] font-bold text-slate-500">{driver.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">4. Predicted 3D & Epigenetic Impact</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">
            {getBiologicalHypothesis(window.anomalyType, topDrivers[0].feature)}
          </p>
        </section>

        <div className="mt-auto border-t border-slate-200 pt-6 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <div>OFFICIAL DIAGNOSTIC PREDICTION #GEN-{window.index}-{Math.floor(Math.random()*10000)}</div>
          <div>DISCLAIMER: Computational model for research use only.</div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReport;
