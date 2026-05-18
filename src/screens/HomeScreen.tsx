// ============================================================
// src/screens/HomeScreen.tsx
// Landing screen: best scores, navigation hub
// ============================================================

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatCard } from '../components/StatCard';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { useStatistics } from '../hooks/useStatistics';
import { RootStackParamList } from '../types';
import { formatAccuracy } from '../utils/formatters';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: Props) {
  const { stats, isLoading } = useStatistics();

  // Entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <ScreenWrapper scrollable contentStyle={styles.content}>
      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Title */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>⚡</Text>
          <Text style={styles.title}>Mental Calc</Text>
          <Text style={styles.subtitle}>Desafía tu mente con números</Text>
        </View>

        {/* Stats summary */}
        {!isLoading && stats.totalGamesPlayed > 0 && (
          <View style={styles.statsRow}>
            <StatCard
              label="Mejor Score"
              value={stats.bestScore}
              accent
            />
            <StatCard
              label="Precisión"
              value={formatAccuracy(stats.averageAccuracy)}
            />
            <StatCard
              label="Partidas"
              value={stats.totalGamesPlayed}
            />
          </View>
        )}

        {stats.totalGamesPlayed === 0 && !isLoading && (
          <View style={styles.emptyStats}>
            <Text style={styles.emptyText}>¡Jugá tu primera partida!</Text>
          </View>
        )}
      </Animated.View>

      {/* Action buttons */}
      <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
        <PrimaryButton
          label="🎮  Jugar"
          onPress={() => navigation.navigate('Config')}
          variant="primary"
          fullWidth
          style={styles.playButton}
        />
        <PrimaryButton
          label="📊  Historial"
          onPress={() => navigation.navigate('History')}
          variant="secondary"
          fullWidth
        />
        <PrimaryButton
          label="⚙️  Configuración"
          onPress={() => navigation.navigate('Config')}
          variant="ghost"
          fullWidth
        />
      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoIcon: {
    fontSize: 64,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize4xl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  emptyStats: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeMd,
  },
  buttons: {
    gap: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  playButton: {
    ...SHADOWS.lg,
  },
});
