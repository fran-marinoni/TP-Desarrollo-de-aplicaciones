// ============================================================
// src/components/ScreenWrapper.tsx
// Safe area + background wrapper shared by all screens
// ============================================================

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function ScreenWrapper({
  children,
  scrollable = false,
  style,
  contentStyle,
}: ScreenWrapperProps) {
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
});
