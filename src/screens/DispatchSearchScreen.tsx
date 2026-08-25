import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { useDriverStore } from '../store/useDriverStore';
import { soundService } from '../services/soundService';
import { ShieldAlert, X, Radio, CheckCircle } from 'lucide-react-native';
import { AMBULANCE_TYPES } from '../constants/ambulanceTypes';

export const DispatchSearchScreen: React.FC = () => {
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
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([
    'Broadcasting emergency GPS coordinates...',
  ]);

  // 🔮 AI Energy Sphere Animation - Dispatch ka visual effect
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'savelife-sphere-css';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @keyframes sphere-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes sphere-pulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
          @keyframes sphere-glow { 
            0%,100% { box-shadow: 0 0 60px rgba(59,130,246,0.5), 0 0 120px rgba(139,92,246,0.3); } 
            50% { box-shadow: 0 0 80px rgba(59,130,246,0.8), 0 0 160px rgba(139,92,246,0.5), 0 0 200px rgba(6,182,212,0.3); } 
          }
          @keyframes scan-text { 0%,100% { opacity: 0.4; } 50% { opacity: 1; text-shadow: 0 0 10px rgba(6,182,212,0.8); } }
          @keyframes pulse-dot { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  useEffect(() => {
    // Play initial sonar audio
    soundService.playSonarPing();

    const sonarAudioTimer = setInterval(() => {
      soundService.playSonarPing();
    }, 1300);

    // 📡 Live Dispatch Log - Real-time updates dikhata hai
    const t1 = setTimeout(() => {
      setDispatchLogs((prev) => [
        'Alerting nearest 3 active ambulance stations within 5km...',
        ...prev,
      ]);
    }, 1200);

    const t2 = setTimeout(() => {
      setDispatchLogs((prev) => [
        'EMT Rajesh Kumar (Unit DL 01 EM 4092) accepted dispatch!',
        ...prev,
      ]);
    }, 2500);

    // ⏱️ Countdown Timer - Kitne seconds mein ambulance milegi
    const timerInterval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    // 🚨 Emergency Dispatch Screen - Ambulance dhundh raha hai (Searching for ambulance)
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

  // ❌ Cancel karne pe confirm karo - "Ambulance aa rahi hai, cancel karoge?"
  const handleCancel = () => {
    if (Platform.OS === 'web') {
      const confirmCancel = window.confirm("Ambulance is already dispatched. It will arrive in ~5 minutes.\n\nCancel Anyway?");
      if (confirmCancel) {
        cancelActiveBooking();
      }
    } else {
      Alert.alert(
        'Cancel Emergency Request?',
        'Ambulance is already dispatched. It will arrive in ~5 minutes.',
        [
          { text: 'Keep Booking', style: 'cancel' },
          { text: 'Cancel Anyway', style: 'destructive', onPress: cancelActiveBooking },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Status Header */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.headerBar}>
          <View style={styles.liveDispatchPill}>
            <Radio size={14} color="#FFFFFF" />
            <Text style={styles.liveDispatchText}>EMERGENCY DISPATCH PROTOCOL</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Center Animation Area */}
      <View style={styles.centerArea}>
        {Platform.OS === 'web' && (
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
            {/* Outer Glow */}
            <div style={{
              position: 'absolute', inset: -20,
              borderRadius: '50%',
              animation: 'sphere-glow 4s ease-in-out infinite',
            }} />
            {/* Rotating Core 1 */}
            <div style={{
              position: 'absolute', inset: 10,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(59,130,246,0.8) 25%, transparent 50%, rgba(139,92,246,0.8) 75%, transparent 100%)',
              animation: 'sphere-rotate 6s linear infinite, sphere-pulse 3s ease-in-out infinite',
              filter: 'blur(8px)',
            }} />
            {/* Rotating Core 2 */}
            <div style={{
              position: 'absolute', inset: 20,
              borderRadius: '50%',
              background: 'conic-gradient(from 180deg, transparent 0%, rgba(6,182,212,0.8) 25%, transparent 50%, rgba(59,130,246,0.8) 75%, transparent 100%)',
              animation: 'sphere-rotate 4s linear infinite reverse',
              filter: 'blur(4px)',
            }} />
            {/* Inner Sphere */}
            <div style={{
              position: 'absolute', inset: 30,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(6,182,212,1), rgba(59,130,246,0.8), rgba(139,92,246,0.6), transparent 80%)',
              animation: 'sphere-pulse 2s ease-in-out infinite',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)',
            }} />
          </div>
        )}

        {Platform.OS === 'web' && (
          <div style={{ animation: 'scan-text 2s ease-in-out infinite', color: '#06B6D4', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '40px' }}>
            SCANNING VITAL NETWORKS...
          </div>
        )}

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>0{secondsRemaining}</Text>
          <Text style={styles.timerSubtext}>seconds remaining</Text>
        </View>
      </View>

      {/* Bottom Dispatch Card */}
      <View style={styles.bottomCard}>
        <View style={styles.signalRow}>
          {Platform.OS === 'web' ? (
            <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.alertRed, animation: 'pulse-dot 1s ease-in-out infinite' }} />
          ) : (
            <View style={styles.pulseDot} />
          )}
          <Text style={styles.findingText}>
            Dispatching {selectedAmbulanceType.toUpperCase()} Ambulance...
          </Text>
        </View>

        <Text style={styles.subtext}>
          High-priority emergency beacon active • Assigning nearest paramedic team
        </Text>

        {/* Selected Service Info Pill */}
        <View style={styles.servicePill}>
          <ShieldAlert size={16} color={COLORS.alertRed} />
          <Text style={styles.servicePillText} numberOfLines={1}>
            {ambulanceConfig.name} ➔ {selectedHospital?.name || 'Emergency Trauma Center'}
          </Text>
        </View>

        {/* Live Dispatch Steps Log */}
        <View style={styles.logContainer}>
          {dispatchLogs.map((log, idx) => (
            <View key={idx} style={styles.logItem}>
              <CheckCircle size={13} color={COLORS.primary} />
              <Text style={styles.logText}>{log}</Text>
            </View>
          ))}
        </View>

        {/* Progress Bar */}
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
          onPress={handleCancel}
        >
          <Text style={styles.cancelLinkText}>Cancel Emergency Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27', // Full dark background
    position: 'relative',
  },
  safeHeader: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centered above sphere
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  liveDispatchText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Make room for bottom card
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(6, 182, 212, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  timerSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -5,
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
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
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
    marginBottom: 10,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  servicePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  logContainer: {
    backgroundColor: '#FAFCFA',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    marginBottom: 14,
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
    marginBottom: 12,
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
});
