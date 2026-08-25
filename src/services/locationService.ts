// 📍 Location Service - GPS aur Live Location tracking
// User ki live coordinates aur address fetch karta hai (Default: Sector 128, Noida)

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

// 🏢 Default Location - Sector 128, Noida (Jaypee Greens Wish Town)
export const DEFAULT_LOCATION: UserLocation = {
  latitude: 28.5130,
  longitude: 77.3780,
  accuracy: 10,
  heading: 45,
  speed: 0,
  address: 'Tower 4, Jaypee Greens Wish Town, Sector 128, Noida, UP 201304',
};

/**
 * 📍 Get Current Location - User ki current GPS position fetch karta hai
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
    console.warn('Location retrieval error, using Sector 128 coordinates:', error);
    return DEFAULT_LOCATION;
  }
}

/**
 * 🛰️ Start Location Updates - Real-time continuous position tracker
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
    console.warn('watchPositionAsync fallback to default location:', error);
    onUpdate(DEFAULT_LOCATION);
    return { remove: () => {} };
  }
}
