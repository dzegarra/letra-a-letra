import { ComponentProps } from "react";
import clsx from "clsx";
import fontColorContrast from "font-color-contrast";
import { CircularWord } from "./CircularWord";
import { CardBackground } from "./CardBackground";
import { Card as CardType, WordIndex } from "../types";
import { useTranslation } from "react-i18next";

// Middle of each colored band of CardBackground on a 340px card. Its ring stops are shares of
// the half diagonal (170px * √2) and the outer band reaches the edge of the card
const OUTER_RING_RADIUS = (0.53 * 170 * Math.SQRT2 + 170) / 2;
const MIDDLE_RING_RADIUS = ((0.35 + 0.53) / 2) * 170 * Math.SQRT2;
const INNER_RING_RADIUS = ((0.17 + 0.35) / 2) * 170 * Math.SQRT2;

type CardFrontProps = {
  index?: number;
  card: CardType;
  hideIndex?: boolean;
  /** Called when the card is tapped. When present, a blank card also shows a hint inviting to write on it */
  onEdit?: () => void;
  /** Keeps the ring of the word being edited in color and fades the other two */
  highlightWord?: WordIndex;
} & ComponentProps<"div">;

export const CardFront = ({
  index,
  card,
  hideIndex = false,
  className,
  style,
  onEdit,
  highlightWord,
}: CardFrontProps) => {
  const { t } = useTranslation();
  const isBlank = card.words.every(({ word }) => word.trim() === "");
  const isFaded = (wordIndex: WordIndex) => highlightWord !== undefined && highlightWord !== wordIndex;
  const ringColor = (wordIndex: WordIndex) =>
    isFaded(wordIndex)
      ? `color-mix(in srgb, ${card.words[wordIndex].color} 15%, #e2e8f0)`
      : card.words[wordIndex].color;
  const wordColor = (wordIndex: WordIndex) =>
    isFaded(wordIndex) ? "#94a3b8" : fontColorContrast(card.words[wordIndex].color);

  return (
    <div className={clsx("h-[340px] w-[340px] relative select-none", className)} style={style}>
      <div
        className={clsx("relative w-full h-full flex justify-center", { "cursor-pointer": onEdit })}
        onClick={onEdit}
      >
        <CardBackground size="340px" color1={ringColor(0)} color2={ringColor(1)} color3={ringColor(2)} />

        <CircularWord
          word={card.words[0].word}
          radius={OUTER_RING_RADIUS}
          fontSize={2}
          fontColor={wordColor(0)}
          rotationDeg={card.words[0].rotationDeg}
        />
        <CircularWord
          word={card.words[1].word}
          radius={MIDDLE_RING_RADIUS}
          fontSize={2}
          fontColor={wordColor(1)}
          rotationDeg={card.words[1].rotationDeg}
        />
        <CircularWord
          word={card.words[2].word}
          radius={INNER_RING_RADIUS}
          fontSize={2}
          fontColor={wordColor(2)}
          rotationDeg={card.words[2].rotationDeg}
        />

        {!hideIndex && index !== undefined && (
          <span className="text-4xl font-bold text-white absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            {index + 1}
          </span>
        )}

        {onEdit && isBlank && (
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-sm text-slate-700 shadow print:hidden">
            {t("tapToWrite")}
          </span>
        )}
      </div>
    </div>
  );
};
