import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';

interface SonarRadarProps {
  size?: number;
  color?: string;
}

export const SonarRadar: React.FC<SonarRadarProps> = ({
  size = 280,
  color = COLORS.primary,
}) => {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createPulse(pulse1, 0);
    const anim2 = createPulse(pulse2, 600);
    const anim3 = createPulse(pulse3, 1200);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const getRingStyle = (anim: Animated.Value) => {
    return {
      transform: [
        {
          scale: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
      opacity: anim.interpolate({
        inputRange: [0, 0.4, 0.9, 1],
        outputRange: [0.8, 0.5, 0.1, 0],
      }),
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: color },
          getRingStyle(pulse1),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: color },
          getRingStyle(pulse2),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: color },
          getRingStyle(pulse3),
        ]}
      />
      {/* Center Core Dot */}
      <View style={[styles.centerDot, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2.5,
    backgroundColor: 'rgba(14, 159, 110, 0.08)',
  },
  centerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
