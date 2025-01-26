import { CardColors, Word } from "./types";

export const defaultWords: [Word, Word, Word] = [
  {
    word: "",
    color: "#C0392B",
  },
  {
    word: "",
    color: "#8E44AD",
  },
  {
    word: "",
    color: "#27AE60",
  },
];

export const defaultColors = defaultWords.map((word) => word.color) as CardColors;
