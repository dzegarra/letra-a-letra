import { useRef, useState } from "react";
import { Layout, Modal } from "antd";
import { AppHeader } from "./components/AppHeader";
import { PreviewView } from "./components/PreviewView";
import { useViewMode } from "./hooks/useViewMode";
import { TableView } from "./components/TableView";
import { PrintDocument } from "./components/PrintDocument";
import { useTranslation } from "react-i18next";

function App() {
  const scrollableContainer = useRef<HTMLDivElement>(null);
  const { viewMode, setViewMode } = useViewMode();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <AppHeader
          className="fixed top-0 left-0 w-full z-10 print:hidden"
          onDownloadPdf={() => setOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Layout.Content className="overflow-y-auto flex flex-col flex-1" ref={scrollableContainer}>
          {viewMode === "preview" && <PreviewView scrollableContainer={scrollableContainer.current} />}

          {viewMode === "table" && <TableView />}
        </Layout.Content>
      </Layout>
      <Modal
        title={t("generatePdfModalTitle")}
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
        destroyOnClose
        width={1050}
        closable={false}
        keyboard={false}
        maskClosable={false}
        footer={null}
      >
        <PrintDocument className="max-h-[600px]" onComplete={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export default App;
