// 🏠 SaveLife Home Screen - Map, Emergency Dispatch, Blinkit Staff & Facilities
// 1-Tap Emergency Dispatch, Sector 128 Noida Live GPS, Siren toggle & On-board Telemetry

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Truck,
  Building2,
  Zap,
  Stethoscope,
  HeartPulse,
  ShieldAlert,
  Flame,
  UserCheck,
  Search,
  MapPin,
  Shield,
  CheckCircle,
  ChevronRight,
  Syringe,
  Activity,
  Thermometer,
  Pill,
  Heart,
  Volume2,
  VolumeX,
  PhoneCall,
} from 'lucide-react-native';

import { LiveMapView } from '../components/map/LiveMapView';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS } from '../constants/colors';
import { soundService } from '../services/soundService';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.42;

export function HomeScreen() {
  // 📍 User live coordinates (Sector 128, Noida default)
  const { location } = useLiveLocation();
  const { setCurrentScreen, startBookingFlow } = useBookingStore();
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  const toggleSirenSound = () => {
    if (isSirenPlaying) {
      soundService.stopSiren();
      setIsSirenPlaying(false);
    } else {
      soundService.playEmergencySiren();
      setIsSirenPlaying(true);
    }
  };

  const handleSosEmergency = () => {
    soundService.playSonarPing();
    startBookingFlow(undefined, 'als');
  };

  return (
    <View style={styles.container}>
      {/* 🗺️ Top Real-time Leaflet Map Section */}
      <View style={styles.mapContainer}>
        <LiveMapView 
          pickupLocation={location} 
          showPickupPuck={true}
        />

        {/* 🚨 Quick Emergency Siren Audio Toggle on Map */}
        <TouchableOpacity
          style={[styles.sirenFloatingBtn, isSirenPlaying && styles.sirenFloatingBtnActive]}
          activeOpacity={0.85}
          onPress={toggleSirenSound}
        >
          {isSirenPlaying ? (
            <Volume2 size={18} color="#FFFFFF" />
          ) : (
            <VolumeX size={18} color={COLORS.textPrimary} />
          )}
          <Text style={[styles.sirenBtnText, isSirenPlaying && { color: '#FFFFFF' }]}>
            {isSirenPlaying ? 'SIREN ON' : 'Siren Audio'}
          </Text>
        </TouchableOpacity>

        {/* 🆘 1-Tap SOS Emergency Dispatch Float */}
        <TouchableOpacity
          style={styles.sosFloatingBtn}
          activeOpacity={0.88}
          onPress={handleSosEmergency}
        >
          <Zap size={18} color="#FFFFFF" />
          <Text style={styles.sosFloatingBtnText}>SOS DISPATCH</Text>
        </TouchableOpacity>
        
        {/* 📍 Reverse-Geocoded Sector 128 Address Chip */}
        <TouchableOpacity
          style={styles.addressChipContainer}
          activeOpacity={0.88}
          onPress={() => setCurrentScreen('destination_search')}
        >
          <View style={styles.addressChip}>
            <View style={styles.greenDot} />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressTitle}>Current Emergency Pickup</Text>
              <Text style={styles.addressSubtitle} numberOfLines={1}>
                {location.address || 'Tower 4, Jaypee Greens Wish Town, Sector 128, Noida, UP'}
              </Text>
            </View>
            <ChevronRight size={18} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 📱 Smooth Scrollable Bottom Sheet */}
      <ScrollView 
        style={styles.bottomSheet}
        contentContainerStyle={styles.bottomSheetContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        {/* 🔍 Search Pill "Where do you want to go?" */}
        <TouchableOpacity 
          style={styles.searchPill}
          activeOpacity={0.88}
          onPress={() => setCurrentScreen('destination_search')}
        >
          <Search size={22} color={COLORS.primary} style={styles.searchIcon} />
          <Text style={styles.searchText}>Where do you want to go?</Text>
        </TouchableOpacity>

        {/* ⚡ Availability Telemetry Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Get Help Fast</Text>
          <View style={styles.availabilityPill}>
            <Zap size={14} color={COLORS.primaryDark} fill={COLORS.primaryDark} />
            <Text style={styles.availabilityText}>4 ALS Ambulances active in Sector 128</Text>
          </View>
        </View>

        {/* 🚑 Dual Service Cards (Emergency Ambulance + Find Hospital) */}
        <View style={styles.serviceCardsContainer}>
          {/* Card A: Emergency Ambulance */}
          <TouchableOpacity 
            style={[styles.serviceCard, styles.emergencyCard]}
            activeOpacity={0.88}
            onPress={() => setCurrentScreen('hospital_select')}
          >
            <View style={styles.badgeRed}>
              <Text style={styles.badgeTextRed}>Book Now</Text>
            </View>
            <Truck size={32} color={COLORS.alertRed} style={styles.cardIcon} />
            <Text style={styles.serviceTitle}>Emergency{'\n'}Ambulance</Text>
            <Text style={styles.serviceSubtitle}>Reaches in 4–6 mins</Text>
          </TouchableOpacity>

          {/* Card B: Find Hospital */}
          <TouchableOpacity 
            style={[styles.serviceCard, styles.hospitalCard]}
            activeOpacity={0.88}
            onPress={() => setCurrentScreen('hospital_list')}
          >
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeTextGreen}>Nearby</Text>
            </View>
            <Building2 size={32} color={COLORS.primary} style={styles.cardIcon} />
            <Text style={styles.serviceTitle}>Find{'\n'}Hospital</Text>
            <Text style={styles.serviceSubtitle}>Live ICU bed status</Text>
          </TouchableOpacity>
        </View>

        {/* 🏷️ Instant Emergency Category Tags (Cardiac, Trauma, Burn, Elderly) */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tagsScrollContent}
          style={styles.tagsContainer}
        >
          <EmergencyTag icon={<HeartPulse size={16} color={COLORS.alertRed} />} text="Cardiac ICU (ALS)" onPress={() => startBookingFlow(undefined, 'als')} />
          <EmergencyTag icon={<ShieldAlert size={16} color={COLORS.textPrimary} />} text="Trauma Center" onPress={() => startBookingFlow(undefined, 'als')} />
          <EmergencyTag icon={<Flame size={16} color="#F97316" />} text="Burn Care Unit" onPress={() => startBookingFlow(undefined, 'als')} />
          <EmergencyTag icon={<UserCheck size={16} color={COLORS.primary} />} text="Elderly Transfer (BLS)" onPress={() => startBookingFlow(undefined, 'bls')} />
        </ScrollView>

        {/* 👨‍⚕️ SECTION: Ambulance Staff (Blinkit-style Dark Section) */}
        <View style={styles.darkSection}>
          <View style={styles.darkSectionHeader}>
            <Text style={styles.darkSectionTitle}>Ambulance Staff</Text>
            <Text style={styles.darkSectionSubtitle}>Equipped and ready to deliver expert care on the move</Text>
          </View>

          <View style={styles.staffList}>
            <StaffItem 
              icon={<Stethoscope size={28} color={COLORS.primary} />}
              title="Paramedic"
              subtitle="Provides extensive medical care & IV stabilization"
              bgColor={COLORS.primaryLight}
            />
            <StaffItem 
              icon={<Truck size={28} color="#3B82F6" />}
              title="Pilot"
              subtitle="Ensures timely, sirens-cleared & safe transfer"
              bgColor="#EFF6FF"
            />
            <StaffItem 
              icon={<Heart size={28} color="#F59E0B" />}
              title="Duty Assistant"
              subtitle="Supports in lifting, stretcher transfer & moving"
              bgColor="#FEF3C7"
            />
          </View>
        </View>

        {/* 🩺 SECTION: On-board Facilities Carousel */}
        <View style={[styles.darkSection, styles.darkSectionBottom]}>
          <View style={styles.darkSectionHeader}>
            <Text style={styles.darkSectionTitle}>On-board Facilities</Text>
            <Text style={styles.darkSectionSubtitle}>Equipped with essential ICU life-support tools</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.facilitiesScrollContent}
          >
            <FacilityCard 
              icon={<Activity size={24} color={COLORS.primary} />}
              text="Stretcher, scoop & wheelchair"
              detail="Hydraulic shock absorber"
            />
            <FacilityCard 
              icon={<Thermometer size={24} color={COLORS.primary} />}
              text="Instruments to check vitals"
              detail="Multi-para ECG monitor"
            />
            <FacilityCard 
              icon={<Pill size={24} color={COLORS.primary} />}
              text="Essential ICU medicine"
              detail="Epinephrine, CPR kits"
            />
          </ScrollView>
        </View>

        {/* 🛡️ Safety & Trust Verification */}
        <View style={styles.trustSection}>
          <Text style={styles.trustSectionTitle}>Your Safety & Medical Trust</Text>
          <View style={styles.trustItems}>
            <TrustItem icon={<MapPin size={20} color={COLORS.primary} />} text="Live GPS Tracked" />
            <TrustItem icon={<CheckCircle size={20} color={COLORS.primary} />} text="Verified EMTs" />
            <TrustItem icon={<Shield size={20} color={COLORS.primary} />} text="100% Insured" />
          </View>
        </View>

        {/* Bottom Nav Spacer */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function EmergencyTag({ icon, text, onPress }: { icon: React.ReactNode; text: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.tag} onPress={onPress} activeOpacity={0.8}>
      {icon}
      <Text style={styles.tagText}>{text}</Text>
    </TouchableOpacity>
  );
}

