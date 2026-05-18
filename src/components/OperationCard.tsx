// ============================================================
// src/components/OperationCard.tsx
// The main card that displays a math operation
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Operation } from '../types';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface OperationCardProps {
  operation: Operation;
  /** For trueFalse mode, shows the claimed answer */
  showDisplayedAnswer?: boolean;
}

export const OperationCard = React.memo(function OperationCard({
  operation,
  showDisplayedAnswer = false,
}: OperationCardProps) {
  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animate in when operation changes
  useEffect(() => {
    slideAnim.setValue(60);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [operation.id, slideAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        SHADOWS.lg,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.expression}>{operation.expression}</Text>
      {showDisplayedAnswer && operation.displayedAnswer !== undefined && (
        <View style={styles.answerRow}>
          <Text style={styles.equals}>=</Text>
          <Text style={styles.displayedAnswer}>{operation.displayedAnswer}</Text>
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 260,
  },
  expression: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize4xl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
    textAlign: 'center',
    letterSpacing: 2,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  equals: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize2xl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  displayedAnswer: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.fontSize2xl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
