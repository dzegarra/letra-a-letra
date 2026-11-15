import { createContext } from "react";
import { Card, CardColors } from "./types";
import { Form, GetRef } from "antd";

export const defaultColors: CardColors = ["#C0392B", "#8E44AD", "#27AE60"];

type FormInstance<T> = GetRef<typeof Form<T>>;

export const EditableContext = createContext<FormInstance<Card> | null>(null);

export const wordPositionName = ["outer", "middle", "inner"] as const;

export const cardSizes = {
  S: "scale(1)",
  M: "scale(1.1)",
  L: "scale(1.25)",
} as const;

export const wordLengthsMax: Record<(typeof wordPositionName)[number], [number, number, number]> = {
  outer: [9, 12, 15],
  middle: [7, 10, 13],
  inner: [5, 7, 9],
} as const;

export const pageSizes = {
  a4: {
    w: 2480,
    h: 3508,
  },
};

export const languages = [
  { label: "English", key: "en" },
  { label: "Español", key: "es" },
  { label: "Polski", key: "pl" },
];

/** YouTube videos that explain the game, by language. Polish has none, and many Poles speak English */
export const howToPlayVideos: Partial<Record<string, string>> = {
  en: "WTTEoSTIEXg",
  es: "gGX3avQoT1Q",
  pl: "WTTEoSTIEXg",
};