function StaffItem({ icon, title, subtitle, bgColor }: { icon: React.ReactNode; title: string; subtitle: string; bgColor: string }) {
  return (
    <View style={styles.staffItem}>
      <View style={[styles.staffAvatar, { backgroundColor: bgColor }]}>
        {icon}
        <View style={styles.verifiedBadge}>
          <CheckCircle size={11} color="#FFF" fill="#3B82F6" />
        </View>
      </View>
      <View style={styles.staffInfo}>
        <Text style={styles.staffTitle}>{title}</Text>
        <Text style={styles.staffSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function FacilityCard({ icon, text, detail }: { icon: React.ReactNode; text: string; detail: string }) {
  return (
    <View style={styles.facilityCard}>
      <View style={styles.facilityIconContainer}>
        {icon}
      </View>
      <Text style={styles.facilityText}>{text}</Text>
      <Text style={styles.facilityDetailText}>{detail}</Text>
    </View>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.trustItem}>
      {icon}
      <Text style={styles.trustText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
  },
  mapContainer: {
    height: MAP_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  sirenFloatingBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 15,
  },
  sirenFloatingBtnActive: {
    backgroundColor: COLORS.alertRed,
  },
  sirenBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sosFloatingBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 15,
  },
  sosFloatingBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  addressChipContainer: {
    position: 'absolute',
    bottom: 20,
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 15,
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  greenDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  addressSubtitle: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -20,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomSheetContent: {
    paddingBottom: 100,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.dragHandle,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  headerSection: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  availabilityText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '800',
    marginLeft: 6,
  },
  serviceCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 18,
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    position: 'relative',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyCard: {
    backgroundColor: COLORS.alertRedLight,
    borderColor: '#FECACA',
  },
  hospitalCard: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#A7F3D0',
  },
  cardIcon: {
    marginBottom: 12,
    marginTop: 6,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  serviceSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  badgeRed: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeTextRed: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  badgeGreen: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeTextGreen: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  darkSection: {
    backgroundColor: '#1E293B',
    paddingVertical: 20,
  },
  darkSectionBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  darkSectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  darkSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  darkSectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  staffList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  staffItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffInfo: {
    flex: 1,
  },
  staffTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  staffSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  facilitiesScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    width: 150,
    marginRight: 10,
  },
  facilityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  facilityText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  facilityDetailText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  trustSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  trustSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
    textAlign: 'center',
  },
  trustItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustText: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});
