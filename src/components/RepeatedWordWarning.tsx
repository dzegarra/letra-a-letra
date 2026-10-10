import { useTranslation } from "react-i18next";
import { RepeatedWord } from "../helpers/findRepeatedWords";

type RepeatedWordWarningProps = {
  repetition: RepeatedWord;
};

/** Warns that a word is used more than once in the project. It is only a warning, the word can still be saved */
export const RepeatedWordWarning = ({ repetition: { otherCards, sameCard } }: RepeatedWordWarningProps) => {
  const { t, i18n } = useTranslation();
  const cards = new Intl.ListFormat(i18n.language, { type: "conjunction" }).format(otherCards.map(String));
  const message =
    otherCards.length > 0
      ? t("repeatedWordInCards", { count: otherCards.length, cards })
      : sameCard
        ? t("repeatedWordInThisCard")
        : undefined;
  return <span className="block text-xs text-amber-600">{message}</span>;
};
