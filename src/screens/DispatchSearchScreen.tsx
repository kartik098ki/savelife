// 🚨 Emergency Dispatch Screen - Realistic GPS Radar & Station Dispatch Connection
// Live station connection telemetry, rotating emergency beacon & paramedic dispatch

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { useDriverStore } from '../store/useDriverStore';
import { soundService } from '../services/soundService';
import { ShieldAlert, X, Radio, CheckCircle, Truck, MapPin, Navigation } from 'lucide-react-native';
import { AMBULANCE_TYPES } from '../constants/ambulanceTypes';
import { LiveMapView } from '../components/map/LiveMapView';

export const DispatchSearchScreen: React.FC = () => {
  // 🚑 Booking Store - User selection aur cancel logic
  const {
    pickupLocation,
    selectedHospital,
    selectedAmbulanceType,
    setCurrentScreen,
    cancelActiveBooking,
    setBookingStatus,
  } = useBookingStore();

  const { initializeDispatch } = useDriverStore();
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([
    'Broadcasting emergency GPS beacon (Sector 128)...',
  ]);

  useEffect(() => {
    // 🔊 Sonar Audio Ping
    soundService.playSonarPing();

    const sonarAudioTimer = setInterval(() => {
      soundService.playSonarPing();
    }, 1300);

    // 📡 Live Telemetry Progression Log
    const t1 = setTimeout(() => {
      setDispatchLogs((prev) => [
        'Alerting 3 active ALS stations near Noida Expressway...',
        ...prev,
      ]);
    }, 1200);

    const t2 = setTimeout(() => {
      setDispatchLogs((prev) => [
        'EMT Rajesh Kumar (Unit UP 16 EM 4092) accepted dispatch!',
        ...prev,
      ]);
    }, 2400);

    const timerInterval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    const dispatchTimeout = setTimeout(() => {
      clearInterval(sonarAudioTimer);
      soundService.playDispatchSuccess();

      initializeDispatch(
        pickupLocation.latitude,
        pickupLocation.longitude,
        selectedAmbulanceType,
        [],
        4
      );
      setBookingStatus('driver_assigned');
      setCurrentScreen('live_tracking');
    }, 4000);

    return () => {
      clearInterval(sonarAudioTimer);
      clearInterval(timerInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(dispatchTimeout);
    };
  }, []);

  const ambulanceConfig = AMBULANCE_TYPES[selectedAmbulanceType] || AMBULANCE_TYPES.bls;

  return (
    <View style={styles.container}>
      {/* 🗺️ Live Map Radar Background */}
      <View style={styles.mapBackground}>
        <LiveMapView 
          pickupLocation={pickupLocation} 
          showPickupPuck={true}
        />
        <View style={styles.mapDimOverlay} />
      </View>

      <SafeAreaView style={styles.safeContainer}>
        {/* Floating Protocol Header */}
        <View style={styles.headerBar}>
          <View style={styles.liveDispatchPill}>
            <Radio size={14} color="#FFFFFF" />
            <Text style={styles.liveDispatchText}>EMERGENCY DISPATCH PROTOCOL</Text>
          </View>

          <TouchableOpacity
            style={styles.cancelIconBtn}
            activeOpacity={0.8}
            onPress={() => setShowCancelModal(true)}
          >
            <X size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 🚨 Center Dispatch Connecting Card (Realistic Ambulance Strobe Radar) */}
        <View style={styles.centerCardContainer}>
          <View style={styles.radarCard}>
            {/* Animated Radar Pulse Container */}
            <View style={styles.beaconOuterCircle}>
              <View style={styles.beaconInnerCircle}>
                <Truck size={42} color={COLORS.alertRed} />
              </View>
              <View style={styles.strobeLightLeft} />
              <View style={styles.strobeLightRight} />
            </View>

            <View style={styles.connectingBadge}>
              <View style={styles.liveBlinkingDot} />
              <Text style={styles.connectingBadgeText}>DISPATCHING NEAREST UNIT</Text>
            </View>

            <Text style={styles.dispatchMainTitle}>
              Locating {selectedAmbulanceType === 'als' ? 'ALS ICU Ambulance' : 'BLS Ambulance'}
            </Text>
            
            <Text style={styles.dispatchSubtitle}>
              Broadcasting to Sector 128 stations • ETA ~4 mins
            </Text>

            <View style={styles.destinationPill}>
              <MapPin size={12} color={COLORS.primaryDark} />
              <Text style={styles.destinationPillText} numberOfLines={1}>
                {selectedHospital?.name || 'Jaypee Hospital (Sector 128)'}
              </Text>
            </View>
          </View>
        </View>

        {/* 📋 Bottom Telemetry & Progress Card */}
        <View style={styles.bottomCard}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressStatusText}>Connecting in {secondsRemaining}s...</Text>
            <Text style={styles.progressPercentText}>{Math.round(((4 - secondsRemaining) / 4) * 100)}%</Text>
          </View>

          {/* ⏳ Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((4 - secondsRemaining) / 4) * 100}%` },
              ]}
            />
          </View>

          {/* 📡 Live Dispatch Steps Log */}
          <View style={styles.logContainer}>
            {dispatchLogs.map((log, idx) => (
              <View key={idx} style={styles.logItem}>
                <CheckCircle size={14} color={COLORS.primary} />
                <Text style={styles.logText}>{log}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.cancelLink}
            activeOpacity={0.7}
            onPress={() => setShowCancelModal(true)}
          >
            <Text style={styles.cancelLinkText}>Cancel Emergency Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ❌ 5-Minute Arrival Cancellation Protection Modal */}
      <Modal visible={showCancelModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.cancelAlertIconBox}>
              <ShieldAlert size={38} color={COLORS.alertRed} />
            </View>

            <Text style={styles.cancelAlertTitle}>Ambulance is Already Dispatched</Text>
            <Text style={styles.cancelAlertSub}>
              🚑 Paramedic unit is speeding towards your pickup point in Sector 128. It will arrive in ~4 minutes.
            </Text>

            <TouchableOpacity
              style={styles.keepBookingBtn}
              activeOpacity={0.88}
              onPress={() => setShowCancelModal(false)}
            >
              <Text style={styles.keepBookingBtnText}>Keep Booking — Ambulance Aa Rahi Hai</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmCancelBtn}
              activeOpacity={0.88}
              onPress={() => {
                setShowCancelModal(false);
                cancelActiveBooking();
              }}
            >
              <Text style={styles.confirmCancelBtnText}>Cancel Anyway ❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  mapDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },
  safeContainer: {
    flex: 1,
    zIndex: 10,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  liveDispatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  liveDispatchText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cancelIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCardContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  radarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  beaconOuterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  beaconInnerCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  strobeLightLeft: {
    position: 'absolute',
    top: 4,
    left: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.alertRed,
  },
  strobeLightRight: {
    position: 'absolute',
    top: 4,
    right: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  connectingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 8,
  },
  liveBlinkingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.alertRed,
  },
  connectingBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.alertRed,
    letterSpacing: 0.5,
  },
  dispatchMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  dispatchSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  destinationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    maxWidth: '95%',
  },
  destinationPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStatusText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.alertRed,
    borderRadius: 3,
  },
  logContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  cancelLinkText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
  },
  cancelAlertIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  cancelAlertTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  cancelAlertSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  keepBookingBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  keepBookingBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  confirmCancelBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmCancelBtnText: {
    color: COLORS.alertRed,
    fontSize: 13,
    fontWeight: '700',
  },
});
