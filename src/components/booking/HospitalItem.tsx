// 🏥 Hospital Item Component - Hospital Card with photo, live doctor status & ICU beds
// User ko hospital ki full photo, rating, emergency physician status aur distance dikhata hai

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Building2, Star, Clock, BedDouble, ChevronRight, UserCheck, ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { Hospital } from '../../services/mockDataService';

interface HospitalItemProps {
  hospital: Hospital;
  isSelected?: boolean;
  onPress: () => void;
}

export const HospitalItem: React.FC<HospitalItemProps> = ({
  hospital,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
      ]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      {/* 🖼️ Hospital Image Thumbnail */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: hospital.imageUrl }}
          style={styles.hospitalImage}
          resizeMode="cover"
        />
        {hospital.openNow && (
          <View style={styles.openNowBadge}>
            <View style={styles.openNowDot} />
            <Text style={styles.openNowText}>24/7 OPEN</Text>
          </View>
        )}
      </View>

      {/* 📋 Hospital Details */}
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text style={styles.hospitalName} numberOfLines={1}>
            {hospital.name}
          </Text>
        </View>

        <Text style={styles.addressText} numberOfLines={1}>
          {hospital.address}
        </Text>

        {/* 👨‍⚕️ On-Duty Doctor Status Pill */}
        {hospital.doctorOnDuty && (
          <View style={styles.doctorPill}>
            <UserCheck size={12} color={COLORS.primaryDark} />
            <Text style={styles.doctorText} numberOfLines={1}>
              {hospital.doctorName} • <Text style={{ fontWeight: '800' }}>ON DUTY</Text>
            </Text>
          </View>
        )}

        {/* 🏷️ Telemetry Badges: Rating, Distance, ETA, ICU Beds */}
        <View style={styles.metaRow}>
          {/* Rating */}
          <View style={styles.badge}>
            <Star size={11} color={COLORS.star} fill={COLORS.star} />
            <Text style={styles.ratingText}>{hospital.rating.toFixed(1)}</Text>
            <Text style={styles.ratingsCount}>({hospital.userRatingsTotal})</Text>
          </View>

          {/* Distance */}
          <View style={styles.badge}>
            <Text style={styles.distanceText}>{hospital.distanceKm} km</Text>
          </View>

          {/* ETA */}
          <View style={styles.badge}>
            <Clock size={11} color={COLORS.textSecondary} />
            <Text style={styles.etaText}>{hospital.etaMinutes} min</Text>
          </View>

          {/* ICU Bed */}
          <View style={[styles.badge, styles.bedBadge]}>
            <BedDouble size={11} color={COLORS.primaryDark} />
            <Text style={styles.bedText}>{hospital.icuBedsAvailable} ICU</Text>
          </View>
        </View>
      </View>

      <ChevronRight size={18} color={isSelected ? COLORS.primary : COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: 12,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  imageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
  },
  openNowBadge: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    right: 3,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  openNowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  openNowText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  doctorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  doctorText: {
    fontSize: 10,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
    borderWidth: 0.5,
    borderColor: COLORS.cardBorder,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ratingsCount: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  distanceText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  bedBadge: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  bedText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
