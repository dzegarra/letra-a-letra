import fontColorContrast from "font-color-contrast";
import { Card, CardWords, WordIndex } from "../types";

export const factoryCardColorApply =
  (color: string, index: WordIndex) =>
  (card: Card): Card => ({
    ...card,
    words: card.words.map((word, wordIndex) => {
      if (wordIndex === index) {
        return { ...word, color, fontColor: fontColorContrast(color) };
      }
      return word;
    }) as CardWords,
  });
