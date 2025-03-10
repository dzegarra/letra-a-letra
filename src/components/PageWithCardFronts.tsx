import { ComponentProps } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { CardFront } from "./CardFront";
import { useCardsStore } from "../store";

type PageWithCardFrontsProps = {
  hideIndex?: boolean;
} & ComponentProps<"div">;

export const PageWithCardFronts = ({ className, hideIndex, ...props }: PageWithCardFrontsProps) => {
  const cards = useCardsStore((state) => state.cards);
  const updateCard = useCardsStore((state) => state.updateCard);

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
            <CardFront index={index} card={card} onUpdate={updateCard} hideIndex={hideIndex} />
          </motion.ul>
        ))}
      </AnimatePresence>
    </div>
  );
};
