import { ComponentProps, Dispatch, SetStateAction, useCallback } from "react";
import { Button, Layout, Tooltip, Space, Segmented } from "antd";
import { AppstoreOutlined, BarsOutlined, DownloadOutlined, FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ViewMode } from "../types";
import { pickFile } from "../helpers/pickFile";
import { jsonToFile } from "../helpers/jsonToFile";
import { CardsCount } from "./CardsCount";
import { useCardsStore } from "../store";
import { LangSelector } from "./LangSelector";

type AppHeaderProps = {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  onDownloadPdf: () => void;
} & ComponentProps<typeof Layout.Header>;

export const AppHeader = ({ onDownloadPdf, viewMode, setViewMode, ...props }: AppHeaderProps) => {
  const cards = useCardsStore((store) => store.cards);
  const importCards = useCardsStore((store) => store.importCards);
  const { t } = useTranslation();

  const exportData = useCallback(() => {
    jsonToFile(cards, "project-export");
  }, [cards]);

  const importFile = useCallback(() => {
    pickFile(async function (files) {
      if (files && files.length) {
        const file = files[0];
        try {
          const text = await file.text();
          const decoded = JSON.parse(text);
          importCards(decoded);
        } catch (err) {
          alert(String(err));
        }
      }
    });
  }, [importCards]);

  return (
    <Layout.Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
      {...props}
    >
      <Space>
        <Tooltip title={t("exportTooltip")}>
          <Button onClick={exportData} icon={<DownloadOutlined />}>
            {t("export")}
          </Button>
        </Tooltip>

        <Tooltip title={t("importTooltip")}>
          <Button onClick={importFile} icon={<UploadOutlined />}>
            {t("import")}
          </Button>
        </Tooltip>

        <Tooltip title={t("generatePdfTooltip")}>
          <Button onClick={onDownloadPdf} icon={<FilePdfOutlined />} type="primary">
            {t("generatePdf")}
          </Button>
        </Tooltip>
      </Space>

      <Segmented
        value={viewMode}
        onChange={setViewMode}
        options={[
          { value: "preview", label: t("preview"), icon: <AppstoreOutlined /> },
          { value: "table", label: t("table"), icon: <BarsOutlined /> },
        ]}
      />

      <LangSelector />

      <CardsCount count={cards.length} />
    </Layout.Header>
  );
};
