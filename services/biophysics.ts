
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
import { 
  AnalysisWindow, 
  BiophysicalFeatures, 
  AnalysisStats, 
  CorrelationPoint, 
  ComparisonResult, 
  AnalysisWindowDelta, 
  AnomalyType, 
  BiologicalArchetype,
  BiologicalSummary 
} from '../types';

export function analyzeSequence(sequence: string, threshold: number = 3.0, W: number = 15, S: number = 5, salt: number = 0.1, saltMg: number = 0.0015) {
  const seq = sequence.toUpperCase().replace(/[^ACGTM]/g, 'N');
  const windows: AnalysisWindow[] = [];
  
  if (seq.length < W) {
    throw new Error(`Sequence length (${seq.length}) must be at least window size (${W}).`);
  }

  for (let i = 0; i <= seq.length - W; i += S) {
    const sub = seq.substring(i, i + W);
    const windowFeatures = calculateWindowFeatures(sub, salt, saltMg);
    
    // High-precision Tm Calculation using Salt-Equivalence
    const effectiveSalt = salt + 120 * Math.sqrt(Math.max(saltMg, 0));
    const tm = 64.9 + 41 * (windowFeatures.gc - 0.5) + (16.6 * Math.log10(Math.max(effectiveSalt, 1e-5)));

    windows.push({
      index: Math.floor(i / S),
      start: i,
      end: i + W,
      sequence: sub,
      features: windowFeatures,
      isAnomalous: false,
      zScores: {},
      anomalyType: 'None',
      archetype: 'Stable Helix',
      combinedScore: 0,
      contributions: [],
      tm: tm
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
      const std = stds[key] > EPS ? stds[key] : EPS;
      const z = (val - mean) / std;
      w.zScores[key] = z;
      const zSq = z * z;
      distSq += zSq;
      rawContributions.push({ feature: key, zSq });
    }
    
    w.combinedScore = Math.sqrt(distSq);
    w.contributions = rawContributions.map(c => ({
      feature: c.feature,
      score: (c.zSq / (distSq || EPS)) * w.combinedScore,
      percentage: (c.zSq / (distSq || EPS)) * 100
    })).sort((a, b) => b.score - a.score);

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

    w.archetype = classifyArchetype(w);
  });

  const correlationMap = calculateCrossCorrelation(windows);
  
  const summary: BiologicalSummary = {
    promoterPotential: windows.filter(w => w.archetype === 'Putative Promoter').length,
    structuralAnchors: windows.filter(w => w.archetype === 'Mechanical Anchor').length,
    zDnaSites: windows.filter(w => w.archetype === 'Z-DNA Candidate').length,
    avgTm: windows.reduce((acc, w) => acc + w.tm, 0) / windows.length
  };

  return { 
    windows, 
    stats, 
    correlationMap, 
    thresholdUsed: threshold,
    multivariateScores: windows.map(w => w.combinedScore),
    summary
  };
}

function classifyArchetype(w: AnalysisWindow): BiologicalArchetype {
  const z = w.zScores;
  if (w.features.gc > 0.7 && Math.abs(z.zx) > 2) return 'Z-DNA Candidate';
  if (z.dG_per_base < -2 && z.bendability > 1.5) return 'Putative Promoter';
  if (z.stack_per_base < -2 && z.bendability < -1.5) return 'Mechanical Anchor';
  if (w.features.gc > 0.8 && z.stack_per_base < -2.5) return 'G-Quadruplex';
  if (z.bendability > 2.5 && Math.abs(z.dG_per_base) < 1.5) return 'Flexible Linker';
  return w.isAnomalous ? 'Unknown Anomaly' : 'Stable Helix';
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

function calculateWindowFeatures(sub: string, salt: number, saltMg: number): BiophysicalFeatures {
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
  
  if (pairCount > 0) {
    const effectiveSalt = salt + 120 * Math.sqrt(Math.max(saltMg, 0));
    sSum += K_SALT * pairCount * Math.log(Math.max(effectiveSalt, 1e-5));
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
