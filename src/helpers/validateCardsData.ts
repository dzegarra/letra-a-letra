import { z } from "zod";

export const cardsSchema = z.array(
  z.object({
    id: z.string(),
    words: z
      .array(
        z.object({
          word: z.string().max(50),
          color: z.string().max(12),
          rotationDeg: z.number().int().gte(0).lte(360).optional(),
        }),
      )
      .length(3),
  }),
);
