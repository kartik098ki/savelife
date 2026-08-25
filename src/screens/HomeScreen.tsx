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
  SafeAreaView
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
  Heart
} from 'lucide-react-native';

import { LiveMapView } from '../components/map/LiveMapView';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.45;

export function HomeScreen() {
  const { location } = useLiveLocation();
  const { setCurrentScreen, startBookingFlow } = useBookingStore();

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <LiveMapView 
          pickupLocation={location} 
          showPickupPuck={true}
        />
        
        {/* Address Chip Floating over map bottom edge */}
        <View style={styles.addressChipContainer}>
          <View style={styles.addressChip}>
            <View style={styles.greenDot} />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressTitle}>Pickup Location</Text>
              <Text style={styles.addressSubtitle} numberOfLines={1}>
                {location.address || 'Locating...'}
              </Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.bottomSheet}
        contentContainerStyle={styles.bottomSheetContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        {/* Search Pill */}
        <TouchableOpacity 
          style={styles.searchPill}
          activeOpacity={0.9}
          onPress={() => setCurrentScreen('destination_search')}
        >
          <Search size={22} color={COLORS.primary} style={styles.searchIcon} />
          <Text style={styles.searchText}>Where do you want to go?</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Get Help Fast</Text>
          <View style={styles.availabilityPill}>
            <Zap size={14} color={COLORS.primaryDark} fill={COLORS.primaryDark} />
            <Text style={styles.availabilityText}>4 Ambulances active near you</Text>
          </View>
        </View>

        {/* Dual Service Cards */}
        <View style={styles.serviceCardsContainer}>
          <TouchableOpacity 
            style={[styles.serviceCard, styles.emergencyCard]}
            activeOpacity={0.8}
            onPress={() => setCurrentScreen('hospital_select')}
          >
            <View style={styles.badgeRed}>
              <Text style={styles.badgeTextRed}>Book Now</Text>
            </View>
            <Truck size={32} color={COLORS.alertRed} style={styles.cardIcon} />
            <Text style={styles.serviceTitle}>Emergency{'\n'}Ambulance</Text>
            <Text style={styles.serviceSubtitle}>Reaches in 4-6 mins</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.serviceCard, styles.hospitalCard]}
            activeOpacity={0.8}
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

        {/* Instant Emergency Tags */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tagsScrollContent}
          style={styles.tagsContainer}
        >
          <EmergencyTag icon={<HeartPulse size={16} color={COLORS.alertRed} />} text="Cardiac(ALS)" onPress={() => startBookingFlow(undefined, 'als')} />
          <EmergencyTag icon={<ShieldAlert size={16} color={COLORS.textPrimary} />} text="Trauma Center" onPress={() => startBookingFlow(undefined, 'als')} />
          <EmergencyTag icon={<Flame size={16} color="#F97316" />} text="Burn Care" onPress={() => startBookingFlow(undefined, 'als')} />
          <EmergencyTag icon={<UserCheck size={16} color={COLORS.primary} />} text="Elderly(BLS)" onPress={() => startBookingFlow(undefined, 'bls')} />
        </ScrollView>

        {/* SECTION: Ambulance Staff */}
        <View style={styles.darkSection}>
          <View style={styles.darkSectionHeader}>
            <Text style={styles.darkSectionTitle}>Ambulance Staff</Text>
            <Text style={styles.darkSectionSubtitle}>Equipped and ready to deliver expert care</Text>
          </View>

          <View style={styles.staffList}>
            <StaffItem 
              icon={<Stethoscope size={28} color={COLORS.primary} />}
              title="Paramedic"
              subtitle="Provides extensive medical care"
              bgColor={COLORS.primaryLight}
            />
            <StaffItem 
              icon={<Truck size={28} color="#3B82F6" />}
              title="Pilot"
              subtitle="Ensures timely & safe transfer"
              bgColor="#EFF6FF"
            />
            <StaffItem 
              icon={<Heart size={28} color="#F59E0B" />}
              title="Duty Assistant"
              subtitle="Supports in lifting & moving"
              bgColor="#FEF3C7"
            />
          </View>
        </View>

        {/* SECTION: On-board Facilities */}
        <View style={[styles.darkSection, styles.darkSectionBottom]}>
          <View style={styles.darkSectionHeader}>
            <Text style={styles.darkSectionTitle}>On-board facilities</Text>
            <Text style={styles.darkSectionSubtitle}>Equipped with essential tools for emergency support on the move</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.facilitiesScrollContent}
          >
            <FacilityCard 
              icon={<Activity size={24} color={COLORS.primary} />}
              text="Stretcher, scoop and wheelchair"
            />
            <FacilityCard 
              icon={<Thermometer size={24} color={COLORS.primary} />}
              text="Instruments to check vitals"
            />
            <FacilityCard 
              icon={<Pill size={24} color={COLORS.primary} />}
              text="Essential medicine"
            />
          </ScrollView>
        </View>

        {/* Safety & Trust Section */}
        <View style={styles.trustSection}>
          <Text style={styles.trustSectionTitle}>Your Safety First</Text>
          <View style={styles.trustItems}>
            <TrustItem icon={<MapPin size={20} color={COLORS.primary} />} text="GPS Tracked" />
            <TrustItem icon={<CheckCircle size={20} color={COLORS.primary} />} text="Verified EMTs" />
            <TrustItem icon={<Shield size={20} color={COLORS.primary} />} text="Insurance Covered" />
          </View>
        </View>

        {/* Bottom Padding for Nav Bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function EmergencyTag({ icon, text, onPress }: { icon: React.ReactNode; text: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.tag} onPress={onPress} activeOpacity={0.7}>
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
          <CheckCircle size={10} color="#FFF" fill="#3B82F6" />
        </View>
      </View>
      <View style={styles.staffInfo}>
        <Text style={styles.staffTitle}>{title}</Text>
        <Text style={styles.staffSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function FacilityCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.facilityCard}>
      <View style={styles.facilityIconContainer}>
        {icon}
      </View>
      <Text style={styles.facilityText}>{text}</Text>
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
  addressChipContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressSubtitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetContent: {
    paddingBottom: 24,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.dragHandle,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  headerSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '700',
    marginLeft: 6,
  },
  serviceCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    borderWidth: 1,
  },
  emergencyCard: {
    backgroundColor: COLORS.alertRedLight,
    borderColor: 'rgba(229, 57, 53, 0.1)',
  },
  hospitalCard: {
    backgroundColor: COLORS.primaryLight,
    borderColor: 'rgba(14, 159, 110, 0.1)',
  },
  cardIcon: {
    marginBottom: 16,
    marginTop: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  badgeRed: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextRed: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeGreen: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextGreen: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tagsContainer: {
    marginBottom: 32,
  },
  tagsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  darkSection: {
    backgroundColor: '#1E293B',
    paddingVertical: 24,
  },
  darkSectionBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  darkSectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  darkSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  darkSectionSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  staffList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  staffItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffInfo: {
    flex: 1,
  },
  staffTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  staffSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  facilitiesScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  facilityCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: 140,
    marginRight: 12,
  },
  facilityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  facilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  trustSection: {
    padding: 24,
    backgroundColor: '#FFF',
  },
  trustSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
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
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 80,
  }
});
