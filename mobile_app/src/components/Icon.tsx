import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

// Outline icons on a 24px grid, 1.75px stroke, round caps and joins — DESIGN.md §05.
// Same drawings as desktop_app/src/frontend/components/Icon.tsx.
const shapes = {
  search: (
    <>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="M16 16l4 4" />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" />,
  minus: <Path d="M5 12h14" />,
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  back: <Path d="M15 6l-6 6 6 6" />,
  chevron: <Path d="M6 9l6 6 6-6" />,
  'chevron-right': <Path d="M9 6l6 6-6 6" />,
  check: <Path d="M5 12.5l4.5 4.5L19 7" />,
  delete: <Path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  box: (
    <>
      <Path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z" />
      <Path d="M3 7.5l9 4.5 9-4.5M12 12v9" />
    </>
  ),
  settings: (
    <>
      <Path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <Circle cx="16" cy="6" r="2" />
      <Circle cx="10" cy="12" r="2" />
      <Circle cx="18" cy="18" r="2" />
    </>
  ),
  sort: <Path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4" />,
};

export type IconName = keyof typeof shapes;

export default function Icon({ name, size = 24, color }: { name: IconName; size?: number; color: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </Svg>
  );
}
