import { MouseEvent, useState } from "react";
import { Alert, ColorPicker, Flex, FlexProps, Segmented, Tooltip, Typography } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { wordPositionName } from "../constants";
import { useCardsStore } from "../store";
import { Card, CardColors, WordIndex } from "../types";
import { colorPalettes, ColorPaletteName, colorSwatches, isSameColor } from "../colorPalettes";
import { colorDifference } from "../helpers/colorDifference";
import { CardFront } from "./CardFront";
import { CardBackground } from "./CardBackground";

type ColorsChangerProps = Omit<FlexProps, "children">;

const wordIndexes: WordIndex[] = [0, 1, 2];

/** Below this difference two neighbouring rings are easy to mistake for each other */
const minRingDifference = 20;

/** Size of the sample card relative to the real one */
const sampleScale = 0.75;
const cardSize = 340;
const sampleSize = cardSize * sampleScale;

/**
 * Where each ring ends, as a share of the card's radius. The card background is a radial gradient
 * whose stops are relative to the half diagonal of the card (see CardBackground.module.css)
 */
const ringOuterEdge: Record<WordIndex, number> = { 0: 1, 1: 0.53 * Math.SQRT2, 2: 0.35 * Math.SQRT2 };
const ringInnerEdge: Record<WordIndex, number> = { 0: 0.53 * Math.SQRT2, 1: 0.35 * Math.SQRT2, 2: 0.17 * Math.SQRT2 };

const ringAt = (distanceFromCenter: number): WordIndex | undefined =>
  wordIndexes.find((index) => distanceFromCenter <= ringOuterEdge[index] && distanceFromCenter > ringInnerEdge[index]);

export const ColorsChanger = ({ className, ...props }: ColorsChangerProps) => {
  const colors = useCardsStore((state) => state.colors);
  const cards = useCardsStore((state) => state.cards);
  const changeColorArIndex = useCardsStore((state) => state.changeColorArIndex);
  const changeColors = useCardsStore((state) => state.changeColors);
  const { t } = useTranslation();
  const [selectedRing, setSelectedRing] = useState<WordIndex>(0);

  const sampleCard = useSampleCard(colors, cards);
  const ringName = (index: WordIndex) => t(wordPositionName[index]);

  const selectRingAtPointer = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const radius = rect.width / 2;
    const distance = Math.hypot(event.clientX - rect.left - radius, event.clientY - rect.top - radius) / radius;
    const ring = ringAt(distance);
    if (ring !== undefined) setSelectedRing(ring);
  };

  const similarRings = (
    [
      [0, 1],
      [1, 2],
    ] as const
  ).filter(([a, b]) => colorDifference(colors[a], colors[b]) < minRingDifference);

  return (
    <Flex vertical gap="large" className={clsx("pt-2", className)} {...props}>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <Flex vertical align="center" gap="small" className="flex-none">
          <div
            className="relative cursor-pointer"
            style={{ width: sampleSize, height: sampleSize }}
            onClick={selectRingAtPointer}
          >
            <CardFront
              card={sampleCard}
              hideIndex
              className="origin-top-left"
              style={{ transform: `scale(${sampleScale})` }}
            />
            <RingOutline ring={selectedRing} />
          </div>
          <Typography.Text type="secondary" className="text-xs">
            {t("tapARing")}
          </Typography.Text>
        </Flex>

        <Flex vertical gap="middle" className="w-full min-w-0">
          <Segmented<WordIndex>
            block
            value={selectedRing}
            onChange={setSelectedRing}
            options={wordIndexes.map((index) => ({
              value: index,
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 flex-none rounded-full border border-slate-300"
                    style={{ background: colors[index] }}
                  />
                  {ringName(index)}
                </span>
              ),
            }))}
          />

          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={ringName(selectedRing)}>
            {colorSwatches.map((swatch) => {
              const isSelected = isSameColor(swatch, colors[selectedRing]);
              return (
                <button
                  key={swatch}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={swatch}
                  onClick={() => changeColorArIndex(swatch, selectedRing)}
                  className={clsx(
                    "h-8 w-8 cursor-pointer rounded-full border-2 border-white shadow-[0_0_0_1px_#cbd5e1] transition-transform hover:scale-110",
                    { "!shadow-[0_0_0_2px_#1677ff]": isSelected },
                  )}
                  style={{ background: swatch }}
                />
              );
            })}
            <Tooltip title={t("otherColor")}>
              <ColorPicker
                disabledAlpha
                value={colors[selectedRing]}
                presets={[{ label: t("suggestedColors"), colors: colorSwatches }]}
                onChangeComplete={(color) => changeColorArIndex(color.toHexString(), selectedRing)}
              >
                <button
                  type="button"
                  aria-label={t("otherColor")}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-slate-400 bg-white text-slate-500 hover:border-slate-600 hover:text-slate-700"
                >
                  <BgColorsOutlined />
                </button>
              </ColorPicker>
            </Tooltip>
          </div>

          {similarRings.map(([a, b]) => (
            <Alert
              key={`${a}-${b}`}
              type="warning"
              showIcon
              message={t("similarRings", { first: ringName(a).toLowerCase(), second: ringName(b).toLowerCase() })}
            />
          ))}
        </Flex>
      </div>

      <Flex vertical gap="small">
        <Typography.Text strong>{t("palettes")}</Typography.Text>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="radiogroup" aria-label={t("palettes")}>
          {(Object.entries(colorPalettes) as [ColorPaletteName, CardColors][]).map(([name, palette]) => {
            const isSelected = palette.every((color, index) => isSameColor(color, colors[index]));
            return (
              <Tooltip key={name} title={t(`palette_${name}`)}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={t(`palette_${name}`)}
                  onClick={() => changeColors(palette)}
                  className={clsx(
                    "flex cursor-pointer flex-col items-center gap-1 rounded-lg border bg-white p-1.5 hover:border-slate-400",
                    isSelected ? "border-[#1677ff] shadow-[0_0_0_1px_#1677ff]" : "border-slate-200",
                  )}
                >
                  <span className="relative block h-10 w-10">
                    <CardBackground size="40px" color1={palette[0]} color2={palette[1]} color3={palette[2]} />
                  </span>
                  <span className="w-full truncate text-center text-[11px] leading-tight text-slate-600">
                    {t(`palette_${name}`)}
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </Flex>
    </Flex>
  );
};

/** Dashed circles along both edges of the selected ring of the sample card */
const RingOutline = ({ ring }: { ring: WordIndex }) => (
  <>
    {[ringOuterEdge[ring], ringInnerEdge[ring]].map((edge, i) => (
      <span
        key={i}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-dashed border-white transition-all duration-200"
        style={{ width: sampleSize * edge, height: sampleSize * edge, filter: "drop-shadow(0 0 1px rgb(0 0 0 / 0.6))" }}
      />
    ))}
  </>
);

/** The first card with words, so the colours are tried on something familiar, or a made-up one if there is none */
const useSampleCard = (colors: CardColors, cards: Card[]): Card => {
  const { t } = useTranslation();
  const firstWrittenCard = cards.find((card) => card.words.some(({ word }) => word.trim() !== ""));
  const words = firstWrittenCard?.words.map(({ word, rotationDeg }) => ({ word, rotationDeg })) ?? [
    { word: t("sampleWordOuter") },
    { word: t("sampleWordMiddle") },
    { word: t("sampleWordInner") },
  ];
  return {
    id: "sample",
    words: wordIndexes.map((index) => ({ ...words[index], color: colors[index] })) as Card["words"],
  };
};
