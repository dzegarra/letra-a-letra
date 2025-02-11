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
}: CircularWordProps) => (
  <span
    className={clsx(classes.ring, className)}
    style={
      {
        "--total": word.length,
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
  </span>
);
