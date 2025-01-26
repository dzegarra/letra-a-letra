import { defaultColors } from "../constants";
import { Card as CardType, CardWords, CardColors, WordIndex } from "../types";
import { useCallback, Dispatch, SetStateAction } from "react";

const factoryCardColorApply =
  (color: string, index: WordIndex) =>
  (card: CardType): CardType => ({
    ...card,
    words: card.words.map((word, wordIndex) => (wordIndex === index ? { ...word, color } : word)) as CardWords,
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
