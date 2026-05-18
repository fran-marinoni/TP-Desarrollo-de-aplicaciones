// ============================================================
// src/screens/HistoryScreen.tsx
// List of all past game sessions
// ============================================================

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GAME_MODE_LABELS } from '../constants/game';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { GameResult, RootStackParamList } from '../types';
import { formatAccuracy, formatDate } from '../utils/formatters';
import { clearHistory, loadHistory } from '../storage/storageService';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'History'>;
};

export function HistoryScreen({ navigation }: Props) {
  const [history, setHistory] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const data = await loadHistory();
    setHistory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Borrar historial',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: GameResult }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardMeta}>
          <DifficultyBadge difficulty={item.difficulty} size="sm" />
          <View style={styles.modePill}>
            <Text style={styles.modeText}>{GAME_MODE_LABELS[item.gameMode]}</Text>
          </View>
        </View>
        <Text style={styles.score}>{item.score}</Text>
      </View>

      <View style={styles.cardStats}>
        <MetaStat label="Precisión" value={formatAccuracy(item.accuracy)} />
        <MetaStat label="Correctas" value={`${item.correctAnswers}/${item.totalQuestions}`} />
        <MetaStat label="Fecha" value={formatDate(item.date)} />
      </View>
    </View>
  ), []);

  return (
    <ScreenWrapper style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Historial</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearButton}>Borrar todo</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Sin partidas registradas</Text>
          <Text style={styles.emptySubtext}>
            Juega tu primera partida para verla aquí.
          </Text>
          <PrimaryButton
            label="Ir a jugar"
            onPress={() => navigation.navigate('Config')}
            variant="primary"
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchHistory}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </ScreenWrapper>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaStat}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize2xl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
  },
  clearButton: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  list: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  separator: {
    height: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  modePill: {
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  modeText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeXs,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  score: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightExtraBold,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaStat: {
    gap: 2,
  },
  metaLabel: {
    color: COLORS.textDisabled,
    fontSize: TYPOGRAPHY.fontSizeXs,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  metaValue: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeMd,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: SPACING.sm,
  },
});
