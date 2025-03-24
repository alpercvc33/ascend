// src/theme/typography.js
import { Platform } from 'react-native';

export const FONTS = {
  primary: Platform.select({
    ios: 'Montserrat',
    android: 'Montserrat-Regular',
  }),
  primaryMedium: Platform.select({
    ios: 'Montserrat-Medium',
    android: 'Montserrat-Medium',
  }),
  primarySemiBold: Platform.select({
    ios: 'Montserrat-SemiBold',
    android: 'Montserrat-SemiBold',
  }),
  primaryBold: Platform.select({
    ios: 'Montserrat-Bold',
    android: 'Montserrat-Bold',
  }),
  secondary: Platform.select({
    ios: 'Inter',
    android: 'Inter-Regular',
  }),
  secondaryMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
  }),
  secondarySemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
  }),
  secondaryBold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
  }),
};

export const TYPOGRAPHY = {
  // Başlıklar
  h1: {
    fontFamily: FONTS.primaryBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FONTS.primaryBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h3: {
    fontFamily: FONTS.primaryBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  h4: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h5: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Gövde Metinleri
  bodyLarge: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Buton Metinleri
  buttonLarge: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  buttonMedium: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  buttonSmall: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Alt Başlıklar
  subtitle1: {
    fontFamily: FONTS.secondaryMedium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontFamily: FONTS.secondaryMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Etiketler
  caption: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: FONTS.secondaryMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};