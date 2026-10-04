import { ComponentProps, CSSProperties } from "react";
import clsx from "clsx";
import { defaultRearDesign, RearDesign, rearDesigns } from "../rearDesigns";
import { useCardsStore } from "../store";

type CardRearProps = {
  color: string;
  design?: RearDesign;
} & ComponentProps<"div">;

/**
 * Reverse of the Cards.
 */
export const CardRear = ({ color, design = defaultRearDesign, className, style, ...props }: CardRearProps) => {
  const customRearImage = useCardsStore((state) => state.customRearImage);
  const image = design === "custom" ? customRearImage : rearDesigns[design];
  return (
    <div
      style={
        {
          backgroundColor: color,
          backgroundImage: image ? `url("${image}")` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          ...style,
        } as CSSProperties
      }
      className={clsx(`h-[340px] w-[340px] rounded-full border border-slate-500`, className)}
      {...props}
    ></div>
  );
};
