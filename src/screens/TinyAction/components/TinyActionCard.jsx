import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export default function TinyActionCard({ task, onSwiped }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3; // subtle vertical drift only
    })
    .onEnd(event => {
      const shouldDismiss = Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (shouldDismiss) {
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withTiming(
          direction * width * 1.2,
          { duration: 280 },
          finished => {
            if (finished) runOnJS(onSwiped)();
          },
        );
      } else {
        // Didn't swipe far enough — spring back to center
        translateX.value = withSpring(0, { damping: 14 });
        translateY.value = withSpring(0, { damping: 14 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-18, 0, 18],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      translateX.value,
      [-width * 0.8, 0, width * 0.8],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.task}>{task}</Text>
        <Text style={styles.hint}>Swipe away when you're ready</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 56,
    paddingVertical: 56,
    paddingHorizontal: 32,
    borderRadius: 28,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  task: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
