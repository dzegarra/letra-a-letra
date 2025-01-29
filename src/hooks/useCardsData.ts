import { useEffect, useState } from "react";
import { Card as CardType } from "../types";

const emptyArray: CardType[] = [];

const readFromLocalStorage = () => {
  const savedCards = localStorage.getItem("cards");
  if (savedCards) {
    return JSON.parse(savedCards);
  }
  return emptyArray;
};

const saveInLocalStorage = (cards: CardType[]) => {
  localStorage.setItem("cards", JSON.stringify(cards));
};

export const useCardsData = () => {
  const [cards, setCards] = useState<CardType[]>(readFromLocalStorage());

  useEffect(() => {
    saveInLocalStorage(cards);
  }, [cards]);

  return { cards, setCards };
};
