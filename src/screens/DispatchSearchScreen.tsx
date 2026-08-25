// 🚨 Emergency Dispatch Screen - 4-Second Sonar & Ethereal AI Orb Dispatch
// Live GPS beacon broadcast + Ethereal glowing energy sphere matching user reference image

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { EtherealOrb } from '../components/common/EtherealOrb';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { useDriverStore } from '../store/useDriverStore';
import { soundService } from '../services/soundService';
import { ShieldAlert, X, Radio, CheckCircle, Activity, Sparkles } from 'lucide-react-native';
import { AMBULANCE_TYPES } from '../constants/ambulanceTypes';

export const DispatchSearchScreen: React.FC = () => {
  // 🚑 Booking Store - User selection aur cancel logic
  const {
    pickupLocation,
    selectedHospital,
    selectedAmbulanceType,
    setCurrentScreen,
    cancelActiveBooking,
    setBookingStatus,
    otpCode,
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
        'Alerting nearest 3 active ambulance stations near Noida Expressway...',
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
        5
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
      {/* 🌌 Deep Dark Sci-Fi Background */}
      <View style={styles.darkBackdrop}>
        {/* Floating Protocol Header */}
        <SafeAreaView style={styles.safeHeader}>
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
        </SafeAreaView>

        {/* 🔮 Center Ethereal AI Glowing Orb Sphere (Matching Reference Image) */}
        <View style={styles.centerOrbContainer}>
          <EtherealOrb size={190}>
            <View style={styles.innerOrbPulse}>
              <Sparkles size={36} color="#FFFFFF" />
              <Text style={styles.orbCountdownText}>{secondsRemaining}s</Text>
            </View>
          </EtherealOrb>

          <Text style={styles.searchingTitle}>Locating Nearest Paramedic</Text>
          <Text style={styles.searchingSubtitle}>AI High-Priority Beacon Active • Sector 128 Hub</Text>
        </View>
      </View>

      {/* 📋 Bottom Dispatch Telemetry Card */}
      <View style={styles.bottomCard}>
        <View style={styles.signalRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.findingText}>
            Dispatching {ambulanceConfig.name}...
          </Text>
        </View>

        <Text style={styles.subtext}>
          Destination: {selectedHospital?.name || 'Jaypee Hospital (Sector 128)'}
        </Text>

        {/* 🔢 Generated Security OTP Pill */}
        <View style={styles.otpBanner}>
          <Text style={styles.otpLabel}>Your Trip OTP:</Text>
          <Text style={styles.otpValue}>{otpCode || '4829'}</Text>
          <Text style={styles.otpHint}>(Share with driver on arrival)</Text>
        </View>

        {/* 📡 Live Dispatch Steps Log */}
        <View style={styles.logContainer}>
          {dispatchLogs.map((log, idx) => (
            <View key={idx} style={styles.logItem}>
              <CheckCircle size={13} color={COLORS.primary} />
              <Text style={styles.logText}>{log}</Text>
            </View>
          ))}
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

        <TouchableOpacity
          style={styles.cancelLink}
          activeOpacity={0.7}
          onPress={() => setShowCancelModal(true)}
        >
          <Text style={styles.cancelLinkText}>Cancel Emergency Request</Text>
        </TouchableOpacity>
      </View>

      {/* ❌ Cancel Confirmation Modal */}
      <Modal visible={showCancelModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <ShieldAlert size={34} color={COLORS.alertRed} />
            </View>

            <Text style={styles.modalTitle}>Ambulance is 5 Mins Away</Text>
            <Text style={styles.modalSubtitle}>
              🚑 Paramedic unit UP 16 EM 4092 is responding immediately. Are you sure you want to cancel?
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
  darkBackdrop: {
    flex: 1,
    backgroundColor: '#0A0F1D',
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 280,
  },
  safeHeader: {
    width: '100%',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveDispatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  liveDispatchText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cancelIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOrbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  innerOrbPulse: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  orbCountdownText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  searchingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 18,
    letterSpacing: -0.2,
  },
  searchingSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.alertRed,
  },
  findingText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  otpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  otpValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 2,
  },
  otpHint: {
    fontSize: 10,
    color: '#B45309',
    marginLeft: 'auto',
  },
  logContainer: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    gap: 6,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  cancelLinkText: {
    color: COLORS.alertRed,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  keepBookingBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  keepBookingBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  confirmCancelBtn: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  confirmCancelBtnText: {
    color: COLORS.alertRed,
    fontSize: 13,
    fontWeight: '700',
  },
});
