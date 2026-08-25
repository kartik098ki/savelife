// 🔮 Ethereal AI Glow Orb Component - Inspired by User's Reference Image
// Ethereal sky-blue to soft white luminous flowing cloud/plasma aura animation

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform, TouchableOpacity, Text } from 'react-native';

interface EtherealOrbProps {
  size?: number;
  glowColor?: string;
  pulsing?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const EtherealOrb: React.FC<EtherealOrbProps> = ({
  size = 56,
  glowColor = '#3B82F6',
  pulsing = true,
  children,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  // Inject web CSS keyframes for organic fluid cloud/orb rotation & breathing
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const cssId = 'ethereal-orb-keyframes';
      if (!document.getElementById(cssId)) {
        const style = document.createElement('style');
        style.id = cssId;
        style.innerHTML = `
          @keyframes ethereal-cloud-drift {
            0% {
              background-position: 0% 50%, 100% 50%;
              transform: rotate(0deg) scale(1);
            }
            50% {
              background-position: 100% 50%, 0% 50%;
              transform: rotate(180deg) scale(1.06);
            }
            100% {
              background-position: 0% 50%, 100% 50%;
              transform: rotate(360deg) scale(1);
            }
          }
          @keyframes ethereal-aura-glow {
            0%, 100% {
              box-shadow: 0 0 ${size * 0.4}px rgba(59, 130, 246, 0.45),
                          0 0 ${size * 0.8}px rgba(96, 165, 250, 0.3),
                          inset 0 0 ${size * 0.3}px rgba(255, 255, 255, 0.8);
            }
            50% {
              box-shadow: 0 0 ${size * 0.7}px rgba(59, 130, 246, 0.75),
                          0 0 ${size * 1.2}px rgba(147, 197, 253, 0.5),
                          inset 0 0 ${size * 0.4}px rgba(255, 255, 255, 0.95);
            }
          }
          @keyframes ethereal-wave-ripple {
            0% { transform: scale(0.92); opacity: 0.85; }
            50% { transform: scale(1.18); opacity: 0.35; }
            100% { transform: scale(1.35); opacity: 0; }
          }
          .ethereal-orb-surface {
            background: radial-gradient(circle at 50% 25%, #FFFFFF 0%, #BAE6FD 35%, #38BDF8 60%, #1D4ED8 100%);
            background-size: 200% 200%;
            animation: ethereal-cloud-drift 8s ease-in-out infinite, ethereal-aura-glow 3s ease-in-out infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [size]);

  useEffect(() => {
    if (pulsing) {
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 1600,
            useNativeDriver: true,
          }),
        ])
      );
      breathing.start();
      return () => breathing.stop();
    }
  }, [pulsing]);

  const orbContent = (
    <Animated.View
      style={[
        styles.outerWrapper,
        { width: size, height: size, transform: [{ scale: pulseAnim }] },
      ]}
    >
      {/* Outer Luminous Ring */}
      <View
        style={[
          styles.glowRing,
          {
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
            backgroundColor: 'rgba(56, 189, 248, 0.18)',
          },
        ]}
      />

      {/* Main Ethereal Orb Sphere Matching Uploaded Screenshot */}
      <View
        style={[
          styles.orbSphere,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          Platform.OS === 'web' ? ({ className: 'ethereal-orb-surface' } as any) : {
            backgroundColor: '#38BDF8',
          },
        ]}
      >
        {/* Luminous Core Light Reflex */}
        <View
          style={[
            styles.lightReflex,
            {
              width: size * 0.55,
              height: size * 0.35,
              borderRadius: size * 0.25,
            },
          ]}
        />

        {/* Children Icon / Content */}
        {children && <View style={styles.childrenWrapper}>{children}</View>}
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
        {orbContent}
      </TouchableOpacity>
    );
  }

  return orbContent;
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
  },
  orbSphere: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  lightReflex: {
    position: 'absolute',
    top: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    filter: 'blur(3px)' as any,
  },
  childrenWrapper: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
