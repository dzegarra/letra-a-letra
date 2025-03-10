import { forwardRef, useEffect, useRef, useState } from "react";
import { FloatButton, Modal } from "antd";
import { BgColorsOutlined, PlusOutlined } from "@ant-design/icons";
import { PageWithCardFronts } from "./PageWithCardFronts";
import { PageWithCardRears } from "./PageWithCardRears";
import { ColorsChanger } from "./ColorsChanger";
import { useCardsStore } from "../store";

type PreviewViewProps = {
  showRears: boolean;
  scrollableContainer?: HTMLDivElement | null;
};

export const PreviewView = forwardRef<HTMLDivElement, PreviewViewProps>(
  ({ showRears, scrollableContainer, ...props }, ref) => {
    const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
    const cards = useCardsStore((state) => state.cards);
    const addCard = useCardsStore((state) => state.addCard);
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
          <PageWithCardFronts hideIndex={showRears} />

          {showRears && <PageWithCardRears className="flex-row-reverse break-before-page" />}
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
  },
);
