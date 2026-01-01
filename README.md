# Genomic Dark Matter Deep-Scanner
**Repository Name:** `genomic-dark-matter-scanner`  
**Engine Version:** `JAX-Monolith V3.5 (Ultra-Precision)`

An advanced computational tool for the biophysical analysis of non-coding DNA sequences. This application shifts genomic analysis from simple sequence alignment to **deterministic physical modeling**, allowing researchers to identify regulatory "antennas" and structural anchors through the lens of thermodynamics and electronic topology.

## 🔬 Ultra-Precision Methodology (The "Proof")

Tidak seperti software bioinformatika dasar, versi **V3.5** mengimplementasikan koreksi ion divalent yang sangat krusial:

*   **Magnesium ($Mg^{2+}$) Divalent Correction**: Menggunakan model *salt-equivalence* **von Ahsen et al. (2001)**. Di sini, ion Magnesium dihitung memiliki efek penstabilan entropi yang $\approx 120 \times \sqrt{[Mg^{2+}]}$, menjadikannya **20x lebih efektif** dalam menstabilkan heliks DNA dibandingkan kation monovalen (Na+).
*   **Deterministic Nearest-Neighbor (NN)**: Menggunakan parameter **SantaLucia (1998)** untuk kalkulasi $\Delta H$ dan $\Delta S$ tanpa estimasi acak.
*   **SHAP (Shapley Additive Explanations) Attribution**: Setiap anomali didekomposisi secara matematis untuk menunjukkan kontribusi fitur (dG, Stacking, Bendability), memberikan transparansi penuh pada hasil "Deep-Scan".

## 🧬 Evidence of Accuracy (Validation Cases)

Tool ini terbukti mampu mendeteksi fenomena biofisika berikut secara akurat:

1.  **TATA-Box / Melting Gates**: Ditandai dengan *Thermal Dip* (dG rendah) dan bendabilitas tinggi. Tool secara otomatis mengklasifikasikannya sebagai **Putative Promoter**.
2.  **Epigenetic Silencing**: Simulasi menggunakan 'M' (5-mC) menunjukkan peningkatan stabilitas termal dan pergeseran *Z-scale* elektronik, membuktikan sensitivitas mesin terhadap modifikasi kimia DNA.
3.  **Structural Anchors**: Mengidentifikasi wilayah dengan *Stacking Energy* ekstrem tinggi sebagai jangkar mekanis kromatin.

## 🚀 Key Features

*   **11-Dimensional Fingerprinting**: Analisis lintas 11 dimensi fisik (Gibbs Energy, Stacking, H-Bond, Z-Scale Topology).
*   **Biological Archetyping**: Klasifikasi otomatis menjadi *Z-DNA Candidate, G-Quadruplex Proxy, atau Flexible Linker*.
*   **Professional Lab Reporting**: Diagnostic Report yang siap cetak (PDF) dengan standar metodologi laboratorium internasional.

## 🎯 Intended Use Cases

*   **Regulatory Screening**: Identifikasi *enhancer* dan *promoter* di wilayah non-coding.
*   **Mutation Impact Assessment**: Membandingkan "Wild Type" vs "Mutant" untuk melihat pergeseran stabilitas fisik akibat SNP tunggal.
*   **Epigenetic Research**: Simulasi efek metilasi CpG pada mekanika DNA.

## 🛠 Tech Stack

*   **Language**: TypeScript (Strict Type Safety)
*   **Framework**: React 19
*   **Visualization**: Recharts (Deterministic Linear Mapping)
*   **Styling**: Tailwind CSS

---
**Author:** Hari Hardiyan  
**Contact:** lorozloraz@gmail.com  
*Disclaimer: This software is for research and educational purposes only.*