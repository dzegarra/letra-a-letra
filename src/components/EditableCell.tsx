import { useRef, useCallback } from "react";
import { Input, InputRef } from "antd";

type EditableCellProps = {
  cardWord?: string;
  updateCardWord?: (word: string) => void;
};

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  children,
  cardWord,
  updateCardWord,
  ...restProps
}) => {
  const inputRef = useRef<InputRef>(null);

  const save = useCallback(() => {
    updateCardWord?.(inputRef.current?.input?.value || "");
  }, [updateCardWord]);

  if (updateCardWord) {
    return (<td {...restProps}>
      <Input ref={inputRef} onBlur={save} defaultValue={cardWord} />
    </td>)
  }

  return (
    <td {...restProps}>{children}</td>
  );
};
