export type Word = {
  word: string;
  color: string;
  fontColor?: string;
  rotationDeg?: number;
  direction?: WordDirection;
};

export type Card = {
  id: string;
  words: CardWords;
};

export type WordDirection = "normal" | "reverse";

export type CardWords = [Word, Word, Word];

export type CardColors = [string, string, string];

export type WordIndex = 0 | 1 | 2;