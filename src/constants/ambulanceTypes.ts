// 🚑 Ambulance Types - App mein available ambulance ke prakar

export interface AmbulanceTypeConfig {
  id: 'bls' | 'als';
  name: string;
  shortDescription: string;
  tagline: string;
  baseFare: number;
  perKmRate: number;
  features: string[];
  recommendedFor: string;
  badgeColor: string;
  etaModifierMinutes: number;
}

export const AMBULANCE_TYPES: Record<'bls' | 'als', AmbulanceTypeConfig> = {
  // 💚 BLS - Basic Life Support - Normal medical transport
  bls: {
    id: 'bls',
    name: 'Basic Life Support (BLS)',
    shortDescription: 'Standard Medical Transport',
    tagline: 'Oxygen + Trained Paramedic',
    baseFare: 100,
    perKmRate: 18,
    features: ['Oxygen Support', 'Stretcher & Wheelchair', 'Trained EMT', 'First Aid Kit'],
    recommendedFor: 'Non-critical transfers, fractures, elderly transport',
    badgeColor: '#0E9F6E',
    etaModifierMinutes: 0,
  },
  // ❤️ ALS - Advanced Life Support - ICU on Wheels, serious emergencies ke liye
  als: {
    id: 'als',
    name: 'Advanced Life Support (ALS)',
    shortDescription: 'ICU on Wheels',
    tagline: 'Ventilator + Doctor + Defibrillator',
    baseFare: 250,
    perKmRate: 25,
    features: ['Portable ICU Ventilator', 'Multi-para Monitor & ECG', 'Defibrillator', 'Emergency Doctor / Paramedic'],
    recommendedFor: 'Cardiac arrest, trauma, stroke, respiratory failure',
    badgeColor: '#E53935',
    etaModifierMinutes: 1,
  },
};
