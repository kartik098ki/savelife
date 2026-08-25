import * as Location from 'expo-location';
import { reverseGeocodeAddress } from './googleMapsService';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  address: string;
}

// Default fallback coordinates (Delhi) matching the spec screenshot
export const DEFAULT_LOCATION: UserLocation = {
  latitude: 28.6139,
  longitude: 77.2090,
  accuracy: 10,
  heading: 45,
  speed: 0,
  address: '136, Pocket A 2, New Kondli, Kondli, Delhi, 110096',
};

/**
 * Requests location permission and gets current position
 */
export async function getCurrentUserLocation(): Promise<UserLocation> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return DEFAULT_LOCATION;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    let address = DEFAULT_LOCATION.address;
    try {
      address = await reverseGeocodeAddress(loc.coords.latitude, loc.coords.longitude);
    } catch {
      // Keep default address if geocoding fails
    }

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
      heading: loc.coords.heading,
      speed: loc.coords.speed,
      address,
    };
  } catch (error) {
    console.warn('Location retrieval error, using default coordinates:', error);
    return DEFAULT_LOCATION;
  }
}

/**
 * Subscribes to live position updates
 */
export async function startLocationUpdates(
  onUpdate: (location: UserLocation) => void
): Promise<{ remove: () => void }> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      onUpdate(DEFAULT_LOCATION);
      return { remove: () => {} };
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      async (loc) => {
        let address = DEFAULT_LOCATION.address;
        try {
          address = await reverseGeocodeAddress(loc.coords.latitude, loc.coords.longitude);
        } catch {}

        onUpdate({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
          heading: loc.coords.heading,
          speed: loc.coords.speed,
          address,
        });
      }
    );

    return sub;
  } catch (error) {
    console.warn('watchPositionAsync not supported, returning mock watcher:', error);
    onUpdate(DEFAULT_LOCATION);
    return { remove: () => {} };
  }
}
