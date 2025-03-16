import { useRef, useCallback } from "react";
import { Input, InputRef, Space, Tag } from "antd";
import { WordCounterTag } from "./WordCounterTag";
import { wordPositionName } from "../constants";

type EditableCellProps = {
  cardWord?: string;
  updateCardWord?: (word: string) => void;
  wordPosition: (typeof wordPositionName)[number];
};

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  children,
  cardWord,
  updateCardWord,
  wordPosition,
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
          <Input ref={inputRef} onChange={save} defaultValue={cardWord} className="uppercase flex-1" />
          <WordCounterTag word={cardWord} position={wordPosition} />
        </div>
      </td>
    );
  }

  return <td {...restProps}>{children}</td>;
};
