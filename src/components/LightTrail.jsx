import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const AnimatedLine = Animated.createAnimatedComponent(Line);

/**
 * A thin, softly pulsing light beam that threads down the screen.
 * Purpose: give the eye a path from the ember (the "stuck" feeling)
 * down to the button (the "start" action) — two static objects
 * become one continuous line of energy instead of empty space.
 */
export default function LightTrail({ height = 140 }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: 0.25 + pulse.value * 0.35,
  }));

  return (
    <Svg width={2} height={height} style={styles.svg}>
      <Defs>
        <LinearGradient id="trailFade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.amber} stopOpacity="0.8" />
          <Stop offset="1" stopColor={colors.amber} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <AnimatedLine
        x1="1"
        y1="0"
        x2="1"
        y2={height}
        stroke="url(#trailFade)"
        strokeWidth={2}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: {
    alignSelf: 'center',
  },
});
