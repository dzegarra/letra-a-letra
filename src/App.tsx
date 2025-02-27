import { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useCardsData } from "./hooks/useCardsData";
import { ConfigBar } from "./components/ConfigBar";
import { PageWithCardRears } from "./components/PageWithCardRears";
import { PageWithCardFronts } from "./components/PageWithCardFronts";

function App() {
  const [showRears, setShowRears] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lastCardsCountRef = useRef(-1);
  const { cards, setCards } = useCardsData();

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

  return (
    <div className="flex flex-col gap-5 p-4">
      <ConfigBar
        cards={cards}
        setCards={setCards}
        className="fixed top-0 left-0 w-full z-10 print:hidden"
        onDownloadPdf={downloadPdf}
      />

      <div className="flex mt-[80px]">
        <div className="flex flex-wrap flex-1" ref={cardsRef}>
          <PageWithCardFronts cards={cards} setCards={setCards} />
          {showRears && <PageWithCardRears cards={cards} className="flex-row-reverse break-before-page" />}
        </div>
      </div>
    </div>
  );
}

export default App;
