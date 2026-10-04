/** Largest side, in pixels, a PNG is scaled down to. It is enough for a 340px card printed at high resolution. */
const maxPngSidePx = 1200;
/** SVGs are kept as they are, so they are only limited by size to fit in localStorage. */
const maxSvgBytes = 1024 * 1024;

export class RearImageError extends Error {
  constructor(public reason: "type" | "size" | "invalid") {
    super(reason);
  }
}

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new RearImageError("invalid"));
    reader.readAsDataURL(blob);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new RearImageError("invalid"));
    image.src = src;
  });

/**
 * Some browsers can't draw an SVG without width and height into a canvas (what the PDF capture does),
 * so they are taken from the viewBox when missing.
 */
const withIntrinsicSize = (svgText: string) => {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.documentElement;
  if (svg.nodeName !== "svg" || doc.querySelector("parsererror")) throw new RearImageError("invalid");
  if (!svg.getAttribute("width") || !svg.getAttribute("height")) {
    const viewBox = svg
      .getAttribute("viewBox")
      ?.split(/[\s,]+/)
      .map(Number);
    const [w, h] = viewBox && viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0 ? viewBox.slice(2) : [400, 400];
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
  }
  return new XMLSerializer().serializeToString(doc);
};

/**
 * Reads an SVG or PNG chosen by the user and returns it as a data URL ready to be stored and used as the rear
 * of the cards.
 */
export async function readRearImage(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (file.type === "image/svg+xml" || name.endsWith(".svg")) {
    if (file.size > maxSvgBytes) throw new RearImageError("size");
    const svg = withIntrinsicSize(await file.text());
    const dataUrl = await readAsDataUrl(new Blob([svg], { type: "image/svg+xml" }));
    await loadImage(dataUrl);
    return dataUrl;
  }
  if (file.type === "image/png" || name.endsWith(".png")) {
    const image = await loadImage(await readAsDataUrl(file));
    const scale = Math.min(1, maxPngSidePx / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }
  throw new RearImageError("type");
}
