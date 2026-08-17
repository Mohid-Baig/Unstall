import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../theme/colors';

/**
 * PLACEHOLDER — replaced when we build Screen 4 (Focus Session).
 */
export default function FocusSessionScreen({ route }) {
  const task = route?.params?.task ?? '(no task passed)';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>Focus Session — coming next</Text>
        <Text style={styles.task}>Task: {task}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: { color: colors.textPrimary, fontSize: 18 },
  task: { color: colors.textSecondary, fontSize: 14 },
});
