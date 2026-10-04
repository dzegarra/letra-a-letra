import { Word } from "../types";
import { randomRotationDeg } from "./randomRotationDeg";

// A word gets a random rotation the first time it is written and keeps it while it is being edited,
// so the preview doesn't jump around on every keystroke
export const nextRotationDeg = (previous: Word, newWord: string): number | undefined => {
  if (newWord.trim() === "") return previous.rotationDeg;
  if (previous.word.trim() === "" || previous.rotationDeg === undefined) return randomRotationDeg();
  return previous.rotationDeg;
};
