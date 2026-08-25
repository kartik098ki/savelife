import React from 'react';
import { StyleSheet, View, Platform, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useBookingStore } from './src/store/useBookingStore';
import { COLORS } from './src/constants/colors';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { HospitalSelectScreen } from './src/screens/HospitalSelectScreen';
import { DispatchSearchScreen } from './src/screens/DispatchSearchScreen';
import { LiveTrackingScreen } from './src/screens/LiveTrackingScreen';
import { AiAssistantScreen } from './src/screens/AiAssistantScreen';
import { HospitalListScreen } from './src/screens/HospitalListScreen';
import { BookingHistoryScreen } from './src/screens/BookingHistoryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { DestinationSearchScreen } from './src/screens/DestinationSearchScreen';

// Common Components
import { BottomNavBar } from './src/components/common/BottomNavBar';

export default function App() {
  const { currentScreen, setCurrentScreen } = useBookingStore();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'hospital_select':
        return <HospitalSelectScreen />;
      case 'searching_dispatch':
        return <DispatchSearchScreen />;
      case 'live_tracking':
        return <LiveTrackingScreen />;
      case 'ai_assistant':
        return <AiAssistantScreen />;
      case 'hospital_list':
        return <HospitalListScreen />;
      case 'booking_history':
        return <BookingHistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'destination_search':
        return <DestinationSearchScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'hospital_list' ||
    currentScreen === 'booking_history' ||
    currentScreen === 'profile' ||
    currentScreen === 'ai_assistant';

  return (
    <SafeAreaProvider>
      <View style={styles.outerContainer}>
        <View style={styles.appContainer}>
          <StatusBar style="dark" backgroundColor="transparent" translucent />

          {/* Active Screen Content */}
          <View style={styles.screenWrapper}>
            {renderCurrentScreen()}
          </View>

          {/* Global Bottom Navigation Bar */}
          {showBottomNav && (
            <BottomNavBar
              activeScreen={currentScreen}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  screenWrapper: {
    flex: 1,
    position: 'relative',
  },
});
