import { Tag } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { wordLengthsMax, wordPositionName } from "../constants";

type WordCounterTagProps = {
  word?: string;
  position: (typeof wordPositionName)[number];
  /** Shows the count against the recommended maximum of the ring, like "5/9" */
  showMax?: boolean;
  className?: string;
};

export const WordCounterTag = ({ word = "", position, showMax = false, className }: WordCounterTagProps) => {
  const { t } = useTranslation();
  const color = useMemo(() => {
    const positionRules = wordLengthsMax[position];
    // An empty word is not an error yet, the card just hasn't been filled in
    if (word.length === 0) return undefined;
    if (word.length <= positionRules[0]) return "green";
    if (word.length <= positionRules[1]) return "warning";
    if (word.length <= positionRules[2]) return "error";
    return "#cd201f";
  }, [word, position]);
  return (
    <Tag color={color} className={className}>
      {showMax ? `${word.length}/${wordLengthsMax[position][0]}` : t("wordLength", { length: word.length })}
    </Tag>
  );
};
