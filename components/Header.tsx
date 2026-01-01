
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/5 pt-8 pb-6 glass-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-dna text-white"></i>
            </span>
            Genomic <span className="gradient-text ml-2">Dark Matter Deep-Scanner</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400 font-light">
            Biophysical Anomaly Detection for Non-Coding Regulatory Antennas
          </p>
        </div>
        <div className="hidden sm:flex space-x-4 text-xs font-mono text-gray-500">
          <span className="px-2 py-1 bg-white/5 rounded">Z-SCALE</span>
          <span className="px-2 py-1 bg-white/5 rounded">STACKING E</span>
          <span className="px-2 py-1 bg-white/5 rounded">dG THERMO</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
