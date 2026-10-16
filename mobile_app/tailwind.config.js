// Colours come from CSS variables set at the app root (src/theme/ThemeContext.tsx), so every class
// below switches between light and dark automatically. Values live in src/theme/tokens.ts.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.ts', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: token('primary'),
        'primary-hover': token('primary-hover'),
        secondary: token('secondary'),
        disabled: token('disabled'),
        border: token('border'),
        'border-strong': token('border-strong'),
        'border-disabled': token('border-disabled'),
        surface: token('surface'),
        'surface-muted': token('surface-muted'),
        'surface-sunken': token('surface-sunken'),
        accent: token('accent'),
        'accent-pressed': token('accent-pressed'),
        'accent-tint': token('accent-tint'),
        info: token('info'),
        'info-track': token('info-track'),
        'info-tint': token('info-tint'),
        success: token('success'),
        'success-tint': token('success-tint'),
        warning: token('warning'),
        'warning-tint': token('warning-tint'),
        error: token('error'),
        'error-tint': token('error-tint'),
        'on-primary': token('on-primary'),
        // Filled destructive button keeps the light-mode error fill in both themes so white text stays AA
        danger: '#C4291F',
        'danger-pressed': '#B62E22',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '999px',
      },
    },
  },
  plugins: [],
};
