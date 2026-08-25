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
  KeyboardAvoidingView
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
  Zap
} from 'lucide-react-native';
import { Hospital, getNearbyHospitalsMock } from '../services/mockDataService';
import { fetchNearbyHospitals } from '../services/googleMapsService';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS } from '../constants/colors';

export const DestinationSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<TextInput>(null);

  const { pickupLocation, startBookingFlow, setCurrentScreen } = useBookingStore();

  const QUICK_TAGS = [
    { id: '1', label: 'Nearest Hospital', icon: Zap, term: 'Nearest' },
    { id: '2', label: 'Trauma Center', icon: ShieldAlert, term: 'Trauma' },
    { id: '3', label: 'Cardiac Unit', icon: HeartPulse, term: 'Cardiac' },
    { id: '4', label: 'Burn Care', icon: Flame, term: 'Burn' },
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

  const filteredHospitals = hospitals.filter(h => {
    const query = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(query) ||
      h.address.toLowerCase().includes(query) ||
      (h.specialties && h.specialties.some(s => s.toLowerCase().includes(query)))
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
            activeOpacity={0.7}
          >
            <ArrowLeft stroke={COLORS.textPrimary || '#1E293B'} width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Destination</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Input Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search stroke={COLORS.textMuted || '#8A94A6'} width={20} height={20} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search hospital, location, address..."
              placeholderTextColor={COLORS.textMuted || '#8A94A6'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton} activeOpacity={0.7}>
                <X stroke={COLORS.textMuted || '#8A94A6'} width={18} height={18} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Suggestion Tags */}
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
                  <Icon stroke={COLORS.primary || '#0E9F6E'} width={16} height={16} />
                  <Text style={styles.tagText}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results List */}
        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsScrollContent}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Nearby Hospitals'}
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary || '#0E9F6E'} />
            </View>
          ) : filteredHospitals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hospitals found matching "{searchQuery}"</Text>
            </View>
          ) : (
            filteredHospitals.map((hospital) => (
              <TouchableOpacity 
                key={hospital.id} 
                style={styles.hospitalCard}
                onPress={() => handleHospitalSelect(hospital)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.hospitalIconContainer}>
                    <Building2 stroke={COLORS.primary || '#0E9F6E'} width={24} height={24} />
                  </View>
                  <View style={styles.hospitalInfo}>
                    <View style={styles.hospitalHeaderRow}>
                      <Text style={styles.hospitalName} numberOfLines={1}>{hospital.name}</Text>
                      {hospital.emergencyAvailable && (
                        <View style={styles.availableDot} />
                      )}
                    </View>
                    <Text style={styles.hospitalAddress} numberOfLines={1}>{hospital.address}</Text>
                    
                    <View style={styles.badgesRow}>
                      <View style={styles.badge}>
                        <Star fill={COLORS.alertRed || '#E53935'} stroke={COLORS.alertRed || '#E53935'} width={12} height={12} />
                        <Text style={styles.badgeText}>{hospital.rating || '4.5'}</Text>
                      </View>
                      <View style={styles.badge}>
                        <MapPin stroke={COLORS.textMuted || '#8A94A6'} width={12} height={12} />
                        <Text style={styles.badgeText}>{hospital.distanceKm} km</Text>
                      </View>
                      <View style={styles.badge}>
                        <Clock stroke={COLORS.textMuted || '#8A94A6'} width={12} height={12} />
                        <Text style={styles.badgeText}>{hospital.etaMinutes} min</Text>
                      </View>
                      <View style={styles.badge}>
                        <BedDouble stroke={COLORS.textMuted || '#8A94A6'} width={12} height={12} />
                        <Text style={styles.badgeText}>{hospital.icuBedsAvailable || '5'} ICU</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    <ChevronRight stroke={COLORS.textMuted || '#8A94A6'} width={20} height={20} />
                  </View>
                </View>
              </TouchableOpacity>
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EC',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E3E8EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    height: '100%',
  },
  clearButton: {
    padding: 6,
  },
  tagsContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EC',
  },
  tagsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    color: '#0E9F6E',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8A94A6',
    textAlign: 'center',
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3E8EC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF6F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hospitalName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0E9F6E',
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E3E8EC',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  chevronContainer: {
    marginLeft: 8,
  },
});
