import clsx from "clsx";
import classes from "./CircularWord.module.css";
import { WordDirection } from "../types";

type CircularWordProps = {
  className?: string;
  word: string;
  direction?: WordDirection;
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
  direction,
  width,
  height,
  fontSize = 1,
  fontColor = "#000000",
  radius = 5,
  rotationDeg = 0,
}: CircularWordProps) => {
  const letters = word.split("");
  return (
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
      {(direction === "normal" ? letters : letters.reverse()).map((letter, i) => (
        <span key={i} style={{ "--index": i } as any}>
          {letter}
        </span>
      ))}
    </span>
  );
};