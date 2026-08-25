// 🏥 Mock Data Service - Sector 128, Noida ke Verified Hospitals aur Driver Profiles
// Yeh service realistic hospital pictures, live doctor availability, aur ICU bed telemetry deti hai

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
  imageUrl: string;
  doctorOnDuty: boolean;
  doctorName: string;
  doctorSpecialty: string;
  emergencyDoctorsCount: number;
}

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

// 🏥 Generate Verified Sector 128 Noida Hospitals relative to coordinates
export function getNearbyHospitalsMock(userLat: number, userLng: number): Hospital[] {
  const baseHospitals = [
    {
      id: 'hosp-1',
      name: 'Jaypee Hospital (Sector 128)',
      address: 'Jaypee Greens Wish Town, Sector 128, Noida, UP 201304',
      offsetLat: 0.004,
      offsetLng: 0.003,
      rating: 4.9,
      userRatingsTotal: 4820,
      phone: '+91-120-4122222',
      emergencyAvailable: true,
      icuBedsAvailable: 18,
      specialties: ['Level-1 Trauma', 'Cardiac Emergency', 'Advanced Neuro ICU', 'Stroke Center'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. Ananya Verma',
      doctorSpecialty: 'Chief of Trauma & Emergency Medicine',
      emergencyDoctorsCount: 6,
    },
    {
      id: 'hosp-2',
      name: 'Yatharth Super Speciality Hospital (Sector 110)',
      address: 'Plot No. 1, Sector 110, Noida Expressway, UP 201304',
      offsetLat: -0.012,
      offsetLng: 0.009,
      rating: 4.8,
      userRatingsTotal: 3190,
      phone: '+91-120-2468888',
      emergencyAvailable: true,
      icuBedsAvailable: 14,
      specialties: ['Cardiology ICU', 'Emergency Surgery', 'Pediatric Trauma', 'Burn Unit'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. Rajesh Gupta',
      doctorSpecialty: 'Senior Critical Care & Resuscitation Lead',
      emergencyDoctorsCount: 4,
    },
    {
      id: 'hosp-3',
      name: 'Felix Hospital (Sector 137, Expressway)',
      address: 'Expressway Tower, Sector 137, Noida, UP 201305',
      offsetLat: -0.018,
      offsetLng: -0.011,
      rating: 4.7,
      userRatingsTotal: 2540,
      phone: '+91-7835999222',
      emergencyAvailable: true,
      icuBedsAvailable: 11,
      specialties: ['24/7 Trauma Unit', 'Cardiac Catheterization', 'Dialysis Emergency'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. Sneha Roy',
      doctorSpecialty: 'Emergency Medicine Consultant',
      emergencyDoctorsCount: 4,
    },
    {
      id: 'hosp-4',
      name: 'Max Super Speciality Hospital (Noida Hub)',
      address: 'A-364, Sector 19 / Sector 128 Connected, Noida, UP 201301',
      offsetLat: 0.024,
      offsetLng: 0.018,
      rating: 4.9,
      userRatingsTotal: 5600,
      phone: '+91-120-6629999',
      emergencyAvailable: true,
      icuBedsAvailable: 24,
      specialties: ['Apex Level-1 Trauma', 'Heart Transplant ICU', 'Organ Support'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. Vikram Malhotra',
      doctorSpecialty: 'Apex Neuro & Trauma Surgeon',
      emergencyDoctorsCount: 8,
    },
    {
      id: 'hosp-5',
      name: 'Fortis Hospital & Heart Center (Sector 62)',
      address: 'B-22, Sector 62, Noida, Uttar Pradesh 201301',
      offsetLat: 0.038,
      offsetLng: 0.015,
      rating: 4.8,
      userRatingsTotal: 6410,
      phone: '+91-120-4300222',
      emergencyAvailable: true,
      icuBedsAvailable: 16,
      specialties: ['Cardiology', 'Emergency Surgery', 'Stroke Unit', 'Toxicology'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. P. K. Mishra',
      doctorSpecialty: 'Cardiovascular Emergency Specialist',
      emergencyDoctorsCount: 5,
    },
    {
      id: 'hosp-6',
      name: 'Kailash Hospital & Neuro Institute (Sector 27)',
      address: 'H-33, Sector 27, Noida, Uttar Pradesh 201301',
      offsetLat: 0.029,
      offsetLng: -0.022,
      rating: 4.6,
      userRatingsTotal: 4200,
      phone: '+91-120-2444444',
      emergencyAvailable: true,
      icuBedsAvailable: 9,
      specialties: ['Neuro Trauma', 'Orthopedic Emergency', 'Emergency ICU'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. Manisha Tyagi',
      doctorSpecialty: 'Critical Care Incharge',
      emergencyDoctorsCount: 3,
    },
    {
      id: 'hosp-7',
      name: 'Apollo Hospital (Sector 26, Noida)',
      address: 'E-2, Sector 26, Noida, Uttar Pradesh 201301',
      offsetLat: 0.032,
      offsetLng: -0.016,
      rating: 4.8,
      userRatingsTotal: 3890,
      phone: '+91-120-4012000',
      emergencyAvailable: true,
      icuBedsAvailable: 15,
      specialties: ['Comprehensive Trauma', 'Pediatric Emergency', 'Burns ICU'],
      openNow: true,
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
      doctorOnDuty: true,
      doctorName: 'Dr. Arvind Saxena',
      doctorSpecialty: 'Lead Emergency Physician',
      emergencyDoctorsCount: 5,
    },
  ];

  return baseHospitals.map((h) => {
    const lat = userLat + h.offsetLat;
    const lng = userLng + h.offsetLng;
    const dist = Math.max(0.6, parseFloat((Math.sqrt(h.offsetLat ** 2 + h.offsetLng ** 2) * 111 * 1.25).toFixed(1)));
    const eta = Math.max(3, Math.round(dist * 2.0));

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
      imageUrl: h.imageUrl,
      doctorOnDuty: h.doctorOnDuty,
      doctorName: h.doctorName,
      doctorSpecialty: h.doctorSpecialty,
      emergencyDoctorsCount: h.emergencyDoctorsCount,
    };
  });
}

// 🛣️ Generate realistic road polyline points between two coordinates
export function generateRoutePoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numSegments: number = 30
): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  
  for (let i = 0; i <= numSegments; i++) {
    const progress = i / numSegments;
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

// 👨‍⚕️ Verified Emergency Driver & Paramedic Unit
export const MOCK_DRIVER: DriverProfile = {
  id: 'drv-9021',
  name: 'Rajesh Kumar (EMT-Adv & Pilot)',
  photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces',
  phone: '+91-9876543210',
  ambulanceNumber: 'UP 16 EM 4092',
  ambulanceType: 'als',
  ambulanceModel: 'Force Traveller ICU Spec (Sector 128 Unit)',
  rating: 4.9,
  totalTrips: 1420,
  currentLat: 28.5100,
  currentLng: 77.3750,
};
