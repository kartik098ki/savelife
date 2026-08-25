import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Truck, Building2, Zap, Stethoscope, ShieldAlert, HeartPulse, Flame, UserCheck } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

interface ServiceCardsProps {
  onSelectAmbulance: () => void;
  onSelectHospital: () => void;
  onSelectQuickTag?: (tag: string) => void;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({
  onSelectAmbulance,
  onSelectHospital,
  onSelectQuickTag,
}) => {
  return (
    <View style={styles.container}>
      {/* Live Availability Telemetry Pill */}
      <View style={styles.liveUnitsBanner}>
        <View style={styles.liveDot} />
        <Text style={styles.liveUnitsText}>
          <Text style={{ fontWeight: '800' }}>4 Ambulances</Text> active near you • Avg response: <Text style={{ fontWeight: '800' }}>4 mins</Text>
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Get Help Fast</Text>

      {/* Main Dual Cards Matching Screenshot */}
      <View style={styles.cardsRow}>
        {/* Card A: Emergency Ambulance */}
        <TouchableOpacity
          style={[styles.card, styles.cardAmbulance]}
          activeOpacity={0.88}
          onPress={onSelectAmbulance}
        >
          <View style={styles.badgeRow}>
            <View style={styles.urgentBadge}>
              <Zap size={11} color="#FFFFFF" />
              <Text style={styles.urgentBadgeText}>Book Now</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Emergency</Text>
            <Text style={[styles.cardTitle, styles.cardTitleAccent]}>Ambulance</Text>
            <Text style={styles.cardSubtitle}>Reaches in 4–6 mins</Text>
          </View>

          {/* Styled 3D Vector Icon Badge */}
          <View style={styles.illustrationWrapperRed}>
            <View style={styles.redIconBackdrop}>
              <Truck size={38} color={COLORS.alertRed} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Card B: Find Hospital */}
        <TouchableOpacity
          style={[styles.card, styles.cardHospital]}
          activeOpacity={0.88}
          onPress={onSelectHospital}
        >
          <View style={styles.badgeRow}>
            <View style={styles.nearbyBadge}>
              <Stethoscope size={11} color={COLORS.primaryDark} />
              <Text style={styles.nearbyBadgeText}>🩺 Nearby</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Find</Text>
            <Text style={[styles.cardTitle, styles.cardTitleGreen]}>Hospital</Text>
            <Text style={styles.cardSubtitle}>Live ICU bed status</Text>
          </View>

          {/* Styled 3D Vector Icon Badge */}
          <View style={styles.illustrationWrapperGreen}>
            <View style={styles.greenIconBackdrop}>
              <Building2 size={38} color={COLORS.primaryDark} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Emergency Quick Triage Strip */}
      <View style={styles.quickTagsContainer}>
        <Text style={styles.quickTagsHeader}>Instant Emergency Dispatch</Text>
        <View style={styles.tagsGrid}>
          <TouchableOpacity
            style={styles.tagItem}
            onPress={() => onSelectQuickTag && onSelectQuickTag('Cardiac Emergency (ALS ICU)')}
          >
            <HeartPulse size={14} color={COLORS.alertRed} />
            <Text style={styles.tagItemText}>Cardiac (ALS)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tagItem}
            onPress={() => onSelectQuickTag && onSelectQuickTag('Road Accident & Trauma')}
          >
            <ShieldAlert size={14} color={COLORS.warning} />
            <Text style={styles.tagItemText}>Trauma Center</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tagItem}
            onPress={() => onSelectQuickTag && onSelectQuickTag('Burn Care Unit')}
          >
            <Flame size={14} color="#EA580C" />
            <Text style={styles.tagItemText}>Burn Care</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tagItem}
            onPress={() => onSelectQuickTag && onSelectQuickTag('Elderly Transfer')}
          >
            <UserCheck size={14} color={COLORS.secondaryBlue} />
            <Text style={styles.tagItemText}>Elderly (BLS)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 8,
  },
  liveUnitsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EDFDF5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  liveUnitsText: {
    fontSize: 12,
    color: COLORS.primaryDark,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    height: 144,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAmbulance: {
    backgroundColor: COLORS.alertRedLight,
    borderColor: '#FFCDD2',
  },
  cardHospital: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#C8E6C9',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  nearbyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  nearbyBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },
  cardContent: {
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 21,
  },
  cardTitleAccent: {
    color: COLORS.alertRed,
  },
  cardTitleGreen: {
    color: COLORS.primaryDark,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  illustrationWrapperRed: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  redIconBackdrop: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrapperGreen: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  greenIconBackdrop: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(14, 159, 110, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTagsContainer: {
    marginTop: 4,
  },
  quickTagsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  tagItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
