import { Card, CardColors } from "../types";
import { defaultColors } from "../constants";

export const getCardsColors = (cards: Card[]) => cards && cards.length ? (cards[0].words.map((word) => word.color) as CardColors) : defaultColors;