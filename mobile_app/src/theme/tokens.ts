import type { TextStyle } from 'react-native';

/** Colour tokens — DESIGN.md §01. Keep in sync with desktop_app/src/index.css. */
const light = {
  primary: '#101112',
  'primary-hover': '#2E3133',
  secondary: '#63686D',
  disabled: '#9BA0A5',
  border: '#E4E6E8',
  'border-strong': '#8C9297',
  'border-disabled': '#C9CDD1',
  surface: '#FFFFFF',
  'surface-muted': '#F7F8F8',
  'surface-sunken': '#F1F2F3',
  accent: '#D33A2C',
  'accent-pressed': '#B62E22',
  'accent-tint': '#FBEDEB',
  info: '#2F6BD8',
  'info-track': '#B9CDF2',
  'info-tint': '#EDF2FC',
  success: '#197A4B',
  'success-tint': '#E8F3EC',
  warning: '#8A5300',
  'warning-tint': '#FBF2E3',
  error: '#C4291F',
  'error-tint': '#FBEBEA',
  'on-primary': '#FFFFFF',
};

export type Palette = typeof light;

const dark: Palette = {
  primary: '#F5F5F6',
  'primary-hover': '#E4E6E8',
  secondary: '#9BA0A5',
  disabled: '#5C6165',
  border: '#2A2B2D',
  'border-strong': '#72777C',
  'border-disabled': '#3A3C3F',
  surface: '#101112',
  'surface-muted': '#1C1D1E',
  'surface-sunken': '#252627',
  accent: '#D33A2C',
  'accent-pressed': '#B62E22',
  'accent-tint': '#2C1613',
  info: '#2F6BD8',
  'info-track': '#24406E',
  'info-tint': '#16233B',
  success: '#22A566',
  'success-tint': '#12261C',
  warning: '#C97F1D',
  'warning-tint': '#2C2211',
  error: '#E5544A',
  'error-tint': '#2E1614',
  'on-primary': '#101112',
};

export const palettes = { light, dark };

/** "#D33A2C" → "211 58 44", the form Tailwind's rgb(var(--x) / <alpha-value>) expects */
const toChannels = (hex: string) =>
  [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)).join(' ');

export const toCssVariables = (palette: Palette) =>
  Object.fromEntries(Object.entries(palette).map(([name, hex]) => [`--${name}`, toChannels(hex)]));

/** Font families per weight — custom fonts on Android need a family per weight, not fontWeight */
export const fonts = {
  regular: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semibold: 'Archivo_600SemiBold',
  bold: 'Archivo_700Bold',
  extrabold: 'Archivo_800ExtraBold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
};

/** Type ramp — DESIGN.md §02 */
export const typography = {
  display: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 38, letterSpacing: -1.02 },
  h1: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 32, letterSpacing: -0.7 },
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.44 },
  h3: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.18 },
  'body-lg': { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  'label-lg': { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  'label-sm': { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 1.1, textTransform: 'uppercase' },
  mono: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 18, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
