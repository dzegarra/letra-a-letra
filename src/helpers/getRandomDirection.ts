import { WordDirection } from "../types";

export const getRandomDirection = (): WordDirection => (Math.random() > 0.5 ? "normal" : "reverse");
