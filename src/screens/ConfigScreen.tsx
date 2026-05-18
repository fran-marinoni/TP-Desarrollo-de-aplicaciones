// ============================================================
// src/screens/ConfigScreen.tsx
// Game configuration: difficulty, iterations, time, mode
// ============================================================

import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  DIFFICULTY_LABELS,
  GAME_MODE_DESCRIPTIONS,
  GAME_MODE_LABELS,
  ITERATIONS_OPTIONS,
  TIME_BY_DIFFICULTY,
} from '../constants/game';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useGameConfig } from '../context/GameConfigContext';
import { Difficulty, GameMode, RootStackParamList } from '../types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Config'>;
};

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const GAME_MODES: GameMode[] = ['classic', 'trueFalse', 'multipleChoice', 'timeAttack'];

export function ConfigScreen({ navigation }: Props) {
  const { config, updateConfig } = useGameConfig();

  function handleStartGame() {
    navigation.navigate('Game', { config });
  }

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <Text style={styles.title}>Configuración</Text>
      <Text style={styles.subtitle}>Personaliza tu partida</Text>

      {/* Difficulty */}
      <Section label="Dificultad">
        <View style={styles.row}>
          {DIFFICULTIES.map((d) => (
            <OptionChip
              key={d}
              label={DIFFICULTY_LABELS[d]}
              selected={config.difficulty === d}
              color={
                d === 'easy'
                  ? COLORS.easy
                  : d === 'medium'
                  ? COLORS.medium
                  : COLORS.hard
              }
              onPress={() => {
                updateConfig({
                  difficulty: d,
                  timePerOperation: TIME_BY_DIFFICULTY[d],
                });
              }}
            />
          ))}
        </View>
      </Section>

      {/* Game mode */}
      <Section label="Modo de juego">
        <View style={styles.modeGrid}>
          {GAME_MODES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeCard, config.gameMode === m && styles.modeCardSelected]}
              onPress={() => updateConfig({ gameMode: m })}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeLabel, config.gameMode === m && styles.modeLabelSelected]}>
                {GAME_MODE_LABELS[m]}
              </Text>
              <Text style={styles.modeDesc}>{GAME_MODE_DESCRIPTIONS[m]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      {/* Iterations */}
      <Section label={`Preguntas por ronda  ·  ${config.iterations}`}>
        <View style={styles.row}>
          {ITERATIONS_OPTIONS.map((n) => (
            <OptionChip
              key={n}
              label={String(n)}
              selected={config.iterations === n}
              onPress={() => updateConfig({ iterations: n })}
            />
          ))}
        </View>
      </Section>

      {/* Time per operation */}
      <Section label={`Tiempo por pregunta  ·  ${config.timePerOperation}s`}>
        <View style={styles.row}>
          {[5, 8, 10, 15, 20, 30].map((t) => (
            <OptionChip
              key={t}
              label={`${t}s`}
              selected={config.timePerOperation === t}
              onPress={() => updateConfig({ timePerOperation: t })}
            />
          ))}
        </View>
      </Section>

      {/* Start */}
      <PrimaryButton
        label="Comenzar partida →"
        onPress={handleStartGame}
        fullWidth
        style={styles.startButton}
      />
    </ScreenWrapper>
  );
}

// ── Internal sub-components ───────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

interface OptionChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}

function OptionChip({ label, selected, onPress, color }: OptionChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && {
          backgroundColor: color ?? COLORS.primary,
          borderColor: color ?? COLORS.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize2xl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeMd,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  modeGrid: {
    gap: SPACING.sm,
  },
  modeCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  modeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#1C1A30',
  },
  modeLabel: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  modeLabelSelected: {
    color: COLORS.primary,
  },
  modeDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    marginTop: 2,
  },
  startButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
});
