import rings from "./assets/rear/rings.svg";
import rays from "./assets/rear/rays.svg";
import dots from "./assets/rear/dots.svg";
import stars from "./assets/rear/stars.svg";

/**
 * Designs available for the rear of the cards. `null` means a plain background with only the color.
 */
export const rearDesigns = {
  rings,
  rays,
  dots,
  stars,
  plain: null,
} as const satisfies Record<string, string | null>;

export type RearDesign = keyof typeof rearDesigns;

export const defaultRearDesign: RearDesign = "rings";

export const isRearDesign = (value: unknown): value is RearDesign =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(rearDesigns, value);
