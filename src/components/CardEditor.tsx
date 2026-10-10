import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Drawer, Grid, Input, InputRef, Modal, Tooltip } from "antd";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Card, CardWords, WordIndex } from "../types";
import { wordLengthsMax, wordPositionName } from "../constants";
import { nextRotationDeg } from "../helpers/nextRotationDeg";
import { randomRotationDeg } from "../helpers/randomRotationDeg";
import { CardFront } from "./CardFront";
import { CardDeletePopConfirm } from "./CardDeletePopConfirm";
import { WordCounterTag } from "./WordCounterTag";
import { RepeatedWordWarning } from "./RepeatedWordWarning";
import { findWordPlaces, getRepetition } from "../helpers/findRepeatedWords";
import { useCardsStore } from "../store";

type CardEditorProps = {
  /** The card being edited. The editor is open while there is one */
  card?: Card;
  index: number;
  onSave: (card: Card) => void;
  onSaveAndNext: (card: Card) => void;
  onClose: () => void;
};

const wordIndexes: WordIndex[] = [0, 1, 2];

/**
 * Edits the three words of a card next to a live preview of it.
 * It opens as a dialog on wide screens and as a sheet that slides up from the bottom on phones.
 */
export const CardEditor = ({ card, index, onSave, onSaveAndNext, onClose }: CardEditorProps) => {
  const { t } = useTranslation();
  const screens = Grid.useBreakpoint();
  const isPhone = !screens.sm;

  // Keep showing the last card while the dialog is animating out
  const lastCardRef = useRef(card);
  if (card) lastCardRef.current = card;
  const shownCard = card ?? lastCardRef.current;

  const title = t("cardNumber", { number: index + 1 });
  const content = shownCard && (
    <CardEditorForm
      key={shownCard.id}
      card={shownCard}
      isPhone={isPhone}
      onSave={onSave}
      onSaveAndNext={onSaveAndNext}
      onClose={onClose}
    />
  );

  if (isPhone) {
    return (
      <Drawer
        open={!!card}
        onClose={onClose}
        placement="bottom"
        height="auto"
        title={title}
        styles={{ body: { padding: 16 } }}
        destroyOnClose
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal open={!!card} onCancel={onClose} title={title} footer={null} width={680} destroyOnClose centered>
      {content}
    </Modal>
  );
};

type CardEditorFormProps = {
  card: Card;
  isPhone: boolean;
  onSave: (card: Card) => void;
  onSaveAndNext: (card: Card) => void;
  onClose: () => void;
};

const CardEditorForm = ({ card, isPhone, onSave, onSaveAndNext, onClose }: CardEditorFormProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(card);
  const [activeIndex, setActiveIndex] = useState<WordIndex>(() => firstEmptyWord(card));
  const inputRefs = useRef<(InputRef | null)[]>([]);
  const cards = useCardsStore((state) => state.cards);

  // Compare the words being typed with the rest of the project
  const cardIndex = cards.findIndex(({ id }) => id === draft.id);
  const wordPlaces = useMemo(() => findWordPlaces(cards.map((c) => (c.id === draft.id ? draft : c))), [cards, draft]);

  // Focus the first empty word once the dialog has opened (or when moving on to the next card)
  useEffect(() => {
    const timeout = setTimeout(() => inputRefs.current[firstEmptyWord(card)]?.focus(), 150);
    return () => clearTimeout(timeout);
  }, [card]);

  const changeWord = useCallback((index: WordIndex, word: string) => {
    setDraft((draft) => {
      const words = [...draft.words] as CardWords;
      words[index] = { ...words[index], word, rotationDeg: nextRotationDeg(words[index], word) };
      return { ...draft, words };
    });
  }, []);

  const shuffleRotation = useCallback(() => {
    setDraft((draft) => ({
      ...draft,
      words: draft.words.map((word) => ({ ...word, rotationDeg: randomRotationDeg() })) as CardWords,
    }));
  }, []);

  const pressEnter = (index: WordIndex) => {
    if (index < 2) {
      inputRefs.current[index + 1]?.focus();
    } else {
      onSave(draft);
    }
  };

  // The card is 340px, it is scaled down so the fields fit next to it (or below it on phones)
  const previewSize = isPhone ? 200 : 280;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative flex-none" style={{ width: previewSize, height: previewSize }}>
          <CardFront
            card={draft}
            hideIndex
            highlightWord={activeIndex}
            className="origin-top-left"
            style={{ transform: `scale(${previewSize / 340})` }}
          />
          <Tooltip title={t("shuffleRotation")}>
            <Button
              shape="circle"
              icon={<SyncOutlined />}
              onClick={shuffleRotation}
              aria-label={t("shuffleRotation")}
              className="absolute -right-1 -bottom-1 shadow"
            />
          </Tooltip>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {wordIndexes.map((index) => {
            const { word, color } = draft.words[index];
            const position = wordPositionName[index];
            const [recommended, tight] = wordLengthsMax[position];
            const warning =
              word.length > tight ? t("wordTooLong") : word.length > recommended ? t("wordTight") : undefined;
            const repetition = getRepetition(wordPlaces, word, cardIndex, index);
            return (
              <label key={index} className="block">
                <span className="flex items-center gap-2 mb-1 text-sm font-medium text-slate-700">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-slate-400"
                    style={{ background: color }}
                  />
                  {t(position)}
                </span>
                <Input
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  size="large"
                  value={word}
                  placeholder={t("inputWord")}
                  classNames={{ input: "uppercase" }}
                  enterKeyHint={index < 2 ? "next" : "done"}
                  onFocus={() => setActiveIndex(index)}
                  onChange={(evt) => changeWord(index, evt.target.value)}
                  onPressEnter={() => pressEnter(index)}
                  status={repetition ? "warning" : undefined}
                  suffix={<WordCounterTag word={word} position={position} showMax className="me-0" />}
                />
                {warning && (
                  <span className={word.length > tight ? "text-xs text-red-600" : "text-xs text-amber-600"}>
                    {warning}
                  </span>
                )}
                {repetition && <RepeatedWordWarning repetition={repetition} />}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap-reverse items-center justify-between gap-2">
        <CardDeletePopConfirm card={card} placement="top">
          <Button type="text" danger icon={<DeleteOutlined />}>
            {t("deleteCard")}
          </Button>
        </CardDeletePopConfirm>
        <div className="flex gap-2 ms-auto">
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button onClick={() => onSaveAndNext(draft)}>{t("saveAndNext")}</Button>
          <Button type="primary" onClick={() => onSave(draft)}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

function firstEmptyWord(card: Card): WordIndex {
  const index = card.words.findIndex(({ word }) => word.trim() === "");
  return index === -1 ? 0 : (index as WordIndex);
}
