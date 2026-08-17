import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width - 56, 320);
const VB = 320;
const CENTER = VB / 2;
const BASE_R = 100; // bigger curve
const POINTS = 10; // fewer points = smoother/cheaper, more = more detail

// Highlight completes exactly this many full rotations per loop.
// MUST be a whole number — a fractional value (e.g. 1.4) means the
// angle doesn't land back on a multiple of 2π when t resets from 1
// to 0, which is what caused the visible "snap" every loop.
const ORBITS_PER_LOOP = 2;

// Radius at a given angle + time — three overlapping sine harmonics
// with different frequencies/speeds so the blob never repeats a
// visible "pulse," it just keeps organically drifting.
function blobRadius(angle, t) {
  'worklet';
  const w1 = Math.sin(angle * 2 + t * Math.PI * 2) * 12;
  const w2 = Math.sin(angle * 3 - t * Math.PI * 2 * 1.6) * 7;
  const w3 = Math.sin(angle * 5 + t * Math.PI * 2 * 0.6) * 5;
  return BASE_R + w1 + w2 + w3;
}

// Catmull-Rom -> smooth cubic bezier path through N points on the blob edge
function buildBlobPath(t) {
  'worklet';
  const pts = [];
  for (let i = 0; i < POINTS; i++) {
    const angle = (i / POINTS) * Math.PI * 2;
    const r = blobRadius(angle, t);
    pts.push({
      x: CENTER + Math.cos(angle) * r,
      y: CENTER + Math.sin(angle) * r,
    });
  }

  let d = `M ${pts[0].x} ${pts[0].y} `;
  for (let i = 0; i < POINTS; i++) {
    const p0 = pts[(i - 1 + POINTS) % POINTS];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % POINTS];
    const p3 = pts[(i + 2) % POINTS];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y} `;
  }
  return d + 'Z';
}

function GlowOrbSvg() {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [t]);

  const blobProps = useAnimatedProps(() => ({
    d: buildBlobPath(t.value),
  }));

  // The highlight orbits by reading the SAME radius function at its
  // own angle, scaled down so it always sits well inside the blob's
  // current edge instead of poking outside it.
  const highlightProps = useAnimatedProps(() => {
    const angle = t.value * Math.PI * 2 * ORBITS_PER_LOOP;
    const r = blobRadius(angle, t.value) * 0.45;
    return {
      cx: CENTER + Math.cos(angle) * r,
      cy: CENTER + Math.sin(angle) * r,
    };
  });

  return (
    <Svg
      width={CARD_SIZE * 0.85}
      height={CARD_SIZE * 0.85}
      viewBox={`0 0 ${VB} ${VB}`}
    >
      <Defs>
        {/* Soft fill for the blob body itself — low opacity, no hard edge */}
        <RadialGradient id="blobFill" cx="50%" cy="50%" r="60%">
          <Stop offset="0%" stopColor={colors.amber} stopOpacity="0.28" />
          <Stop offset="100%" stopColor={colors.amber} stopOpacity="0.06" />
        </RadialGradient>
        {/* True glow for the orbiting highlight — fades to fully transparent */}
        <RadialGradient id="highlightGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.amber} stopOpacity="0.9" />
          <Stop offset="40%" stopColor={colors.amber} stopOpacity="0.35" />
          <Stop offset="100%" stopColor={colors.amber} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <AnimatedPath animatedProps={blobProps} fill="url(#blobFill)" />
      <AnimatedCircle
        r={32}
        fill="url(#highlightGlow)"
        animatedProps={highlightProps}
      />
    </Svg>
  );
}

export default function HeroCard() {
  return (
    <View style={styles.card}>
      <GlowOrbSvg />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
