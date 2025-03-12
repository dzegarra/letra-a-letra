import { ComponentProps, CSSProperties } from "react";
import clsx from "clsx";
import classes from "./CardRear.module.css";

type CardRearProps = {
  color: string;
} & ComponentProps<"div">;

/**
 * Reverse of the Cards.
 */
export const CardRear = ({ color, className, ...props }: CardRearProps) => (
  <div
    style={
      {
        "--color": color,
      } as CSSProperties
    }
    className={clsx(`h-[340px] w-[340px] rounded-full border border-slate-500`, classes.bgcolor, className)}
    {...props}
  ></div>
);
