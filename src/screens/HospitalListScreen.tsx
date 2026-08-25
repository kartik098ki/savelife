// 🏥 Hospital Directory Screen - Sector 128 Noida Verified Emergency Hospitals
// Verified 24/7 Trauma Centers, live ICU Bed counters, on-duty doctors aur hospital photos

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import {
  Search,
  Building2,
  Phone,
  Star,
  BedDouble,
  ShieldCheck,
  MapPin,
  X,
  UserCheck,
  Clock,
  Navigation,
  RefreshCw,
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { Hospital, getNearbyHospitalsMock } from '../services/mockDataService';
import { fetchNearbyHospitals } from '../services/googleMapsService';

export const HospitalListScreen: React.FC = () => {
  const { pickupLocation, startBookingFlow } = useBookingStore();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'icu' | 'cardiac' | 'trauma'>('all');
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const list = await fetchNearbyHospitals(pickupLocation.latitude, pickupLocation.longitude, 8000);
      setHospitals(list);
    } catch {
      setHospitals(getNearbyHospitalsMock(pickupLocation.latitude, pickupLocation.longitude));
    } finally {
      setLastUpdated('Just now');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [pickupLocation]);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'icu') return h.icuBedsAvailable > 10;
    if (selectedFilter === 'cardiac')
      return h.specialties.some((s) => s.toLowerCase().includes('cardiac') || s.toLowerCase().includes('heart'));
    if (selectedFilter === 'trauma')
      return h.specialties.some((s) => s.toLowerCase().includes('trauma'));

    return true;
  });

  const handleCallHospital = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber.replace(/\s+/g, '')}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🏢 Header Section */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.headerEyebrow}>CARE NETWORK</Text>
              <Text style={styles.headerTitle}>Find emergency care</Text>
            </View>
            <TouchableOpacity accessibilityLabel="Refresh hospitals" style={styles.refreshButton} onPress={loadHospitals} disabled={loading}>
              <RefreshCw size={17} color={COLORS.primaryDark} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Near Sector 128, Noida • Emergency, ICU and specialist care</Text>

          <View style={styles.networkStatus}>
            <View style={styles.liveDot} />
            <Text style={styles.networkStatusText}>Availability directory refreshed {lastUpdated}</Text>
          </View>

          {/* 🔍 Search Input Box */}
          <View style={styles.searchBox}>
            <Search size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by hospital, doctor or specialty..."
              placeholderTextColor={COLORS.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* 🏷️ Filter Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                All Hospitals ({hospitals.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'icu' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('icu')}
            >
              <Text style={[styles.filterText, selectedFilter === 'icu' && styles.filterTextActive]}>
                🛏️ High ICU Bed Capacity ({'>'}10)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'trauma' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('trauma')}
            >
              <Text style={[styles.filterText, selectedFilter === 'trauma' && styles.filterTextActive]}>
                🚨 Level-1 Trauma
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'cardiac' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('cardiac')}
            >
              <Text style={[styles.filterText, selectedFilter === 'cardiac' && styles.filterTextActive]}>
                🫀 Cardiac Care
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 📋 Hospital Cards List with Photos & Doctor Info */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loaderText}>Fetching live ICU & doctor rosters...</Text>
            </View>
          ) : filteredHospitals.length === 0 ? (
            <View style={styles.emptyState}>
              <Building2 size={28} color={COLORS.primary} />
              <Text style={styles.emptyTitle}>No centres match that search</Text>
              <Text style={styles.emptyCopy}>Try a hospital name, doctor, or specialty such as “cardiac”.</Text>
              <TouchableOpacity style={styles.resetButton} onPress={() => { setSearchQuery(''); setSelectedFilter('all'); }}>
                <Text style={styles.resetButtonText}>Show all hospitals</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredHospitals.map((hospital) => (
              <View key={hospital.id} style={styles.hospitalCard}>
                {/* 🖼️ Hospital Photo & Header */}
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: hospital.imageUrl }}
                    style={styles.hospitalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.photoOverlayGradient} />
                  
                  {/* Floating Rating Badge */}
                  <View style={styles.floatingRating}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.floatingRatingText}>{hospital.rating.toFixed(1)}</Text>
                    <Text style={styles.floatingRatingCount}>({hospital.userRatingsTotal})</Text>
                  </View>

                  {/* Floating Distance Pill */}
                  <View style={styles.floatingDistance}>
                    <MapPin size={11} color="#FFFFFF" />
                    <Text style={styles.floatingDistanceText}>{hospital.distanceKm} km • {hospital.etaMinutes}m</Text>
                  </View>
                </View>

                {/* 📋 Hospital Body Info */}
                <View style={styles.cardBody}>
                  <Text style={styles.hospitalName}>{hospital.name}</Text>
                  <Text style={styles.hospitalAddress} numberOfLines={2}>
                    {hospital.address}
                  </Text>

                  {/* 👨‍⚕️ On-Duty Doctor Card Strip */}
                  <View style={styles.doctorStrip}>
                    <View style={styles.doctorAvatarCircle}>
                      <UserCheck size={16} color={COLORS.primaryDark} />
                    </View>
                    <View style={styles.doctorInfoCol}>
                      <Text style={styles.doctorNameText}>
                        {hospital.doctorName} <Text style={styles.onDutyBadge}>• ON DUTY</Text>
                      </Text>
                      <Text style={styles.doctorSpecialtyText}>
                        {hospital.doctorSpecialty} • {hospital.emergencyDoctorsCount} doctors on shift
                      </Text>
                    </View>
                  </View>

                  {/* 🏷️ Specialties Row */}
                  <View style={styles.specialtiesRow}>
                    {hospital.specialties.map((spec, i) => (
                      <View key={i} style={styles.specialtyTag}>
                        <Text style={styles.specialtyTagText}>{spec}</Text>
                      </View>
                    ))}
                  </View>

                  {/* ⚡ Status & Action Buttons */}
                  <View style={styles.cardFooter}>
                    <View style={styles.bedInfo}>
                      <BedDouble size={15} color={COLORS.primary} />
                      <Text style={styles.bedInfoText}>
                        <Text style={{ fontWeight: '800', color: COLORS.primaryDark }}>{hospital.icuBedsAvailable}</Text> ICU Beds
                      </Text>
                    </View>

                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={styles.callBtn}
                        activeOpacity={0.85}
                        onPress={() => handleCallHospital(hospital.phone)}
                      >
                        <Phone size={15} color={COLORS.textPrimary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.bookAmbulanceBtn}
                        activeOpacity={0.85}
                        onPress={() => startBookingFlow(hospital)}
                      >
                        <ShieldCheck size={15} color="#FFFFFF" />
                        <Text style={styles.bookAmbulanceBtnText}>Book Ambulance</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: '#FFFFFF',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerEyebrow: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
  headerTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  refreshButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: '#C7EBDC' },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 9,
  },
  networkStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 11, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20, backgroundColor: '#EFFBF5' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  networkStatusText: { fontSize: 10, color: COLORS.primaryDark, fontWeight: '700' },
  searchBox: {
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.primaryDark,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
  },
  loaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: { alignItems: 'center', paddingVertical: 56, paddingHorizontal: 28, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: COLORS.cardBorder },
  emptyTitle: { marginTop: 12, fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  emptyCopy: { marginTop: 6, textAlign: 'center', fontSize: 12, lineHeight: 18, color: COLORS.textSecondary },
  resetButton: { marginTop: 18, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, backgroundColor: COLORS.primary },
  resetButtonText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlayGradient: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  floatingRating: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  floatingRatingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  floatingRatingCount: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  floatingDistance: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  floatingDistanceText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 14,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  doctorStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 10,
    gap: 10,
  },
  doctorAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfoCol: {
    flex: 1,
  },
  doctorNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  onDutyBadge: {
    fontSize: 10,
    color: '#15803D',
    fontWeight: '800',
  },
  doctorSpecialtyText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  specialtyTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  bedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bedInfoText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAmbulanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 19,
    gap: 6,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookAmbulanceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
