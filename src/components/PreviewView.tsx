import { forwardRef, useEffect, useRef, useState } from "react";
import { FloatButton, Modal } from "antd";
import { motion, AnimatePresence } from "motion/react";
import { BgColorsOutlined, PlusOutlined } from "@ant-design/icons";
import { ColorsChanger } from "./ColorsChanger";
import { useCardsStore } from "../store";
import { CardFront } from "./CardFront";
import { useTranslation } from "react-i18next";
import { EmptyCards } from "./EmptyCards";

type PreviewViewProps = {
  scrollableContainer?: HTMLDivElement | null;
};

export const PreviewView = forwardRef<HTMLDivElement, PreviewViewProps>(({ scrollableContainer, ...props }, ref) => {
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const cards = useCardsStore((state) => state.cards);
  const addCard = useCardsStore((state) => state.addCard);
  const updateCard = useCardsStore((state) => state.updateCard);
  const lastCardsCountRef = useRef(-1);
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
      <div className="flex flex-wrap flex-1 mx-3 my-2" {...props} ref={ref}>
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
                <CardFront index={index} card={card} onUpdate={updateCard} />
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

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton
          tooltip={t("changeColors")}
          icon={<BgColorsOutlined />}
          onClick={() => setIsColorsModalOpen(true)}
        />
        <FloatButton.BackTop tooltip={t("moveToTheTop")} target={() => scrollableContainer ?? window} />
      </FloatButton.Group>

      <Modal
        centered
        title={t("colorsOfTheCards")}
        width={300}
        footer={null}
        open={isColorsModalOpen}
        onCancel={() => setIsColorsModalOpen(false)}
      >
        <ColorsChanger className="mt-5" />
      </Modal>
    </>
  );
});
