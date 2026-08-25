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
} from 'react-native';
import { Search, Building2, Phone, Star, BedDouble, ShieldCheck, MapPin, X } from 'lucide-react-native';
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

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await fetchNearbyHospitals(pickupLocation.latitude, pickupLocation.longitude, 8000);
        setHospitals(list);
      } catch {
        setHospitals(getNearbyHospitalsMock(pickupLocation.latitude, pickupLocation.longitude));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pickupLocation]);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'icu') return h.icuBedsAvailable > 10;
    if (selectedFilter === 'cardiac')
      return h.specialties.some((s) => s.toLowerCase().includes('cardiac') || s.toLowerCase().includes('heart'));
    if (selectedFilter === 'trauma')
      return h.specialties.some((s) => s.toLowerCase().includes('trauma'));

    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergency Hospital Directory</Text>
          <Text style={styles.headerSubtitle}>Verified 24/7 Trauma Centers & ICU Facilities</Text>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Search size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by hospital name or specialty..."
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

          {/* Category Filter Chips */}
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
                🛏️ ICU Available ({'>'}10)
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

        {/* Hospital List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loaderText}>Querying emergency network...</Text>
            </View>
          ) : (
            filteredHospitals.map((hospital) => (
              <View key={hospital.id} style={styles.hospitalCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.hospitalIcon}>
                    <Building2 size={22} color={COLORS.primaryDark} />
                  </View>

                  <View style={styles.headerInfo}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalAddress} numberOfLines={1}>
                      {hospital.address}
                    </Text>
                  </View>

                  <View style={styles.ratingBadge}>
                    <Star size={11} color={COLORS.star} fill={COLORS.star} />
                    <Text style={styles.ratingValue}>{hospital.rating.toFixed(1)}</Text>
                  </View>
                </View>

                {/* Specialties Tag Row */}
                <View style={styles.specialtiesRow}>
                  {hospital.specialties.map((spec, i) => (
                    <View key={i} style={styles.specialtyTag}>
                      <Text style={styles.specialtyTagText}>{spec}</Text>
                    </View>
                  ))}
                </View>

                {/* Status & CTA Row */}
                <View style={styles.cardFooter}>
                  <View style={styles.bedInfo}>
                    <BedDouble size={14} color={COLORS.primary} />
                    <Text style={styles.bedInfoText}>
                      <Text style={{ fontWeight: '800' }}>{hospital.icuBedsAvailable}</Text> ICU Beds Available
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bookAmbulanceBtn}
                    activeOpacity={0.85}
                    onPress={() => startBookingFlow(hospital)}
                  >
                    <ShieldCheck size={14} color="#FFFFFF" />
                    <Text style={styles.bookAmbulanceBtnText}>Book Ambulance</Text>
                  </TouchableOpacity>
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
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
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loaderBox: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  hospitalAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  specialtyTag: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specialtyTagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
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
    gap: 5,
  },
  bedInfoText: {
    fontSize: 12,
    color: COLORS.primaryDark,
  },
  bookAmbulanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  bookAmbulanceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
