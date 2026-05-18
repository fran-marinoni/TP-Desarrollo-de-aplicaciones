// ============================================================
// src/screens/ResultsScreen.tsx
// Post-game statistics and actions
// ============================================================

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { StatCard } from '../components/StatCard';
import { GAME_MODE_LABELS } from '../constants/game';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useStatistics } from '../hooks/useStatistics';
import { RootStackParamList } from '../types';
import { formatAccuracy, formatTime } from '../utils/formatters';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

export function ResultsScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const { stats } = useStatistics();

  const isNewBest = result.score >= stats.bestScore && stats.totalGamesPlayed > 0;

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  return (
    <ScreenWrapper scrollable>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Score hero */}
        <Animated.View
          style={[styles.hero, SHADOWS.lg, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}
        >
          {isNewBest && <Text style={styles.newBest}>🏆 ¡Nuevo récord!</Text>}
          <Text style={styles.scoreLabel}>PUNTAJE FINAL</Text>
          <Text style={styles.score}>{result.score}</Text>
          <View style={styles.badgeRow}>
            <DifficultyBadge difficulty={result.difficulty} />
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>{GAME_MODE_LABELS[result.gameMode]}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Estadísticas de la partida</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Correctas" value={result.correctAnswers} accent />
            <StatCard label="Incorrectas" value={result.incorrectAnswers} />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              label="Precisión"
              value={formatAccuracy(result.accuracy)}
              accent={result.accuracy >= 80}
            />
            <StatCard
              label="Tiempo Prom."
              value={formatTime(result.averageResponseTimeMs)}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard label="Sin responder" value={result.unansweredQuestions} />
            <StatCard label="Mejor score hist." value={stats.bestScore} accent />
          </View>
        </Animated.View>

        {/* Answer breakdown */}
        <Animated.View style={[styles.breakdownSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Respuestas</Text>
          {result.answers.map((a, idx) => (
            <View
              key={a.operationId}
              style={[
                styles.answerRow,
                a.isCorrect ? styles.answerCorrect : styles.answerWrong,
              ]}
            >
              <Text style={styles.answerIndex}>{idx + 1}</Text>
              <Text style={styles.answerExpr}>{a.expression}</Text>
              <Text style={styles.answerCorrectVal}>= {a.correctAnswer}</Text>
              <Text
                style={[
                  styles.answerPoints,
                  { color: a.pointsAwarded >= 0 ? COLORS.success : COLORS.error },
                ]}
              >
                {a.pointsAwarded >= 0 ? `+${a.pointsAwarded}` : a.pointsAwarded}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            label="🎮  Jugar de nuevo"
            onPress={() => navigation.replace('Game', { config: {
              difficulty: result.difficulty,
              gameMode: result.gameMode,
              iterations: result.totalQuestions,
              timePerOperation: 15,
            }})}
            variant="primary"
            fullWidth
          />
          <PrimaryButton
            label="⚙️  Cambiar configuración"
            onPress={() => navigation.navigate('Config')}
            variant="secondary"
            fullWidth
          />
          <PrimaryButton
            label="🏠  Inicio"
            onPress={() => navigation.navigate('Home')}
            variant="ghost"
            fullWidth
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  hero: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  newBest: {
    color: COLORS.warning,
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeXs,
    letterSpacing: 2,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  score: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize4xl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  modeBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  modeBadgeText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  statsSection: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  breakdownSection: {
    gap: SPACING.sm,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
  },
  answerCorrect: {
    backgroundColor: '#0D2418',
    borderColor: COLORS.success + '40',
  },
  answerWrong: {
    backgroundColor: '#2A0D0D',
    borderColor: COLORS.error + '40',
  },
  answerIndex: {
    color: COLORS.textDisabled,
    fontSize: TYPOGRAPHY.fontSizeSm,
    width: 20,
    textAlign: 'center',
  },
  answerExpr: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    flex: 1,
  },
  answerCorrectVal: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
  },
  answerPoints: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    minWidth: 44,
    textAlign: 'right',
  },
  actions: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
});
