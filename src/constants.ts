import { createContext } from "react";
import { Card, CardColors } from "./types";
import { Form, GetRef } from "antd";

export const defaultColors: CardColors = ["#C0392B", "#8E44AD", "#27AE60"];

type FormInstance<T> = GetRef<typeof Form<T>>;

export const EditableContext = createContext<FormInstance<Card> | null>(null);

export const wordPositionName = ["outer", "middle", "inner"] as const;

export const cardSizes = {
  S: "scale-100",
  M: "scale-110",
  L: "scale-125",
} as const;

export const wordLengthsMax: Record<(typeof wordPositionName)[number], [number, number, number]> = {
  outer: [9, 12, 15],
  middle: [7, 10, 13],
  inner: [5, 7, 9],
} as const;
