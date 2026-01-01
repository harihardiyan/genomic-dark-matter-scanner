
import { 
  BASE_TO_ID, 
  HBOND_PER_BASE, 
  Z_VEC, 
  STACK_E_KCAL, 
  BENDABILITY_INDEX,
  DELTA_H, 
  DELTA_S_CAL, 
  T_KELVIN, 
  K_SALT, 
  EPS 
} from '../constants';
import { AnalysisWindow, BiophysicalFeatures, AnalysisStats, CorrelationPoint, ComparisonResult, AnalysisWindowDelta, AnomalyType, FeatureContribution } from '../types';

export function analyzeSequence(sequence: string, threshold: number = 3.0, W: number = 15, S: number = 5, salt: number = 0.1) {
  // Strict sanitation
  const seq = sequence.toUpperCase().replace(/[^ACGTM]/g, 'N');
  const windows: AnalysisWindow[] = [];
  
  if (seq.length < W) {
    throw new Error(`Sequence length (${seq.length}) must be at least window size (${W}).`);
  }

  for (let i = 0; i <= seq.length - W; i += S) {
    const sub = seq.substring(i, i + W);
    const windowFeatures = calculateWindowFeatures(sub, salt);
    windows.push({
      index: Math.floor(i / S),
      start: i,
      end: i + W,
      sequence: sub,
      features: windowFeatures,
      isAnomalous: false,
      zScores: {},
      anomalyType: 'None',
      combinedScore: 0,
      contributions: []
    });
  }

  const stats = calculateStats(windows.map(w => w.features));
  
  windows.forEach(w => {
    const features = w.features as any;
    const means = stats.mean as any;
    const stds = stats.std as any;
    let distSq = 0;
    const rawContributions: {feature: string, zSq: number}[] = [];
    
    for (const key in features) {
      const val = features[key];
      const mean = means[key];
      // If variance is zero (e.g. repetitive sequence), Z-score is 0 unless value differs from mean
      const std = stds[key] > EPS ? stds[key] : EPS;
      const z = (val - mean) / std;
      w.zScores[key] = z;
      const zSq = z * z;
      distSq += zSq;
      rawContributions.push({ feature: key, zSq });
    }
    
    // Multivariate Mahalanobis Distance (Euclidean in Z-space)
    w.combinedScore = Math.sqrt(distSq);

    w.contributions = rawContributions.map(c => ({
      feature: c.feature,
      score: (c.zSq / (distSq || EPS)) * w.combinedScore,
      percentage: (c.zSq / (distSq || EPS)) * 100
    })).sort((a, b) => b.score - a.score);

    // Heuristic anomaly tagging based on specific feature outliers
    if (Math.abs(w.zScores.dG_per_base) > threshold) {
      w.isAnomalous = true;
      w.anomalyType = w.zScores.dG_per_base < 0 ? 'Thermal Dip' : 'Structural Shift';
    }
    
    if (Math.abs(w.zScores.stack_per_base) > threshold && w.anomalyType === 'None') {
      w.isAnomalous = true;
      w.anomalyType = 'Stacking Anchor';
    }

    if (w.combinedScore > threshold * 2 && w.anomalyType === 'None') {
      w.isAnomalous = true;
      w.anomalyType = 'Multivariate Deviation';
    }
  });

  const correlationMap = calculateCrossCorrelation(windows);

  return { 
    windows, 
    stats, 
    correlationMap, 
    thresholdUsed: threshold,
    multivariateScores: windows.map(w => w.combinedScore)
  };
}

