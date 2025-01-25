import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./components/Card";
import { Word } from "./types";

const defaultWords: Word[] = [
  {
    word: "",
    color: "#C0392B",
  },
  {
    word: "",
    color: "#8E44AD",
  },
  {
    word: "",
    color: "#27AE60",
  },
];

function App() {
  const initialLoadRef = useRef(true);
  const lastCardsCountRef = useRef(0);
  const [cards, setCards] = useState<Word[][]>([]);

  const restore = useCallback((showConfirmation = true) => {
    const savedCards = localStorage.getItem("cards");
    if (savedCards) {
      setCards(JSON.parse(savedCards));
      if (showConfirmation) alert("Restaurado");
    } else {
      if (showConfirmation) alert("No habia datos guardados");
    }
  }, []);

  const save = useCallback(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
    alert("Guardado");
  }, [cards]);

  const addCard = useCallback(() => {
    setCards((cards) => [...cards, defaultWords]);
  }, []);

  const duplicateLastCard = useCallback(() => {
    const lastCard = cards.length ? cards[cards.length - 1] : defaultWords;
    setCards((cards) => [...cards, lastCard.map((word) => ({ ...word, word: "" }))]);
  }, [cards]);

  const updateCard = useCallback((words: Word[], index: number) => {
    setCards((cards) => {
      const newCards = [...cards];
      newCards.splice(index, 1, words);
      return newCards;
    });
  }, []);

  const deleteCard = useCallback((index: number) => {
    setCards((cards) => {
      const newCards = [...cards];
      newCards.splice(index, 1);
      return newCards;
    });
  }, []);

  useEffect(() => {
    if (initialLoadRef.current && cards.length === 0) {
      initialLoadRef.current = false;
      restore(false);
    }
  }, [restore, cards]);

  useEffect(() => {
    if (cards.length > lastCardsCountRef.current) {
      window.scrollTo(0, document.body.scrollHeight);
    }
    lastCardsCountRef.current = cards.length;
  }, [cards]);

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex gap-2 items-center p-4 fixed top-0 left-0 bg-cyan-200 border-b-slate-400 w-full z-10 print:hidden">
        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={addCard}>
          ➕Añadir tarjeta
        </button>
        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={duplicateLastCard}>
          Duplicar ultima tarjeta
        </button>
        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={save}>
          💾Guardar
        </button>
        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={() => restore()}>
          Restaurar
        </button>

        <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={() => window.print()}>
          🖨️ Imprimir
        </button>

        <div>Numero de cartas: {cards.length}</div>
      </div>

      <div className="flex flex-wrap gap-5 mt-[80px]">
        <AnimatePresence>
          {cards.map((words, index) => (
            <motion.ul
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
              exit={{ opacity: 0, scale: 0.5 }}
              key={index}
            >
              <Card words={words} onUpdate={(words) => updateCard(words, index)} onDelete={() => deleteCard(index)} />
            </motion.ul>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
