import { CardColors, CardWords } from "../types";

export const generateWords = (colors: CardColors): CardWords => [
  {
    word: "",
    color: colors[0],
  },
  {
    word: "",
    color: colors[1],
  },
  {
    word: "",
    color: colors[2],
  },
];
