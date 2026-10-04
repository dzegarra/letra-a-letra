import { WordIndex } from "../types";

// Inner and outer radius of each ring as a fraction of the card radius. They match the stops of the
// radial gradient in CardBackground.module.css, which are relative to the farthest corner (√2 × radius)
const ringBounds: Record<WordIndex, [number, number]> = {
  0: [0.53 * Math.SQRT2, 1],
  1: [0.35 * Math.SQRT2, 0.53 * Math.SQRT2],
  2: [0.17 * Math.SQRT2, 0.35 * Math.SQRT2],
};

type RingHighlightProps = {
  index: WordIndex;
  className?: string;
};

/** Outlines one of the three rings of a card. It fills its (square) parent. */
export const RingHighlight = ({ index, className }: RingHighlightProps) => {
  const [inner, outer] = ringBounds[index];
  const r1 = inner * 50;
  const r2 = Math.min(outer * 50, 49.4);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r={(r1 + r2) / 2} fill="none" stroke="white" strokeOpacity="0.22" strokeWidth={r2 - r1} />
      <circle cx="50" cy="50" r={r1} fill="none" stroke="white" strokeWidth="0.8" />
      <circle cx="50" cy="50" r={r2} fill="none" stroke="white" strokeWidth="0.8" />
    </svg>
  );
};
