import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Crosshair, Layers, Navigation, ZoomIn, ZoomOut } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { Hospital } from '../../services/mockDataService';
import L from 'leaflet';

interface LiveMapViewProps {
  pickupLocation: { latitude: number; longitude: number; address?: string };
  driverLocation?: { latitude: number; longitude: number; heading?: number };
  destinationHospital?: Hospital | null;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
  showPickupPuck?: boolean;
  showDriverMarker?: boolean;
  showDestinationMarker?: boolean;
  style?: any;
  onCenterMap?: () => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  pickupLocation,
  driverLocation,
  destinationHospital,
  routeCoordinates = [],
  showPickupPuck = true,
  showDriverMarker = false,
  showDestinationMarker = false,
  style,
  onCenterMap,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const hospitalMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Ensure Leaflet CSS is loaded in DOM head
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cssId = 'leaflet-css-bundle';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Inject custom pulse ring animations for Leaflet markers
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
          @keyframes savelife-pulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(2.0); opacity: 0.2; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          .savelife-pulse-ring {
            position: absolute;
            width: 36px;
            height: 36px;
            top: -6px;
            left: -6px;
            border-radius: 50%;
            background-color: #1A73E8;
            animation: savelife-pulse 1.8s infinite ease-out;
            pointer-events: none;
          }
          .savelife-driver-pulse {
            position: absolute;
            width: 44px;
            height: 44px;
            top: -6px;
            left: -6px;
            border-radius: 50%;
            background-color: #E53935;
            animation: savelife-pulse 1.4s infinite ease-out;
            pointer-events: none;
          }
          .leaflet-control-attribution {
            display: none !important;
          }
        `;
        document.head.appendChild(styleTag);
      }
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [pickupLocation.latitude, pickupLocation.longitude],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager clean medical tile basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (e) {
      console.warn('Leaflet initialization warning:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Pickup Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showPickupPuck) {
      const pickupHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            background: #0E9F6E;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 14px;
            white-space: nowrap;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            margin-bottom: 4px;
            letter-spacing: 0.3px;
          ">
            Pickup Point
          </div>
          <div style="position: relative; width: 24px; height: 24px;">
            <div class="savelife-pulse-ring"></div>
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 12px;
              background: #1A73E8;
              border: 3px solid #FFFFFF;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF" style="transform: rotate(45deg);">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
            </div>
          </div>
        </div>
      `;

      const pickupIcon = L.divIcon({
        className: 'savelife-custom-pickup',
        html: pickupHtml,
        iconSize: [100, 50],
        iconAnchor: [50, 48],
      });

      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker(
          [pickupLocation.latitude, pickupLocation.longitude],
          { icon: pickupIcon, zIndexOffset: 1000 }
        ).addTo(map);
      } else {
        pickupMarkerRef.current.setLatLng([pickupLocation.latitude, pickupLocation.longitude]);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }
  }, [pickupLocation, showPickupPuck]);

  // Update Driver Ambulance Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showDriverMarker && driverLocation) {
      const heading = driverLocation.heading || 0;
      const driverHtml = `
        <div style="position: relative; width: 36px; height: 36px;">
          <div class="savelife-driver-pulse"></div>
          <div style="
            width: 34px;
            height: 34px;
            border-radius: 17px;
            background: #E53935;
            border: 2.5px solid #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(229, 57, 53, 0.45);
            transform: rotate(${heading}deg);
            transition: transform 0.2s linear;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        </div>
      `;

      const driverIcon = L.divIcon({
        className: 'savelife-custom-driver',
        html: driverHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker(
          [driverLocation.latitude, driverLocation.longitude],
          { icon: driverIcon, zIndexOffset: 2000 }
        ).addTo(map);
      } else {
        driverMarkerRef.current.setLatLng([driverLocation.latitude, driverLocation.longitude]);
        driverMarkerRef.current.setIcon(driverIcon);
      }
    } else if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
      driverMarkerRef.current = null;
    }
  }, [driverLocation, showDriverMarker]);

  // Update Hospital Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showDestinationMarker && destinationHospital) {
      const hospitalHtml = `
        <div style="
          display: flex;
          align-items: center;
          background: #047447;
          border: 2px solid #FFFFFF;
          padding: 5px 9px;
          border-radius: 16px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          gap: 5px;
          white-space: nowrap;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span style="color: #FFFFFF; font-size: 11px; font-weight: 800;">
            ${destinationHospital.name.slice(0, 18)}
          </span>
          <span style="background: rgba(255,255,255,0.25); color: #FFFFFF; font-size: 9px; font-weight: 800; padding: 2px 4px; border-radius: 4px;">
            ${destinationHospital.icuBedsAvailable} ICU
          </span>
        </div>
      `;

      const hospitalIcon = L.divIcon({
        className: 'savelife-custom-hospital',
        html: hospitalHtml,
        iconSize: [160, 32],
        iconAnchor: [80, 16],
      });

      if (!hospitalMarkerRef.current) {
        hospitalMarkerRef.current = L.marker(
          [destinationHospital.latitude, destinationHospital.longitude],
          { icon: hospitalIcon, zIndexOffset: 900 }
        ).addTo(map);
      } else {
        hospitalMarkerRef.current.setLatLng([destinationHospital.latitude, destinationHospital.longitude]);
      }
    } else if (hospitalMarkerRef.current) {
      hospitalMarkerRef.current.remove();
      hospitalMarkerRef.current = null;
    }
  }, [destinationHospital, showDestinationMarker]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeCoordinates && routeCoordinates.length > 1) {
      const latLngs: [number, number][] = routeCoordinates.map((c) => [c.latitude, c.longitude]);

      if (!polylineRef.current) {
        polylineRef.current = L.polyline(latLngs, {
          color: '#2563EB',
          weight: 6,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(map);
      } else {
        polylineRef.current.setLatLngs(latLngs);
      }

      // Auto-fit bounds
      try {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      } catch (e) {}
    } else if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
  }, [routeCoordinates]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [pickupLocation.latitude, pickupLocation.longitude],
        15,
        { animate: true }
      );
    }
    if (onCenterMap) onCenterMap();
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Real Interactive Leaflet Container */}
      <div
        ref={mapContainerRef as any}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Floating Map Controls */}
      <View style={styles.controlsCol}>
        <TouchableOpacity
          style={styles.controlBtn}
          activeOpacity={0.85}
          onPress={handleRecenter}
        >
          <Crosshair size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          activeOpacity={0.85}
          onPress={handleZoomIn}
        >
          <ZoomIn size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          activeOpacity={0.85}
          onPress={handleZoomOut}
        >
          <ZoomOut size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E8ECEF',
  },
  controlsCol: {
    position: 'absolute',
    right: 14,
    bottom: 20,
    gap: 8,
    zIndex: 400,
  },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
});
