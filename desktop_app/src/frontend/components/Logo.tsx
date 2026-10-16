import { useId } from 'react';

// StockUp mark — rounded hexagon cut by an S. Source artwork: branding/stockup-mark.svg
const HEX =
  'M-16 -102.76A32 32 0 0 1 16 -102.76L80.99 -65.24A32 32 0 0 1 96.99 -37.52L96.99 37.52A32 32 0 0 1 80.99 65.24L16 102.76A32 32 0 0 1 -16 102.76L-80.99 65.24A32 32 0 0 1 -96.99 37.52L-96.99 -37.52A32 32 0 0 1 -80.99 -65.24Z';
const S_CUT = 'M-51.5 -130V-40.13A18 18 0 0 0 -42.5 -24.54L42.5 24.54A18 18 0 0 1 51.5 40.13V130';
const SHORT_CUTS = 'M2 -57.6L122 11.68M-2 57.6L-122 -11.68';

/** Drawn in currentColor; the cuts are transparent so it sits on any surface in either theme */
export default function Logo({ size = 24, className }: { size?: number; className?: string }) {
  // useId can contain characters (":", "«") that break url(#…) references
  const maskId = `stockup-mark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      width={(size * 194) / 214}
      height={size}
      viewBox="-97 -107 194 214"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ''}`}
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-97" y="-107" width="194" height="214">
        <path d={HEX} fill="#fff" />
        <g fill="none" stroke="#000" strokeWidth={10.5}>
          <path d={S_CUT} />
          <path d={SHORT_CUTS} strokeLinecap="round" />
        </g>
      </mask>
      <path d={HEX} fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
