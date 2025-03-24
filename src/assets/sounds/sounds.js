// src/assets/sounds/sounds.js
export const MEDITATION_SOUNDS = {
  AMBIENT: {
    RAIN: require('./meditation/rain.mp3'),
    OCEAN: require('./meditation/ocean.mp3'),
    FOREST: require('./meditation/forest.mp3'),
    WHITE_NOISE: require('./meditation/white-noise.mp3'),
  },
  BELLS: {
    START: require('./meditation/bell-start.mp3'),
    INTERVAL: require('./meditation/bell-interval.mp3'),
    END: require('./meditation/bell-end.mp3'),
  },
  GUIDANCE: {
    BREATHING: require('./meditation/breathing-guide.mp3'),
    BODY_SCAN: require('./meditation/body-scan.mp3'),
    MINDFULNESS: require('./meditation/mindfulness.mp3'),
  }
};

export const NOTIFICATION_SOUNDS = {
  SUCCESS: require('./notifications/success.mp3'),
  WARNING: require('./notifications/warning.mp3'),
  ERROR: require('./notifications/error.mp3'),
  REMINDER: require('./notifications/reminder.mp3'),
  ACHIEVEMENT: require('./notifications/achievement.mp3'),
};