// 📱 Bottom Navigation Bar - Global 5-Tab Navigation with Ethereal AI Glowing Orb
// 1. Ride (Home Map) | 2. Ambulance (Track/History) | 3. AI Help (Ethereal Orb) | 4. Hospital (Directory) | 5. Profile

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Navigation,
  Truck,
  Building2,
  User,
  Sparkles,
  Bot,
} from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { EtherealOrb } from './EtherealOrb';

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

  const isTabActive = (tabKey: ScreenType) => {
    if (tabKey === 'home') {
      return activeScreen === 'home' || activeScreen === 'hospital_select' || activeScreen === 'destination_search';
    }
    if (tabKey === 'booking_history') {
      return activeScreen === 'booking_history' || activeScreen === 'live_tracking' || activeScreen === 'searching_dispatch';
    }
    return activeScreen === tabKey;
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {/* 🧭 Tab 1: Ride / Home Map */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('home')}
        activeOpacity={0.7}
      >
        <Navigation
          size={22}
          color={isTabActive('home') ? COLORS.primary : COLORS.textMuted}
          style={{ transform: [{ rotate: '45deg' }] }}
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

      {/* 🚑 Tab 2: Track Ambulance / Medical History */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('booking_history')}
        activeOpacity={0.7}
      >
        <Truck
          size={22}
          color={isTabActive('booking_history') ? COLORS.primary : COLORS.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isTabActive('booking_history') ? COLORS.primary : COLORS.textMuted },
          ]}
        >
          Ambulance
        </Text>
      </TouchableOpacity>

      {/* 🔮 Tab 3: Raised Ethereal AI Orb Center Button (Inspired by Reference Screenshot) */}
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
        style={styles.tabItem}
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
        style={styles.tabItem}
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
    backgroundColor: '#FFFFFF',
    height: 68,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    zIndex: 50,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
  },
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
    paddingBottom: 6,
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
    color: '#0284C7',
    marginTop: 34,
  },
});
