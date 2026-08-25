// 📍 Location Service - GPS aur Live Location tracking
// Real-time GPS coordinates, reverse geocoding & Sector 128 Noida location presets

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

// 🏢 Sector 128, Noida Verified Pickup Locations
export const NOIDA_PICKUP_PRESETS: UserLocation[] = [
  {
    latitude: 28.5130,
    longitude: 77.3780,
    accuracy: 5,
    heading: 45,
    speed: 0,
    address: 'Tower 4, Jaypee Greens Wish Town, Sector 128, Noida, UP 201304',
  },
  {
    latitude: 28.5155,
    longitude: 77.3820,
    accuracy: 8,
    heading: 90,
    speed: 0,
    address: 'Klassic Heights, Jaypee Wish Town, Sector 128, Noida, UP',
  },
  {
    latitude: 28.5080,
    longitude: 77.3910,
    accuracy: 6,
    heading: 0,
    speed: 0,
    address: 'Pavilion Court, Sector 128, Noida Expressway, UP 201304',
  },
  {
    latitude: 28.5020,
    longitude: 77.4050,
    accuracy: 10,
    heading: 30,
    speed: 0,
    address: 'Expressway Tower, Sector 137, Noida, UP 201305',
  },
  {
    latitude: 28.5280,
    longitude: 77.3760,
    accuracy: 8,
    heading: 60,
    speed: 0,
    address: 'Grand Omaxe, Sector 93B, Noida Expressway, UP 201304',
  },
];

// 🏢 Default Location - Sector 128, Noida (Jaypee Greens Wish Town)
export const DEFAULT_LOCATION: UserLocation = NOIDA_PICKUP_PRESETS[0];

/**
 * 📍 Get Current Location - Queries live device/browser GPS position
 */
export async function getCurrentUserLocation(): Promise<UserLocation> {
  // Web browser native Geolocation fallback
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.geolocation) {
    try {
      const pos: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4000,
          enableHighAccuracy: true,
          maximumAge: 10000,
        });
      });

      if (pos && pos.coords) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let address = DEFAULT_LOCATION.address;
        try {
          address = await reverseGeocodeAddress(lat, lng);
        } catch {}

        return {
          latitude: lat,
          longitude: lng,
          accuracy: pos.coords.accuracy || 10,
          heading: pos.coords.heading || 45,
          speed: pos.coords.speed || 0,
          address,
        };
      }
    } catch (e) {
      // Permission denied or timeout -> proceed with default
    }
  }

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      let address = DEFAULT_LOCATION.address;
      try {
        address = await reverseGeocodeAddress(loc.coords.latitude, loc.coords.longitude);
      } catch {}

      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        heading: loc.coords.heading,
        speed: loc.coords.speed,
        address,
      };
    }
  } catch (error) {
    console.warn('Location retrieval error, using Sector 128 coordinates:', error);
  }

  return DEFAULT_LOCATION;
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
    onUpdate(DEFAULT_LOCATION);
    return { remove: () => {} };
  }
}
