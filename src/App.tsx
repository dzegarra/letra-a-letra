import { useState, useRef } from "react";
import { Layout } from "antd";
import html2pdf from "html2pdf.js";
import { useCardsData } from "./hooks/useCardsData";
import { AppHeader } from "./components/AppHeader";
import { PreviewView } from "./components/PreviewView";
import { useViewMode } from "./hooks/useViewMode";
import { TableView } from "./components/TableView";

function App() {
  const [showRears, setShowRears] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollableContainer = useRef<HTMLDivElement>(null);
  const { cards, setCards } = useCardsData();
  const { viewMode, setViewMode } = useViewMode();

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
    <>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <AppHeader
          className="fixed top-0 left-0 w-full z-10 print:hidden"
          cards={cards}
          setCards={setCards}
          onDownloadPdf={downloadPdf}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Layout.Content className="overflow-y-auto flex-1" ref={scrollableContainer}>
          {viewMode === "preview" && (
            <div ref={cardsRef}>
              <PreviewView
                cards={cards}
                setCards={setCards}
                showRears={showRears}
                scrollableContainer={scrollableContainer.current}
              />
            </div>
          )}

          {viewMode === "table" && <TableView cards={cards} setCards={setCards} />}
        </Layout.Content>
      </Layout>
    </>
  );
}

export default App;
