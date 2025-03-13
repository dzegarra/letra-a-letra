import { ComponentProps, useMemo } from "react";
import { CardRear } from "./CardRear";
import { useCardsStore } from "../store";
import { PrintPage } from "./PrintPage";

type PrintPageCardRearsProps = ComponentProps<"div">;

export const PrintPageCardRears = ({ ...props }: PrintPageCardRearsProps) => {
  const cards = useCardsStore((state) => state.cards);
  const colors = useCardsStore((state) => state.colors);

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
    <PrintPage {...props}>
      {cardsDistribution.map(({ color }, index) => (
        <CardRear key={index} color={color} />
      ))}
    </PrintPage>
  );
};
