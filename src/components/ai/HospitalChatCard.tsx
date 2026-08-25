import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Star, Clock, ShieldAlert, Building2 } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { Hospital } from '../../services/mockDataService';

interface HospitalChatCardProps {
  hospitals: Hospital[];
  onBookAmbulance: (hospital: Hospital) => void;
}

export const HospitalChatCard: React.FC<HospitalChatCardProps> = ({
  hospitals,
  onBookAmbulance,
}) => {
  if (!hospitals || hospitals.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Top-Ranked Emergency Hospitals</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hospitals.map((hospital) => (
          <View key={hospital.id} style={styles.card}>
            {/* Top row */}
            <View style={styles.topRow}>
              <View style={styles.iconCircle}>
                <Building2 size={16} color={COLORS.primaryDark} />
              </View>
              <View style={styles.ratingBadge}>
                <Star size={11} color={COLORS.star} fill={COLORS.star} />
                <Text style={styles.ratingText}>{hospital.rating.toFixed(1)}</Text>
              </View>
            </View>

            {/* Hospital Name & Dist */}
            <Text style={styles.name} numberOfLines={1}>
              {hospital.name}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {hospital.address}
            </Text>

            <View style={styles.statsRow}>
              <Text style={styles.statText}>{hospital.distanceKm} km</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <View style={styles.etaRow}>
                <Clock size={11} color={COLORS.textSecondary} />
                <Text style={styles.statText}>{hospital.etaMinutes} min</Text>
              </View>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.icuText}>{hospital.icuBedsAvailable} ICU</Text>
            </View>

            {/* Direct Instant Book CTA */}
            <TouchableOpacity
              style={styles.bookBtn}
              activeOpacity={0.85}
              onPress={() => onBookAmbulance(hospital)}
            >
              <ShieldAlert size={14} color="#FFFFFF" />
              <Text style={styles.bookBtnText}>Book Ambulance</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 8,
  },
  card: {
    width: 210,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#D4EADF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  address: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dotSeparator: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  icuText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  bookBtn: {
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.alertRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
