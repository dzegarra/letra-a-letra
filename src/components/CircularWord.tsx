/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import classes from "./CircularWord.module.css";

type CircularWordProps = {
  className?: string;
  word: string;
  /** Distance in px from the center of the ring to the vertical center of the capital letters */
  radius?: number;
  fontSize?: number;
  fontColor?: string;
  width?: string;
  height?: string;
  rotationDeg?: number;
};

const capCenterOffsets = new Map<string, number>();

/**
 * The browser centers the line box of a letter, which keeps room for accents and descenders.
 * Words are always uppercase, so this returns how many px the capital letters sit above that center.
 */
const capCenterOffset = (font: string) => {
  const cached = capCenterOffsets.get(font);
  if (cached !== undefined) return cached;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return 0;
  context.font = font;
  const metrics = context.measureText("H");
  const offset =
    metrics.actualBoundingBoxAscent / 2 - (metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2;
  const result = Number.isFinite(offset) ? offset : 0;
  capCenterOffsets.set(font, result);
  return result;
};

export const CircularWord = ({
  className,
  word,
  width,
  height,
  fontSize = 1,
  fontColor = "#000000",
  radius = 80,
  rotationDeg = 0,
}: CircularWordProps) => {
  const ringRef = useRef<HTMLSpanElement>(null);
  const [capOffset, setCapOffset] = useState(0);

  useLayoutEffect(() => {
    const letter = ringRef.current?.firstElementChild;
    if (!letter) return;
    const style = getComputedStyle(letter);
    setCapOffset(capCenterOffset(`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`));
  }, [fontSize, word]);

  return (
    <span
      ref={ringRef}
      className={clsx(classes.ring, className)}
      style={
        {
          "--total": word.length,
          "--font-size": fontSize,
          "--font-color": fontColor,
          "--radius": `${radius - capOffset}px`,
          "--rotation": `${rotationDeg}deg`,
          width,
          height,
        } as any
      }
    >
      {word.split("").map((letter, i) => (
        <span key={i} style={{ "--index": i } as any}>
          {letter}
        </span>
      ))}
    </span>
  );
};
