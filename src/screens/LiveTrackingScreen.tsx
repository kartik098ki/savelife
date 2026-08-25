import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LiveMapView } from '../components/map/LiveMapView';
import { DriverCard } from '../components/tracking/DriverCard';
import { TripActions } from '../components/tracking/TripActions';
import { useBookingStore } from '../store/useBookingStore';
import { useDriverStore } from '../store/useDriverStore';
import { useDriverSimulation } from '../hooks/useDriverSimulation';
import { COLORS } from '../constants/colors';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Activity,
  Send,
  X,
  HeartPulse,
  Phone,
} from 'lucide-react-native';

export const LiveTrackingScreen: React.FC = () => {
  // 🚑 Booking Store - Booking ki saari details
  const {
    pickupLocation,
    selectedHospital,
    selectedAmbulanceType,
    activeBookingId,
    cancelActiveBooking,
    setCurrentScreen,
    otpCode,
    otpVerified,
    setOtpVerified,
  } = useBookingStore();

  // 🚗 Driver Store - Driver ki live location aur trip phase
  const {
    driver,
    currentCoord,
    heading,
    tripPhase,
    etaMinutesRemaining,
    etaSecondsRemaining,
  } = useDriverStore();

  // 🗺️ Live movement simulation chalu karo
  useDriverSimulation();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: 'Emergency lights active! Approaching your location now. Keep patient in resting position.',
      time: 'Just now',
    },
  ]);

  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [patientStatus, setPatientStatus] = useState('Conscious & Breathing');

  // 🔢 OTP Verification Modal - Driver aaya toh OTP verify karo
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);

  // ❌ Cancel Confirmation State
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isEnRouteToHospital = tripPhase === 'en_route_hospital' || tripPhase === 'arrived_hospital';

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMsg = {
      sender: 'user' as const,
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'driver',
          text: 'Understood. Paramedic team informed.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Full-Screen Live Interactive Map */}
      <View style={styles.mapContainer}>
        <LiveMapView
          pickupLocation={pickupLocation}
          driverLocation={{
            latitude: currentCoord.latitude,
            longitude: currentCoord.longitude,
            heading,
          }}
          destinationHospital={isEnRouteToHospital ? selectedHospital : null}
          showPickupPuck={!isEnRouteToHospital}
          showDriverMarker={true}
          showDestinationMarker={isEnRouteToHospital}
        />
      </View>

      {/* Floating Top Nav Bar with Live Speedometer */}
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => setCurrentScreen('home')}
          >
            <ArrowLeft size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.speedometerPill}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.speedText}>Speed: 52 km/h • Siren ON</Text>
          </View>

          <View style={styles.emergencyIdBadge}>
            <ShieldCheck size={14} color="#FFFFFF" />
            <Text style={styles.emergencyIdText}>
              #{activeBookingId || 'BK-8821'}
            </Text>
          </View>
        </View>

        {/* Quick Paramedic Telemetry Action Bar */}
        <View style={styles.quickBar}>
          <TouchableOpacity
            style={styles.quickBarBtn}
            activeOpacity={0.85}
            onPress={() => setIsChatOpen(true)}
          >
            <MessageSquare size={14} color={COLORS.primaryDark} />
            <Text style={styles.quickBarBtnText}>Chat with EMT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBarBtn}
            activeOpacity={0.85}
            onPress={() => setIsVitalsModalOpen(true)}
          >
            <HeartPulse size={14} color={COLORS.alertRed} />
            <Text style={styles.quickBarBtnText}>Pre-Submit Vitals</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Driver Profile & Trip Control Card */}
      <View style={styles.bottomCardWrapper}>
        <DriverCard
          driver={driver}
          tripPhase={tripPhase}
          etaMinutes={etaMinutesRemaining}
          hospitalName={selectedHospital?.name}
        />

        <TripActions
          bookingId={activeBookingId || 'BK-8821'}
          driverName={driver.name}
          vehicleNo={driver.ambulanceNumber}
          hospitalName={selectedHospital?.name}
          onCancel={() => setShowCancelConfirm(true)}
        />

        {/* 🔢 OTP Verification Button - Driver ke paas OTP dikhao */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#FEF3C7', paddingVertical: 10, paddingHorizontal: 16,
            borderRadius: 14, borderWidth: 1, borderColor: '#FDE68A', gap: 8,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#92400E' }}>
              🔢 Share OTP with driver:
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#92400E', letterSpacing: 4 }}>
              {otpCode}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: otpVerified ? COLORS.primary : '#1E293B',
              paddingVertical: 12, borderRadius: 14, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}
            activeOpacity={0.85}
            onPress={() => {
              if (!otpVerified) setIsOtpModalOpen(true);
            }}
          >
            {otpVerified ? (
              <>
                <ShieldCheck size={16} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>✅ OTP Verified — Driver Confirmed</Text>
              </>
            ) : (
              <>
                <ShieldCheck size={16} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>Verify Driver OTP</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* EMT Direct Message Modal */}
      <Modal visible={isChatOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EMT Rajesh Kumar (Direct Line)</Text>
              <TouchableOpacity onPress={() => setIsChatOpen(false)}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 12, gap: 8 }}>
              {messages.map((m, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.chatMsg,
                    m.sender === 'user' ? styles.chatMsgUser : styles.chatMsgDriver,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatMsgText,
                      m.sender === 'user' ? styles.chatMsgTextUser : styles.chatMsgTextDriver,
                    ]}
                  >
                    {m.text}
                  </Text>
                  <Text style={styles.chatMsgTime}>{m.time}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Send gate code, landmark, or patient update..."
                placeholderTextColor={COLORS.textPlaceholder}
                value={chatMessage}
                onChangeText={setChatMessage}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity style={styles.sendChatBtn} onPress={handleSendMessage}>
                <Send size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pre-Submit Patient Vitals Modal */}
      <Modal visible={isVitalsModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pre-Submit Patient Vitals</Text>
              <TouchableOpacity onPress={() => setIsVitalsModalOpen(false)}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16, gap: 12 }}>
              <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                Transmitting patient vitals in advance allows the oncoming paramedic team to prepare oxygen or ventilator equipment before arrival.
              </Text>

              {['Conscious & Breathing', 'Unconscious but Breathing', 'Difficulty Breathing', 'Severe Hemorrhage / Bleeding'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.vitalsOption,
                    patientStatus === status && styles.vitalsOptionSelected,
                  ]}
                  onPress={() => setPatientStatus(status)}
                >
                  <Text
                    style={[
                      styles.vitalsOptionText,
                      patientStatus === status && styles.vitalsOptionTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.transmitBtn}
                onPress={() => {
                  setIsVitalsModalOpen(false);
                  Alert.alert('Vitals Transmitted', `EMT unit updated with condition: ${patientStatus}`);
                }}
              >
                <Text style={styles.transmitBtnText}>Transmit to Paramedic Unit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔢 OTP Verification Modal - Driver ka OTP verify karo */}
      <Modal visible={isOtpModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔐 Verify Driver OTP</Text>
              <TouchableOpacity onPress={() => { setIsOtpModalOpen(false); setOtpInput(''); setOtpError(false); }}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20, gap: 16 }}>
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' }}>
                Driver ko apna 4-digit OTP bataiye. Phir yahan enter karein confirm karne ke liye.
              </Text>

              <TextInput
                style={{
                  height: 56, borderRadius: 16, borderWidth: 2,
                  borderColor: otpError ? COLORS.alertRed : COLORS.cardBorder,
                  textAlign: 'center', fontSize: 28, fontWeight: '900',
                  letterSpacing: 12, color: COLORS.textPrimary,
                }}
                placeholder="• • • •"
                placeholderTextColor={COLORS.textPlaceholder}
                value={otpInput}
                onChangeText={(t) => { setOtpInput(t); setOtpError(false); }}
                keyboardType="number-pad"
                maxLength={4}
                autoFocus
              />

              {otpError && (
                <Text style={{ color: COLORS.alertRed, fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
                  ❌ Galat OTP! Phir se try karein.
                </Text>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary, paddingVertical: 14,
                  borderRadius: 16, alignItems: 'center',
                }}
                onPress={() => {
                  if (otpInput === otpCode) {
                    setOtpVerified(true);
                    setIsOtpModalOpen(false);
                    setOtpInput('');
                    setOtpError(false);
                  } else {
                    setOtpError(true);
                  }
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800' }}>Verify OTP ✅</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ❌ Cancel Confirmation Modal - "Ambulance aa rahi hai, cancel karoge?" */}
      <Modal visible={showCancelConfirm} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: 20 }]}>
            <View style={{ padding: 24, alignItems: 'center', gap: 16 }}>
              <View style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldAlert size={32} color={COLORS.alertRed} />
              </View>

              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' }}>
                Ambulance Already Dispatched
              </Text>

              <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 }}>
                🚑 Ambulance 5 minute mein aapke paas pahunch jayegi. Kya aap sure hain ki cancel karna hai?
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary, paddingVertical: 14,
                  borderRadius: 16, alignItems: 'center', width: '100%',
                }}
                onPress={() => setShowCancelConfirm(false)}
              >
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800' }}>🚑 Keep Booking — Ambulance Aa Rahi Hai</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#FEF2F2', paddingVertical: 14,
                  borderRadius: 16, alignItems: 'center', width: '100%',
                  borderWidth: 1, borderColor: '#FECACA',
                }}
                onPress={() => {
                  setShowCancelConfirm(false);
                  cancelActiveBooking();
                }}
              >
                <Text style={{ color: COLORS.alertRed, fontSize: 14, fontWeight: '700' }}>Cancel Anyway ❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  topSafeArea: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    zIndex: 25,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  speedometerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emergencyIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  emergencyIdText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  quickBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickBarBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bottomCardWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
    zIndex: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  chatScroll: {
    maxHeight: 220,
  },
  chatMsg: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
  },
  chatMsgUser: {
    backgroundColor: COLORS.secondaryBlue,
    alignSelf: 'flex-end',
  },
  chatMsgDriver: {
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
  },
  chatMsgText: {
    fontSize: 13,
  },
  chatMsgTextUser: {
    color: '#FFFFFF',
  },
  chatMsgTextDriver: {
    color: COLORS.textPrimary,
  },
  chatMsgTime: {
    fontSize: 9,
    color: 'rgba(0,0,0,0.4)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 21,
    paddingHorizontal: 14,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sendChatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalsOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.surfaceLight,
  },
  vitalsOptionSelected: {
    borderColor: COLORS.alertRed,
    backgroundColor: COLORS.alertRedLight,
  },
  vitalsOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  vitalsOptionTextSelected: {
    color: COLORS.alertRed,
    fontWeight: '800',
  },
  transmitBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.alertRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  transmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
