import React, { useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function GlowButton({ label, onPress }) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.35);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (pressed) return undefined;
    glow.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    return undefined;
  }, [pressed, glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  const handlePressIn = () => {
    setPressed(true);
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    scale.value = withTiming(0.97, { duration: 120 });
    glow.value = withTiming(0.9, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 180 });
    glow.value = withTiming(0.35, { duration: 180 });
    setPressed(false);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.row}>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
    shadowColor: colors.amber,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrow: {
    color: '#241505',
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: '#241505',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
