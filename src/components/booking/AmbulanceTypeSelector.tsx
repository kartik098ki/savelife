// 🚑 Ambulance Type Selector - BLS ya ALS ambulance choose karo
// Yeh component user ko ambulance type select karne deta hai booking ke time

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Truck, Zap, ShieldCheck, HeartPulse } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { AMBULANCE_TYPES, AmbulanceTypeConfig } from '../../constants/ambulanceTypes';

interface AmbulanceTypeSelectorProps {
  selectedType: 'bls' | 'als';
  distanceKm: number;
  onSelect: (type: 'bls' | 'als') => void;
}

export const AmbulanceTypeSelector: React.FC<AmbulanceTypeSelectorProps> = ({
  selectedType,
  distanceKm,
  onSelect,
}) => {
  // 🚑 Sirf BLS aur ALS - Bike hata diya
  const types: AmbulanceTypeConfig[] = [
    AMBULANCE_TYPES.bls,
    AMBULANCE_TYPES.als,
  ];

  return (
    <View style={styles.container}>
      {/* 🏷️ Section Header - Ambulance type ka heading */}
      <Text style={styles.header}>Select Ambulance Service</Text>
      
      <View style={styles.cardsRow}>
        {types.map((type) => {
          const isSelected = selectedType === type.id;
          const estimatedFare = Math.round(type.baseFare + distanceKm * type.perKmRate);

          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                isSelected && type.id === 'als' && styles.cardSelectedAls,
              ]}
              activeOpacity={0.85}
              onPress={() => onSelect(type.id)}
            >
              {/* 💰 Price & Icon - Kitna paisa lagega */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: isSelected ? type.badgeColor : COLORS.surfaceLight },
                  ]}
                >
                  {type.id === 'als' ? (
                    <HeartPulse size={22} color={isSelected ? '#FFFFFF' : type.badgeColor} />
                  ) : (
                    <Truck size={22} color={isSelected ? '#FFFFFF' : type.badgeColor} />
                  )}
                </View>

                <View style={styles.fareBox}>
                  <Text style={styles.fareAmount}>₹{estimatedFare}</Text>
                  <Text style={styles.fareSubtitle}>₹{type.baseFare} base</Text>
                </View>
              </View>

              {/* 📋 Ambulance Details - Type ka naam aur info */}
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.tagline}>{type.tagline}</Text>

              {/* ✅ Key Feature - Sabse important feature */}
              <View style={styles.featureRow}>
                <ShieldCheck size={12} color={COLORS.primary} />
                <Text style={styles.featureText} numberOfLines={1}>
                  {type.features[0]}
                </Text>
              </View>

              {/* 📝 More Features - Aur features ki list */}
              <View style={styles.featuresListContainer}>
                {type.features.slice(1, 3).map((feature, idx) => (
                  <View key={idx} style={styles.miniFeatureRow}>
                    <View style={styles.miniDot} />
                    <Text style={styles.miniFeatureText} numberOfLines={1}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* 🏥 Recommended For - Kis emergency mein use karo */}
              <View style={styles.recommendedBox}>
                <Text style={styles.recommendedText} numberOfLines={2}>
                  Best for: {type.recommendedFor}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  cardSelectedAls: {
    borderColor: COLORS.alertRed,
    backgroundColor: '#FFF5F5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fareBox: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  fareSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  typeName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryDark,
    flex: 1,
  },
  featuresListContainer: {
    gap: 4,
    marginBottom: 8,
  },
  miniFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  miniFeatureText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  recommendedBox: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  recommendedText: {
    fontSize: 9,
    color: '#9A3412',
    fontWeight: '600',
  },
});
