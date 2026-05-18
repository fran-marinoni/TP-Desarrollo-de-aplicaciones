// ============================================================
// src/components/StatCard.tsx
// Generic stat display card (used in Results and History)
// ============================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  accent?: boolean;
}

export const StatCard = React.memo(function StatCard({
  label,
  value,
  subValue,
  accent = false,
}: StatCardProps) {
  return (
    <View style={[styles.card, accent && styles.cardAccent, SHADOWS.sm]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent && styles.valueAccent]}>{value}</Text>
      {subValue ? <Text style={styles.subValue}>{subValue}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    minWidth: 100,
  },
  cardAccent: {
    borderColor: COLORS.primary,
    backgroundColor: '#1C1A30',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeXs,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginTop: SPACING.xs,
  },
  valueAccent: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize2xl,
  },
  subValue: {
    color: COLORS.textDisabled,
    fontSize: TYPOGRAPHY.fontSizeXs,
    marginTop: 2,
  },
});
