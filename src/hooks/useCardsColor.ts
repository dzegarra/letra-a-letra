import { useCallback, Dispatch, SetStateAction } from "react";
import fontColorContrast from "font-color-contrast";
import { defaultColors } from "../constants";
import { Card as CardType, CardWords, CardColors, WordIndex } from "../types";

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

export const useCardsColor = (cards: CardType[], setCards: Dispatch<SetStateAction<CardType[]>>) => {
  const colors: CardColors =
    cards && cards.length ? (cards[0].words.map((word) => word.color) as CardColors) : defaultColors;

  const updateColorAtIndex = useCallback(
    (color: string, index: WordIndex) => {
      setCards((cards: CardType[]) => [...cards].map(factoryCardColorApply(color, index)));
    },
    [setCards],
  );

  return { colors, updateColorAtIndex };
};
