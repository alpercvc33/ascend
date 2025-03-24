// src/theme/index.js
import { COLORS } from './colors';
import { TYPOGRAPHY, FONTS } from './typography';
import { SPACING, LAYOUT } from './spacing';

// Tema konfigürasyonu
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  fonts: FONTS,
  spacing: SPACING,
  layout: LAYOUT,

  // Gölgeler
  shadows: {
    sm: {
      shadowColor: COLORS.neutral[900],
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: COLORS.neutral[900],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    lg: {
      shadowColor: COLORS.neutral[900],
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 6,
    },
  },

  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Animasyon Süreleri
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // Z-index Katmanları
  zIndex: {
    base: 0,
    card: 10,
    drawer: 20,
    modal: 30,
    overlay: 40,
    popover: 50,
    toast: 60,
  },
};

// Tema Yardımcı Fonksiyonları
export const getColor = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], COLORS);
};

export const getFontStyle = (style) => {
  return TYPOGRAPHY[style] || {};
};

export const getSpacing = (size) => {
  return SPACING[size] || size;
};

// Responsive Değerler için Yardımcı Fonksiyonlar
export const responsive = {
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  
  fontSize: (size) => {
    if (width < 375) return size * 0.9;
    if (width >= 768) return size * 1.1;
    return size;
  },
  
  spacing: (space) => {
    if (width < 375) return space * 0.9;
    if (width >= 768) return space * 1.1;
    return space;
  },
};

// Tema Kombinasyonları
export const themedStyles = {
  // Kart Stilleri
  card: {
    base: {
      backgroundColor: COLORS.themes.light.surface,
      borderRadius: theme.borderRadius.lg,
      padding: SPACING.card.padding,
      ...theme.shadows.md,
    },
    dark: {
      backgroundColor: COLORS.themes.dark.surface,
    },
  },

  // Buton Stilleri
  button: {
    primary: {
      backgroundColor: COLORS.primary.DEFAULT,
      paddingVertical: SPACING.button.padding.medium,
      paddingHorizontal: SPACING.button.padding.large,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    },
    secondary: {
      backgroundColor: COLORS.secondary.DEFAULT,
      paddingVertical: SPACING.button.padding.medium,
      paddingHorizontal: SPACING.button.padding.large,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    },
  },

  // Input Stilleri
  input: {
    base: {
      backgroundColor: COLORS.themes.light.surface,
      borderRadius: theme.borderRadius.md,
      padding: SPACING.input.padding.vertical,
      paddingHorizontal: SPACING.input.padding.horizontal,
      borderWidth: 1,
      borderColor: COLORS.functional.border,
    },
    focus: {
      borderColor: COLORS.primary.DEFAULT,
    },
    error: {
      borderColor: COLORS.status.error.DEFAULT,
    },
  },

  // Liste Öğesi Stilleri
  listItem: {
    base: {
      backgroundColor: COLORS.themes.light.surface,
      paddingVertical: SPACING.list.itemPadding,
      paddingHorizontal: SPACING.layout.horizontal,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.functional.divider,
    },
    active: {
      backgroundColor: COLORS.primary.light,
    },
  },
};

// Ortak Component Stilleri
export const commonStyles = {
  // Flex Yardımcıları
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Kenar Boşlukları
  margin: {
    top: { marginTop: SPACING.md },
    bottom: { marginBottom: SPACING.md },
    vertical: { marginVertical: SPACING.md },
    horizontal: { marginHorizontal: SPACING.md },
  },
  padding: {
    top: { paddingTop: SPACING.md },
    bottom: { paddingBottom: SPACING.md },
    vertical: { paddingVertical: SPACING.md },
    horizontal: { paddingHorizontal: SPACING.md },
  },

  // Genel Stiller
  roundedCorners: {
    borderRadius: theme.borderRadius.md,
  },
  shadow: theme.shadows.md,
  center: {
    textAlign: 'center',
    alignItems: 'center',
  },
};

export default theme;