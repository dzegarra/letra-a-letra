import { Dispatch, SetStateAction, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { FloatButton, Modal } from "antd";
import { BgColorsOutlined, PlusOutlined } from "@ant-design/icons";
import { PageWithCardFronts } from "./PageWithCardFronts";
import { PageWithCardRears } from "./PageWithCardRears";
import { Card } from "../types";
import { ColorsChanger } from "./ColorsChanger";
import { generateCard } from "../helpers/generateCard";
import { useCardsColor } from "../hooks/useCardsColor";

type PreviewViewProps = {
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
  showRears: boolean;
  scrollableContainer?: HTMLDivElement | null;
};

export const PreviewView = forwardRef<HTMLDivElement, PreviewViewProps>(
  ({ showRears, cards, setCards, scrollableContainer, ...props }, ref) => {
    const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
    const { colors } = useCardsColor(cards, setCards);
    const lastCardsCountRef = useRef(-1);

    const addCard = useCallback(() => {
      setCards((cards) => [...cards, generateCard(colors)]);
    }, [setCards, colors]);

    // Scroll to the bottom each time a new card is added
    useEffect(() => {
      if (cards.length > lastCardsCountRef.current && lastCardsCountRef.current !== -1) {
        scrollableContainer?.scrollTo(0, scrollableContainer?.scrollHeight);
      }
      lastCardsCountRef.current = cards.length;
    }, [cards]);

    return (
      <>
        <div className="flex flex-wrap flex-1 mx-3 my-2" {...props} ref={ref}>
          <PageWithCardFronts cards={cards} setCards={setCards} hideIndex={showRears} />

          {showRears && <PageWithCardRears cards={cards} className="flex-row-reverse break-before-page" />}
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
          <ColorsChanger cards={cards} setCards={setCards} className="mt-5" />
        </Modal>
      </>
    );
  },
);
