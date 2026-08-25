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
import { ArrowLeft, Search, Building2, MapPin, X } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { Hospital, getNearbyHospitalsMock } from '../services/mockDataService';
import { fetchNearbyHospitals } from '../services/googleMapsService';
import { HospitalItem } from '../components/booking/HospitalItem';
import { AmbulanceTypeSelector } from '../components/booking/AmbulanceTypeSelector';
import { FareSummaryCard } from '../components/booking/FareSummaryCard';
import { LiveMapView } from '../components/map/LiveMapView';

const { height: screenHeight } = Dimensions.get('window');

export const HospitalSelectScreen: React.FC = () => {
  const {
    pickupLocation,
    selectedHospital,
    selectedAmbulanceType,
    fareCalculation,
    setSelectedHospital,
    setSelectedAmbulanceType,
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
          5000
        );
        // Distance ascending sort
        results.sort((a, b) => a.distanceKm - b.distanceKm);
        setHospitals(results);

        // Auto-select the first hospital if none is selected
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
        {/* Top Header & Search Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => setCurrentScreen('home')}
          >
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

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
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Mini-Map Preview with Route */}
          {selectedHospital && (
            <View style={styles.miniMapContainer}>
              <LiveMapView
                pickupLocation={pickupLocation}
                destinationHospital={selectedHospital}
                showPickupPuck={true}
                showDestinationMarker={true}
                style={styles.miniMap}
              />
              <View style={styles.miniMapBadge}>
                <MapPin size={12} color="#FFFFFF" />
                <Text style={styles.miniMapBadgeText}>Route Preview</Text>
              </View>
            </View>
          )}

          {/* Hospital Selection Section */}
          <Text style={styles.sectionTitle}>Select Destination Hospital</Text>

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

          {/* Ambulance Type Selector */}
          <AmbulanceTypeSelector
            selectedType={selectedAmbulanceType}
            distanceKm={selectedHospital?.distanceKm || 3.5}
            onSelect={setSelectedAmbulanceType}
          />

          {/* Fare Summary & Urgent Booking CTA */}
          {fareCalculation && (
            <FareSummaryCard
              fare={fareCalculation}
              hospitalName={selectedHospital?.name}
              onBook={handleBook}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  miniMapContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    position: 'relative',
  },
  miniMap: {
    flex: 1,
  },
  miniMapBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(14, 159, 110, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniMapBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  loaderBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
