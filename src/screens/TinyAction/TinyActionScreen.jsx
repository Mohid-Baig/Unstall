import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import TinyActionCard from './components/TinyActionCard';
import { getRandomTinyAction } from '../../constants/tinyActions';
import { colors } from '../../theme/colors';

export default function TinyActionScreen({ navigation }) {
  // Picked once per visit via lazy initializer, not re-rolled on
  // re-render — the whole point is ONE task, never a shifting target.
  const [task] = useState(getRandomTinyAction);

  const handleSwiped = () => {
    navigation.replace('FocusSession', { task });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Just this one thing.</Text>

        <TinyActionCard task={task} onSwiped={handleSwiped} />
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
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 28,
  },
  eyebrow: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
