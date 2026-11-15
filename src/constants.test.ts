import { describe, expect, it } from "vitest";
import { cardSizes } from "./constants";

describe("cardSizes", () => {
  it("uses standard CSS transforms for PDF-compatible scaling", () => {
    expect(cardSizes).toEqual({
      S: "scale(1)",
      M: "scale(1.1)",
      L: "scale(1.25)",
    });
  });
});
