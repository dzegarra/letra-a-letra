import { useRef, useCallback } from "react";
import { Input, InputRef } from "antd";
import { WordCounterTag } from "./WordCounterTag";
import { wordPositionName } from "../constants";
import { RepeatedWord } from "../helpers/findRepeatedWords";
import { RepeatedWordWarning } from "./RepeatedWordWarning";

type EditableCellProps = {
  cardWord?: string;
  updateCardWord?: (word: string) => void;
  wordPosition: (typeof wordPositionName)[number];
  repetition?: RepeatedWord;
};

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  children,
  cardWord,
  updateCardWord,
  wordPosition,
  repetition,
  ...restProps
}) => {
  const inputRef = useRef<InputRef>(null);

  const save = useCallback(() => {
    updateCardWord?.(inputRef.current?.input?.value || "");
  }, [updateCardWord]);

  if (updateCardWord) {
    return (
      <td {...restProps}>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            onChange={save}
            value={cardWord}
            className="uppercase flex-1"
            status={repetition ? "warning" : undefined}
          />
          <WordCounterTag word={cardWord} position={wordPosition} />
        </div>
        {repetition && <RepeatedWordWarning repetition={repetition} />}
      </td>
    );
  }

  return <td {...restProps}>{children}</td>;
};
