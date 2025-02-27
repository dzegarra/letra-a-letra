import { ComponentProps, Dispatch, SetStateAction, useCallback } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../types";
import { CardFront } from "./CardFront";

type PageWithCardFrontsProps = {
  cards: Card[];
  hideIndex?: boolean;
  setCards: Dispatch<SetStateAction<Card[]>>;
} & ComponentProps<"div">;

export const PageWithCardFronts = ({ className, cards, hideIndex, setCards, ...props }: PageWithCardFrontsProps) => {
  const updateCard = useCallback(
    (card: Card) => {
      setCards((cards) => {
        const newCards = [...cards];
        const index = newCards.findIndex((c) => c.id === card.id);
        newCards.splice(index, 1, card);
        return newCards;
      });
    },
    [setCards],
  );

  const deleteCard = useCallback(
    (card: Card) => {
      setCards((cards) => {
        return cards.filter((c) => c.id !== card.id);
      });
    },
    [setCards],
  );

  return (
    <div className={clsx("flex flex-wrap gap-5", className)} {...props}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.ul
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
            exit={{ opacity: 0, scale: 0.5 }}
            key={card.id}
          >
            <CardFront index={index} card={card} onUpdate={updateCard} onDelete={deleteCard} hideIndex={hideIndex} />
          </motion.ul>
        ))}
      </AnimatePresence>
    </div>
  );
};
