import { useEffect, useState, useRef, useCallback } from "react";
import { Layout, FloatButton, Modal } from "antd";
import html2pdf from "html2pdf.js";
import { useCardsData } from "./hooks/useCardsData";
import { ConfigBar } from "./components/ConfigBar";
import { PageWithCardRears } from "./components/PageWithCardRears";
import { PageWithCardFronts } from "./components/PageWithCardFronts";
import { BgColorsOutlined, PlusOutlined } from "@ant-design/icons";
import { useCardsColor } from "./hooks/useCardsColor";
import { generateCard } from "./helpers/generateCard";
import { ColorsChanger } from "./components/ColorsChanger";

function App() {
  const [showRears, setShowRears] = useState(false);
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lastCardsCountRef = useRef(-1);
  const { cards, setCards } = useCardsData();
  const { colors } = useCardsColor(cards, setCards);

  // Scroll to the bottom each time a new card is added
  useEffect(() => {
    if (cards.length > lastCardsCountRef.current && lastCardsCountRef.current !== -1) {
      window.scrollTo(0, document.body.scrollHeight);
    }
    lastCardsCountRef.current = cards.length;
  }, [cards]);

  const downloadPdf = async () => {
    try {
      setShowRears(true);
      await html2pdf()
        .set({
          margin: 0.6,
          filename: "letra-a-letra.pdf",
          jsPDF: { unit: "cm", format: "A4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(cardsRef.current)
        .save();
    } finally {
      setShowRears(false);
    }
  };

  const addCard = useCallback(() => {
    setCards((cards) => [...cards, generateCard(colors)]);
  }, [setCards, colors]);

  return (
    <>
      <Layout>
        <ConfigBar
          cards={cards}
          setCards={setCards}
          className="fixed top-0 left-0 w-full z-10 print:hidden"
          onDownloadPdf={downloadPdf}
        />

        <Layout.Content style={{ marginTop: "12px" }}>
          <div className="flex flex-wrap flex-1 mx-3" ref={cardsRef}>
            <PageWithCardFronts cards={cards} setCards={setCards} hideIndex={showRears} />

            {showRears && <PageWithCardRears cards={cards} className="flex-row-reverse break-before-page" />}
          </div>
        </Layout.Content>
      </Layout>

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton type="primary" tooltip="Add new card" icon={<PlusOutlined />} onClick={addCard} />
        <FloatButton tooltip="Change colors" icon={<BgColorsOutlined />} onClick={() => setIsColorsModalOpen(true)} />
        <FloatButton.BackTop tooltip="Move to the top" />
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
}

export default App;
