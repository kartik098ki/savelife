import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { Phone, Star, Shield, Clock, AlertTriangle, Truck } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { DriverProfile } from '../../services/mockDataService';
import { TripPhase } from '../../store/useDriverStore';
import { AMBULANCE_TYPES } from '../../constants/ambulanceTypes';

interface DriverCardProps {
  driver: DriverProfile;
  tripPhase: TripPhase;
  etaMinutes: number;
  hospitalName?: string;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  tripPhase,
  etaMinutes,
  hospitalName,
}) => {
  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`).catch((err) =>
      console.warn('Unable to make call:', err)
    );
  };

  const typeConfig = AMBULANCE_TYPES[driver.ambulanceType] || AMBULANCE_TYPES.bls;

  const getStatusBanner = () => {
    switch (tripPhase) {
      case 'driver_to_pickup':
        return {
          title: `Arriving in ${etaMinutes} mins`,
          subtitle: 'Ambulance is rushing to your pickup point',
          bgColor: COLORS.alertRedLight,
          textColor: COLORS.alertRed,
          icon: <Clock size={16} color={COLORS.alertRed} />,
        };
      case 'pickup_wait':
        return {
          title: 'Ambulance Arrived at Pickup',
          subtitle: 'Paramedic is preparing patient boarding',
          bgColor: COLORS.warningLight,
          textColor: COLORS.warning,
          icon: <AlertTriangle size={16} color={COLORS.warning} />,
        };
      case 'en_route_hospital':
        return {
          title: `En Route to ${hospitalName || 'Hospital'}`,
          subtitle: `ETA to Emergency Room: ${etaMinutes} mins`,
          bgColor: COLORS.primaryLight,
          textColor: COLORS.primaryDark,
          icon: <Truck size={16} color={COLORS.primary} />,
        };
      case 'arrived_hospital':
        return {
          title: 'Arrived at Emergency Room',
          subtitle: 'Handing over patient to trauma medical team',
          bgColor: '#E8F5E9',
          textColor: COLORS.primaryDark,
          icon: <Shield size={16} color={COLORS.primary} />,
        };
    }
  };

  const banner = getStatusBanner();

  return (
    <View style={styles.container}>
      {/* Top Dynamic Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: banner.bgColor }]}>
        {banner.icon}
        <View style={styles.bannerTextCol}>
          <Text style={[styles.bannerTitle, { color: banner.textColor }]}>
            {banner.title}
          </Text>
          <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
        </View>
      </View>

      {/* Driver Info Row */}
      <View style={styles.driverRow}>
        <Image
          source={{ uri: driver.photoUrl }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop' }}
        />

        <View style={styles.driverInfoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingBadge}>
              <Star size={11} color={COLORS.star} fill={COLORS.star} />
              <Text style={styles.ratingText}>{driver.rating}</Text>
            </View>
          </View>

          <Text style={styles.vehicleModel}>{driver.ambulanceModel}</Text>

          <View style={styles.vehicleTagsRow}>
            <View style={styles.plateBadge}>
              <Text style={styles.plateText}>{driver.ambulanceNumber}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: typeConfig.badgeColor }]}>
              <Text style={styles.typeBadgeText}>{driver.ambulanceType.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Call Button */}
        <TouchableOpacity
          style={styles.callButton}
          activeOpacity={0.8}
          onPress={handleCall}
        >
          <Phone size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  bannerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.surfaceLight,
  },
  driverInfoCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  vehicleModel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  vehicleTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  plateBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  plateText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.4,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  callButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
