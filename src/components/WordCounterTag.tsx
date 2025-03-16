import { Tag } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { wordLengthsMax, wordPositionName } from "../constants";

type WordCounterTagProps = {
  word?: string;
  position: (typeof wordPositionName)[number];
};

export const WordCounterTag = ({ word = "", position }: WordCounterTagProps) => {
  const { t } = useTranslation();
  const color = useMemo(() => {
    const positionRules = wordLengthsMax[position];
    if (word.length === 0) return "#cd201f";
    if (word.length <= positionRules[0]) return "green";
    if (word.length <= positionRules[1]) return "warning";
    if (word.length <= positionRules[2]) return "error";
    return "#cd201f";
  }, [word, position]);
  return <Tag color={color}>{t("wordLength", { length: word.length })}</Tag>;
};
