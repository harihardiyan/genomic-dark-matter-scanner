
export interface ScannerResult {
  windows: AnalysisWindow[];
  stats: AnalysisStats;
  anomalies: number[];
  correlationMap?: CorrelationPoint[];
  thresholdUsed: number;
  multivariateScores: number[];
  summary?: BiologicalSummary;
}

export interface BiologicalSummary {
  promoterPotential: number;
  structuralAnchors: number;
  zDnaSites: number;
  avgTm: number;
}

export interface CorrelationPoint {
  index: number;
  correlation: number;
}

export interface ComparisonResult {
  deltas: AnalysisWindowDelta[];
  avgDelta: BiophysicalFeatures;
}

export interface AnalysisWindowDelta {
  index: number;
  start: number;
  end: number;
  diff: BiophysicalFeatures;
}

export type AnomalyType = 'Thermal Dip' | 'Structural Shift' | 'Stacking Anchor' | 'Multivariate Deviation' | 'None';

export type BiologicalArchetype = 
  | 'Putative Promoter' 
  | 'Z-DNA Candidate' 
  | 'G-Quadruplex' 
  | 'Flexible Linker' 
  | 'Mechanical Anchor' 
  | 'Unknown Anomaly'
  | 'Stable Helix';

export interface FeatureContribution {
  feature: string;
  score: number;
  percentage: number;
}

export interface AnalysisWindow {
  index: number;
  start: number;
  end: number;
  sequence: string;
  features: BiophysicalFeatures;
  isAnomalous: boolean;
  zScores: Record<string, number>;
  anomalyType: AnomalyType;
  archetype: BiologicalArchetype;
  combinedScore: number;
  contributions: FeatureContribution[];
  tm: number; // Melting Temperature in Celsius
}

export interface BiophysicalFeatures {
  gc: number;
  hb_per_base: number;
  stack_per_base: number;
  dG_per_base: number;
  zx: number;
  zy: number;
  zz: number;
  bendability: number;
}

export interface AnalysisStats {
  mean: BiophysicalFeatures;
  std: BiophysicalFeatures;
}
