import { useState } from 'react';
import clsx from 'clsx';
import { CircularWord } from './CircularWord';
import { Circle } from './Circle';
import { ConfirmForm } from './ConfigForm';
import { Word } from '../types';

type CardProps = {
  words?: Word[];
  onUpdate: (words: Word[]) => void;
  onDelete: () => void;
};

export const Card = ({ words = [], onUpdate, onDelete }: CardProps) => {
  const [editVisible, setEditVisible] = useState(false);

  return (
    <div className="h-[500px] w-[500px] relative select-none break-inside-avoid">
      <div
        className={clsx("relative w-full h-full flex justify-center", {
          "blur-sm": editVisible,
        })}
      >
        <Circle size="500px" color1={words[0].color} color2={words[1].color} color3={words[2].color} />
        <CircularWord word={words[0].word} radius={8.6} fontSize={3} />
        <CircularWord word={words[1].word} radius={6.1} fontSize={3} />
        <CircularWord word={words[2].word} radius={3.5} fontSize={3} />
      </div>

      {editVisible ? (
        <ConfirmForm
          className="w-[250px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          words={words}
          onChangeWords={onUpdate}
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
            onClick={() => onDelete()}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

