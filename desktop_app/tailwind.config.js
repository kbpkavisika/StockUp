/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colour tokens from DESIGN.md §01; values live in src/index.css and swap under .dark
      colors: {
        primary: { DEFAULT: 'var(--primary)', hover: 'var(--primary-hover)' },
        secondary: 'var(--secondary)',
        disabled: 'var(--disabled)',
        border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        surface: { DEFAULT: 'var(--surface)', muted: 'var(--surface-muted)', sunken: 'var(--surface-sunken)' },
        accent: { DEFAULT: 'var(--accent)', pressed: 'var(--accent-pressed)', tint: 'var(--accent-tint)' },
        info: { DEFAULT: 'var(--info)', track: 'var(--info-track)', tint: 'var(--info-tint)' },
        success: { DEFAULT: 'var(--success)', tint: 'var(--success-tint)' },
        warning: { DEFAULT: 'var(--warning)', tint: 'var(--warning-tint)' },
        error: { DEFAULT: 'var(--error)', tint: 'var(--error-tint)' },
        // Filled destructive button keeps the light-mode error fill in both themes so white text stays AA
        danger: { DEFAULT: '#C4291F', hover: '#B62E22' },
        'on-primary': 'var(--on-primary)',
        scrim: 'rgba(16, 17, 18, 0.45)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      // Desktop type ramp from DESIGN.md §02
      fontSize: {
        display: ['34px', { lineHeight: '38px', letterSpacing: '-0.03em' }],
        h1: ['28px', { lineHeight: '32px', letterSpacing: '-0.025em' }],
        h2: ['22px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
        h3: ['18px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        body: ['14px', { lineHeight: '20px' }],
        label: ['13px', { lineHeight: '18px' }],
        caption: ['13px', { lineHeight: '18px' }],
        'label-sm': ['12px', { lineHeight: '16px' }],
        overline: ['11px', { lineHeight: '14px', letterSpacing: '0.1em' }],
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '999px',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(16,17,18,.06)',
        e2: '0 2px 8px rgba(16,17,18,.08)',
        e3: '0 8px 24px rgba(16,17,18,.10)',
        e4: '0 16px 40px rgba(16,17,18,.16)',
        knob: '0 1px 2px rgba(16,17,18,.2)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(.2,0,0,1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'dialog-in': { from: { opacity: '0', transform: 'scale(.98)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'panel-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'toast-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 160ms cubic-bezier(.2,0,0,1)',
        'dialog-in': 'dialog-in 160ms cubic-bezier(.2,0,0,1)',
        'panel-in': 'panel-in 240ms cubic-bezier(.2,0,0,1)',
        'toast-in': 'toast-in 160ms cubic-bezier(.2,0,0,1)',
      },
    },
  },
  plugins: [],
}
