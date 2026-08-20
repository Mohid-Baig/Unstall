import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import TimerRing from './components/TimerRing';
import { FOCUS_DURATION_SECONDS } from '../../constants/focusSession';
import { colors } from '../../theme/colors';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function FocusSessionScreen({ route, navigation }) {
  const task = route?.params?.task ?? 'Focus';

  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPaused) return undefined;

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          navigation.replace('Completion', { task });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  const handleTogglePause = () => setIsPaused(prev => !prev);

  const handleFinish = () => {
    clearInterval(intervalRef.current);
    navigation.replace('Completion', { task });
  };

  const progress = 1 - secondsLeft / FOCUS_DURATION_SECONDS;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.taskLabel}>{task}</Text>

        <TimerRing progress={progress}>
          <Text style={styles.time}>{formatTime(secondsLeft)}</Text>
        </TimerRing>

        <View style={styles.controls}>
          <Pressable onPress={handleTogglePause} style={styles.secondaryButton}>
            <Text style={styles.secondaryLabel}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </Pressable>

          <Pressable onPress={handleFinish} style={styles.primaryButton}>
            <Text style={styles.primaryLabel}>Finish</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    paddingHorizontal: 28,
  },
  taskLabel: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  time: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  secondaryLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: colors.amber,
  },
  primaryLabel: {
    color: '#241505',
    fontSize: 15,
    fontWeight: '700',
  },
});
