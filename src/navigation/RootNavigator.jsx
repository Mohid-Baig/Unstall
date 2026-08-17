import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../screens/Landing/LandingScreen';
import ResetRitualScreen from '../screens/ResetRitual/ResetRitualScreen';
import TinyActionScreen from '../screens/TinyAction/TinyActionScreen';
import FocusSessionScreen from '../screens/FocusSession/FocusSessionScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

// Extend React Navigation's built-in DarkTheme instead of building the
// theme object from scratch — this guarantees the required `fonts` key
// (regular/medium/bold/heavy) is always present, which newer versions
// of React Navigation require internally.
const navTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.glassBorder,
    notification: colors.accent,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="ResetRitual" component={ResetRitualScreen} />
        <Stack.Screen name="TinyAction" component={TinyActionScreen} />
        <Stack.Screen name="FocusSession" component={FocusSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
