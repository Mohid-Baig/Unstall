import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import HeroCard from '../../components/HeroCard';
import AmbientParticles from '../../components/AmbientParticles';
import GlowButton from './components/GlowButton';
import { colors } from '../../theme/colors';

/**
 * Fades + rises a child in on mount, with an optional stagger delay.
 * Kept local to this screen since Landing's entrance choreography is
 * a one-time "first impression" moment, not a pattern reused elsewhere.
 */
function useEntrance(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, opacity, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export default function LandingScreen({ navigation }) {
  const wordmarkStyle = useEntrance(0);
  const cardStyle = useEntrance(200);
  const headlineStyle = useEntrance(450);
  const buttonStyle = useEntrance(650);
  const footerStyle = useEntrance(800);

  const handleStart = () => {
    navigation.navigate('ResetRitual');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Subtle edge darkening so the screen reads as one composed
          image rather than "glow" sitting on top of "flat background." */}
      <LinearGradient
        colors={['#000000', 'transparent', 'transparent', '#000000']}
        locations={[0, 0.18, 0.82, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <AmbientParticles />

      <View style={styles.container}>
        <Animated.View style={[styles.wordmarkBlock, wordmarkStyle]}>
          <Text style={styles.wordmark}>unstall</Text>
          <Text style={styles.tagline}>RESET TO START.</Text>
        </Animated.View>

        <Animated.View style={cardStyle}>
          <HeroCard />
        </Animated.View>

        <Animated.View style={[styles.headlineBlock, headlineStyle]}>
          <Text style={styles.headline}>You're not behind.</Text>
          <Text style={styles.subtext}>Just take the first step.</Text>
        </Animated.View>

        <View style={styles.bottom}>
          <Animated.View style={buttonStyle}>
            <GlowButton label="Begin" onPress={handleStart} />
          </Animated.View>

          <Animated.Text style={[styles.footer, footerStyle]}>
            Flip your phone when you're ready.
          </Animated.Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
  },
  wordmarkBlock: {
    alignItems: 'center',
    gap: 6,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 2,
  },
  headlineBlock: {
    alignItems: 'center',
    gap: 8,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottom: {
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
