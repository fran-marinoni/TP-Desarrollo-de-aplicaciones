// ============================================================
// src/components/Timer.tsx
// Visual countdown timer bar + digit display
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
  size?: 'sm' | 'md' | 'lg';
}

export const Timer = React.memo(function Timer({
  secondsLeft,
  totalSeconds,
  size = 'md',
}: TimerProps) {
  const progress = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const ratio = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: ratio,
      duration: 800,
      useNativeDriver: false,
    }).start();

    Animated.timing(colorAnim, {
      toValue: ratio < 0.25 ? 2 : ratio < 0.5 ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [ratio, progress, colorAnim]);

  const barColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [COLORS.timerSafe, COLORS.timerWarning, COLORS.timerDanger],
  });

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const fontSize =
    size === 'sm'
      ? TYPOGRAPHY.fontSizeLg
      : size === 'lg'
      ? TYPOGRAPHY.fontSize3xl
      : TYPOGRAPHY.fontSize2xl;

  const isUrgent = ratio < 0.25;

  return (
    <View style={styles.container}>
      <Text style={[styles.digit, { fontSize }, isUrgent && styles.urgentText]}>
        {Math.max(0, secondsLeft)}
      </Text>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: barWidth, backgroundColor: barColor }]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  digit: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  urgentText: {
    color: COLORS.timerDanger,
  },
  track: {
    width: '100%',
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});
