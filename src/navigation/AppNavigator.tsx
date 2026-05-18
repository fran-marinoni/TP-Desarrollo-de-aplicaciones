// ============================================================
// src/navigation/AppNavigator.tsx
// Root stack navigator with custom dark header styling
// ============================================================

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ConfigScreen } from '../screens/ConfigScreen';
import { GameScreen } from '../screens/GameScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.background, elevation: 0, shadowOpacity: 0 },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: {
    fontWeight: TYPOGRAPHY.fontWeightBold as any,
    fontSize: TYPOGRAPHY.fontSizeLg,
  },
  cardStyle: { backgroundColor: COLORS.background },
};

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Config"
          component={ConfigScreen}
          options={{ title: 'Nueva Partida' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            title: '',
            headerLeft: () => null, // prevent accidental back during game
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Resultados',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Historial' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
