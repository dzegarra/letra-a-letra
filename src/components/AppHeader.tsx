import { ComponentProps, Dispatch, SetStateAction, useCallback, useState } from "react";
import { Button, Dropdown, Grid, Layout, MenuProps, Modal, Segmented, Space, Tooltip } from "antd";
import {
  AppstoreOutlined,
  BgColorsOutlined,
  BarsOutlined,
  DownloadOutlined,
  FlagOutlined,
  FormatPainterOutlined,
  MobileOutlined,
  MoreOutlined,
  PrinterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ViewMode } from "../types";
import { pickFile } from "../helpers/pickFile";
import { jsonToFile } from "../helpers/jsonToFile";
import { CardsCount } from "./CardsCount";
import { ColorsChanger } from "./ColorsChanger";
import { useCardsStore } from "../store";
import { LangSelector } from "./LangSelector";
import { languages } from "../constants";
import { NewProjectPopConfirm } from "./NewProjectPopConfirm";
import { useCardLength } from "../hooks/useCardLength";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

type AppHeaderProps = {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  onDownloadPdf: () => void;
} & ComponentProps<typeof Layout.Header>;

export const AppHeader = ({ onDownloadPdf, viewMode, setViewMode, ...props }: AppHeaderProps) => {
  const cardsLength = useCardLength();
  const importCards = useCardsStore((store) => store.importCards);
  const deleteAllCards = useCardsStore((store) => store.deleteAllCards);
  const { t, i18n } = useTranslation();
  const { canInstall, install } = useInstallPrompt();
  const screens = Grid.useBreakpoint();
  // Secondary actions only fit as buttons on very wide screens; below that they go in a "more" menu
  const showSecondaryInline = screens.xl === true;
  const isPhone = !screens.sm;
  const [modal, modalContextHolder] = Modal.useModal();
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);

  const exportData = useCallback(() => {
    const cards = useCardsStore.getState().cards;
    jsonToFile(cards, "project-export");
  }, []);

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

  const confirmNewProject = useCallback(() => {
    modal.confirm({
      title: t("newProject"),
      content: t("newProjectConfirmationMessage"),
      okText: t("yes"),
      cancelText: t("no"),
      onOk: deleteAllCards,
    });
  }, [modal, t, deleteAllCards]);

  const moreMenuItems: MenuProps["items"] = [
    { key: "newProject", label: t("newProject"), icon: <FormatPainterOutlined />, disabled: cardsLength === 0 },
    { key: "export", label: t("export"), icon: <DownloadOutlined /> },
    { key: "import", label: t("import"), icon: <UploadOutlined /> },
    ...(canInstall ? [{ key: "install", label: t("install"), icon: <MobileOutlined /> }] : []),
    { type: "divider" },
    {
      key: "language",
      label: t("language"),
      icon: <FlagOutlined />,
      children: languages.map(({ key, label }) => ({ key: `lang:${key}`, label })),
    },
  ];

  const handleMoreMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("lang:")) i18n.changeLanguage(key.slice("lang:".length));
    else if (key === "newProject") confirmNewProject();
    else if (key === "export") exportData();
    else if (key === "import") importFile();
    else if (key === "install") install();
  };

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
        gap: isPhone ? 8 : 16,
        padding: isPhone ? "0 12px" : "0 24px",
      }}
      {...props}
    >
      {modalContextHolder}

      <Space>
        <Tooltip title={t("generatePdfTooltip")}>
          <Button onClick={onDownloadPdf} icon={<PrinterOutlined />} type="primary" aria-label={t("generatePdf")}>
            {!isPhone && t("generatePdf")}
          </Button>
        </Tooltip>

        <Button onClick={() => setIsColorsModalOpen(true)} icon={<BgColorsOutlined />} aria-label={t("changeColors")}>
          {screens.md && t("changeColors")}
        </Button>
      </Space>

      <Modal
        centered
        title={t("colorsOfTheCards")}
        width={300}
        footer={null}
        open={isColorsModalOpen}
        onCancel={() => setIsColorsModalOpen(false)}
      >
        <ColorsChanger className="mt-5" />
      </Modal>

      <Segmented
        value={viewMode}
        onChange={setViewMode}
        options={[
          {
            value: "preview",
            label: isPhone ? undefined : t("preview"),
            title: t("preview"),
            icon: <AppstoreOutlined />,
          },
          { value: "table", label: isPhone ? undefined : t("table"), title: t("table"), icon: <BarsOutlined /> },
        ]}
      />

      <Space>
        {showSecondaryInline ? (
          <>
            {cardsLength > 0 && (
              <NewProjectPopConfirm>
                <Button icon={<FormatPainterOutlined />}>{t("newProject")}</Button>
              </NewProjectPopConfirm>
            )}

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

            {canInstall && (
              <Tooltip title={t("installTooltip")}>
                <Button onClick={install} icon={<MobileOutlined />}>
                  {t("install")}
                </Button>
              </Tooltip>
            )}

            <LangSelector />
          </>
        ) : (
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{ items: moreMenuItems, onClick: handleMoreMenuClick }}
          >
            <Button icon={<MoreOutlined />} aria-label={t("more")} />
          </Dropdown>
        )}

        <CardsCount count={cardsLength} compact={isPhone} />
      </Space>
    </Layout.Header>
  );
};
