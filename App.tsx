// ============================================================
// App.tsx  (root entry point)
// Wraps navigation with all context providers
// ============================================================

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GameConfigProvider } from './src/context/GameConfigContext';
import { StatsProvider } from './src/context/StatsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GameConfigProvider>
      <StatsProvider>
        <StatusBar style="light" backgroundColor="#0F0E17" />
        <AppNavigator />
      </StatsProvider>
    </GameConfigProvider>
  );
}
