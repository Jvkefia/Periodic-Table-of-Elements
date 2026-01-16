export type ElementCategory = 
  | 'diatomic-nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'metalloid'
  | 'polyatomic-nonmetal'
  | 'post-transition-metal'
  | 'transition-metal'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface PeriodicElement {
  name: string;
  name_ko: string;
  appearance: string | null;
  atomic_mass: number;
  boil: number | null;
  category: ElementCategory;
  density: number | null;
  discovered_by: string | null;
  melt: number | null;
  number: number;
  period: number;
  group: number;
  phase: string;
  source: string;
  spectral_img: string | null;
  summary: string;
  summary_ko: string;
  symbol: string;
  xpos: number;
  ypos: number;
  shells: number[];
  electron_configuration: string;
  electron_configuration_semantic: string;
  electron_affinity: number | null;
  electronegativity_pauling: number | null;
  ionization_energies: number[];
  cpk_hex: string | null;
}
