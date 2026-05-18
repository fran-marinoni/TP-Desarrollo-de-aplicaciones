// ============================================================
// src/components/ProgressBar.tsx
// Round progress indicator
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export const ProgressBar = React.memo(function ProgressBar({
  current,
  total,
  showLabel = true,
}: ProgressBarProps) {
  const width = useRef(new Animated.Value(0)).current;
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;

  useEffect(() => {
    Animated.timing(width, {
      toValue: ratio,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [ratio, width]);

  const barWidth = width.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          {current} / {total}
        </Text>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: barWidth }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    textAlign: 'right',
  },
  track: {
    width: '100%',
    height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
});
