import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { PulsingPuck } from '../common/PulsingPuck';
import { Truck, Building2, Crosshair } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { Hospital } from '../../services/mockDataService';

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
  const initialRegion = {
    latitude: pickupLocation.latitude,
    longitude: pickupLocation.longitude,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035,
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
      >
        {/* Pickup Marker */}
        {showPickupPuck && (
          <Marker
            coordinate={{
              latitude: pickupLocation.latitude,
              longitude: pickupLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.8 }}
          >
            <PulsingPuck label="Pickup Point" />
          </Marker>
        )}

        {/* Driver Ambulance Marker */}
        {showDriverMarker && driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={driverLocation.heading || 0}
          >
            <View style={styles.driverAmbulanceMarker}>
              <Truck size={20} color="#FFFFFF" />
            </View>
          </Marker>
        )}

        {/* Destination Hospital Marker */}
        {showDestinationMarker && destinationHospital && (
          <Marker
            coordinate={{
              latitude: destinationHospital.latitude,
              longitude: destinationHospital.longitude,
            }}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <View style={styles.hospitalMarker}>
              <Building2 size={18} color="#FFFFFF" />
              <View style={styles.hospitalMarkerLabel}>
                <Text style={styles.hospitalMarkerText} numberOfLines={1}>
                  {destinationHospital.name}
                </Text>
              </View>
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={COLORS.alertRed}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Center Target Button */}
      {onCenterMap && (
        <TouchableOpacity
          style={styles.recenterBtn}
          activeOpacity={0.8}
          onPress={onCenterMap}
        >
          <Crosshair size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  driverAmbulanceMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.alertRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  hospitalMarker: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    flexDirection: 'row',
    gap: 4,
  },
  hospitalMarkerLabel: {
    maxWidth: 120,
  },
  hospitalMarkerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  recenterBtn: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
});
