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
import { LinearGradient } from 'expo-linear-gradient';
import {
  Navigation,
  Truck,
  Building2,
  User,
  Bot,
} from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

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

  // Pulsing glow animation for the center raised AI button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.75,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim]);

  // Tab active logic
  const isHomeActive =
    activeScreen === 'home' ||
    activeScreen === 'hospital_select' ||
    activeScreen === 'destination_search';

  const isAmbulanceActive =
    activeScreen === 'booking_history' ||
    activeScreen === 'live_tracking' ||
    activeScreen === 'searching_dispatch';

  const isAiActive = activeScreen === 'ai_assistant';
  const isHospitalActive = activeScreen === 'hospital_list';
  const isProfileActive = activeScreen === 'profile';

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {/* Bottom Bar Content */}
      <View style={styles.bar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onNavigate('home')}
          activeOpacity={0.7}
        >
          <Navigation
            size={22}
            color={isHomeActive ? COLORS.primary : COLORS.textMuted}
            style={{ transform: [{ rotate: '45deg' }] }}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: isHomeActive ? COLORS.primary : COLORS.textMuted },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Ambulance */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onNavigate('booking_history')}
          activeOpacity={0.7}
        >
          <Truck
            size={22}
            color={isAmbulanceActive ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: isAmbulanceActive ? COLORS.primary : COLORS.textMuted },
            ]}
          >
            Ambulance
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Center AI Help Placeholder Slot */}
        <TouchableOpacity
          style={styles.centerSlot}
          onPress={() => onNavigate('ai_assistant')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: isAiActive ? COLORS.primary : COLORS.textMuted,
              },
            ]}
          >
            AI Help
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Hospital */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onNavigate('hospital_list')}
          activeOpacity={0.7}
        >
          <Building2
            size={22}
            color={isHospitalActive ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: isHospitalActive ? COLORS.primary : COLORS.textMuted },
            ]}
          >
            Hospital
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onNavigate('profile')}
          activeOpacity={0.7}
        >
          <User
            size={22}
            color={isProfileActive ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: isProfileActive ? COLORS.primary : COLORS.textMuted },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Center Raised Circular AI Button */}
      <View style={styles.floatingCenterContainer} pointerEvents="box-none">
        {/* Pulsing Glow Ring */}
        <Animated.View
          style={[
            styles.aiGlow,
            {
              transform: [{ scale: pulseAnim }],
              opacity: glowAnim,
            },
          ]}
        />

        {/* Pulsing Raised AI Button */}
        <Animated.View
          style={[
            styles.aiFabWrapper,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.aiTouchable}
            activeOpacity={0.85}
            onPress={() => onNavigate('ai_assistant')}
          >
            <LinearGradient
              colors={['#FF6B6B', COLORS.alertRed, '#E65100']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiGradientCircle}
            >
              <Bot size={26} color="#FFFFFF" strokeWidth={2.2} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  bar: {
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    height: '100%',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  floatingCenterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiGlow: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(229, 57, 53, 0.35)',
  },
  aiFabWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: COLORS.alertRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  aiTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: COLORS.alertRed,
  },
  aiGradientCircle: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.alertRed,
  },
});
