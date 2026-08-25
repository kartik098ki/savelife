// 🏥 Hospital Selection & Clean Multi-Step Ambulance Booking Screen
// Real route preview, hospital switcher, sticky bottom "Book Ambulance" trigger & modern ambulance tier selector sheet

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
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Building2,
  MapPin,
  X,
  Truck,
  HeartPulse,
  Activity,
  ShieldCheck,
  CheckCircle,
  Clock,
  Zap,
  ChevronRight,
  UserCheck,
  BedDouble,
  ShieldAlert,
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useBookingStore } from '../store/useBookingStore';
import { Hospital, getNearbyHospitalsMock } from '../services/mockDataService';
import { fetchNearbyHospitals } from '../services/googleMapsService';
import { HospitalItem } from '../components/booking/HospitalItem';
import { LiveMapView } from '../components/map/LiveMapView';
import { AMBULANCE_TYPES } from '../constants/ambulanceTypes';

const { width } = Dimensions.get('window');

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
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);

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

  const handleOpenBookingModal = () => {
    calculateAndSetFare();
    setIsBookingSheetOpen(true);
  };

  const handleConfirmBooking = () => {
    setIsBookingSheetOpen(false);
    confirmBookingAndSearch();
  };

  const currentHospital = selectedHospital || hospitals[0] || getNearbyHospitalsMock(pickupLocation.latitude, pickupLocation.longitude)[0];
  const alsConfig = AMBULANCE_TYPES.als;
  const blsConfig = AMBULANCE_TYPES.bls;

  const distance = currentHospital?.distanceKm || 0.8;
  const alsFare = Math.round(alsConfig.baseFare + distance * alsConfig.perKmRate);
  const blsFare = Math.round(blsConfig.baseFare + distance * blsConfig.perKmRate);

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
            <Text style={styles.headerTitle}>Select Hospital & Route</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              📍 Pickup: {pickupLocation.address?.slice(0, 32) || 'Sector 128, Wish Town'}...
            </Text>
          </View>
        </View>

        {/* 📜 Content Scroll Area */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 🗺️ Selected Hospital Card with Route Map Preview */}
          {currentHospital && (
            <View style={styles.selectedHospitalCard}>
              <View style={styles.hospitalCardTop}>
                <View style={styles.hospitalImageContainer}>
                  <Image
                    source={{ uri: currentHospital.imageUrl }}
                    style={styles.hospitalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.verifiedTag}>
                    <ShieldCheck size={11} color="#FFFFFF" />
                    <Text style={styles.verifiedTagText}>24/7 TRAUMA CENTER</Text>
                  </View>
                </View>

                <View style={styles.hospitalDetails}>
                  <Text style={styles.hospitalName} numberOfLines={1}>
                    {currentHospital.name}
                  </Text>
                  <Text style={styles.hospitalAddress} numberOfLines={1}>
                    {currentHospital.address}
                  </Text>

                  {/* Doctor on duty & Beds */}
                  <View style={styles.metaRow}>
                    <View style={styles.doctorBadge}>
                      <UserCheck size={12} color={COLORS.primaryDark} />
                      <Text style={styles.doctorBadgeText} numberOfLines={1}>
                        {currentHospital.doctorName}
                      </Text>
                    </View>
                    <View style={styles.icuBadge}>
                      <BedDouble size={12} color="#15803D" />
                      <Text style={styles.icuBadgeText}>{currentHospital.icuBedsAvailable} ICU Beds</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Mini Map Route View */}
              <View style={styles.mapPreviewBox}>
                <LiveMapView
                  pickupLocation={pickupLocation}
                  destinationHospital={currentHospital}
                  routeCoordinates={routeToHospital?.coordinates}
                  showPickupPuck={true}
                  showDestinationMarker={true}
                  style={styles.miniMap}
                />
                <View style={styles.routeTag}>
                  <MapPin size={12} color="#FFFFFF" />
                  <Text style={styles.routeTagText}>
                    Direct Corridor: {distance} km • ~{currentHospital.etaMinutes} mins
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 🔍 Section: Other Sector 128 Hospitals List */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Change Destination Hospital</Text>
            <Text style={styles.sectionCount}>({filteredHospitals.length} Centers)</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarWrapper}>
            <Search size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hospital, specialty..."
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

          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loaderText}>Loading verified hospitals...</Text>
            </View>
          ) : (
            filteredHospitals.map((hospital) => (
              <HospitalItem
                key={hospital.id}
                hospital={hospital}
                isSelected={currentHospital?.id === hospital.id}
                onPress={() => handleSelectHospital(hospital)}
              />
            ))
          )}

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* 🚨 STICKY BOTTOM BAR: Book Ambulance Button in Below Bottom Center */}
        <View style={styles.stickyBottomBar}>
          <View style={styles.bottomBarContent}>
            <View style={styles.bottomPriceSummary}>
              <Text style={styles.bottomPriceLabel}>Estimated Emergency Fare</Text>
              <Text style={styles.bottomPriceValue}>
                ₹{selectedAmbulanceType === 'als' ? alsFare : blsFare}
                <Text style={styles.bottomPriceType}>
                  {' '}({selectedAmbulanceType === 'als' ? 'ALS ICU' : 'BLS'})
                </Text>
              </Text>
              <Text style={styles.bottomEtaText}>⚡ Avg response: 3-4 mins</Text>
            </View>

            <TouchableOpacity
              style={styles.bookAmbulanceCtaBtn}
              activeOpacity={0.88}
              onPress={handleOpenBookingModal}
            >
              <Truck size={20} color="#FFFFFF" />
              <Text style={styles.bookAmbulanceCtaText}>Book Ambulance ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📋 MODERN AMBULANCE CATEGORY & PRICE SELECTION MODAL */}
        <Modal visible={isBookingSheetOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {/* Drag Pill */}
              <View style={styles.modalDragPill} />

              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.modalTitle}>Choose Ambulance Tier</Text>
                  <Text style={styles.modalSubtitle}>
                    To: {currentHospital?.name.slice(0, 26)}...
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setIsBookingSheetOpen(false)}
                >
                  <X size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* 🚑 Option 1: ALS (Advanced Life Support - ICU on Wheels) */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedAmbulanceType === 'als' && styles.tierCardSelected,
                ]}
                activeOpacity={0.88}
                onPress={() => setSelectedAmbulanceType('als')}
              >
                <View style={styles.tierCardTop}>
                  <View style={styles.tierIconBoxRed}>
                    <HeartPulse size={24} color={COLORS.alertRed} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.tierName}>Advanced Life Support (ALS)</Text>
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>ICU ON WHEELS</Text>
                      </View>
                    </View>
                    <Text style={styles.tierSpecs}>
                      Ventilator • Defibrillator • 12-Lead ECG • Paramedic Lead
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.tierPrice}>₹{alsFare}</Text>
                    <Text style={styles.tierEta}>3 mins ETA</Text>
                  </View>
                </View>

                {selectedAmbulanceType === 'als' && (
                  <View style={styles.tierActiveIndicator}>
                    <CheckCircle size={14} color={COLORS.alertRed} />
                    <Text style={styles.tierActiveText}>Selected • Immediate High-Priority Dispatch</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* 💚 Option 2: BLS (Basic Life Support Emergency) */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedAmbulanceType === 'bls' && styles.tierCardSelectedGreen,
                ]}
                activeOpacity={0.88}
                onPress={() => setSelectedAmbulanceType('bls')}
              >
                <View style={styles.tierCardTop}>
                  <View style={styles.tierIconBoxGreen}>
                    <Truck size={24} color={COLORS.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.tierName}>Basic Life Support (BLS)</Text>
                      <View style={styles.basicBadge}>
                        <Text style={styles.basicBadgeText}>STANDARD</Text>
                      </View>
                    </View>
                    <Text style={styles.tierSpecs}>
                      Hydraulic Stretcher • 2000L Oxygen Kit • First Aid Paramedic
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.tierPrice}>₹{blsFare}</Text>
                    <Text style={styles.tierEta}>4 mins ETA</Text>
                  </View>
                </View>

                {selectedAmbulanceType === 'bls' && (
                  <View style={styles.tierActiveIndicatorGreen}>
                    <CheckCircle size={14} color={COLORS.primary} />
                    <Text style={styles.tierActiveTextGreen}>Selected • Standard Emergency Transport</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Fare Transparency Note */}
              <View style={styles.fareNoteBox}>
                <ShieldCheck size={16} color={COLORS.primaryDark} />
                <Text style={styles.fareNoteText}>
                  Fixed Medical Rate • No Surge Pricing • Govt 112 Integrated
                </Text>
              </View>

              {/* Final Confirm CTA Button */}
              <TouchableOpacity
                style={styles.confirmDispatchBtn}
                activeOpacity={0.88}
                onPress={handleConfirmBooking}
              >
                <ShieldAlert size={20} color="#FFFFFF" />
                <Text style={styles.confirmDispatchBtnText}>
                  Confirm & Dispatch {selectedAmbulanceType === 'als' ? 'ALS ICU' : 'BLS'} (₹{selectedAmbulanceType === 'als' ? alsFare : blsFare}) ➔
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    position: 'relative',
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
  selectedHospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  hospitalCardTop: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  hospitalImageContainer: {
    width: 90,
    height: 85,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#CBD5E1',
  },
  verifiedTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  verifiedTagText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
  },
  hospitalDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  hospitalAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  doctorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  doctorBadgeText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  icuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  icuBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  mapPreviewBox: {
    height: 140,
    width: '100%',
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  miniMap: {
    width: '100%',
    height: '100%',
  },
  routeTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  routeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  sectionCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
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
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 40,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomPriceSummary: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bottomPriceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  bottomPriceType: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  bottomEtaText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '800',
  },
  bookAmbulanceCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  bookAmbulanceCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 18,
    paddingBottom: 28,
  },
  modalDragPill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  tierCardSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: COLORS.alertRed,
  },
  tierCardSelectedGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: COLORS.primary,
  },
  tierCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tierIconBoxRed: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierIconBoxGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  popularBadge: {
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  basicBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  basicBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  tierSpecs: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  tierPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  tierEta: {
    fontSize: 10,
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  tierActiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  tierActiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.alertRed,
  },
  tierActiveIndicatorGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
  },
  tierActiveTextGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  fareNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
  },
  fareNoteText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '700',
    flex: 1,
  },
  confirmDispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.alertRed,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmDispatchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
