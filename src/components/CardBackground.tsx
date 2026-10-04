import { ComponentProps } from "react";
import clsx from "clsx";

type CardBackgroundProps = {
  size: string;
  color1: string;
  color2: string;
  color3: string;
} & ComponentProps<"div">;

/**
 * Outer edge of each inner ring, as a share of the half diagonal of the card. The rings are stacked circles
 * instead of a radial gradient with hard stops because browsers and html2canvas don't antialias those stops,
 * which leaves jagged edges between the rings
 */
const ringStops = { color2: 0.53, color3: 0.35, center: 0.17 };

const Ring = ({ stop, color }: { stop: number; color: string }) => (
  <div
    className="absolute rounded-full"
    style={{ inset: `${((1 - stop * Math.SQRT2) / 2) * 100}%`, background: color }}
  />
);

export const CardBackground = ({ size, className, color1, color2, color3, style, ...props }: CardBackgroundProps) => (
  <div
    style={{ width: size, height: size, background: color1, ...style }}
    className={clsx(
      `top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute rounded-full border border-slate-500`,
      className,
    )}
    {...props}
  >
    <Ring stop={ringStops.color2} color={color2} />
    <Ring stop={ringStops.color3} color={color3} />
    <Ring stop={ringStops.center} color="#000" />
  </div>
);
