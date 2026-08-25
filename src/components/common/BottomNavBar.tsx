// 📱 Bottom Navigation Bar - Global 5-Tab Navigation with Ethereal AI Glowing Orb
// 1. Ride (Home Map) | 2. Ambulance (Dispatch/Track) | 3. AI Help (Ethereal Orb) | 4. Hospital (Directory) | 5. Profile

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Navigation,
  Truck,
  Building2,
  User,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { EtherealOrb } from './EtherealOrb';
import { useBookingStore } from '../../store/useBookingStore';

export type ScreenType =
  | 'home'
  | 'hospital_select'
  | 'searching_dispatch'
  | 'live_tracking'
  | 'ai_assistant'
  | 'hospital_list'
  | 'booking_history'
  | 'profile'
  | 'destination_search';

export interface BottomNavBarProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeScreen,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 6);
  const { bookingStatus, startBookingFlow } = useBookingStore();

  const handleAmbulanceTabPress = () => {
    // 🚑 If active trip exists, jump straight to tracking/dispatch
    if (bookingStatus === 'searching') {
      onNavigate('searching_dispatch');
    } else if (
      bookingStatus === 'driver_assigned' ||
      bookingStatus === 'driver_arriving' ||
      bookingStatus === 'patient_picked_up' ||
      bookingStatus === 'en_route_hospital'
    ) {
      onNavigate('live_tracking');
    } else {
      // 🚑 Otherwise initialize booking flow & open ambulance booking screen
      startBookingFlow(undefined, 'als');
    }
  };

  const isTabActive = (tabKey: ScreenType) => {
    if (tabKey === 'home') {
      return activeScreen === 'home' || activeScreen === 'destination_search';
    }
    if (tabKey === 'hospital_select') {
      return activeScreen === 'hospital_select' || activeScreen === 'searching_dispatch' || activeScreen === 'live_tracking' || activeScreen === 'booking_history';
    }
    return activeScreen === tabKey;
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {/* 🧭 Tab 1: Ride / Home Map */}
      <TouchableOpacity
        style={[styles.tabItem, isTabActive('home') && styles.tabItemActive]}
        onPress={() => onNavigate('home')}
        activeOpacity={0.7}
      >
        <Navigation
          size={22}
          color={isTabActive('home') ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isTabActive('home') ? COLORS.primary : COLORS.textMuted },
          ]}
        >
          Ride
        </Text>
      </TouchableOpacity>

      {/* 🚑 Tab 2: Book / Track Ambulance */}
      <TouchableOpacity
        style={[styles.tabItem, isTabActive('hospital_select') && styles.tabItemActive]}
        onPress={handleAmbulanceTabPress}
        activeOpacity={0.7}
      >
        <Truck
          size={22}
          color={isTabActive('hospital_select') ? COLORS.alertRed : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isTabActive('hospital_select') ? COLORS.alertRed : COLORS.textMuted, fontWeight: isTabActive('hospital_select') ? '800' : '700' },
          ]}
        >
          Ambulance
        </Text>
      </TouchableOpacity>

      {/* 🔮 Tab 3: Raised Ethereal AI Orb Center Button */}
      <View style={styles.centerSlot}>
        <View style={styles.orbFloatingWrapper}>
          <EtherealOrb
            size={58}
            onPress={() => onNavigate('ai_assistant')}
          >
            <Sparkles size={24} color="#FFFFFF" />
          </EtherealOrb>
        </View>
        <TouchableOpacity onPress={() => onNavigate('ai_assistant')}>
          <Text style={styles.aiLabel}>AI Help</Text>
        </TouchableOpacity>
      </View>

      {/* 🏥 Tab 4: Hospital Directory & ICU beds */}
      <TouchableOpacity
        style={[styles.tabItem, isTabActive('hospital_list') && styles.tabItemActive]}
        onPress={() => onNavigate('hospital_list')}
        activeOpacity={0.7}
      >
        <Building2
          size={22}
          color={isTabActive('hospital_list') ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isTabActive('hospital_list') ? COLORS.primary : COLORS.textMuted },
          ]}
        >
          Hospital
        </Text>
      </TouchableOpacity>

      {/* 👤 Tab 5: User Profile & Emergency Medical ID */}
      <TouchableOpacity
        style={[styles.tabItem, isTabActive('profile') && styles.tabItemActive]}
        onPress={() => onNavigate('profile')}
        activeOpacity={0.7}
      >
        <User
          size={22}
          color={isTabActive('profile') ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isTabActive('profile') ? COLORS.primary : COLORS.textMuted },
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.98)',
    height: 74,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
    position: 'relative',
    zIndex: 50,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    gap: 4,
    marginHorizontal: 3,
    borderRadius: 15,
  },
  tabItemActive: { backgroundColor: '#ECFDF5' },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    height: '100%',
    paddingBottom: 7,
  },
  orbFloatingWrapper: {
    position: 'absolute',
    top: -24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 34,
  },
});
