import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Card, CardColors, CardWords, WordIndex } from "./types";
import { defaultColors } from "./constants";
import { generateCard } from "./helpers/generateCard";
import { factoryCardColorApply } from "./helpers/factoryCardColorApply";
import { cardsSchema } from "./helpers/validateCardsData";
import { readFromLocalStorage } from "./helpers/readFromLocalStorage";
import { randomRotationDeg } from "./helpers/randomRotationDeg";

type CardsStore = {
  cards: Card[];
  colors: CardColors;
  updateCardWord: (cardId: Card["id"], wordIndex: WordIndex, newWord: string) => void;
  updateCard: (card: Card) => void;
  sortWordsOfCard: (card: Card) => void;
  deleteCard: (cardId: Card) => void;
  deleteCardById: (cardId: Card["id"]) => void;
  deleteAllCards: () => void;
  addCard: () => void;
  changeColorArIndex: (color: string, index: WordIndex) => void;
  importCards: (cards: Card[]) => void;
};

export const useCardsStore = create<CardsStore>()(
  persist(
    (set) => ({
      cards: [],
      colors: defaultColors,
      updateCardWord: (cardId, wordIndex, newWord) => {
        set(({ cards }) => {
          const card = cards.find((card) => card.id === cardId)!;
          const cardIndex = cards.findIndex((card) => card.id === cardId);
          const word = card.words[wordIndex];
          const newWords: CardWords = [...card.words];
          const newCards = [...cards];
          newWords.splice(wordIndex, 1, { ...word, word: newWord, rotationDeg: randomRotationDeg() });
          newCards.splice(cardIndex, 1, { ...card, words: newWords });
          return { cards: newCards };
        });
      },
      updateCard: (card) => {
        set(({ cards }) => {
          const newCards = [...cards];
          const cardIndex = newCards.findIndex((c) => c.id === card.id);
          newCards.splice(cardIndex, 1, card);
          return { cards: newCards };
        });
      },
      sortWordsOfCard: ({ id }) => {
        set(({ cards }) => {
          const card = cards.find((card) => card.id === id)!;
          const cardIndex = cards.findIndex((card) => card.id === id);

          // Swapping only the word strings, not the Word objects
          const newWordStrings: string[] = [...card.words].map((word) => word.word).sort((a, b) => b.length - a.length);
          const newWords = card.words.map((word, index) => ({ ...word, word: newWordStrings[index] })) as CardWords;

          const newCards = [...cards];
          newCards.splice(cardIndex, 1, { ...card, words: newWords });
          return { cards: newCards };
        });
      },
      deleteCard: ({ id }) => {
        set(({ cards }) => ({
          cards: cards.filter((card) => card.id !== id),
        }));
      },
      deleteCardById: (cardId) => {
        set(({ cards }) => ({
          cards: cards.filter((card) => card.id !== cardId),
        }));
      },
      deleteAllCards: () => {
        set(() => ({ cards: [] }));
      },
      addCard: () => {
        set(({ cards, colors }) => ({
          cards: [...cards, generateCard(colors)],
        }));
      },
      changeColorArIndex: (newColor, colorIndex) => {
        set(({ cards, colors }) => ({
          colors: [...colors].map((color, index) => (index === colorIndex ? newColor : color)) as CardColors,
          cards: [...cards].map(factoryCardColorApply(newColor, colorIndex)),
        }));
      },
      importCards: (cards) => {
        const validCards = cardsSchema.parse(cards) as Card[];
        const colors =
          validCards.length > 0 ? (validCards[0].words.map((word) => word.color) as CardColors) : defaultColors;
        set(() => ({ cards: validCards, colors }));
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// These lines below will load the cards saved in memory when the save in localStorage was done manually
try {
  const maybeOldState = readFromLocalStorage();
  if (maybeOldState && Array.isArray(maybeOldState)) {
    console.info("Old saved data found in localStorage:", maybeOldState);
    const cards = cardsSchema.parse(maybeOldState);
    useCardsStore.setState({
      cards: cards as Card[],
    });
  }
} catch (err) {
  console.info("The old data found in localStorage could not be imported because of the error: ", err);
}
