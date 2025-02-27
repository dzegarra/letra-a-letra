import { useCallback, Dispatch, SetStateAction } from "react";
import fontColorContrast from "font-color-contrast";
import { Card as CardType, CardWords, CardColors, WordIndex } from "../types";
import { getCardsColors } from "../helpers/getCardsColors";

const factoryCardColorApply =
  (color: string, index: WordIndex) =>
  (card: CardType): CardType => ({
    ...card,
    words: card.words.map((word, wordIndex) => {
      if (wordIndex === index) {
        return { ...word, color, fontColor: fontColorContrast(color) };
      }
      return word;
    }) as CardWords,
  });

/**
 * Returns the colors of the cards and allows to change them.
 */
export const useCardsColor = (cards: CardType[], setCards: Dispatch<SetStateAction<CardType[]>>) => {
  const colors: CardColors = getCardsColors(cards);

  const updateColorAtIndex = useCallback(
    (color: string, index: WordIndex) => {
      setCards((cards: CardType[]) => [...cards].map(factoryCardColorApply(color, index)));
    },
    [setCards],
  );

  return { colors, updateColorAtIndex };
};
