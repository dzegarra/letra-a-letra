import { useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { CircularWord } from "./CircularWord";
import { CardBackground } from "./CardBackground";
import { ConfirmForm } from "./ConfigForm";
import { Card as CardType } from "../types";
import { CardDeletePopConfirm } from "./CardDeletePopConfirm";
import { Button } from "antd";

type CardFrontProps = {
  index?: number;
  card: CardType;
  hideIndex?: boolean;
  onUpdate?: (card: CardType) => void;
};

export const CardFront = ({ index, card, hideIndex = false, onUpdate }: CardFrontProps) => {
  const [editVisible, setEditVisible] = useState(false);

  return (
    <div className="h-[340px] w-[340px] relative select-none">
      <div
        className={clsx("relative w-full h-full flex justify-center", {
          "blur-sm": editVisible,
        })}
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
          fontColor={card.words[0].fontColor}
          rotationDeg={card.words[0].rotationDeg}
        />
        <CircularWord
          word={card.words[1].word}
          radius={6.1}
          fontSize={2}
          fontColor={card.words[1].fontColor}
          rotationDeg={card.words[1].rotationDeg}
        />
        <CircularWord
          word={card.words[2].word}
          radius={3.6}
          fontSize={2}
          fontColor={card.words[2].fontColor}
          rotationDeg={card.words[2].rotationDeg}
        />

        {!hideIndex && index && (
          <span className="text-4xl font-bold text-slate-700 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            {index + 1}
          </span>
        )}
      </div>

      <AnimatePresence>
        {editVisible && onUpdate ? (
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
        ) : (
          <div className="flex gap-1 opacity-0 hover:opacity-100 print:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <Button shape="circle" variant="text" title="Editar" onClick={() => setEditVisible(true)}>
              ✏️
            </Button>
            <CardDeletePopConfirm card={card} placement="left">
              <Button shape="circle" variant="text" title="Eliminar">
                🗑️
              </Button>
            </CardDeletePopConfirm>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
