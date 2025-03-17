import { useCardsStore } from "../store";

export const useCardLength = () => useCardsStore((state) => state.cards.length);
