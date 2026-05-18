// ============================================================
// src/components/ResultModal.tsx
// Feedback modal shown after each answer (correct/wrong)
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

type FeedbackType = 'correct' | 'incorrect' | 'timeout' | null;

interface ResultModalProps {
  visible: boolean;
  type: FeedbackType;
  points: number;
  correctAnswer: number;
}

export const ResultModal = React.memo(function ResultModal({
  visible,
  type,
  points,
  correctAnswer,
}: ResultModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.6);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 160,
          friction: 6,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible || !type) return null;

  const config = {
    correct: {
      emoji: '✓',
      label: '¡Correcto!',
      color: COLORS.success,
      bg: COLORS.successLight,
    },
    incorrect: {
      emoji: '✗',
      label: 'Incorrecto',
      color: COLORS.error,
      bg: COLORS.errorLight,
    },
    timeout: {
      emoji: '⏱',
      label: 'Tiempo!',
      color: COLORS.warning,
      bg: COLORS.warningLight,
    },
  }[type];

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            SHADOWS.lg,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
            <Text style={[styles.emoji, { color: config.color }]}>
              {config.emoji}
            </Text>
          </View>
          <Text style={[styles.label, { color: config.color }]}>
            {config.label}
          </Text>
          {type !== 'correct' && (
            <Text style={styles.correctText}>
              Respuesta: <Text style={styles.correctValue}>{correctAnswer}</Text>
            </Text>
          )}
          <Text
            style={[
              styles.points,
              { color: points >= 0 ? COLORS.success : COLORS.error },
            ]}
          >
            {points >= 0 ? `+${points}` : points} pts
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 200,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  correctText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeMd,
  },
  correctValue: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  points: {
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
  },
});
