// ============================================================
// src/constants/theme.ts
// Design system: colors, typography, spacing, shadows
// ============================================================

export const COLORS = {
  // Brand
  primary: '#6C63FF',
  primaryDark: '#4B44CC',
  primaryLight: '#9D97FF',
  accent: '#FF6584',
  accentLight: '#FF8FA3',

  // Semantic
  success: '#2ECC71',
  successLight: '#D5F5E3',
  error: '#E74C3C',
  errorLight: '#FADBD8',
  warning: '#F1C40F',
  warningLight: '#FEF9E7',
  info: '#3498DB',

  // Neutrals
  background: '#0F0E17',
  surface: '#1A1926',
  surfaceElevated: '#252336',
  border: '#2E2B47',

  // Text
  textPrimary: '#FFFFFE',
  textSecondary: '#A7A9BE',
  textDisabled: '#5A5878',
  textInverse: '#0F0E17',

  // Difficulty badges
  easy: '#2ECC71',
  medium: '#F1C40F',
  hard: '#E74C3C',

  // Timer bar states
  timerSafe: '#2ECC71',
  timerWarning: '#F1C40F',
  timerDanger: '#E74C3C',

  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const TYPOGRAPHY = {
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 18,
  fontSizeXl: 22,
  fontSize2xl: 28,
  fontSize3xl: 36,
  fontSize4xl: 48,

  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,

  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

export const ANIMATION = {
  durationFast: 150,
  durationNormal: 300,
  durationSlow: 500,
} as const;
