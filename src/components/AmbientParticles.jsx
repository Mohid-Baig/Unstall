import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width, height } = Dimensions.get('window');

const PARTICLES = [
  { x: width * 0.22, delay: 0, size: 2 },
  { x: width * 0.78, delay: 900, size: 1.5 },
  { x: width * 0.35, delay: 1800, size: 2.5 },
  { x: width * 0.65, delay: 500, size: 1.5 },
  { x: width * 0.5, delay: 1300, size: 2 },
];

function Particle({ x, delay, size }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 5200, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, [progress, delay]);

  const animatedProps = useAnimatedProps(() => {
    const startY = height * 0.62;
    const endY = height * 0.18;
    return {
      cy: startY + (endY - startY) * progress.value,
      opacity:
        progress.value < 0.15
          ? progress.value / 0.15
          : progress.value > 0.7
          ? (1 - progress.value) / 0.3
          : 1,
    };
  });

  return (
    <AnimatedCircle
      cx={x}
      r={size}
      fill={colors.amber}
      animatedProps={animatedProps}
    />
  );
}

/**
 * A handful of faint embers drifting slowly upward. Purpose: make the
 * dark space feel inhabited and alive rather than empty, without
 * introducing any new UI element competing for attention.
 */
export default function AmbientParticles() {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </Svg>
  );
}
