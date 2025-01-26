import { ComponentProps, useCallback, useState } from 'react'
import clsx from 'clsx'
import { Card as CardType, CardWords } from "../types";
import { InputField } from "./InputField";

type ConfirmFormProps = {
  card: CardType;
  onUpdate: (card: CardType) => void;
  onClose: () => void;
} & ComponentProps<"div">;

const randomRotaionDeg = () => Math.floor(Math.random() * 360);

export const ConfirmForm = ({ className, card, onClose, onUpdate, ...props }: ConfirmFormProps) => {
  const [cardCopy, setCardCopy] = useState(card);

  const handleWordChange = useCallback((index: number, word: string) => {
    setCardCopy((cardCopy) => {
      const newWords: CardWords = [...cardCopy.words];
      newWords.splice(index, 1, { ...cardCopy.words[index], word, rotationDeg: randomRotaionDeg() });
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
          label={`Palabra #${index + 1}`}
          inputProps={{ placeholder: "Ingresa la palabra", className: "uppercase", autoFocus: index === 0 }}
          value={word}
          helperText={`${word.length} caracteres`}
          onChange={(evt) => handleWordChange(index, evt.target.value)}
        />
      ))}

      <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={confirmChanges}>
        OK
      </button>
    </div>
  );
};