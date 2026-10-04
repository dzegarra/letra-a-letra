import { ComponentProps } from "react";
import clsx from "clsx";
import fontColorContrast from "font-color-contrast";
import { CircularWord } from "./CircularWord";
import { CardBackground } from "./CardBackground";
import { RingHighlight } from "./RingHighlight";
import { Card as CardType, WordIndex } from "../types";
import { useTranslation } from "react-i18next";

type CardFrontProps = {
  index?: number;
  card: CardType;
  hideIndex?: boolean;
  /** Called when the card is tapped. When present, a blank card also shows a hint inviting to write on it */
  onEdit?: () => void;
  /** Outlines the ring of the word being edited */
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

  return (
    <div className={clsx("h-[340px] w-[340px] relative select-none", className)} style={style}>
      <div
        className={clsx("relative w-full h-full flex justify-center", { "cursor-pointer": onEdit })}
        onClick={onEdit}
      >
        <CardBackground
          size="340px"
          color1={card.words[0].color}
          color2={card.words[1].color}
          color3={card.words[2].color}
        />

        <CircularWord
          word={card.words[0].word}
          radius={8.6}
          fontSize={2}
          fontColor={fontColorContrast(card.words[0].color)}
          rotationDeg={card.words[0].rotationDeg}
        />
        <CircularWord
          word={card.words[1].word}
          radius={6.1}
          fontSize={2}
          fontColor={fontColorContrast(card.words[1].color)}
          rotationDeg={card.words[1].rotationDeg}
        />
        <CircularWord
          word={card.words[2].word}
          radius={3.6}
          fontSize={2}
          fontColor={fontColorContrast(card.words[2].color)}
          rotationDeg={card.words[2].rotationDeg}
        />

        {!hideIndex && index !== undefined && (
          <span className="text-4xl font-bold text-white absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            {index + 1}
          </span>
        )}

        {highlightWord !== undefined && (
          <RingHighlight index={highlightWord} className="absolute inset-0 w-full h-full pointer-events-none" />
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
