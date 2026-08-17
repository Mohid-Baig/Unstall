import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Vibration } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useFlipDetection } from '../../hooks/useFlipDetection';
import BreathingCircle from './components/BreathingCircle';
import FlipHint from './components/FlipHint';
import { colors } from '../../theme/colors';

// How long the breathing moment lasts once the phone is confirmed
// face-down, before we ask the user to flip back. Matches the plan's
// "2-3 seconds" spec.
const RITUAL_DURATION_MS = 2600;

// The two vibrations need to feel *different* from each other, not
// just happen twice — the user can't see the screen while face-down,
// so touch is the only channel. A single long buzz reads as "the
// ritual has begun." A quick double-pulse reads as "it's done, flip
// back" without needing to consciously count vibrations.
const DEEP_VIBRATION_MS = 500;
const COMPLETE_PATTERN_MS = [0, 120, 100, 120];

// Phases, in order:
// 'await-down'  -> "Flip me over."      (waiting for face-down)
// 'in-ritual'    -> almost-black screen, haptic, breathing circle
// 'await-up'     -> "Flip me back."      (waiting for face-up)
// 'complete'     -> hand off to navigation

export default function ResetRitualScreen({ navigation }) {
  const orientation = useFlipDetection();
  const [phase, setPhase] = useState('await-down');
  const timerRef = useRef(null);

  const dimOpacity = useSharedValue(0);

  useEffect(() => {
    if (phase === 'await-down' && orientation === 'down') {
      setPhase('in-ritual');
    }
  }, [phase, orientation]);

  useEffect(() => {
    if (phase === 'await-up' && orientation === 'up') {
      setPhase('complete');
    }
  }, [phase, orientation]);

  useEffect(() => {
    if (phase !== 'in-ritual') return undefined;

    dimOpacity.value = withTiming(1, { duration: 400 });
    Vibration.vibrate(DEEP_VIBRATION_MS);

    timerRef.current = setTimeout(() => {
      Vibration.vibrate(COMPLETE_PATTERN_MS);
      setPhase('await-up');
    }, RITUAL_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, dimOpacity]);

  useEffect(() => {
    if (phase === 'await-up') {
      dimOpacity.value = withTiming(0.55, { duration: 400 });
    }
  }, [phase, dimOpacity]);

  useEffect(() => {
    if (phase === 'complete') {
      navigation.replace('TinyAction');
    }
  }, [phase, navigation]);

  const dimStyle = useAnimatedStyle(() => ({
    opacity: dimOpacity.value,
  }));

  const isAwaiting = phase === 'await-down' || phase === 'await-up';
  const promptText = phase === 'await-down' ? 'Flip me over.' : 'Flip me back.';
  const helperText =
    phase === 'await-down'
      ? 'Set it face down. You\u2019ll feel two short buzzes \u2014 flip back after the second one.'
      : 'Nice. Flip it back over to continue.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[styles.dimOverlay, dimStyle]}
        pointerEvents="none"
      />

      <View style={styles.container}>
        {phase === 'in-ritual' ? (
          <BreathingCircle active />
        ) : (
          isAwaiting && (
            <View style={styles.promptBlock}>
              <FlipHint />
              <Text style={styles.prompt}>{promptText}</Text>
              <Text style={styles.helper}>{helperText}</Text>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBlock: {
    alignItems: 'center',
    gap: 20,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  helper: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
