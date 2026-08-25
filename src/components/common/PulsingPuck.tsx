import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Navigation } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

interface PulsingPuckProps {
  label?: string;
}

export const PulsingPuck: React.FC<PulsingPuckProps> = ({ label = 'Pickup Point' }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 2.3,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Floating Pickup Point Pill Label */}
      <View style={styles.pillContainer}>
        <Text style={styles.pillText}>{label}</Text>
        <View style={styles.pillArrow} />
      </View>

      {/* Pulsing Outer Ring */}
      <View style={styles.puckWrapper}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim,
            },
          ]}
        />

        {/* Central Blue Puck with White Navigation Arrow */}
        <View style={styles.centerPuck}>
          <View style={styles.innerDot}>
            <Navigation size={14} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
  },
  pillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  pillArrow: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
  },
  puckWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryBlue,
  },
  centerPuck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  innerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
