import { useEffect, useState } from 'react';
import { UserLocation, DEFAULT_LOCATION, getCurrentUserLocation, startLocationUpdates } from '../services/locationService';
import { useBookingStore } from '../store/useBookingStore';

export function useLiveLocation() {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const setPickupLocation = useBookingStore((state) => state.setPickupLocation);

  useEffect(() => {
    let isMounted = true;
    let subscription: { remove: () => void } | null = null;

    async function init() {
      try {
        const initial = await getCurrentUserLocation();
        if (isMounted) {
          setLocation(initial);
          setPickupLocation(initial);
          setLoading(false);
        }

        subscription = await startLocationUpdates((newLoc) => {
          if (isMounted) {
            setLocation(newLoc);
            setPickupLocation(newLoc);
          }
        });
      } catch (err) {
        console.warn('Error in location hook:', err);
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { location, loading };
}
