import { CardColors } from "./types";
import { defaultColors } from "./constants";

/** Ready-made combinations for the three rings, ordered outer, middle, inner. Neighbouring rings are kept clearly different */
export const colorPalettes = {
  classic: defaultColors,
  rainbow: ["#E74C3C", "#F1C40F", "#3498DB"],
  ocean: ["#1A5276", "#48C9B0", "#F4D03F"],
  forest: ["#1E8449", "#F39C12", "#6E2C00"],
  candy: ["#E91E63", "#00BCD4", "#FFEB3B"],
  sunset: ["#6C3483", "#E67E22", "#F7DC6F"],
  primary: ["#1565C0", "#D32F2F", "#FBC02D"],
  pastel: ["#F48FB1", "#81D4FA", "#FFF59D"],
} satisfies Record<string, CardColors>;

export type ColorPaletteName = keyof typeof colorPalettes;

/** Bright colours offered as quick picks for a single ring */
export const colorSwatches = [
  "#E53935",
  "#FB8C00",
  "#FDD835",
  "#7CB342",
  "#2E7D32",
  "#00897B",
  "#00ACC1",
  "#1E88E5",
  "#3949AB",
  "#8E24AA",
  "#D81B60",
  "#6D4C41",
];

export const isSameColor = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
