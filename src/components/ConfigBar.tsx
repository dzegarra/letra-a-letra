import { ComponentProps, Dispatch, SetStateAction, useCallback } from "react";
import clsx from "clsx";
import { Card as CardType, CardWords } from "../types";
import { useCardsColor } from "../hooks/useCardsColor";
import { generateCardId } from "../helpers/generateCardId";
import { defaultWords } from "../constants";
import { jsonToFile } from "../helpers/jsonToFile";
import { InputField } from "./InputField";
import { useDebounce } from "../hooks/useDebounce";
import { pickFile } from "../helpers/pickFile";

type ConfigBarProps = {
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
} & ComponentProps<"div">;

export const ConfigBar = ({ className, cards, setCards }: ConfigBarProps) => {
  const { colors, updateColorAtIndex } = useCardsColor(cards, setCards);

  const updateWithDelayColorAtIndex = useDebounce(updateColorAtIndex, 200);

  const duplicateLastCard = useCallback(() => {
    setCards((cards) => {
      const lastCard = cards.length
        ? cards[cards.length - 1]
        : {
            id: generateCardId(),
            words: defaultWords,
          };
      const newCard: CardType = {
        id: generateCardId(),
        words: lastCard.words.map((card) => ({ ...card, word: "" })) as CardWords,
      };
      return [...cards, newCard];
    });
  }, [setCards]);

  const exportData = useCallback(() => {
    jsonToFile(cards, "letra-a-letra");
  }, [cards]);

  const importFile = useCallback(() => {
    pickFile(async function (files) {
      if (files && files.length) {
        const file = files[0];
        try {
          const text = await file.text();
          const decoded = JSON.parse(text);
          setCards(decoded);
        } catch (err) {
          alert(String(err));
        }
      }
    });
  }, [setCards]);

  return (
    <div className={clsx("flex gap-2 items-center p-4  bg-cyan-200 border-b-slate-400", className)}>
      <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={duplicateLastCard}>
        ➕Añadir tarjeta
      </button>

      <button
        className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4"
        onClick={exportData}
        title="Descarga los datos actuales ingresados en un archivo"
      >
        ⬇️Exportar
      </button>

      <button
        className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4"
        onClick={importFile}
        title="Importar datos previamente descargados"
      >
        ⬆️Importar
      </button>

      <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={() => window.print()}>
        🖨️ Imprimir
      </button>

      <div className="flex gap-4 mx-6">
        <InputField
          label="Color #1"
          inputProps={{ type: "color" }}
          value={colors[0]}
          onChange={(evt) => updateWithDelayColorAtIndex(evt.target.value, 0)}
        />
        <InputField
          label="Color #2"
          inputProps={{ type: "color" }}
          value={colors[1]}
          onChange={(evt) => updateWithDelayColorAtIndex(evt.target.value, 1)}
        />
        <InputField
          label="Color #3"
          inputProps={{ type: "color" }}
          value={colors[2]}
          onChange={(evt) => updateWithDelayColorAtIndex(evt.target.value, 2)}
        />
      </div>

      <div>Numero de cartas: {cards.length}</div>
    </div>
  );
};
