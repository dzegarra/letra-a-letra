import { ComponentProps, useCallback, useState } from 'react'
import clsx from 'clsx'
import { Card as CardType } from "../types";
import { ConfigWordFieldGroup } from './ConfigWordFieldGroup'

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
      const newWords = [...cardCopy.words];
      newWords.splice(index, 1, { ...cardCopy.words[index], word, rotationDeg: randomRotaionDeg() });
      return { ...cardCopy, words: newWords };
    });
  }, []);

  const handleColorChange = useCallback((index: number, color: string) => {
    setCardCopy((cardCopy) => {
      const newWords = [...cardCopy.words];
      newWords.splice(index, 1, { ...cardCopy.words[index], color });
      return {
        ...cardCopy,
        words: newWords,
      };
    });
  }, []);

  const confirmChanges = useCallback(() => {
    onUpdate(cardCopy);
    onClose();
  }, [onUpdate, onClose, cardCopy]);

  return (
    <div className={clsx("flex flex-col gap-4 bg-slate-50/85 p-3 rounded", className)} {...props}>
      {cardCopy.words.map(({ word, color }, index) => (
        <ConfigWordFieldGroup
          key={index}
          index={index}
          word={word}
          color={color}
          autoFocus={index === 0}
          onChangeWord={(word) => handleWordChange(index, word)}
          onChangeColor={(color) => handleColorChange(index, color)}
        />
      ))}

      <button onClick={confirmChanges}>OK</button>
    </div>
  );
};