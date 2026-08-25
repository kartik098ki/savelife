// 💰 Fare Calculator Service - Ambulance ka kiraya calculate karta hai
// Haversine formula se distance nikalte hain, phir ambulance type ke hisaab se paisa

import { AMBULANCE_TYPES, AmbulanceTypeConfig } from '../constants/ambulanceTypes';

export interface LocationCoord {
  latitude: number;
  longitude: number;
}

// 🧾 Fare Breakdown - Poora fare ka detail
export interface FareCalculationResult {
  distanceKm: number;
  etaMinutes: number;
  baseFare: number;
  distanceFare: number;
  surgeMultiplier: number;
  surgeAmount: number;
  totalFare: number;
  formattedTotal: string;
}

/**
 * 📏 Haversine Distance - Do jagah ke beech ki seedhi doori (km mein)
 * Earth ki gol shape ko dhyan mein rakhte hue calculate karta hai
 */
export function calculateHaversineDistance(
  coord1: LocationCoord,
  coord2: LocationCoord
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLng = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const lat1Rad = (coord1.latitude * Math.PI) / 180;
  const lat2Rad = (coord2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  // 🛣️ Road distance seedhi doori se 1.3x zyada hoti hai city mein
  return Math.max(0.3, parseFloat((distance * 1.3).toFixed(1)));
}

/**
 * ⏱️ ETA Calculate - Ambulance ko kitna time lagega pahunchne mein
 * Urban traffic speed: ~28 km/h average with siren
 */
export function estimateEtaMinutes(
  distanceKm: number,
  ambulanceTypeId: 'bls' | 'als' = 'bls'
): number {
  const avgSpeedKmph = 28; // 🚑 Average ambulance speed with siren in city
  let rawMinutes = Math.round((distanceKm / avgSpeedKmph) * 60);
  
  // ⚙️ Ambulance type ke hisaab se ETA adjust karo
  const config = AMBULANCE_TYPES[ambulanceTypeId] || AMBULANCE_TYPES.bls;
  rawMinutes += config.etaModifierMinutes;
  
  // ⏱️ Minimum 2 minute ka ETA
  return Math.max(2, rawMinutes);
}

/**
 * 💰 Fare Compute - Distance, ambulance type aur surge ke hisaab se final paisa
 * Base fare + per km rate + surge (agar hai toh)
 */
export function computeFare(
  distanceKm: number,
  ambulanceTypeId: 'bls' | 'als' = 'bls',
  surgeMultiplier: number = 1.0
): FareCalculationResult {
  const config: AmbulanceTypeConfig = AMBULANCE_TYPES[ambulanceTypeId] || AMBULANCE_TYPES.bls;
  const baseFare = config.baseFare;
  const distanceFare = Math.round(distanceKm * config.perKmRate);
  
  const subtotal = baseFare + distanceFare;
  // 📈 Surge pricing - agar demand zyada hai toh extra charge
  const surgeAmount = surgeMultiplier > 1.0 ? Math.round(subtotal * (surgeMultiplier - 1.0)) : 0;
  const totalFare = subtotal + surgeAmount;
  const etaMinutes = estimateEtaMinutes(distanceKm, ambulanceTypeId);

  return {
    distanceKm: parseFloat(distanceKm.toFixed(1)),
    etaMinutes,
    baseFare,
    distanceFare,
    surgeMultiplier,
    surgeAmount,
    totalFare,
    formattedTotal: `₹${totalFare}`,
  };
}
