// ============================================================
// src/components/AnswerInput.tsx
// Numeric keyboard + submit for classic mode
// ============================================================

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface AnswerInputProps {
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export const AnswerInput = React.memo(function AnswerInput({
  onSubmit,
  disabled = false,
}: AnswerInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onSubmit(num);
      setValue('');
    }
  }, [value, onSubmit]);

  const handleChange = useCallback((text: string) => {
    // Allow optional leading minus, then digits only
    if (/^-?\d{0,6}$/.test(text)) {
      setValue(text);
    }
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        keyboardType="numbers-and-punctuation"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        placeholder="Respuesta"
        placeholderTextColor={COLORS.textDisabled}
        editable={!disabled}
        maxLength={7}
        selectionColor={COLORS.primary}
      />
      <TouchableOpacity
        style={[styles.button, (!value || disabled) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!value || disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
