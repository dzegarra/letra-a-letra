import { Card } from "../types";

export const areWordsSorted = ({ words }: Card): boolean => {
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].word.length < words[i + 1].word.length) {
      return false;
    }
  }
  return true;
};
