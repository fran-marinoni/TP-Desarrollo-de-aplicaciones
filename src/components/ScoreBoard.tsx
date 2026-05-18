// ============================================================
// src/components/ScoreBoard.tsx
// Animated score counter display
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface ScoreBoardProps {
  score: number;
  label?: string;
  compact?: boolean;
}

export const ScoreBoard = React.memo(function ScoreBoard({
  score,
  label = 'PUNTAJE',
  compact = false,
}: ScoreBoardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevScore = useRef(score);

  useEffect(() => {
    if (prevScore.current !== score) {
      prevScore.current = score;
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 8,
        }),
      ]).start();
    }
  }, [score, scaleAnim]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLabel}>{label}</Text>
        <Animated.Text
          style={[styles.compactScore, { transform: [{ scale: scaleAnim }] }]}
        >
          {score}
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, SHADOWS.md]}>
      <Text style={styles.label}>{label}</Text>
      <Animated.Text
        style={[styles.score, { transform: [{ scale: scaleAnim }] }]}
      >
        {score}
      </Animated.Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeXs,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    letterSpacing: 1.5,
  },
  score: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize3xl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  compactLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeXs,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    letterSpacing: 1,
  },
  compactScore: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
