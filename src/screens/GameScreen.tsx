// ============================================================
// src/screens/GameScreen.tsx
// Main game screen — orchestrates all game modes
// ============================================================

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AnswerInput } from '../components/AnswerInput';
import { ChoiceButtons, TrueFalseButtons } from '../components/ChoiceButtons';
import { OperationCard } from '../components/OperationCard';
import { ProgressBar } from '../components/ProgressBar';
import { ResultModal } from '../components/ResultModal';
import { ScoreBoard } from '../components/ScoreBoard';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Timer } from '../components/Timer';
import { PrimaryButton } from '../components/PrimaryButton';
import { GAME_MODE_LABELS } from '../constants/game';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useGame } from '../hooks/useGame';
import { RoundAnswer, RootStackParamList } from '../types';
import { formatCountdown } from '../utils/formatters';
import { useStatistics } from '../hooks/useStatistics';
import { saveGameResult } from '../storage/storageService';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

type FeedbackType = 'correct' | 'incorrect' | 'timeout' | null;

export function GameScreen({ navigation, route }: Props) {
  const { config } = route.params;
  const {
    phase,
    currentOperation,
    currentIndex,
    operations,
    score,
    questionSecondsLeft,
    totalSecondsLeft,
    startGame,
    submitAnswer,
    result,
  } = useGame();

  const { recordResult } = useStatistics();

  // Feedback modal state
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackPoints, setFeedbackPoints] = useState(0);
  const [feedbackCorrectAnswer, setFeedbackCorrectAnswer] = useState(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTimeAttack = config.gameMode === 'timeAttack';
  const totalQuestions = isTimeAttack ? operations.length : config.iterations;

  // Start game on mount
  useEffect(() => {
    startGame(config);
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []); // eslint-disable-line

  // Navigate to results when game finishes
  useEffect(() => {
    if (phase === 'finished' && result) {
      // Persist result
      saveGameResult(result);
      recordResult(result);
      navigation.replace('Results', { result });
    }
  }, [phase, result, navigation, recordResult]);

  // Show feedback modal briefly after each answer
  const showFeedback = useCallback((answer: RoundAnswer) => {
    const type: FeedbackType = !answer.givenAnswer && answer.givenAnswer !== 0
      ? 'timeout'
      : answer.isCorrect
      ? 'correct'
      : 'incorrect';

    setFeedbackType(type);
    setFeedbackPoints(answer.pointsAwarded);
    setFeedbackCorrectAnswer(answer.correctAnswer);
    setFeedbackVisible(true);

    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackVisible(false);
    }, 700);
  }, []);

  const handleAnswer = useCallback(
    (value: number | boolean | null) => {
      submitAnswer(value);
    },
    [submitAnswer]
  );

  if (phase === 'idle' || !currentOperation) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const isTrueFalse = config.gameMode === 'trueFalse';
  const isMultipleChoice = config.gameMode === 'multipleChoice';
  const isClassic = config.gameMode === 'classic';

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.modeLabel}>{GAME_MODE_LABELS[config.gameMode]}</Text>
          {isTimeAttack && (
            <Text style={styles.totalTimer}>
              ⏱ {formatCountdown(totalSecondsLeft)}
            </Text>
          )}
        </View>
        <ScoreBoard score={score} compact />
      </View>

      {/* Progress */}
      <ProgressBar
        current={currentIndex}
        total={isTimeAttack ? currentIndex + 1 : config.iterations}
        showLabel={!isTimeAttack}
      />

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Timer
          secondsLeft={questionSecondsLeft}
          totalSeconds={config.timePerOperation}
          size="md"
        />
      </View>

      {/* Operation card */}
      <View style={styles.cardContainer}>
        <OperationCard
          operation={currentOperation}
          showDisplayedAnswer={isTrueFalse}
        />
      </View>

      {/* Answer input area */}
      <View style={styles.answerContainer}>
        {isClassic && (
          <AnswerInput
            onSubmit={(v) => handleAnswer(v)}
            disabled={feedbackVisible}
          />
        )}
        {isTrueFalse && (
          <TrueFalseButtons
            onSelect={(v) => handleAnswer(v)}
            disabled={feedbackVisible}
          />
        )}
        {isMultipleChoice && currentOperation.choices && (
          <ChoiceButtons
            choices={currentOperation.choices}
            onSelect={(v) => handleAnswer(v)}
            disabled={feedbackVisible}
          />
        )}
        {isTimeAttack && (
          <AnswerInput
            onSubmit={(v) => handleAnswer(v)}
            disabled={feedbackVisible}
          />
        )}
      </View>

      {/* Skip button */}
      <PrimaryButton
        label="Saltar"
        onPress={() => handleAnswer(null)}
        variant="ghost"
        fullWidth
        disabled={feedbackVisible}
        style={styles.skipButton}
      />

      {/* Feedback modal */}
      <ResultModal
        visible={feedbackVisible}
        type={feedbackType}
        points={feedbackPoints}
        correctAnswer={feedbackCorrectAnswer}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeLg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modeLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalTimer: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  timerContainer: {
    marginVertical: SPACING.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  answerContainer: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  skipButton: {
    marginBottom: SPACING.sm,
  },
});
