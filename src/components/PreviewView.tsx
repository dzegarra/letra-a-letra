import { forwardRef, useEffect, useRef, useState } from "react";
import { FloatButton, Modal } from "antd";
import { motion, AnimatePresence } from "motion/react";
import { BgColorsOutlined, PlusOutlined } from "@ant-design/icons";
import { ColorsChanger } from "./ColorsChanger";
import { useCardsStore } from "../store";
import { CardFront } from "./CardFront";

type PreviewViewProps = {
  scrollableContainer?: HTMLDivElement | null;
};

export const PreviewView = forwardRef<HTMLDivElement, PreviewViewProps>(({ scrollableContainer, ...props }, ref) => {
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const cards = useCardsStore((state) => state.cards);
  const addCard = useCardsStore((state) => state.addCard);
  const updateCard = useCardsStore((state) => state.updateCard);
  const lastCardsCountRef = useRef(-1);

  // Scroll to the bottom each time a new card is added
  useEffect(() => {
    if (cards.length > lastCardsCountRef.current && lastCardsCountRef.current !== -1) {
      scrollableContainer?.scrollTo(0, scrollableContainer?.scrollHeight);
    }
    lastCardsCountRef.current = cards.length;
  }, [cards, scrollableContainer]);

  return (
    <>
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
        </div>
      </div>

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton type="primary" tooltip="Add new card" icon={<PlusOutlined />} onClick={addCard} />
        <FloatButton tooltip="Change colors" icon={<BgColorsOutlined />} onClick={() => setIsColorsModalOpen(true)} />
        <FloatButton.BackTop tooltip="Move to the top" target={() => scrollableContainer ?? window} />
      </FloatButton.Group>

      <Modal
        centered
        title="Colors of the cards"
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
