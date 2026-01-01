# Genomic Dark Matter Deep-Scanner
**Repository Name:** `genomic-dark-matter-scanner`  
**Description:** Professional-grade biophysical DNA analysis engine for non-coding sequences using Nearest-Neighbor thermodynamics, electronic topology, and salt-corrected entropy modeling.

### JAX-Monolith Biophysical Core V3.0

An advanced computational tool for the biophysical analysis of non-coding DNA sequences. This application shifts genomic analysis from simple sequence alignment to **deterministic physical modeling**, allowing researchers to identify regulatory "antennas" and structural anchors through the lens of thermodynamics and electronic topology.

## 🚀 Key Features (Honest Advantages)

*   **Deterministic Biophysical Engine**: Unlike standard AI "black-box" models, this tool uses a hardcoded Nearest-Neighbor (NN) engine based on the **SantaLucia (1998)** thermodynamic parameters.
*   **11-Dimensional Fingerprinting**: Every DNA window is analyzed across 11 physical dimensions, including Gibbs Free Energy ($\Delta G$), Stacking Energy, Hydrogen Bonding strength, and Z-scale electronic topology.
*   **Dynamic Salt Correction**: Features a professional-grade monovalent cation ([Na+]) correction factor. This adjusts the entropy ($\Delta S$) calculations dynamically, mirroring professional laboratory software.
*   **3D Folding Proxy (Bendability)**: Utilizes the **Gabrielian & Bolshoy** bendability index to predict nucleosome positioning and chromatin wrapping potential directly from 1D sequences.
*   **Epigenetic Modeling**: Supports **5-Methylcytosine (M)**. Users can simulate methylated states to observe how epigenetic shifts alter the physical rigidity and stability of a promoter or enhancer.
*   **Deep SHAP Attribution**: Provides transparency by decomposing multivariate anomalies (Mahalanobis Distance) into individual feature weights, explaining *exactly* which physical property drives a detection.

## 🧬 Scientific Methodology

The engine calculates the biophysical profile using a sliding window approach:
1.  **Thermodynamics**: Calculation of $\Delta H$ and $\Delta S$ using nearest-neighbor dinucleotide values, with salt concentration logarithmic correction.
2.  **Topology**: Electronic Z-scale vectors representing the electronic topology of the DNA backbone.
3.  **Anomaly Detection**: Uses **Multivariate Mahalanobis Distance** to identify regions that deviate significantly (Z-score > 3.0σ) from the local baseline of the provided sequence.

## ⚠️ Honesty & Limitations

While powerful, this tool is designed with specific boundaries:
*   **Predictive, Not Diagnostic**: This tool provides computational predictions. Results should be treated as hypotheses to be validated via "wet-lab" experiments (e.g., ChIP-seq, ATAC-seq, or Reporter Assays).
*   **Local Baseline**: Statistical anomalies are calculated relative to the input sequence provided. It does not compare against a global "Whole Genome" average unless specifically loaded by the user.
*   **Environment Limits**: The model assumes standard physiological temperature (37°C). While salt is adjustable, other complex cellular factors (molecular crowding, specific protein-binding interference) are not modeled.
*   **1D to 3D Inference**: The "3D" aspect is a biophysical proxy based on sequence bendability; it does not process distal Hi-C chromatin loops or 3D coordinate files (PDB).

## 🎯 Intended Use Cases

*   **Regulatory Screening**: Identifying potential "Melting Gates" (TATA-box like regions) in long non-coding DNA.
*   **Mutation Impact Assessment**: Comparing "Wild Type" vs "Mutant" to see how a single SNP shifts the physical stability of a regulatory element.
*   **Educational Biophysics**: A visual tool for understanding how DNA sequence composition determines physical architecture.
*   **Epigenetic Research**: Simulating the effect of CpG methylation on DNA mechanical properties.

## 🛠 Tech Stack

*   **Language**: TypeScript (Strict Type Safety)
*   **Framework**: React 19
*   **Visualization**: Recharts (Deterministic Linear Mapping)
*   **Styling**: Tailwind CSS

## 👨‍author Author

**Hari Hardiyan**  
📧 [lorozloraz@gmail.com](mailto:lorozloraz@gmail.com)

---
*Disclaimer: This software is for research and educational purposes only. It is not intended for clinical use.*
