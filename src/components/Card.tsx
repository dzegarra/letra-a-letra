import { useState } from 'react';
import clsx from 'clsx';
import { CircularWord } from './CircularWord';
import { Circle } from './Circle';
import { ConfirmForm } from './ConfigForm';
import { Card as CardType } from "../types";

type CardProps = {
  card: CardType;
  onUpdate: (card: CardType) => void;
  onDelete: (card: CardType) => void;
};

export const Card = ({ card, onUpdate, onDelete }: CardProps) => {
  const [editVisible, setEditVisible] = useState(false);

  return (
    <div className="h-[500px] w-[500px] relative select-none break-inside-avoid">
      <div
        className={clsx("relative w-full h-full flex justify-center", {
          "blur-sm": editVisible,
        })}
      >
        <Circle size="500px" color1={card.words[0].color} color2={card.words[1].color} color3={card.words[2].color} />
        <CircularWord word={card.words[0].word} radius={8.6} fontSize={3} rotationDeg={card.words[0].rotationDeg} />
        <CircularWord word={card.words[1].word} radius={6.1} fontSize={3} rotationDeg={card.words[1].rotationDeg} />
        <CircularWord word={card.words[2].word} radius={3.5} fontSize={3} rotationDeg={card.words[2].rotationDeg} />
      </div>

      {editVisible ? (
        <ConfirmForm
          className="w-[250px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          card={card}
          onUpdate={onUpdate}
          onClose={() => setEditVisible(false)}
        />
      ) : (
        <div className="flex gap-1 print:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <button
            className="rounded-full bg-slate-100 hover:bg-slate-300 p-2"
            title="Editar"
            onClick={() => setEditVisible(true)}
          >
            ✏️
          </button>
          <button
            className="rounded-full bg-slate-100 hover:bg-slate-300 p-2"
            title="Eliminar"
            onClick={() => onDelete(card)}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

