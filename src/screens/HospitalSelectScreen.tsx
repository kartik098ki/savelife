// 🏥 Hospital Selection & Instant Ambulance Booking Screen
// Priority Ambulance Selector (BLS/ALS) & Fare CTA on top, Destination Route Preview, and Sector 128 Hospital Directory

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Search, Building2, MapPin, X, Navigation, ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { Hospital, getNearbyHospitalsMock } from '../services/mockDataService';
import { fetchNearbyHospitals } from '../services/googleMapsService';
import { HospitalItem } from '../components/booking/HospitalItem';
import { AmbulanceTypeSelector } from '../components/booking/AmbulanceTypeSelector';
import { FareSummaryCard } from '../components/booking/FareSummaryCard';
import { LiveMapView } from '../components/map/LiveMapView';

export const HospitalSelectScreen: React.FC = () => {
  const {
    pickupLocation,
    selectedHospital,
    selectedAmbulanceType,
    fareCalculation,
    routeToHospital,
    setSelectedHospital,
    setSelectedAmbulanceType,
    calculateAndSetFare,
    confirmBookingAndSearch,
    setCurrentScreen,
  } = useBookingStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHospitals() {
      setLoading(true);
      try {
        const results = await fetchNearbyHospitals(
          pickupLocation.latitude,
          pickupLocation.longitude,
          6000
        );
        results.sort((a, b) => a.distanceKm - b.distanceKm);
        setHospitals(results);

        if (!selectedHospital && results.length > 0) {
          setSelectedHospital(results[0]);
        }
      } catch (err) {
        console.warn('Failed to load hospitals:', err);
        const fallback = getNearbyHospitalsMock(pickupLocation.latitude, pickupLocation.longitude);
        setHospitals(fallback);
        if (!selectedHospital && fallback.length > 0) {
          setSelectedHospital(fallback[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadHospitals();
  }, [pickupLocation]);

  useEffect(() => {
    calculateAndSetFare();
  }, [selectedHospital, selectedAmbulanceType]);

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectHospital = (h: Hospital) => {
    setSelectedHospital(h);
  };

  const handleBook = () => {
    confirmBookingAndSearch();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔙 Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => setCurrentScreen('home')}
          >
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Select Ambulance & Care</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              📍 From: {pickupLocation.address?.slice(0, 32) || 'Sector 128, Wish Town'}...
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ⚡ TOP SECTION 1: Ambulance Type Selection (BLS vs ALS ICU) */}
          <AmbulanceTypeSelector
            selectedType={selectedAmbulanceType}
            distanceKm={selectedHospital?.distanceKm || 0.8}
            onSelect={setSelectedAmbulanceType}
          />

          {/* 💰 TOP SECTION 2: Fare Summary & Instant Booking CTA */}
          {fareCalculation && (
            <FareSummaryCard
              fare={fareCalculation}
              hospitalName={selectedHospital?.name}
              onBook={handleBook}
            />
          )}

          {/* 🏥 SECTION 3: Selected Destination & Mini Route Preview */}
          {selectedHospital && (
            <View style={styles.destinationCard}>
              <View style={styles.destinationCardHeader}>
                <View style={styles.destinationIconBox}>
                  <Building2 size={18} color={COLORS.primaryDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.destinationTag}>DESTINATION TRAUMA CENTER</Text>
                  <Text style={styles.destinationName}>{selectedHospital.name}</Text>
                  <Text style={styles.destinationAddress} numberOfLines={1}>{selectedHospital.address}</Text>
                </View>
                <View style={styles.bedBadge}>
                  <Text style={styles.bedBadgeText}>{selectedHospital.icuBedsAvailable} ICU Beds</Text>
                </View>
              </View>

              {/* Mini-Map Preview with Route */}
              <View style={styles.miniMapContainer}>
                <LiveMapView
                  pickupLocation={pickupLocation}
                  destinationHospital={selectedHospital}
                  routeCoordinates={routeToHospital?.coordinates}
                  showPickupPuck={true}
                  showDestinationMarker={true}
                  style={styles.miniMap}
                />
                <View style={styles.miniMapBadge}>
                  <MapPin size={12} color="#FFFFFF" />
                  <Text style={styles.miniMapBadgeText}>Route: {selectedHospital.distanceKm} km • ~{selectedHospital.etaMinutes}m</Text>
                </View>
              </View>
            </View>
          )}

          {/* 🔍 SECTION 4: Search & Change Destination Hospital */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Change Destination Hospital</Text>
            <Text style={styles.sectionSubtitle}>{filteredHospitals.length} Noida centers available</Text>
          </View>

          <View style={styles.searchBarWrapper}>
            <Search size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hospital, trauma center..."
              placeholderTextColor={COLORS.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loaderText}>Finding nearest emergency facilities...</Text>
            </View>
          ) : (
            filteredHospitals.map((hospital) => (
              <HospitalItem
                key={hospital.id}
                hospital={hospital}
                isSelected={selectedHospital?.id === hospital.id}
                onPress={() => handleSelectHospital(hospital)}
              />
            ))
          )}

          <View style={{ height: 40 }} />
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  scrollContent: {
    padding: 14,
  },
  destinationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  destinationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationTag: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  destinationAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  bedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  miniMapContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  miniMap: {
    width: '100%',
    height: '100%',
  },
  miniMapBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  miniMapBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    padding: 0,
    fontWeight: '600',
  },
  loaderBox: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
