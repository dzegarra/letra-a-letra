/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import classes from "./CircularWord.module.css";

type CircularWordProps = {
  className?: string;
  word: string;
  radius?: number;
  fontSize?: number;
  fontColor?: string;
  width?: string;
  height?: string;
  rotationDeg?: number;
  /** Shows a blinking caret after the last letter, while the word is being typed */
  caret?: boolean;
};

export const CircularWord = ({
  className,
  word,
  width,
  height,
  fontSize = 1,
  fontColor = "#000000",
  radius = 5,
  rotationDeg = 0,
  caret = false,
}: CircularWordProps) => (
  <span
    className={clsx(classes.ring, className)}
    style={
      {
        "--total": word.length + (caret ? 1 : 0),
        "--font-size": fontSize,
        "--font-color": fontColor,
        "--radius": radius,
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
    {caret && (
      <span className={classes.caret} style={{ "--index": word.length } as any}>
        |
      </span>
    )}
  </span>
);
