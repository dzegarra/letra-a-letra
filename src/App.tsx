import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./components/Card";
import { Card as CardType } from "./types";
import { useCardsData } from "./hooks/useCardsData";
import { ConfigBar } from "./components/ConfigBar";

function App() {
  const lastCardsCountRef = useRef(-1);
  const { cards, setCards } = useCardsData();

  const updateCard = useCallback(
    (card: CardType) => {
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
    (card: CardType) => {
      setCards((cards) => {
        return cards.filter((c) => c.id !== card.id);
      });
    },
    [setCards],
  );

  // Scroll to the bottom each time a new card is added
  useEffect(() => {
    if (cards.length > lastCardsCountRef.current && lastCardsCountRef.current !== -1) {
      window.scrollTo(0, document.body.scrollHeight);
    }
    lastCardsCountRef.current = cards.length;
  }, [cards]);

  return (
    <div className="flex flex-col gap-5 p-4">
      <ConfigBar cards={cards} setCards={setCards} className="fixed top-0 left-0 w-full z-10 print:hidden" />

      <div className="flex flex-wrap gap-10 mt-[80px]">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.ul
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
              exit={{ opacity: 0, scale: 0.5 }}
              key={card.id}
            >
              <Card card={card} onUpdate={updateCard} onDelete={deleteCard} />
            </motion.ul>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
