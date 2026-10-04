import { ComponentProps, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import fontColorContrast from "font-color-contrast";
import { Button, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { CircularWord } from "./CircularWord";
import { CardBackground } from "./CardBackground";
import { RingHighlight } from "./RingHighlight";
import { CardDeletePopConfirm } from "./CardDeletePopConfirm";
import { WordCounterTag } from "./WordCounterTag";
import { Card as CardType, CardWords, WordIndex } from "../types";
import { wordPositionName } from "../constants";
import { nextRotationDeg } from "../helpers/nextRotationDeg";
import { useTranslation } from "react-i18next";

type CardFrontProps = {
  index?: number;
  card: CardType;
  hideIndex?: boolean;
  /** Makes the card editable: tapping a ring lets you type its word directly on the card */
  onUpdate?: (card: CardType) => void;
} & ComponentProps<"div">;

const radiuses = [8.6, 6.1, 3.6];

export const CardFront = ({ index, card, hideIndex = false, className, onUpdate }: CardFrontProps) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(card);
  const [activeIndex, setActiveIndex] = useState<WordIndex>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shownCard = editing ? draft : card;
  const isBlank = card.words.every(({ word }) => word.trim() === "");

  // The input has to be focused synchronously inside the tap handler, otherwise phones don't open the keyboard
  const focusWord = useCallback((wordIndex: WordIndex) => {
    setActiveIndex(wordIndex);
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    // Wait for the new value to be rendered before moving the cursor to its end
    requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
  }, []);

  const startEditing = (evt: MouseEvent<HTMLElement>) => {
    setDraft(card);
    setEditing(true);
    focusWord(ringAt(evt) ?? firstEmptyWord(card));
  };

  const save = useCallback(() => {
    onUpdate?.(draft);
    setEditing(false);
    inputRef.current?.blur();
  }, [onUpdate, draft]);

  const cancel = useCallback(() => setEditing(false), []);

  // Tapping anywhere outside of the card saves it, like any other inline editor
  useEffect(() => {
    if (!editing) return;
    const onPointerDown = (evt: globalThis.PointerEvent) => {
      const target = evt.target as Element;
      // The delete confirmation is rendered outside of the card
      if (containerRef.current?.contains(target) || target.closest(".ant-popover")) return;
      save();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [editing, save]);

  const changeWord = (word: string) => {
    setDraft((draft) => {
      const words = [...draft.words] as CardWords;
      words[activeIndex] = { ...words[activeIndex], word, rotationDeg: nextRotationDeg(words[activeIndex], word) };
      return { ...draft, words };
    });
  };

  const onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Escape") {
      cancel();
      inputRef.current?.blur();
    } else if (evt.key === "Enter") {
      evt.preventDefault();
      if (activeIndex < 2) focusWord((activeIndex + 1) as WordIndex);
      else save();
    } else if (evt.key === "Tab") {
      const next = activeIndex + (evt.shiftKey ? -1 : 1);
      if (next >= 0 && next <= 2) {
        evt.preventDefault();
        focusWord(next as WordIndex);
      }
    }
  };

  const activeWord = draft.words[activeIndex];

  return (
    <div
      ref={containerRef}
      className={clsx("h-[340px] w-[340px] relative select-none", { "z-20": editing }, className)}
    >
      <div
        className={clsx("relative w-full h-full flex justify-center", { "cursor-pointer": onUpdate && !editing })}
        onClick={onUpdate && !editing ? startEditing : undefined}
      >
        <CardBackground
          size="340px"
          color1={shownCard.words[0].color}
          color2={shownCard.words[1].color}
          color3={shownCard.words[2].color}
        />

        {shownCard.words.map((word, wordIndex) => (
          <CircularWord
            key={wordIndex}
            word={word.word}
            radius={radiuses[wordIndex]}
            fontSize={2}
            fontColor={fontColorContrast(word.color)}
            rotationDeg={word.rotationDeg}
            caret={editing && wordIndex === activeIndex}
          />
        ))}

        {editing && (
          <RingHighlight index={activeIndex} className="absolute inset-0 w-full h-full pointer-events-none" />
        )}

        {!hideIndex && index !== undefined && (
          <span className="text-4xl font-bold text-white absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            {index + 1}
          </span>
        )}

        {onUpdate && isBlank && !editing && (
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-sm text-slate-700 shadow print:hidden">
            {t("tapToWrite")}
          </span>
        )}
      </div>

      {onUpdate && (
        // Invisible input covering the card: it receives the typing (and the taps to switch ring) while the
        // letters are drawn on the ring itself
        <input
          ref={inputRef}
          value={activeWord.word}
          onChange={(evt) => changeWord(evt.target.value)}
          onKeyDown={onKeyDown}
          onPointerDown={(evt) => {
            const ring = ringAt(evt);
            if (ring !== undefined) {
              evt.preventDefault();
              focusWord(ring);
            }
          }}
          aria-label={t(wordPositionName[activeIndex])}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint={activeIndex < 2 ? "next" : "done"}
          tabIndex={editing ? 0 : -1}
          className={clsx(
            "absolute inset-0 w-full h-full rounded-full opacity-0 text-base cursor-text select-text",
            !editing && "pointer-events-none",
          )}
        />
      )}

      {editing && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full bg-white pl-3 pr-1 py-1 shadow-lg border border-slate-200 print:hidden">
          <span
            className="inline-block w-3 h-3 rounded-full border border-slate-400"
            style={{ background: activeWord.color }}
          />
          <span className="text-sm text-slate-700 ms-1">{t(wordPositionName[activeIndex])}</span>
          <WordCounterTag word={activeWord.word} position={wordPositionName[activeIndex]} showMax className="ms-1" />
          <CardDeletePopConfirm card={card} placement="top">
            <Button type="text" shape="circle" danger icon={<DeleteOutlined />} aria-label={t("deleteCard")} />
          </CardDeletePopConfirm>
          <Tooltip title={t("cancel")}>
            <Button type="text" shape="circle" icon={<CloseOutlined />} onClick={cancel} aria-label={t("cancel")} />
          </Tooltip>
          <Tooltip title={t("save")}>
            <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={save} aria-label={t("save")} />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

// Which ring is under the pointer, based on the distance to the center of the card. The bounds match
// the stops of the radial gradient in CardBackground.module.css (relative to the farthest corner, √2 × radius)
function ringAt(evt: MouseEvent<HTMLElement>): WordIndex | undefined {
  const rect = evt.currentTarget.getBoundingClientRect();
  const x = evt.clientX - (rect.left + rect.width / 2);
  const y = evt.clientY - (rect.top + rect.height / 2);
  const distance = Math.hypot(x, y) / (rect.width / 2) / Math.SQRT2;
  if (distance > 0.53) return 0;
  if (distance > 0.35) return 1;
  if (distance > 0.17) return 2;
  return undefined;
}

function firstEmptyWord(card: CardType): WordIndex {
  const index = card.words.findIndex(({ word }) => word.trim() === "");
  return index === -1 ? 0 : (index as WordIndex);
}
