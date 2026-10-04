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

/**
 * `custom` uses the image uploaded by the user, which is kept in the store.
 */
export type RearDesign = keyof typeof rearDesigns | "custom";

export const defaultRearDesign: RearDesign = "rings";

export const isRearDesign = (value: unknown): value is RearDesign =>
  value === "custom" || (typeof value === "string" && Object.prototype.hasOwnProperty.call(rearDesigns, value));
