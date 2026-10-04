import { ComponentProps, useState } from "react";
import clsx from "clsx";
import fontColorContrast from "font-color-contrast";
import { motion, AnimatePresence } from "motion/react";
import { CircularWord } from "./CircularWord";
import { CardBackground } from "./CardBackground";
import { ConfirmForm } from "./ConfigForm";
import { Card as CardType } from "../types";
import { useTranslation } from "react-i18next";

type CardFrontProps = {
  index?: number;
  card: CardType;
  hideIndex?: boolean;
  onUpdate?: (card: CardType) => void;
} & ComponentProps<"div">;

export const CardFront = ({ index, card, hideIndex = false, className, onUpdate }: CardFrontProps) => {
  const [editVisible, setEditVisible] = useState(false);
  const { t } = useTranslation();
  const isBlank = card.words.every(({ word }) => word.trim() === "");

  return (
    <div className={clsx("h-[340px] w-[340px] relative select-none", className)}>
      <div
        className={clsx("relative w-full h-full flex justify-center", {
          "blur-sm": editVisible,
          "cursor-pointer": onUpdate && !editVisible,
        })}
        onClick={onUpdate && !editVisible ? () => setEditVisible(true) : undefined}
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

        {onUpdate && isBlank && !editVisible && (
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-sm text-slate-700 shadow print:hidden">
            {t("tapToWrite")}
          </span>
        )}
      </div>

      {onUpdate && (
        <AnimatePresence>
          {editVisible && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              exit={{ opacity: 0 }}
            >
              <ConfirmForm
                className="w-[250px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
                card={card}
                onUpdate={onUpdate}
                onClose={() => setEditVisible(false)}
              />
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
