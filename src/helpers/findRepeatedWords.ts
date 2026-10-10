import { Card, WordIndex } from "../types";

type WordPlace = { cardIndex: number; wordIndex: WordIndex };

export type RepeatedWord = {
  /** Numbers (starting at 1) of the other cards where the word also appears */
  otherCards: number[];
  /** Whether the word also appears on another ring of the same card */
  sameCard: boolean;
};

/** Words are always shown in capitals, so "Sol" and "SOL" are the same word */
export function normalizeWord(word: string) {
  return word.trim().toLocaleUpperCase();
}

/** Groups the places where each word of the project appears */
export function findWordPlaces(cards: Card[]) {
  const places = new Map<string, WordPlace[]>();
  cards.forEach((card, cardIndex) => {
    card.words.forEach(({ word }, wordIndex) => {
      const key = normalizeWord(word);
      if (!key) return;
      places.set(key, [...(places.get(key) ?? []), { cardIndex, wordIndex: wordIndex as WordIndex }]);
    });
  });
  return places;
}

/** Tells where else the word at the given card and ring is used, or undefined if it is not repeated */
export function getRepetition(
  places: Map<string, WordPlace[]>,
  word: string,
  cardIndex: number,
  wordIndex: WordIndex,
): RepeatedWord | undefined {
  const others = (places.get(normalizeWord(word)) ?? []).filter(
    (place) => place.cardIndex !== cardIndex || place.wordIndex !== wordIndex,
  );
  if (others.length === 0) return undefined;
  const otherCards = [...new Set(others.filter((place) => place.cardIndex !== cardIndex).map((p) => p.cardIndex + 1))];
  return { otherCards, sameCard: others.some((place) => place.cardIndex === cardIndex) };
}
