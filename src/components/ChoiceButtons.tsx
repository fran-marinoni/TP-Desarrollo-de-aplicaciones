// ============================================================
// src/components/ChoiceButtons.tsx
// Multiple choice and true/false answer buttons
// ============================================================

import React, { useCallback, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

// ── Multiple choice ───────────────────────────────────────────
interface ChoiceButtonsProps {
  choices: number[];
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export const ChoiceButtons = React.memo(function ChoiceButtons({
  choices,
  onSelect,
  disabled = false,
}: ChoiceButtonsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = useCallback(
    (value: number) => {
      if (disabled || selected !== null) return;
      setSelected(value);
      // Brief delay so user sees the selection before screen transitions
      setTimeout(() => {
        onSelect(value);
        setSelected(null);
      }, 150);
    },
    [disabled, selected, onSelect]
  );

  return (
    <View style={styles.grid}>
      {choices.map((choice, idx) => (
        <TouchableOpacity
          key={`${choice}_${idx}`}
          style={[
            styles.choiceButton,
            selected === choice && styles.choiceSelected,
            disabled && styles.choiceDisabled,
          ]}
          onPress={() => handleSelect(choice)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.choiceText,
              selected === choice && styles.choiceTextSelected,
            ]}
          >
            {choice}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

// ── True / False ───────────────────────────────────────────────
interface TrueFalseButtonsProps {
  onSelect: (value: boolean) => void;
  disabled?: boolean;
}

export const TrueFalseButtons = React.memo(function TrueFalseButtons({
  onSelect,
  disabled = false,
}: TrueFalseButtonsProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = useCallback(
    (value: boolean) => {
      if (disabled || selected !== null) return;
      setSelected(value);
      setTimeout(() => {
        onSelect(value);
        setSelected(null);
      }, 150);
    },
    [disabled, selected, onSelect]
  );

  return (
    <View style={styles.tfRow}>
      <TouchableOpacity
        style={[
          styles.tfButton,
          styles.tfTrue,
          selected === true && styles.tfSelected,
          disabled && styles.choiceDisabled,
        ]}
        onPress={() => handleSelect(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.tfText}>✓ Verdadero</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tfButton,
          styles.tfFalse,
          selected === false && styles.tfFalseSelected,
          disabled && styles.choiceDisabled,
        ]}
        onPress={() => handleSelect(false)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.tfText}>✗ Falso</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
    width: '100%',
  },
  choiceButton: {
    width: '46%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  choiceSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  choiceDisabled: {
    opacity: 0.5,
  },
  choiceText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  choiceTextSelected: {
    color: COLORS.white,
  },
  // True / False
  tfRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  tfButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 2,
    ...SHADOWS.sm,
  },
  tfTrue: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  tfFalse: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  tfSelected: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  tfFalseSelected: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  tfText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
