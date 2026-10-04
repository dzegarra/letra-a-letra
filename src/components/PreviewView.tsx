import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { FloatButton } from "antd";
import { motion, AnimatePresence } from "motion/react";
import { PlusOutlined } from "@ant-design/icons";
import { useCardsStore } from "../store";
import { CardFront } from "./CardFront";
import { useTranslation } from "react-i18next";
import { EmptyCards } from "./EmptyCards";
import { CardEditor } from "./CardEditor";
import { Card } from "../types";

type PreviewViewProps = {
  scrollableContainer?: HTMLDivElement | null;
};

export const PreviewView = forwardRef<HTMLDivElement, PreviewViewProps>(({ scrollableContainer, ...props }, ref) => {
  const cards = useCardsStore((state) => state.cards);
  const addCard = useCardsStore((state) => state.addCard);
  const updateCard = useCardsStore((state) => state.updateCard);
  const lastCardsCountRef = useRef(-1);
  const [editingId, setEditingId] = useState<string>();
  const editingIndex = cards.findIndex((card) => card.id === editingId);
  const editingCard = editingIndex === -1 ? undefined : cards[editingIndex];
  // Forget the card once it is gone (deleted from the editor, new project), so a later import that
  // brings back a card with the same id doesn't reopen the editor on its own
  if (editingId !== undefined && editingIndex === -1) setEditingId(undefined);
  const lastEditingIndexRef = useRef(0);
  if (editingIndex !== -1) lastEditingIndexRef.current = editingIndex;

  const closeEditor = useCallback(() => setEditingId(undefined), []);

  const saveCard = useCallback(
    (card: Card) => {
      updateCard(card);
      setEditingId(undefined);
    },
    [updateCard],
  );

  // Saves the card and moves on to the next one, creating a new card after the last one
  const saveCardAndEditNext = useCallback(
    (card: Card) => {
      updateCard(card);
      const { cards } = useCardsStore.getState();
      const index = cards.findIndex(({ id }) => id === card.id);
      if (index === cards.length - 1) addCard();
      setEditingId(useCardsStore.getState().cards[index + 1]?.id);
    },
    [updateCard, addCard],
  );
  const { t } = useTranslation();

  // Scroll to the bottom each time a new card is added
  useEffect(() => {
    if (cards.length > lastCardsCountRef.current && lastCardsCountRef.current !== -1) {
      scrollableContainer?.scrollTo(0, scrollableContainer?.scrollHeight);
    }
    lastCardsCountRef.current = cards.length;
  }, [cards, scrollableContainer]);

  return (
    <>
      {cards.length === 0 && <EmptyCards className="h-full" />}
      <div className="mx-3 my-2" {...props} ref={ref}>
        <div className="flex flex-wrap gap-5">
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.ul
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                exit={{ opacity: 0, scale: 0.5 }}
                key={card.id}
              >
                <CardFront index={index} card={card} onEdit={() => setEditingId(card.id)} />
              </motion.ul>
            ))}
          </AnimatePresence>
          {cards.length > 0 && (
            <button
              type="button"
              onClick={addCard}
              aria-label={t("addNewCard")}
              className="h-[340px] w-[340px] rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center gap-2"
            >
              <PlusOutlined className="text-5xl" />
              <span className="text-base">{t("addNewCard")}</span>
            </button>
          )}
        </div>
      </div>

      <CardEditor
        card={editingCard}
        index={lastEditingIndexRef.current}
        onSave={saveCard}
        onSaveAndNext={saveCardAndEditNext}
        onClose={closeEditor}
      />

      <FloatButton.BackTop
        tooltip={t("moveToTheTop")}
        target={() => scrollableContainer ?? window}
        style={{ insetInlineEnd: 24 }}
      />
    </>
  );
});
