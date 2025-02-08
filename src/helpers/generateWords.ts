import { CardColors, CardWords } from "../types";
import { getRandomDirection } from "./getRandomDirection";

export const generateWords = (colors: CardColors): CardWords => [
  {
    word: "",
    color: colors[0],
    direction: getRandomDirection(),
  },
  {
    word: "",
    color: colors[1],
    direction: getRandomDirection(),
  },
  {
    word: "",
    color: colors[2],
    direction: getRandomDirection(),
  },
];
