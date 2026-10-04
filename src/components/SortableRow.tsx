import { createContext, useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type DragHandleContextValue = Pick<ReturnType<typeof useSortable>, "setActivatorNodeRef" | "listeners" | "attributes">;

const DragHandleContext = createContext<DragHandleContextValue | null>(null);

type SortableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  "data-row-key": string;
};

export const SortableRow = (props: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 10, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" } : {}),
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes],
  );

  return (
    <DragHandleContext.Provider value={contextValue}>
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        className={`${props.className ?? ""} ${isDragging ? "bg-white" : ""}`}
      />
    </DragHandleContext.Provider>
  );
};

export const DragHandle = () => {
  const { t } = useTranslation();
  const context = useContext(DragHandleContext);

  return (
    <button
      type="button"
      ref={context?.setActivatorNodeRef}
      {...context?.attributes}
      {...context?.listeners}
      aria-label={t("dragToReorder")}
      title={t("dragToReorder")}
      className="-m-2 p-2 cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
    >
      <HolderOutlined />
    </button>
  );
};
