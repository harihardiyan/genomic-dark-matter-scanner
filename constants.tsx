
import React from 'react';

// DNA Base to Index (A, C, G, T, M=5-Methylcytosine)
export const BASE_TO_ID: Record<string, number> = { 
  'A': 0, 'C': 1, 'G': 2, 'T': 3, 'M': 4 
};

// Hydrogen Bonds per Base
// Methylation (M) slightly increases stability but maintains 3 H-bonds
export const HBOND_PER_BASE = [2.0, 3.0, 3.0, 2.0, 3.1];

// Z-Scale Vectors (Electronic Topology)
// A, C, G, T, M
export const Z_VEC = [
  [1.0, 1.0, 1.0],     // A
  [-1.0, 1.0, -1.0],   // C
  [1.0, -1.0, -1.0],   // G
  [-1.0, -1.0, 1.0],    // T
  [-1.1, 1.2, -0.9]    // M (Shifted electronic profile)
];

// Stacking Energy (kcal/mol) - 5x5 Matrix
// Row: current, Col: next (A, C, G, T, M)
export const STACK_E_KCAL = [
  [-1.00, -1.44, -1.28, -0.88, -1.50], 
  [-1.07, -2.17, -2.24, -1.44, -2.30], 
  [-1.30, -2.24, -2.36, -1.28, -2.40], 
  [-0.93, -1.45, -1.30, -1.00, -1.55],
  [-1.10, -2.20, -2.30, -1.50, -2.50]
];

// Bendability Index (Gabrielian & Bolshoy) - Dinucleotide parameters for 3D Folding Potential
// High value = More flexible (potential nucleosome wrapping)
export const BENDABILITY_INDEX = [
  [0.01, 0.20, 0.10, 0.20, 0.15], // A-
  [-0.10, 0.10, 0.50, 0.10, 0.30], // C-
  [0.10, 0.30, 0.10, 0.10, 0.25], // G-
  [0.05, 0.10, 0.10, 0.01, 0.10], // T-
  [-0.05, 0.20, 0.40, 0.15, 0.20]  // M-
];

// Delta H (kcal/mol)
export const DELTA_H = [
  [-7.9, -8.4, -7.8, -7.2, -8.6],
  [-8.5, -8.0, -10.6, -8.9, -8.8],
  [-8.2, -10.6, -12.2, -8.0, -11.5],
  [-7.2, -8.2, -8.5, -7.9, -8.5],
  [-8.7, -9.0, -11.0, -8.8, -9.5]
];

// Delta S (cal/mol·K)
export const DELTA_S_CAL = [
  [-22.2, -22.4, -21.0, -20.4, -22.8],
  [-22.7, -19.9, -27.2, -24.0, -21.0],
  [-22.2, -27.2, -29.7, -19.9, -28.5],
  [-20.4, -21.0, -22.7, -22.2, -22.0],
  [-23.0, -21.5, -28.0, -23.0, -23.0]
];

export const T_KELVIN = 310.15; // 37 C
export const NA_MOLAR = 0.1;
export const K_SALT = 0.368;
export const EPS = 1e-12;
