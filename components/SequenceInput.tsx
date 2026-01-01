
import React, { useState } from 'react';

interface Props {
  onScan: (seqA: string, seqB?: string) => void;
  isLoading: boolean;
  isComparison: boolean;
}

const SequenceInput: React.FC<Props> = ({ onScan, isLoading, isComparison }) => {
  const [seqA, setSeqA] = useState("");
  const [seqB, setSeqB] = useState("");

  const examples = [
    { 
      name: "Human vs Chimp (Enhancer)", 
      a: "TGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCC",
      b: "TGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGTATAATGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCCGGCCCC"
    },
    { 
      name: "Epigenetic Shift (Methylation)", 
      a: "CGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCG",
      b: "MGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMGMG"
    },
    { 
      name: "Human vs Mouse (Hox Cluster)", 
      a: "AAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGG",
      b: "AAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAAAAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGG"
    }
  ];

  const handleSubmit = () => {
    onScan(seqA.trim(), isComparison ? seqB.trim() : undefined);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border-blue-500/10 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              {isComparison ? "Sequence A (Reference)" : "DNA Sequence (Non-Coding)"}
            </label>
            {!isComparison && (
              <div className="flex flex-wrap gap-2">
                {examples.map((ex, i) => (
                  <button 
                    key={i}
                    onClick={() => setSeqA(ex.a)}
                    className="text-[10px] px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <textarea
            value={seqA}
            onChange={(e) => setSeqA(e.target.value.toUpperCase().replace(/[^ACGTM\s]/g, ''))}
            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-blue-300 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="Paste genomic DNA (A,C,G,T or M for Methyl-C)..."
          />
        </div>

        {isComparison && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                Sequence B (Target / Simulation)
              </label>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex, i) => (
                  <button 
                    key={i}
                    onClick={() => { setSeqA(ex.a); setSeqB(ex.b); }}
                    className="text-[10px] px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded transition-colors"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={seqB}
              onChange={(e) => setSeqB(e.target.value.toUpperCase().replace(/[^ACGTM\s]/g, ''))}
              className="w-full h-32 bg-black/50 border border-purple-500/20 rounded-xl p-4 font-mono text-sm text-purple-300 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              placeholder="Paste comparison DNA..."
            />
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-xs text-gray-500 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Gunakan 'M' untuk merepresentasikan 5-Methylcytosine dalam simulasi epigenetik.
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !seqA || (isComparison && !seqB)}
          className={`px-8 py-3 rounded-xl font-semibold flex items-center transition-all ${
            isLoading || !seqA || (isComparison && !seqB)
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : isComparison ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {isLoading ? (
            <><i className="fas fa-spinner fa-spin mr-2"></i> Processing...</>
          ) : (
            <>
              <i className={`fas ${isComparison ? 'fa-shuffle' : 'fa-bolt'} mr-2`}></i> 
              {isComparison ? 'Run Comparative Analysis' : 'Deep-Scan DNA Topology'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SequenceInput;
