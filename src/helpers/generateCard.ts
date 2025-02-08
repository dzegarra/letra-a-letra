import { Card, CardColors } from "../types";
import { generateCardId } from "./generateCardId";
import { generateWords } from "./generateWords";

export const generateCard = (colors: CardColors): Card => ({
  id: generateCardId(),
  words: generateWords(colors),
});
