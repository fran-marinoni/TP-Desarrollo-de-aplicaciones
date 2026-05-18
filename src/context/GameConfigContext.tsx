// ============================================================
// src/context/GameConfigContext.tsx
// Global game configuration state (persisted via AsyncStorage)
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants/game';
import { loadConfig, saveConfig } from '../storage/storageService';

interface GameConfigContextValue {
  config: GameConfig;
  updateConfig: (partial: Partial<GameConfig>) => Promise<void>;
  isLoading: boolean;
}

const GameConfigContext = createContext<GameConfigContextValue | null>(null);

export function GameConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted config on mount
  useEffect(() => {
    loadConfig().then((stored) => {
      setConfig(stored);
      setIsLoading(false);
    });
  }, []);

  const updateConfig = useCallback(async (partial: Partial<GameConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...partial };
      saveConfig(updated); // fire-and-forget persistence
      return updated;
    });
  }, []);

  return (
    <GameConfigContext.Provider value={{ config, updateConfig, isLoading }}>
      {children}
    </GameConfigContext.Provider>
  );
}

export function useGameConfig(): GameConfigContextValue {
  const ctx = useContext(GameConfigContext);
  if (!ctx) throw new Error('useGameConfig must be used within GameConfigProvider');
  return ctx;
}
