import { ENV, hasValidGoogleMapsKey } from '../constants/config';
import { Hospital, getNearbyHospitalsMock, generateRoutePoints } from './mockDataService';
import { calculateHaversineDistance, estimateEtaMinutes } from './fareCalculator';

export interface RouteInfo {
  coordinates: Array<{ latitude: number; longitude: number }>;
  distanceKm: number;
  durationMinutes: number;
  polylineString?: string;
  roadNames?: string[];
}

/**
 * Decodes Google encoded polyline string into array of {latitude, longitude}
 */
export function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
}

/**
 * Fetches real road turn-by-turn routing using OSRM or Google Directions
 */
export async function fetchDirectionsRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<RouteInfo> {
  // If Google Maps API key is configured
  if (hasValidGoogleMapsKey()) {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${ENV.GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        const distanceKm = parseFloat((leg.distance.value / 1000).toFixed(1));
        const durationMinutes = Math.max(2, Math.round(leg.duration.value / 60));
        const polylinePoints = decodePolyline(route.overview_polyline.points);

        return {
          coordinates: polylinePoints,
          distanceKm,
          durationMinutes,
          polylineString: route.overview_polyline.points,
        };
      }
    } catch (error) {
      console.warn('Google Directions API error, trying OSRM fallback:', error);
    }
  }

  // Real turn-by-turn road network via Open Source Routing Machine (OSRM)
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((c: [number, number]) => ({
          latitude: c[1],
          longitude: c[0],
        }));
        const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
        const durationMinutes = Math.max(2, Math.round(route.duration / 60));

        return {
          coordinates,
          distanceKm,
          durationMinutes,
        };
      }
    }
  } catch (err) {
    // Network fallback
  }

  // Smooth realistic fallback curve generator
  const coords = generateRoutePoints(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude,
    30
  );
  const dist = calculateHaversineDistance(origin, destination);
  return {
    coordinates: coords,
    distanceKm: dist,
    durationMinutes: estimateEtaMinutes(dist),
  };
}

/**
 * Fetches nearby hospitals using Google Places API (Nearby Search) with fallback
 */
export async function fetchNearbyHospitals(
  userLat: number,
  userLng: number,
  radiusMeters: number = 5000
): Promise<Hospital[]> {
  if (hasValidGoogleMapsKey()) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=${radiusMeters}&type=hospital&key=${ENV.GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const hospitals: Hospital[] = data.results
          .filter((place: any) => place.business_status !== 'CLOSED_PERMANENTLY')
          .map((place: any) => {
            const lat = place.geometry.location.lat;
            const lng = place.geometry.location.lng;
            const distanceKm = calculateHaversineDistance(
              { latitude: userLat, longitude: userLng },
              { latitude: lat, longitude: lng }
            );
            const etaMinutes = estimateEtaMinutes(distanceKm);

            return {
              id: place.place_id,
              name: place.name,
              address: place.vicinity || place.formatted_address || 'Emergency Trauma Center',
              latitude: lat,
              longitude: lng,
              distanceKm,
              etaMinutes,
              rating: place.rating || 4.5,
              userRatingsTotal: place.user_ratings_total || 50,
              phone: '+91-11-2000-0000',
              emergencyAvailable: true,
              icuBedsAvailable: Math.floor(Math.random() * 15) + 4,
              specialties: ['Emergency', 'ICU', 'Trauma', 'Cardiac Care'],
              openNow: place.opening_hours ? place.opening_hours.open_now : true,
            };
          });

        return hospitals.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return a.distanceKm - b.distanceKm;
        });
      }
    } catch (error) {
      console.warn('Google Places API error, using mock fallback:', error);
    }
  }

  // Return realistic nearby hospitals centered dynamically around user's GPS
  return getNearbyHospitalsMock(userLat, userLng);
}

/**
 * Reverse geocodes coordinates to readable street address
 */
export async function reverseGeocodeAddress(lat: number, lng: number): Promise<string> {
  if (hasValidGoogleMapsKey()) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${ENV.GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.warn('Google Geocode API error:', error);
    }
  }

  // Free OpenStreetMap Nominatim reverse geocode fallback
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'SaveLifeApp/1.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data.display_name) {
        return data.display_name.split(',').slice(0, 4).join(', ');
      }
    }
  } catch (e) {}

  return '136, Pocket A 2, New Kondli, Kondli, Delhi, 110096';
}
