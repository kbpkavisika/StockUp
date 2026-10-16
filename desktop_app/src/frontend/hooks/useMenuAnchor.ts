import { useState } from 'react';

export interface AnchorRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const toAnchor = (element: Element): AnchorRect => {
  const { top, bottom, left, right } = element.getBoundingClientRect();
  return { top, bottom, left, right };
};

/** Where an open Menu is anchored: a trigger element, or the pointer for context menus */
export function useMenuAnchor() {
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  return {
    anchor,
    openAt: (element: Element) => setAnchor(toAnchor(element)),
    openAtPoint: (x: number, y: number) => setAnchor({ top: y, bottom: y, left: x, right: x }),
    close: () => setAnchor(null),
  };
}
