import { useMemo } from "react";
import { FloatButton, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { Card, WordIndex } from "../types";
import { EditableCell } from "./EditableCell";
import { wordPositionName } from "../constants";
import { useCardsStore } from "../store";
import { EmptyCards } from "./EmptyCards";
import { TableActionsCell } from "./TableActionsCell";

type TableViewProps = Omit<
  TableProps<Card>,
  "bordered" | "pagination" | "rowClassName" | "dataSource" | "columns" | "components" | "rowKey"
>;

const columns: TableProps<Card>["columns"] = [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
    width: "60px",
    render: (_, __, index) => <span>{index + 1}</span>,
  },
  {
    title: wordPositionName[2],
    dataIndex: "words",
    key: 2,
    width: "30%",
  },
  {
    title: wordPositionName[1],
    dataIndex: "words",
    key: 1,
    width: "30%",
  },
  {
    title: wordPositionName[0],
    dataIndex: "words",
    key: 0,
    width: "30%",
  },
  {
    key: "actions",
    width: "110px",
    className: "text-center",
    render: (_, card) => <TableActionsCell card={card} />,
  },
];

const components = {
  body: {
    cell: EditableCell,
  },
};

export const TableView = (props: TableViewProps) => {
  const cards = useCardsStore((state) => state.cards);
  const updateCardWord = useCardsStore((state) => state.updateCardWord);
  const addCard = useCardsStore((state) => state.addCard);
  const { t } = useTranslation();

  const columnsFinal = useMemo(
    () =>
      columns.map((column, index) => ({
        ...column,
        title: t(column.title as (typeof wordPositionName)[number]),
        onCell: [1, 2, 3].includes(index)
          ? (card: Card) => ({
              cardWord: card.words[column.key as number].word,
              wordPosition: wordPositionName[column.key as WordIndex],
              updateCardWord: (word: string) => {
                updateCardWord(card.id, column.key as WordIndex, word);
              },
            })
          : undefined,
      })),
    [t, updateCardWord],
  );

  return (
    <>
      {cards.length === 0 ? (
        <EmptyCards className="h-full" />
      ) : (
        <Table<Card>
          bordered
          pagination={false}
          rowClassName={() => "editable-row"}
          dataSource={cards}
          columns={columnsFinal as TableProps<Card>["columns"]}
          components={components}
          rowKey={(card) => card.id}
          size="small"
          sticky
          {...props}
        />
      )}

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton type="primary" tooltip={t("addNewCard")} icon={<PlusOutlined />} onClick={addCard} />
      </FloatButton.Group>
    </>
  );
};