export function compareSequences(resA: {windows: AnalysisWindow[]}, resB: {windows: AnalysisWindow[]}): ComparisonResult {
  const len = Math.min(resA.windows.length, resB.windows.length);
  const deltas: AnalysisWindowDelta[] = [];
  const sumDiff: any = { gc: 0, hb_per_base: 0, stack_per_base: 0, dG_per_base: 0, zx: 0, zy: 0, zz: 0, bendability: 0 };

  for (let i = 0; i < len; i++) {
    const wA = resA.windows[i];
    const wB = resB.windows[i];
    const diff: any = {};
    const featA = wA.features as any;
    const featB = wB.features as any;
    for (const key in featA) {
      diff[key] = featB[key] - featA[key];
      sumDiff[key] += diff[key];
    }
    deltas.push({ index: i, start: wA.start, end: wA.end, diff: diff as BiophysicalFeatures });
  }

  const avgDelta: any = {};
  for (const key in sumDiff) { avgDelta[key] = sumDiff[key] / Math.max(len, 1); }
  return { deltas, avgDelta: avgDelta as BiophysicalFeatures };
}

function calculateCrossCorrelation(windows: AnalysisWindow[]): CorrelationPoint[] {
  const result: CorrelationPoint[] = [];
  const lookback = 5;
  if (windows.length <= lookback) return [];
  
  for (let i = lookback; i < windows.length; i++) {
    const slice = windows.slice(i - lookback, i);
    const hbVals = slice.map(w => w.features.hb_per_base);
    const stackVals = slice.map(w => w.features.stack_per_base);
    const corr = pearson(hbVals, stackVals);
    result.push({ index: windows[i].index, correlation: isNaN(corr) ? 0 : corr });
  }
  return result;
}

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  const muX = x.reduce((a, b) => a + b, 0) / n;
  const muY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - muX, dy = y[i] - muY;
    num += dx * dy; denX += dx * dx; denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

function calculateWindowFeatures(sub: string, salt: number): BiophysicalFeatures {
  const L = sub.length;
  let gcCount = 0, hbSum = 0, zxSum = 0, zySum = 0, zzSum = 0;
  for (let i = 0; i < L; i++) {
    const base = sub[i], id = BASE_TO_ID[base];
    if (id !== undefined) {
      if (base === 'G' || base === 'C' || base === 'M') gcCount++;
      hbSum += HBOND_PER_BASE[id];
      zxSum += Z_VEC[id][0]; zySum += Z_VEC[id][1]; zzSum += Z_VEC[id][2];
    }
  }
  let hSum = 0, sSum = 0, eSum = 0, bendSum = 0, pairCount = 0;
  for (let i = 0; i < L - 1; i++) {
    const idCurr = BASE_TO_ID[sub[i]], idNext = BASE_TO_ID[sub[i + 1]];
    if (idCurr !== undefined && idNext !== undefined) {
      eSum += STACK_E_KCAL[idCurr][idNext];
      hSum += DELTA_H[idCurr][idNext];
      sSum += DELTA_S_CAL[idCurr][idNext];
      bendSum += BENDABILITY_INDEX[idCurr][idNext];
      pairCount++;
    }
  }
  
  // Thermodynamic Salt Correction (SantaLucia '98)
  // [Na+] correction for entropy: dS(salt) = dS(1M) + 0.368 * (N-1) * ln[Na+]
  if (pairCount > 0) {
    // Standard logarithmic correction for monovalent salt concentration
    sSum += K_SALT * pairCount * Math.log(Math.max(salt, 1e-5));
  }
  
  const dG = (hSum - T_KELVIN * (sSum / 1000.0));
  
  return {
    gc: gcCount / L, 
    hb_per_base: hbSum / L,
    stack_per_base: eSum / Math.max(pairCount, 1),
    dG_per_base: dG / Math.max(pairCount, 1),
    zx: zxSum / L, 
    zy: zySum / L, 
    zz: zzSum / L,
    bendability: bendSum / Math.max(pairCount, 1)
  };
}

function calculateStats(featuresArray: BiophysicalFeatures[]): AnalysisStats {
  const keys = Object.keys(featuresArray[0]) as (keyof BiophysicalFeatures)[];
  const mean: any = {}; const std: any = {};
  keys.forEach(key => {
    const vals = featuresArray.map(f => f[key]);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    mean[key] = avg;
    const variance = vals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / vals.length;
    std[key] = Math.sqrt(variance);
  });
  return { mean, std };
}
