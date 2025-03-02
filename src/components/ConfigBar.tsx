import { ComponentProps, Dispatch, SetStateAction, useCallback } from "react";
import { Button, Layout, Tooltip, Space } from "antd";
import { DownloadOutlined, FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
import { Card as CardType } from "../types";
import { pickFile } from "../helpers/pickFile";
import { jsonToFile } from "../helpers/jsonToFile";
import { CardsCount } from "./CardsCount";

type ConfigBarProps = {
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
  onDownloadPdf: () => void;
} & ComponentProps<"div">;

export const ConfigBar = ({ className, cards, setCards, onDownloadPdf }: ConfigBarProps) => {
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
          setCards(decoded);
        } catch (err) {
          alert(String(err));
        }
      }
    });
  }, [setCards]);

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
      className={className}
    >
      <Space>
        <Tooltip title="Downloads the project as a file that can be used to continue the project later">
          <Button onClick={exportData} icon={<DownloadOutlined />}>
            Export
          </Button>
        </Tooltip>

        <Tooltip title="Import a previously exported project file">
          <Button onClick={importFile} icon={<UploadOutlined />}>
            Import
          </Button>
        </Tooltip>

        <Tooltip title="Downloads the project as a PDF file">
          <Button onClick={onDownloadPdf} icon={<FilePdfOutlined />}>
            Generate PDF
          </Button>
        </Tooltip>
      </Space>

      <CardsCount count={cards.length} />
    </Layout.Header>
  );
};
