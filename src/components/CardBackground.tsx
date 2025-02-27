import { ComponentProps, CSSProperties } from "react";
import clsx from "clsx";
import classes from "./CardBackground.module.css";

type CardBackgroundProps = {
  size: string;
  color1: string;
  color2: string;
  color3: string;
} & ComponentProps<"div">;

export const CardBackground = ({ size, className, color1, color2, color3, ...props }: CardBackgroundProps) => (
  <div
    style={
      {
        width: size,
        height: size,
        "--color1": color1,
        "--color2": color2,
        "--color3": color3,
      } as CSSProperties
    }
    className={clsx(
      `top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute rounded-full border border-slate-500`,
      classes.bgcolor,
      className,
    )}
    {...props}
  ></div>
);
