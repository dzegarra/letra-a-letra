import { formatRgb, parse } from "culori";
import html2canvas from "html2canvas";

const oklchColorPattern = /oklch\([^)]*\)/gi;

export const convertOklchToRgb = (value: string) =>
  value.replace(oklchColorPattern, (oklchColor) => {
    const color = parse(oklchColor);
    if (!color) {
      throw new Error(`Unable to convert CSS color "${oklchColor}" to RGB.`);
    }
    return formatRgb(color);
  });

const normalizeElementColors = (doc: Document, root: HTMLElement) => {
  const view = doc.defaultView;
  if (!view) {
    throw new Error("Cannot normalize CSS colors without a document window.");
  }

  const elements = [root, ...root.querySelectorAll<HTMLElement | SVGElement>("*")];

  elements.forEach((element) => {
    const computedStyle = view.getComputedStyle(element);

    for (let index = 0; index < computedStyle.length; index += 1) {
      const property = computedStyle.item(index);
      const value = computedStyle.getPropertyValue(property);
      if (value.toLowerCase().includes("oklch(")) {
        element.style.setProperty(property, convertOklchToRgb(value));
      }
    }
  });
};

export const captureElementAsCanvas = (element: HTMLElement) =>
  html2canvas(element, {
    onclone: (doc, clonedElement) => normalizeElementColors(doc, clonedElement),
  });
