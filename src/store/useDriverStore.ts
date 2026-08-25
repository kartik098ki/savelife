import { create } from 'zustand';
import { DriverProfile, MOCK_DRIVER } from '../services/mockDataService';
import { AMBULANCE_TYPES } from '../constants/ambulanceTypes';

export type TripPhase =
  | 'driver_to_pickup'
  | 'pickup_wait'
  | 'en_route_hospital'
  | 'arrived_hospital';

interface DriverState {
  driver: DriverProfile;
  currentCoord: { latitude: number; longitude: number };
  heading: number;
  tripPhase: TripPhase;
  etaMinutesRemaining: number;
  etaSecondsRemaining: number;
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
  routeIndex: number;
  interpolationProgress: number; // 0.0 to 1.0

  // Actions
  initializeDispatch: (
    pickupLat: number,
    pickupLng: number,
    ambulanceType: 'bls' | 'als',
    routePoints: Array<{ latitude: number; longitude: number }>,
    initialEtaMinutes: number
  ) => void;
  updateDriverPosition: (
    coord: { latitude: number; longitude: number },
    heading: number,
    progress: number,
    etaSecRemaining: number
  ) => void;
  setTripPhase: (phase: TripPhase) => void;
  setRouteCoordinates: (points: Array<{ latitude: number; longitude: number }>) => void;
  resetDriver: () => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  driver: MOCK_DRIVER,
  currentCoord: { latitude: MOCK_DRIVER.currentLat, longitude: MOCK_DRIVER.currentLng },
  heading: 0,
  tripPhase: 'driver_to_pickup',
  etaMinutesRemaining: 5,
  etaSecondsRemaining: 300,
  routeCoordinates: [],
  routeIndex: 0,
  interpolationProgress: 0,

  setRouteCoordinates: (points) => set({ routeCoordinates: points }),

  initializeDispatch: (pickupLat, pickupLng, ambulanceType, routePoints, initialEtaMinutes) => {
    const config = AMBULANCE_TYPES[ambulanceType] || AMBULANCE_TYPES.bls;
    const startPoint = routePoints.length > 0
      ? routePoints[0]
      : { latitude: pickupLat - 0.015, longitude: pickupLng - 0.012 };

    set({
      driver: {
        ...MOCK_DRIVER,
        ambulanceType,
        ambulanceModel:
          ambulanceType === 'als'
            ? 'Force Traveller ICU Spec'
            : 'Tata Winger Medical Van',
        currentLat: startPoint.latitude,
        currentLng: startPoint.longitude,
      },
      currentCoord: startPoint,
      heading: 45,
      tripPhase: 'driver_to_pickup',
      etaMinutesRemaining: initialEtaMinutes,
      etaSecondsRemaining: initialEtaMinutes * 60,
      routeCoordinates: routePoints,
      routeIndex: 0,
      interpolationProgress: 0,
    });
  },

  updateDriverPosition: (coord, heading, progress, etaSecRemaining) => {
    set({
      currentCoord: coord,
      heading,
      interpolationProgress: progress,
      etaSecondsRemaining: etaSecRemaining,
      etaMinutesRemaining: Math.max(1, Math.ceil(etaSecRemaining / 60)),
    });
  },

  setTripPhase: (phase) => set({ tripPhase: phase }),

  resetDriver: () => {
    set({
      driver: MOCK_DRIVER,
      currentCoord: { latitude: MOCK_DRIVER.currentLat, longitude: MOCK_DRIVER.currentLng },
      tripPhase: 'driver_to_pickup',
      etaMinutesRemaining: 5,
      etaSecondsRemaining: 300,
      routeCoordinates: [],
      routeIndex: 0,
      interpolationProgress: 0,
    });
  },
}));
