import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./components/Card";
import { Card as CardType } from "./types";
import { jsonToFile } from "./helpers/jsonToFile";
import { generateCardId } from "./helpers/generateCardId";
import { defaultWords } from "./constants";
import { useCardsData } from "./hooks/useCardsData";

function App() {
  const lastCardsCountRef = useRef(-1);
  const { cards, setCards } = useCardsData();

  const duplicateLastCard = useCallback(() => {
    setCards((cards) => {
      const lastCard = cards.length
        ? cards[cards.length - 1]
        : {
            id: generateCardId(),
            words: defaultWords,
          };
      const newCard = {
        id: generateCardId(),
        words: lastCard.words.map((card) => ({ ...card, word: "" })),
      };
      return [...cards, newCard];
    });
  }, [setCards]);

  const exportData = useCallback(() => {
    jsonToFile(cards, "letra-a-letra");
  }, [cards]);

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
      <div className="flex gap-2 items-center p-4 fixed top-0 left-0 bg-cyan-200 border-b-slate-400 w-full z-10 print:hidden">
        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={duplicateLastCard}>
          ➕Añadir tarjeta
        </button>

        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={exportData}>
          💾Guardar en disco
        </button>

        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={() => window.print()}>
          🖨️ Imprimir
        </button>

        <div>Numero de cartas: {cards.length}</div>
      </div>

      <div className="flex flex-wrap gap-5 mt-[80px]">
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
