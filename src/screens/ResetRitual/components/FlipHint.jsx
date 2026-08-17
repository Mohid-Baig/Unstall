import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

/**
 * A small rectangle that slowly tips over on its X-axis, pausing at
 * each end — a visual demonstration of "flip the phone," so the
 * action is understood even before reading the instruction text.
 */
export default function FlipHint() {
  const rotateX = useSharedValue(0);

  useEffect(() => {
    rotateX.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withDelay(500, withTiming(180, { duration: 0 })),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withDelay(500, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [rotateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateX: `${rotateX.value}deg` }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.phone, animatedStyle]}>
        <View style={styles.notch} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 60,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 44,
    height: 84,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.amber,
    alignItems: 'center',
    paddingTop: 6,
  },
  notch: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.amber,
    opacity: 0.6,
  },
});
