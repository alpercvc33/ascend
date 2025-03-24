// src/theme/colors.js
export const COLORS = {
  // Ana Renkler
  primary: {
    DEFAULT: '#1A2B3C',
    light: '#2A3B4C',
    dark: '#0A1B2C',
    contrast: '#FFFFFF',
  },
  secondary: {
    DEFAULT: '#F2D06B',
    light: '#F7E4A3',
    dark: '#C7A543',
    contrast: '#1A2B3C',
  },

  // Nötr Renkler
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Durum Renkleri
  status: {
    success: {
      DEFAULT: '#22C55E',
      light: '#86EFAC',
      dark: '#15803D',
      contrast: '#FFFFFF',
    },
    warning: {
      DEFAULT: '#F59E0B',
      light: '#FCD34D',
      dark: '#B45309',
      contrast: '#FFFFFF',
    },
    error: {
      DEFAULT: '#EF4444',
      light: '#FCA5A5',
      dark: '#B91C1C',
      contrast: '#FFFFFF',
    },
    info: {
      DEFAULT: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
      contrast: '#FFFFFF',
    },
  },

  // Fonksiyonel Renkler
  functional: {
    link: '#3B82F6',
    border: '#E2E8F0',
    divider: '#E2E8F0',
    disable: '#94A3B8',
    placeholder: '#94A3B8',
  },

  // Semantik Renkler
  semantic: {
    meditation: {
      DEFAULT: '#8B5CF6',
      light: '#C4B5FD',
      dark: '#6D28D9',
    },
    fitness: {
      DEFAULT: '#EF4444',
      light: '#FCA5A5',
      dark: '#B91C1C',
    },
    health: {
      DEFAULT: '#22C55E',
      light: '#86EFAC',
      dark: '#15803D',
    },
    mental: {
      DEFAULT: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
    },
    nutrition: {
      DEFAULT: '#F59E0B',
      light: '#FCD34D',
      dark: '#B45309',
    },
  },

  // Gradient Renkler
  gradients: {
    primary: ['#1A2B3C', '#2A3B4C'],
    secondary: ['#F2D06B', '#F7E4A3'],
    meditation: ['#8B5CF6', '#C4B5FD'],
    fitness: ['#EF4444', '#FCA5A5'],
    health: ['#22C55E', '#86EFAC'],
    mental: ['#3B82F6', '#93C5FD'],
    nutrition: ['#F59E0B', '#FCD34D'],
  },

  // Tema Renkleri (Dark/Light)
  themes: {
    light: {
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: {
        primary: '#1A2B3C',
        secondary: '#64748B',
        tertiary: '#94A3B8',
      },
    },
    dark: {
      background: '#1A2B3C',
      surface: '#0F172A',
      text: {
        primary: '#FFFFFF',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
      },
    },
  },
};