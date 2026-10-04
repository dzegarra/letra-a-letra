import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Card, CardColors, CardWords, WordIndex } from "./types";
import { defaultColors } from "./constants";
import { generateCard } from "./helpers/generateCard";
import { factoryCardColorApply } from "./helpers/factoryCardColorApply";
import { cardsSchema, projectSchema } from "./helpers/validateCardsData";
import { readFromLocalStorage } from "./helpers/readFromLocalStorage";
import { nextRotationDeg } from "./helpers/nextRotationDeg";
import { defaultRearDesign, isRearDesign, RearDesign } from "./rearDesigns";

type CardsStore = {
  cards: Card[];
  colors: CardColors;
  rearDesign: RearDesign;
  /** Image uploaded by the user for the rear of the cards, as a data URL */
  customRearImage: string | null;
  updateCardWord: (cardId: Card["id"], wordIndex: WordIndex, newWord: string) => void;
  updateCard: (card: Card) => void;
  sortWordsOfCard: (card: Card) => void;
  deleteCard: (cardId: Card) => void;
  deleteCardById: (cardId: Card["id"]) => void;
  deleteAllCards: () => void;
  addCard: () => void;
  moveCard: (fromIndex: number, toIndex: number) => void;
  changeColorArIndex: (color: string, index: WordIndex) => void;
  changeColors: (colors: CardColors) => void;
  importCards: (cards: Card[]) => void;
  /** Imports an exported project, either the old array of cards or the object with the rear design */
  importProject: (data: unknown) => void;
  setRearDesign: (design: RearDesign) => void;
  setCustomRearImage: (image: string | null) => void;
};

export const useCardsStore = create<CardsStore>()(
  persist(
    (set, get) => ({
      cards: [],
      colors: defaultColors,
      rearDesign: defaultRearDesign,
      customRearImage: null,
      updateCardWord: (cardId, wordIndex, newWord) => {
        set(({ cards }) => {
          const card = cards.find((card) => card.id === cardId)!;
          const cardIndex = cards.findIndex((card) => card.id === cardId);
          const word = card.words[wordIndex];
          const newWords: CardWords = [...card.words];
          const newCards = [...cards];
          newWords.splice(wordIndex, 1, { ...word, word: newWord, rotationDeg: nextRotationDeg(word, newWord) });
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
      moveCard: (fromIndex, toIndex) => {
        set(({ cards }) => {
          const newCards = [...cards];
          const [card] = newCards.splice(fromIndex, 1);
          newCards.splice(toIndex, 0, card);
          return { cards: newCards };
        });
      },
      changeColorArIndex: (newColor, colorIndex) => {
        set(({ cards, colors }) => ({
          colors: [...colors].map((color, index) => (index === colorIndex ? newColor : color)) as CardColors,
          cards: [...cards].map(factoryCardColorApply(newColor, colorIndex)),
        }));
      },
      changeColors: (newColors) => {
        set(({ cards }) => ({
          colors: newColors,
          cards: cards.map((card) => ({
            ...card,
            words: card.words.map((word, index) => ({ ...word, color: newColors[index] })) as CardWords,
          })),
        }));
      },
      importCards: (cards) => {
        const validCards = cardsSchema.parse(cards) as Card[];
        const colors =
          validCards.length > 0 ? (validCards[0].words.map((word) => word.color) as CardColors) : defaultColors;
        set(() => ({ cards: validCards, colors }));
      },
      importProject: (data) => {
        if (Array.isArray(data)) {
          get().importCards(data as Card[]);
          return;
        }
        const project = projectSchema.parse(data);
        get().importCards(project.cards as Card[]);
        const customRearImage = project.customRearImage ?? null;
        const rearDesign =
          isRearDesign(project.rearDesign) && (project.rearDesign !== "custom" || customRearImage)
            ? project.rearDesign
            : defaultRearDesign;
        set(() => ({ customRearImage, rearDesign }));
      },
      setRearDesign: (rearDesign) => {
        set(() => ({ rearDesign }));
      },
      setCustomRearImage: (customRearImage) => {
        // Uploading an image selects it, removing it goes back to the default design if it was in use
        set(({ rearDesign }) => ({
          customRearImage,
          rearDesign: customRearImage ? "custom" : rearDesign === "custom" ? defaultRearDesign : rearDesign,
        }));
      },
    }),
    {
      name: "cards",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = { ...current, ...(persisted as Partial<CardsStore>) };
        // The font color is derived from the background color, so drop any stale value persisted by older versions
        const cards = state.cards.map(withoutFontColor);
        // Ignore persisted rear designs that no longer exist
        const customRearImage = typeof state.customRearImage === "string" ? state.customRearImage : null;
        const rearDesign =
          isRearDesign(state.rearDesign) && (state.rearDesign !== "custom" || customRearImage)
            ? state.rearDesign
            : defaultRearDesign;
        return { ...state, cards, rearDesign, customRearImage };
      },
    },
  ),
);

function withoutFontColor(card: Card): Card {
  return {
    ...card,
    words: card.words.map(({ word, color, rotationDeg }) => ({ word, color, rotationDeg })) as CardWords,
  };
}

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
