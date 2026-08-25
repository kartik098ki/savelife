import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Zap, Clock, Route, ShieldAlert } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { FareCalculationResult } from '../../services/fareCalculator';

interface FareSummaryCardProps {
  fare: FareCalculationResult;
  onBook: () => void;
  hospitalName?: string;
  ambulanceTypeName?: string;
}

export const FareSummaryCard: React.FC<FareSummaryCardProps> = ({
  fare,
  onBook,
  hospitalName,
  ambulanceTypeName = 'Basic Life Support (BLS)',
}) => {
  // Urgent subtle pulse animation for Book Ambulance button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <View style={styles.metricIconBox}>
            <Route size={16} color={COLORS.secondaryBlue} />
          </View>
          <View>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{fare.distanceKm} km</Text>
          </View>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.metricCol}>
          <View style={styles.metricIconBox}>
            <Clock size={16} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.metricLabel}>Est. Arrival</Text>
            <Text style={styles.metricValue}>{fare.etaMinutes} mins</Text>
          </View>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.metricCol}>
          <View style={styles.metricIconBox}>
            <Zap size={16} color={COLORS.alertRed} />
          </View>
          <View>
            <Text style={styles.metricLabel}>Total Fare</Text>
            <Text style={[styles.metricValue, { color: COLORS.alertRed }]}>
              {fare.formattedTotal}
            </Text>
          </View>
        </View>
      </View>

      {/* Pricing Breakdown Note */}
      <View style={styles.breakdownBox}>
        <Text style={styles.breakdownText}>
          Base ₹{fare.baseFare} + ₹{fare.distanceFare} ({fare.distanceKm}km) • Fixed Medical Rate
        </Text>
      </View>

      {/* Book Ambulance Urgent CTA */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={styles.bookButton}
          activeOpacity={0.9}
          onPress={onBook}
        >
          <ShieldAlert size={20} color="#FFFFFF" style={styles.btnIcon} />
          <Text style={styles.bookButtonText}>Book Ambulance Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  dividerVertical: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.divider,
    marginHorizontal: 4,
  },
  breakdownBox: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 14,
    alignItems: 'center',
  },
  breakdownText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  bookButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.alertRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  btnIcon: {
    marginRight: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
