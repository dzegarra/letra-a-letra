import { ComponentProps, useRef, useState, useCallback, useMemo } from "react";
import chunk from "lodash/chunk";
import zip from "lodash/zip";
import { Button, Checkbox, Steps, StepsProps, Tooltip, Typography } from "antd";
import { useCardsStore } from "../store";
import { CardFront } from "./CardFront";
import { calculateRearColors } from "../helpers/calculateRearColors";
import { Page } from "./Page";
import { CardRear } from "./CardRear";
import html2canvas from "html2canvas";
import clsx from "clsx";
import { PageSizes, PDFDocument } from "pdf-lib";
import { bytesToPdf } from "../helpers/bytesToPdf";
import { DownloadOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type PreviewViewProps = ComponentProps<"div"> & {
  onComplete: () => void;
};

export const PrintDocument = ({ className, onComplete, ...props }: PreviewViewProps) => {
  const [duplex, setDuplex] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [renderingStatus, setRenderingStatus] = useState<StepsProps["status"]>("wait");
  const [creatingPdfStatus, setCreatingPdfStatus] = useState<StepsProps["status"]>("wait");
  const pagesRef = useRef<HTMLDivElement>(null);
  const colors = useCardsStore((state) => state.colors);
  const cards = useCardsStore((state) => state.cards);
  const { t } = useTranslation();

  const isBusy = renderingStatus === "process" || creatingPdfStatus === "process";

  const pages = useMemo(() => {
    const cardsGroupedBySix = chunk(cards, 6);
    const rearCards = calculateRearColors(cards.length, colors);
    const rearCardsGroupedBySix = chunk(rearCards, 6);
    let nextCardIndex = 0;

    const frontPages = cardsGroupedBySix.map((cards, index) => (
      <Page format="a4" key={`front-${index}`}>
        <div className="inline-grid grid-cols-2 grid-rows-3 gap-5 mt-3 ml-3">
          {cards.map((card) => (
            <CardFront
              key={`card-front-${nextCardIndex}`}
              card={card}
              index={nextCardIndex++}
              hideIndex={!showCardNumber}
            />
          ))}
        </div>
      </Page>
    ));

    nextCardIndex = 0;
    const rearPages = rearCardsGroupedBySix.map((colors, index) => (
      <Page format="a4" key={`rear-${index}`} contentClassname="text-right">
        <div className="inline-grid grid-cols-2 grid-rows-3 gap-5 mt-3 mr-3 self-end" style={{ direction: "rtl" }}>
          {colors.map((color, index) => (
            <CardRear key={`card-rear-${index++}`} color={color} />
          ))}
        </div>
      </Page>
    ));

    if (duplex) {
      return zip(frontPages, rearPages).flat();
    }
    return [...frontPages, ...rearPages];
  }, [cards, colors, duplex, showCardNumber]);

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

  return (
    <div className={clsx("relative overflow-hidden flex flex-col", className)} {...props}>
      <div className="h-16 flex-none p-3 px-24">
        <Steps
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

      <div
        className={clsx("flex-1 overflow-y-auto bg-gray-200", {
          "overflow-hidden": renderingStatus === "process",
        })}
      >
        <div className="flex flex-col flex-1 items-start" ref={pagesRef}>
          {pages}
        </div>
      </div>

      <div className="flex justify-between pt-3 px-3">
        <div className="flex gap-3 items-center">
          <Typography.Text type="secondary">
            {pages.length} {t("pages", { count: pages.length })}
          </Typography.Text>
          <Tooltip title={t("duplexTooltip")}>
            <Checkbox checked={duplex} onChange={(e) => setDuplex(e.target.checked)} disabled={isBusy}>
              {t("duplex")}
            </Checkbox>
          </Tooltip>
          <Checkbox checked={showCardNumber} onChange={(e) => setShowCardNumber(e.target.checked)} disabled={isBusy}>
            {t("displayCardNumber")}
          </Checkbox>
        </div>
        <div className="flex gap-3">
          <Button type="default" onClick={onComplete} disabled={isBusy}>
            {t("cancel")}
          </Button>
          <Button type="primary" onClick={renderizePages} loading={isBusy}>
            {t("startCreatingPdf")}
          </Button>
        </div>
      </div>
    </div>
  );
};
