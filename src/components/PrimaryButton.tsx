// ============================================================
// src/components/PrimaryButton.tsx
// Reusable primary action button with press animation
// ============================================================

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const PrimaryButton = React.memo(function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  fullWidth = false,
}: PrimaryButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 200,
      friction: 6,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 6,
    }).start();
  }, [scaleAnim]);

  const bgColor =
    variant === 'primary'
      ? COLORS.primary
      : variant === 'secondary'
      ? COLORS.surfaceElevated
      : variant === 'danger'
      ? COLORS.error
      : COLORS.transparent;

  const borderColor =
    variant === 'ghost' ? COLORS.border : variant === 'secondary' ? COLORS.border : 'transparent';

  const textColor =
    variant === 'ghost' ? COLORS.textSecondary : COLORS.white;

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: bgColor, borderColor },
          variant === 'ghost' && styles.ghostBorder,
          disabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <Text style={[styles.label, { color: textColor }, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  ghostBorder: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    letterSpacing: 0.5,
  },
  labelDisabled: {
    color: COLORS.textDisabled,
  },
  fullWidth: {
    width: '100%',
  },
});
