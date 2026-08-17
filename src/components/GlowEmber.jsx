import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 260;
const CENTER = SIZE / 2;

/**
 * The "ember" — a soft radial glow with two concentric rings that
 * breathe in and out slowly, like the app is quietly waiting for you.
 * This is the visual anchor of the Landing screen.
 */
export default function GlowEmber() {
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [breathe]);

  const coreProps = useAnimatedProps(() => ({
    r: 46 + breathe.value * 6,
    opacity: 0.9 + breathe.value * 0.1,
  }));

  const ring1Props = useAnimatedProps(() => ({
    r: 78 + breathe.value * 10,
    opacity: 0.35 - breathe.value * 0.15,
  }));

  const ring2Props = useAnimatedProps(() => ({
    r: 110 + breathe.value * 14,
    opacity: 0.18 - breathe.value * 0.1,
  }));

  return (
    <Svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={styles.svg}
    >
      <Defs>
        <RadialGradient id="emberCore" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.amber} stopOpacity="1" />
          <Stop offset="100%" stopColor={colors.amberDim} stopOpacity="0.2" />
        </RadialGradient>
      </Defs>

      <AnimatedCircle
        cx={CENTER}
        cy={CENTER}
        animatedProps={ring2Props}
        stroke={colors.amber}
        strokeWidth={1}
        fill="none"
      />
      <AnimatedCircle
        cx={CENTER}
        cy={CENTER}
        animatedProps={ring1Props}
        stroke={colors.amber}
        strokeWidth={1}
        fill="none"
      />
      <AnimatedCircle
        cx={CENTER}
        cy={CENTER}
        animatedProps={coreProps}
        fill="url(#emberCore)"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: {
    alignSelf: 'center',
  },
});
