// src/theme/animations.js
import { Animated, Easing } from 'react-native';

// Animasyon Süreleri
const DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Easing Fonksiyonları
const EASING = {
  EASE_IN_OUT: Easing.bezier(0.4, 0, 0.2, 1),
  EASE_OUT: Easing.bezier(0, 0, 0.2, 1),
  EASE_IN: Easing.bezier(0.4, 0, 1, 1),
  LINEAR: Easing.linear,
};

// Temel Animasyonlar
export const animations = {
  // Fade Animasyonları
  fade: {
    in: (value, options = {}) => {
      return Animated.timing(value, {
        toValue: 1,
        duration: options.duration || DURATIONS.NORMAL,
        easing: options.easing || EASING.EASE_OUT,
        useNativeDriver: true,
      });
    },
    out: (value, options = {}) => {
      return Animated.timing(value, {
        toValue: 0,
        duration: options.duration || DURATIONS.NORMAL,
        easing: options.easing || EASING.EASE_IN,
        useNativeDriver: true,
      });
    },
  },

  // Scale Animasyonları
  scale: {
    in: (value, options = {}) => {
      return Animated.spring(value, {
        toValue: 1,
        duration: options.duration || DURATIONS.NORMAL,
        easing: options.easing || EASING.EASE_OUT,
        useNativeDriver: true,
        ...options,
      });
    },
    out: (value, options = {}) => {
      return Animated.spring(value, {
        toValue: 0,
        duration: options.duration || DURATIONS.NORMAL,
        easing: options.easing || EASING.EASE_IN,
        useNativeDriver: true,
        ...options,
      });
    },
  },

  // Slide Animasyonları
  slide: {
    in: (value, options = {}) => {
      return Animated.spring(value, {
        toValue: 0,
        duration: options.duration || DURATIONS.NORMAL,
        easing: options.easing || EASING.EASE_OUT,
        useNativeDriver: true,
        ...options,
      });
    },
    out: (value, options = {}) => {
      return Animated.spring(value, {
        toValue: 1,
        duration: options.duration || DURATIONS.NORMAL,
        easing: options.easing || EASING.EASE_IN,
        useNativeDriver: true,
        ...options,
      });
    },
  },

  // Bounce Animasyonları
  bounce: {
    in: (value, options = {}) => {
      return Animated.spring(value, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
        ...options,
      });
    },
    out: (value, options = {}) => {
      return Animated.spring(value, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
        ...options,
      });
    },
  },
};

// Animasyon Kompozisyonları
export const animationPresets = {
  // Modal Animasyonları
  modal: {
    show: (fadeAnim, slideAnim) => {
      return Animated.parallel([
        animations.fade.in(fadeAnim),
        animations.slide.in(slideAnim),
      ]);
    },
    hide: (fadeAnim, slideAnim) => {
      return Animated.parallel([
        animations.fade.out(fadeAnim),
        animations.slide.out(slideAnim),
      ]);
    },
  },

  // Toast Animasyonları
  toast: {
    show: (translateY, opacity) => {
      return Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]);
    },
    hide: (translateY, opacity) => {
      return Animated.parallel([
        Animated.spring(translateY, {
          toValue: -100,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          easing: EASING.EASE_IN,
          useNativeDriver: true,
        }),
      ]);
    },
  },

  // Button Animasyonları
  button: {
    press: (scale) => {
      return Animated.sequence([
        Animated.spring(scale, {
          toValue: 0.95,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]);
    },
  },

  // List Item Animasyonları
  listItem: {
    delete: (height, opacity) => {
      return Animated.parallel([
        Animated.timing(height, {
          toValue: 0,
          duration: DURATIONS.NORMAL,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: DURATIONS.NORMAL,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]);
    },
  },
};

// Animasyon Hook'ları için Yardımcı Fonksiyonlar
export const createAnimatedStyle = (animations = {}) => {
  const animatedValues = {};
  const style = {};

  Object.keys(animations).forEach((key) => {
    const config = animations[key];
    animatedValues[key] = new Animated.Value(config.initial || 0);
    style[key] = animatedValues[key].interpolate(config.interpolation);
  });

  return { values: animatedValues, style };
};

export default {
  animations,
  animationPresets,
  createAnimatedStyle,
  DURATIONS,
  EASING,
};