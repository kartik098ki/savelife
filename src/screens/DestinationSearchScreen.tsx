// 🔍 Destination Search Screen - Search hospitals in Sector 128, Noida
// Live filtering, quick emergency tags, hospital photos aur doctor on-duty status

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  X,
  Building2,
  Star,
  Clock,
  BedDouble,
  MapPin,
  ChevronRight,
  HeartPulse,
  ShieldAlert,
  Flame,
  Zap,
} from 'lucide-react-native';
import { Hospital, getNearbyHospitalsMock } from '../services/mockDataService';
import { fetchNearbyHospitals } from '../services/googleMapsService';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS } from '../constants/colors';
import { HospitalItem } from '../components/booking/HospitalItem';

export const DestinationSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<TextInput>(null);

  const { pickupLocation, startBookingFlow, setCurrentScreen } = useBookingStore();

  const QUICK_TAGS = [
    { id: '1', label: 'Jaypee (Sec 128)', icon: Zap, term: 'Jaypee' },
    { id: '2', label: 'Trauma Center', icon: ShieldAlert, term: 'Trauma' },
    { id: '3', label: 'Cardiac Care', icon: HeartPulse, term: 'Cardiac' },
    { id: '4', label: 'ICU Available', icon: BedDouble, term: 'Hospital' },
  ];

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      if (pickupLocation) {
        const data = await fetchNearbyHospitals(pickupLocation.latitude, pickupLocation.longitude);
        if (data && data.length > 0) {
          setHospitals(data);
          setLoading(false);
          return;
        }
      }
      const mockData = getNearbyHospitalsMock(pickupLocation.latitude, pickupLocation.longitude);
      setHospitals(mockData);
    } catch (error) {
      console.warn('Error loading hospitals, falling back to mock:', error);
      const mockData = getNearbyHospitalsMock(pickupLocation.latitude, pickupLocation.longitude);
      setHospitals(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    startBookingFlow(hospital);
    setCurrentScreen('hospital_select');
  };

  const filteredHospitals = hospitals.filter((h) => {
    const query = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(query) ||
      h.address.toLowerCase().includes(query) ||
      h.doctorName.toLowerCase().includes(query) ||
      h.specialties.some((s) => s.toLowerCase().includes(query))
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 🔙 Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Destination Hospital</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 🔍 Search Input Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search Sector 128 hospital, doctor, specialty..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton} activeOpacity={0.7}>
                <X size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 🏷️ Quick Suggestion Tags */}
        <View style={styles.tagsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScrollContent}
          >
            {QUICK_TAGS.map((tag) => {
              const Icon = tag.icon;
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={styles.tagButton}
                  onPress={() => setSearchQuery(tag.term)}
                  activeOpacity={0.7}
                >
                  <Icon size={14} color={COLORS.primary} />
                  <Text style={styles.tagText}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 📋 Results List */}
        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsScrollContent}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Matching Hospitals (${filteredHospitals.length})` : 'Verified Hospitals near Sector 128'}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Locating emergency centers...</Text>
            </View>
          ) : filteredHospitals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hospitals found matching "{searchQuery}"</Text>
            </View>
          ) : (
            filteredHospitals.map((hospital) => (
              <HospitalItem
                key={hospital.id}
                hospital={hospital}
                onPress={() => handleHospitalSelect(hospital)}
              />
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
  tagsContainer: {
    marginBottom: 8,
  },
  tagsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginVertical: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
