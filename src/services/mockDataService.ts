// 🏥 Hospital Data - Sector 128, Noida ke paas ke hospitals
export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  etaMinutes: number;
  rating: number;
  userRatingsTotal: number;
  phone: string;
  emergencyAvailable: boolean;
  icuBedsAvailable: number;
  specialties: string[];
  openNow: boolean;
}

// 🚑 Driver Profile - Ambulance driver ki details
export interface DriverProfile {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  ambulanceNumber: string;
  ambulanceType: 'bls' | 'als';
  ambulanceModel: string;
  rating: number;
  totalTrips: number;
  currentLat: number;
  currentLng: number;
}

// Generate dynamic nearby hospitals relative to user location
export function getNearbyHospitalsMock(userLat: number, userLng: number): Hospital[] {
  const baseHospitals = [
    {
      id: 'hosp-1',
      name: 'Jaypee Hospital',
      address: 'Sector 128, Noida',
      offsetLat: 0.005,
      offsetLng: 0.004,
      rating: 4.7,
      userRatingsTotal: 3420,
      phone: '+91-120-4122222',
      emergencyAvailable: true,
      icuBedsAvailable: 14,
      specialties: ['Cardiac Care', 'Trauma Center', 'Neuro ICU'],
      openNow: true,
    },
    {
      id: 'hosp-2',
      name: 'Fortis Hospital',
      address: 'Sector 62, Noida',
      offsetLat: 0.045,
      offsetLng: 0.035,
      rating: 4.6,
      userRatingsTotal: 2890,
      phone: '+91-120-4300222',
      emergencyAvailable: true,
      icuBedsAvailable: 9,
      specialties: ['Cardiology', 'Emergency Surgery', 'Stroke Unit'],
      openNow: true,
    },
    {
      id: 'hosp-3',
      name: 'Yatharth Hospital',
      address: 'Sector 110, Noida',
      offsetLat: -0.015,
      offsetLng: -0.020,
      rating: 4.5,
      userRatingsTotal: 4150,
      phone: '+91-120-2444444',
      emergencyAvailable: true,
      icuBedsAvailable: 22,
      specialties: ['Trauma Center', 'Pediatric ICU', 'Burns Unit'],
      openNow: true,
    },
    {
      id: 'hosp-4',
      name: 'Felix Hospital',
      address: 'Sector 137, Noida',
      offsetLat: 0.020,
      offsetLng: -0.010,
      rating: 4.4,
      userRatingsTotal: 1980,
      phone: '+91-120-2444445',
      emergencyAvailable: true,
      icuBedsAvailable: 6,
      specialties: ['Heart Care', 'Orthopedics', 'Dialysis'],
      openNow: true,
    },
    {
      id: 'hosp-5',
      name: 'Max Super Speciality Hospital',
      address: 'Sector 128, Noida',
      offsetLat: 0.008,
      offsetLng: -0.006,
      rating: 4.8,
      userRatingsTotal: 8900,
      phone: '+91-120-26588500',
      emergencyAvailable: true,
      icuBedsAvailable: 35,
      specialties: ['Critical Care', 'Toxicology', 'Emergency'],
      openNow: true,
    },
    {
      id: 'hosp-6',
      name: 'Kailash Hospital',
      address: 'Sector 27, Noida',
      offsetLat: 0.055,
      offsetLng: 0.010,
      rating: 4.3,
      userRatingsTotal: 3100,
      phone: '+91-120-2444446',
      emergencyAvailable: true,
      icuBedsAvailable: 15,
      specialties: ['Cardiology', 'Emergency Surgery'],
      openNow: true,
    },
    {
      id: 'hosp-7',
      name: 'Metro Hospital',
      address: 'Sector 12, Noida',
      offsetLat: 0.065,
      offsetLng: 0.005,
      rating: 4.2,
      userRatingsTotal: 1500,
      phone: '+91-120-2444447',
      emergencyAvailable: true,
      icuBedsAvailable: 8,
      specialties: ['Heart Care', 'Orthopedics'],
      openNow: true,
    },
    {
      id: 'hosp-8',
      name: 'Apollo Hospital',
      address: 'Sector 26, Noida',
      offsetLat: 0.050,
      offsetLng: 0.015,
      rating: 4.6,
      userRatingsTotal: 2500,
      phone: '+91-120-2444448',
      emergencyAvailable: true,
      icuBedsAvailable: 12,
      specialties: ['Trauma Center', 'Critical Care'],
      openNow: true,
    }
  ];

  return baseHospitals.map((h, index) => {
    const lat = userLat + h.offsetLat;
    const lng = userLng + h.offsetLng;
    // Calculate realistic distance
    const dist = Math.max(0.8, parseFloat((Math.sqrt(h.offsetLat ** 2 + h.offsetLng ** 2) * 111 * 1.3).toFixed(1)));
    const eta = Math.max(3, Math.round(dist * 2.1));

    return {
      id: h.id,
      name: h.name,
      address: h.address,
      latitude: lat,
      longitude: lng,
      distanceKm: dist,
      etaMinutes: eta,
      rating: h.rating,
      userRatingsTotal: h.userRatingsTotal,
      phone: h.phone,
      emergencyAvailable: h.emergencyAvailable,
      icuBedsAvailable: h.icuBedsAvailable,
      specialties: h.specialties,
      openNow: h.openNow,
    };
  });
}

// 📍 Route Points - Do jagah ke beech ka raasta generate karta hai
export function generateRoutePoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numSegments: number = 30
): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  
  // Add some realistic road jitter
  for (let i = 0; i <= numSegments; i++) {
    const progress = i / numSegments;
    
    // Perpendicular detour for road-like curvature
    const curveAmount = Math.sin(progress * Math.PI) * 0.003;
    const perpLat = -(endLng - startLng);
    const perpLng = endLat - startLat;
    const norm = Math.sqrt(perpLat * perpLat + perpLng * perpLng) || 1;
    
    const lat = startLat + (endLat - startLat) * progress + (perpLat / norm) * curveAmount;
    const lng = startLng + (endLng - startLng) * progress + (perpLng / norm) * curveAmount;
    
    points.push({ latitude: lat, longitude: lng });
  }

  return points;
}

// 👨⚕️ Mock Driver - Default paramedic driver ki info
export const MOCK_DRIVER: DriverProfile = {
  id: 'drv-9021',
  name: 'Rajesh Kumar (EMT-Adv)',
  photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces',
  phone: '+91-9876543210',
  ambulanceNumber: 'DL 01 EM 4092',
  ambulanceType: 'als',
  ambulanceModel: 'Force Traveller ICU Spec',
  rating: 4.9,
  totalTrips: 1420,
  currentLat: 28.6139,
  currentLng: 77.2090,
};
