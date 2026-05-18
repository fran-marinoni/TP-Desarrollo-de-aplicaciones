// ============================================================
// src/components/DifficultyBadge.tsx
// Colored pill badge for difficulty level
// ============================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../constants/game';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

const BADGE_COLORS: Record<Difficulty, { bg: string; text: string }> = {
  easy: { bg: '#1A3D2B', text: COLORS.easy },
  medium: { bg: '#3D3210', text: COLORS.medium },
  hard: { bg: '#3D1A1A', text: COLORS.hard },
};

export const DifficultyBadge = React.memo(function DifficultyBadge({
  difficulty,
  size = 'md',
}: DifficultyBadgeProps) {
  const { bg, text } = BADGE_COLORS[difficulty];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: text },
          size === 'sm' && styles.textSm,
        ]}
      >
        {DIFFICULTY_LABELS[difficulty]}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  textSm: {
    fontSize: TYPOGRAPHY.fontSizeXs,
  },
});
