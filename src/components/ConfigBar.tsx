import { ComponentProps, Dispatch, SetStateAction, useCallback } from "react";
import clsx from "clsx";
import { Card as CardType } from "../types";
import { pickFile } from "../helpers/pickFile";
import { generateCard } from "../helpers/generateCard";
import { jsonToFile } from "../helpers/jsonToFile";
import { useCardsColor } from "../hooks/useCardsColor";
import { useDebounce } from "../hooks/useDebounce";
import { InputField } from "./InputField";

type ConfigBarProps = {
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
} & ComponentProps<"div">;

export const ConfigBar = ({ className, cards, setCards }: ConfigBarProps) => {
  const { colors, updateColorAtIndex } = useCardsColor(cards, setCards);

  const updateWithDelayColorAtIndex = useDebounce(updateColorAtIndex, 200);

  const addCard = useCallback(() => {
    setCards((cards) => [...cards, generateCard(colors)]);
  }, [setCards, colors]);

  const exportData = useCallback(() => {
    jsonToFile(cards, "project-export");
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
      <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={addCard}>
        ➕Add card
      </button>

      <button
        className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4"
        onClick={exportData}
        title="Downloads the project as a file that can be used to continue the project later"
      >
        ⬇️Export
      </button>

      <button
        className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4"
        onClick={importFile}
        title="Import a previously exported project file"
      >
        ⬆️Import
      </button>

      <button className="rounded-full bg-slate-100 hover:bg-slate-300 py-2 px-4" onClick={() => window.print()}>
        🖨️ Print
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

      <div>Count or cards: {cards.length}</div>
    </div>
  );
};
