import { useRef } from "react";
import { Layout } from "antd";
import html2pdf from "html2pdf.js";
import { AppHeader } from "./components/AppHeader";
import { PreviewView } from "./components/PreviewView";
import { useViewMode } from "./hooks/useViewMode";
import { TableView } from "./components/TableView";
import { PrintDocument } from "./components/PrintDocument";

function App() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollableContainer = useRef<HTMLDivElement>(null);
  const { viewMode, setViewMode } = useViewMode();

  const downloadPdf = async () => {
    await html2pdf()
      .set({
        filename: "letra-a-letra.pdf",
        jsPDF: { format: "A4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(cardsRef.current)
      .save();
  };

  return (
    <>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <AppHeader
          className="fixed top-0 left-0 w-full z-10 print:hidden"
          onDownloadPdf={downloadPdf}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Layout.Content className="overflow-y-auto flex-1" ref={scrollableContainer}>
          {viewMode === "preview" && (
            <div>
              <PreviewView scrollableContainer={scrollableContainer.current} />
            </div>
          )}

          {viewMode === "table" && <TableView />}

          {viewMode === "print" && <PrintDocument ref={cardsRef} />}
        </Layout.Content>
      </Layout>
    </>
  );
}

export default App;
