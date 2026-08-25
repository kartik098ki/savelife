import { useEffect, useRef } from 'react';
import { useDriverStore, TripPhase } from '../store/useDriverStore';
import { useBookingStore } from '../store/useBookingStore';
import { fetchDirectionsRoute } from '../services/googleMapsService';
import { soundService } from '../services/soundService';

function calculateBearing(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
): number {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function useDriverSimulation() {
  const {
    tripPhase,
    updateDriverPosition,
    setTripPhase,
  } = useDriverStore();

  const {
    pickupLocation,
    selectedHospital,
    setBookingStatus,
    completeTrip,
  } = useBookingStore();

  const routePointsRef = useRef<Array<{ latitude: number; longitude: number }>>([]);
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isCancelled = false;

    async function startSimulation() {
      // 1. Fetch real road-following route for current phase
      let points: Array<{ latitude: number; longitude: number }> = [];

      if (tripPhase === 'driver_to_pickup') {
        const startCoord = {
          latitude: pickupLocation.latitude - 0.018,
          longitude: pickupLocation.longitude - 0.014,
        };
        const route = await fetchDirectionsRoute(startCoord, {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
        });
        points = route.coordinates;
      } else if (tripPhase === 'en_route_hospital' && selectedHospital) {
        const route = await fetchDirectionsRoute(
          { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
          { latitude: selectedHospital.latitude, longitude: selectedHospital.longitude }
        );
        points = route.coordinates;
      }

      if (isCancelled || points.length < 2) return;
      routePointsRef.current = points;

      const totalDurationSeconds = tripPhase === 'driver_to_pickup' ? 20 : 28;
      const tickMs = 600;
      const totalTicks = (totalDurationSeconds * 1000) / tickMs;
      let currentTick = 0;

      interval = setInterval(() => {
        currentTick += 1;
        const progress = Math.min(1.0, currentTick / totalTicks);

        const currentPoints = routePointsRef.current;
        if (currentPoints.length < 2) return;

        const exactIndex = progress * (currentPoints.length - 1);
        const lowerIndex = Math.floor(exactIndex);
        const upperIndex = Math.min(currentPoints.length - 1, Math.ceil(exactIndex));
        const fraction = exactIndex - lowerIndex;

        const p1 = currentPoints[lowerIndex];
        const p2 = currentPoints[upperIndex];

        const lat = p1.latitude + (p2.latitude - p1.latitude) * fraction;
        const lng = p1.longitude + (p2.longitude - p1.longitude) * fraction;

        const heading = calculateBearing(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
        const secondsRemaining = Math.max(0, Math.round((1 - progress) * totalDurationSeconds));

        updateDriverPosition({ latitude: lat, longitude: lng }, heading, progress, secondsRemaining);

        // Transition events
        if (progress >= 1.0) {
          if (interval) clearInterval(interval);

          if (tripPhase === 'driver_to_pickup') {
            soundService.playDispatchSuccess();
            setTripPhase('pickup_wait');
            setBookingStatus('patient_picked_up');

            setTimeout(() => {
              setTripPhase('en_route_hospital');
              setBookingStatus('en_route_hospital');
            }, 3000);
          } else if (tripPhase === 'en_route_hospital') {
            soundService.playDispatchSuccess();
            setTripPhase('arrived_hospital');
            setTimeout(() => {
              completeTrip();
            }, 2500);
          }
        }
      }, tickMs);
    }

    startSimulation();

    return () => {
      isCancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [tripPhase]);
}
