import { ComponentProps, useMemo } from "react";
import { getCardsColors } from "../helpers/getCardsColors";
import { Card } from "../types";
import { CardRear } from "./CardRear";
import clsx from "clsx";

type PageWithCardRearsProps = {
  cards: Card[];
} & ComponentProps<"div">;

export const PageWithCardRears = ({ cards, className, ...props }: PageWithCardRearsProps) => {
  const colors = getCardsColors(cards);

  const cardsDistribution = useMemo(() => {
    const distribution = [];
    const baseCount = Math.floor(cards.length / colors.length);
    const extraCount = cards.length % colors.length;

    for (let i = 0; i < colors.length; i++) {
      const count = baseCount + (i < extraCount ? 1 : 0);
      for (let j = 0; j < count; j++) {
        distribution.push({ color: colors[i], count: 1 });
      }
    }

    return distribution;
  }, [cards.length, colors]);

  return (
    <div className={clsx("flex flex-wrap gap-5", className)} {...props}>
      {cardsDistribution.map(({ color }, index) => (
        <CardRear key={index} color={color} />
      ))}
    </div>
  );
};
