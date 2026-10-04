import { ComponentProps, useCallback, useState } from "react";
import clsx from "clsx";
import { Card as CardType, CardWords } from "../types";
import { InputField } from "./InputField";
import { wordPositionName } from "../constants";
import { randomRotationDeg } from "../helpers/randomRotationDeg";
import { useTranslation } from "react-i18next";
import { CardDeletePopConfirm } from "./CardDeletePopConfirm";

type ConfirmFormProps = {
  card: CardType;
  onUpdate: (card: CardType) => void;
  onClose: () => void;
} & ComponentProps<"div">;

export const ConfirmForm = ({ className, card, onClose, onUpdate, ...props }: ConfirmFormProps) => {
  const [cardCopy, setCardCopy] = useState(card);
  const { t } = useTranslation();

  const handleWordChange = useCallback((index: number, word: string) => {
    setCardCopy((cardCopy) => {
      const newWords: CardWords = [...cardCopy.words];
      newWords.splice(index, 1, { ...cardCopy.words[index], word, rotationDeg: randomRotationDeg() });
      return { ...cardCopy, words: newWords };
    });
  }, []);

  const confirmChanges = useCallback(() => {
    onUpdate(cardCopy);
    onClose();
  }, [onUpdate, onClose, cardCopy]);

  return (
    <div className={clsx("flex flex-col gap-2 bg-slate-50/85 p-3 rounded", className)} {...props}>
      {cardCopy.words.map(({ word }, index) => (
        <InputField
          key={index}
          label={t(wordPositionName[index])}
          inputProps={{ placeholder: t("inputWord"), className: "uppercase", autoFocus: index === 0 }}
          value={word}
          helperText={t("wordLength", { length: word.length })}
          onChange={(evt) => handleWordChange(index, evt.target.value)}
        />
      ))}

      <button
        className="rounded-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 py-2 px-4"
        onClick={confirmChanges}
      >
        {t("ok")}
      </button>

      <div className="flex justify-between">
        <button className="rounded-full text-slate-600 hover:bg-slate-200 py-1 px-3 text-sm" onClick={onClose}>
          {t("cancel")}
        </button>
        <CardDeletePopConfirm card={card} placement="top">
          <button className="rounded-full text-red-600 hover:bg-red-50 py-1 px-3 text-sm">{t("deleteCard")}</button>
        </CardDeletePopConfirm>
      </div>
    </div>
  );
};
