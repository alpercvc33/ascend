// src/theme/spacing.js
export const SPACING = {
  // Base Spacing Units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,

  // Specific Spacings
  layout: {
    horizontal: 16,
    vertical: 24,
    gutter: 16,
  },

  // Component Specific
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 12,
  },

  button: {
    padding: {
      small: 8,
      medium: 12,
      large: 16,
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12,
    },
  },

  input: {
    padding: {
      vertical: 12,
      horizontal: 16,
    },
    gap: 8,
    borderRadius: 8,
  },

  list: {
    gap: 16,
    itemPadding: 12,
  },

  section: {
    margin: {
      top: 32,
      bottom: 24,
    },
    padding: {
      vertical: 24,
      horizontal: 16,
    },
  },

  // Grid System
  grid: {
    container: 16,
    column: 8,
    gutter: 16,
  },
};

export const LAYOUT = {
  // Screen Layout
  screen: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // Container Layout
  container: {
    padding: SPACING.md,
    maxWidth: 1200,
  },

  // Flex Layout Helpers
  flex: {
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },

  // Grid Layout
  grid: {
    container: {
      padding: SPACING.grid.container,
    },
    row: {
      marginHorizontal: -SPACING.grid.gutter / 2,
    },
    col: {
      paddingHorizontal: SPACING.grid.gutter / 2,
    },
  },
};