import { describe, expect, it } from "vitest";
import { convertOklchToRgb } from "./captureElementAsCanvas";

describe("convertOklchToRgb", () => {
  it("converts oklch colors embedded in CSS declarations", () => {
    expect(convertOklchToRgb("1px solid oklch(62.8% 0.257 29.23)")).toBe("1px solid rgb(255, 3, 2)");
  });

  it("preserves transparency when converting oklch colors", () => {
    expect(convertOklchToRgb("oklch(62.8% 0.257 29.23 / 50%)")).toBe("rgba(255, 3, 2, 0.5)");
  });

  it("leaves CSS declarations without oklch colors unchanged", () => {
    expect(convertOklchToRgb("0 1px 2px rgb(0, 0, 0 / 0.2)")).toBe("0 1px 2px rgb(0, 0, 0 / 0.2)");
  });
});
