import { ComponentProps, useRef, useState, useCallback, useMemo, useEffect } from "react";
import chunk from "lodash/chunk";
import zip from "lodash/zip";
import { Button, Checkbox, Collapse, Segmented, Select, Space, Steps, StepsProps, Tooltip, Typography } from "antd";
import { useCardsStore } from "../store";
import { CardFront } from "./CardFront";
import { calculateRearColors } from "../helpers/calculateRearColors";
import { Page } from "./Page";
import { CardRear } from "./CardRear";
import html2canvas from "html2canvas";
import clsx from "clsx";
import { PageSizes, PDFDocument } from "pdf-lib";
import { bytesToPdf } from "../helpers/bytesToPdf";
import {
  ColumnWidthOutlined,
  DownloadOutlined,
  LoadingOutlined,
  SettingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { cardSizes, pageSizes } from "../constants";
import { RearDesign, rearDesigns } from "../rearDesigns";

const minZoom = 0.2;
const maxZoom = 2;
const zoomStep = 0.1;
// Width of an A4 page plus the horizontal padding around the pages (p-4), in CSS pixels
const pagesWidthPx = (pageSizes.a4.w / 10) * (96 / 25.4) + 32;

const clampZoom = (zoom: number) => Math.min(maxZoom, Math.max(minZoom, Math.round(zoom * 100) / 100));

type PreviewViewProps = ComponentProps<"div"> & {
  onComplete: () => void;
};

export const PrintDocument = ({ className, onComplete, ...props }: PreviewViewProps) => {
  const [duplex, setDuplex] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [renderingStatus, setRenderingStatus] = useState<StepsProps["status"]>("wait");
  const [creatingPdfStatus, setCreatingPdfStatus] = useState<StepsProps["status"]>("wait");
  const [cardSize, setCardSize] = useState<keyof typeof cardSizes>("S");
  const pagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [fitZoom, setFitZoom] = useState(1);
  // null until the user picks a zoom, the preview then fits the width without going over the real size
  const [chosenZoom, setChosenZoom] = useState<number | null>(null);
  const colors = useCardsStore((state) => state.colors);
  const cards = useCardsStore((state) => state.cards);
  const rearDesign = useCardsStore((state) => state.rearDesign);
  const setRearDesign = useCardsStore((state) => state.setRearDesign);
  const { t } = useTranslation();

  const isBusy = renderingStatus === "process" || creatingPdfStatus === "process";
  const zoom = chosenZoom ?? Math.min(1, fitZoom);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => setFitZoom(clampZoom(container.clientWidth / pagesWidthPx)));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const pages = useMemo(() => {
    const cardsGroupedBySix = chunk(cards, 6);
    const rearCards = calculateRearColors(cards.length, colors);
    const rearCardsGroupedBySix = chunk(rearCards, 6);
    let nextCardIndex = 0;

    const frontPages = cardsGroupedBySix.map((cards, index) => (
      <Page format="a4" key={`front-page-${index}`}>
        <div className="inline-grid grid-cols-2 grid-rows-3 gap-1 p-3 w-full h-full place-items-center">
          {cards.map((card) => (
            <CardFront
              key={`front-card-${nextCardIndex}`}
              card={card}
              index={nextCardIndex++}
              hideIndex={!showCardNumber}
              className={cardSizes[cardSize]}
            />
          ))}
        </div>
      </Page>
    ));

    nextCardIndex = 0;
    const rearPages = rearCardsGroupedBySix.map((colors, index) => (
      <Page format="a4" key={`rear-page-${index}`}>
        {/* The change in the direction (rtl) is done to flip the ordering of the rear cards when the number if not even */}
        <div
          className="inline-grid grid-cols-2 grid-rows-3 gap-1 p-3 w-full h-full place-items-center"
          style={{ direction: "rtl" }}
        >
          {colors.map((color, index) => (
            <CardRear key={`rear-card-${index++}`} color={color} design={rearDesign} className={cardSizes[cardSize]} />
          ))}
        </div>
      </Page>
    ));

    if (duplex) {
      return zip(frontPages, rearPages).flat();
    }
    return [...frontPages, ...rearPages];
  }, [cards, colors, duplex, showCardNumber, cardSize, rearDesign]);

  const generatePdf = useCallback(
    async (screenshots: HTMLCanvasElement[]) => {
      setCreatingPdfStatus("process");
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const pdfDoc = await PDFDocument.create();
        screenshots.forEach(async (screenshot) => {
          const page = pdfDoc.addPage(PageSizes.A4);
          const imgData = screenshot.toDataURL("image/png");
          const img = await pdfDoc.embedPng(imgData);
          const { width, height } = page.getSize();
          page.drawImage(img, { x: 0, y: 0, width, height });
        });
        const pdfBytes = await pdfDoc.save();
        bytesToPdf(pdfBytes, "letra-a-letra");

        onComplete();
      } catch (error) {
        console.error(error);
        setCreatingPdfStatus("error");
      } finally {
        setCreatingPdfStatus("finish");
      }
    },
    [onComplete],
  );

  const renderizePages = useCallback(async () => {
    if (pagesRef.current) {
      try {
        setRenderingStatus("process");
        await new Promise((resolve) => setTimeout(resolve, 500));

        const promises = Array.from(pagesRef.current.childNodes).map(async (node) => {
          if (node instanceof HTMLElement) {
            return html2canvas(node);
          }
          return null;
        });

        const screenshots = (await Promise.all(promises)).filter(Boolean) as HTMLCanvasElement[];

        setRenderingStatus("finish");

        generatePdf(screenshots);
      } catch (error) {
        console.error(error);
        setRenderingStatus("error");
      }
    }
  }, [generatePdf]);

  const options = (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Typography.Text strong>{t("cardSize")}</Typography.Text>
        <Segmented<string>
          block
          value={cardSize}
          options={Object.keys(cardSizes)}
          onChange={(value) => setCardSize(value as keyof typeof cardSizes)}
          disabled={isBusy}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Typography.Text strong>{t("rearDesign")}</Typography.Text>
        <Select<RearDesign>
          value={rearDesign}
          onChange={setRearDesign}
          disabled={isBusy}
          options={(Object.keys(rearDesigns) as RearDesign[]).map((design) => ({
            value: design,
            label: (
              <Space size="small">
                <CardRear color={colors[0]} design={design} className="!h-5 !w-5 align-middle" />
                {t(`rearDesign_${design}`)}
              </Space>
            ),
          }))}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Checkbox checked={duplex} onChange={(e) => setDuplex(e.target.checked)} disabled={isBusy}>
          {t("duplex")}
        </Checkbox>
        <Typography.Text type="secondary" className="pl-6 text-xs">
          {t("duplexTooltip")}
        </Typography.Text>
      </div>
      <Checkbox checked={showCardNumber} onChange={(e) => setShowCardNumber(e.target.checked)} disabled={isBusy}>
        {t("displayCardNumber")}
      </Checkbox>
    </div>
  );

  return (
    <div className={clsx("relative overflow-hidden flex flex-col", className)} {...props}>
      <div className="h-16 flex-none p-3 sm:px-24">
        <Steps
          responsive={false}
          items={[
            {
              title: t("preparingPages"),
              status: renderingStatus,
              icon: renderingStatus === "process" ? <LoadingOutlined /> : <SettingOutlined />,
            },
            {
              title: t("creatingPdf"),
              status: creatingPdfStatus,
              icon: creatingPdfStatus === "process" ? <LoadingOutlined /> : <DownloadOutlined />,
            },
          ]}
        />
      </div>

      <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-3 md:gap-4">
        <div className="hidden md:block w-60 flex-none overflow-y-auto pr-1">{options}</div>

        <Collapse
          className="md:hidden flex-none"
          size="small"
          items={[{ key: "options", label: t("options"), children: options }]}
        />

        <div className="relative flex-1 min-h-0 min-w-0">
          <div
            ref={scrollContainerRef}
            className={clsx("h-full overflow-y-auto bg-gray-200", {
              "overflow-hidden": renderingStatus === "process",
            })}
          >
            {/* The pages are captured at their real size, so the zoom is dropped while they are being rendered */}
            <div
              className="flex flex-wrap [justify-content:safe_center] items-start gap-7 p-4"
              style={{ zoom: renderingStatus === "process" ? 1 : zoom }}
              ref={pagesRef}
            >
              {pages}
            </div>
          </div>

          <div className="absolute bottom-3 right-5 flex items-center gap-1 rounded-md bg-white p-1 shadow-md">
            <Tooltip title={t("zoomOut")}>
              <Button
                type="text"
                size="small"
                icon={<ZoomOutOutlined />}
                onClick={() => setChosenZoom(clampZoom(zoom - zoomStep))}
                disabled={isBusy || zoom <= minZoom}
              />
            </Tooltip>
            <Typography.Text className="w-11 text-center tabular-nums">{Math.round(zoom * 100)}%</Typography.Text>
            <Tooltip title={t("zoomIn")}>
              <Button
                type="text"
                size="small"
                icon={<ZoomInOutlined />}
                onClick={() => setChosenZoom(clampZoom(zoom + zoomStep))}
                disabled={isBusy || zoom >= maxZoom}
              />
            </Tooltip>
            <Tooltip title={t("fitToWidth")}>
              <Button
                type="text"
                size="small"
                icon={<ColumnWidthOutlined />}
                onClick={() => setChosenZoom(fitZoom)}
                disabled={isBusy}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 pt-3 px-3">
        <Typography.Text type="secondary">{t("pages", { count: pages.length })}</Typography.Text>
        <Space className="ml-auto">
          <Button type="default" onClick={onComplete} disabled={isBusy}>
            {t("cancel")}
          </Button>
          <Button type="primary" onClick={renderizePages} loading={isBusy}>
            {t("startCreatingPdf")}
          </Button>
        </Space>
      </div>
    </div>
  );
};
