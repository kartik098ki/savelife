import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Building2, Star, Clock, BedDouble, ChevronRight } from 'lucide-react-native';
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
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Building2
          size={24}
          color={isSelected ? COLORS.primary : COLORS.textSecondary}
        />
      </View>

      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text style={styles.hospitalName} numberOfLines={1}>
            {hospital.name}
          </Text>
        </View>

        <Text style={styles.addressText} numberOfLines={1}>
          {hospital.address}
        </Text>

        <View style={styles.metaRow}>
          {/* Rating */}
          <View style={styles.badge}>
            <Star size={12} color={COLORS.star} fill={COLORS.star} />
            <Text style={styles.ratingText}>{hospital.rating.toFixed(1)}</Text>
            <Text style={styles.ratingsCount}>({hospital.userRatingsTotal})</Text>
          </View>

          {/* Distance */}
          <View style={styles.badge}>
            <Text style={styles.distanceText}>{hospital.distanceKm} km away</Text>
          </View>

          {/* ETA */}
          <View style={styles.badge}>
            <Clock size={12} color={COLORS.textSecondary} />
            <Text style={styles.etaText}>{hospital.etaMinutes} min</Text>
          </View>

          {/* ICU Bed */}
          <View style={[styles.badge, styles.bedBadge]}>
            <BedDouble size={12} color={COLORS.primaryDark} />
            <Text style={styles.bedText}>{hospital.icuBedsAvailable} ICU Beds</Text>
          </View>
        </View>
      </View>

      <ChevronRight size={20} color={isSelected ? COLORS.primary : COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ratingsCount: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  bedBadge: {
    backgroundColor: '#E8F5E9',
  },
  bedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
