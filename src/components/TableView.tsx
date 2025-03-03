import { Dispatch, SetStateAction, useMemo } from "react";
import { Table, TableProps } from "antd";
import { Card, CardWords, Word } from "../types";
import { EditableCell } from "./EditableCell";

type TableViewProps = {
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
};

const columns: TableProps<Card>["columns"] = [
  {
    title: "Card #",
    dataIndex: "index",
    key: "index",
    width: "10%",
    render: (_, __, index) => <span>{index + 1}</span>,
  },
  {
    title: "Word #1",
    dataIndex: "words",
    key: 0,
    width: "30%",
    render: (_, { words }) => <span>{words[0].word}</span>,
  },
  {
    title: "Word #2",
    dataIndex: "words",
    key: 1,
    width: "30%",
    render: (_, { words }) => <span>{words[1].word}</span>,
  },
  {
    title: "Word #3",
    dataIndex: "words",
    key: 2,
    width: "30%",
    render: (_, { words }) => <span>{words[2].word}</span>,
  },
];

const components = {
  body: {
    cell: EditableCell,
  },
};

export const TableView = ({ cards, setCards }: TableViewProps) => {

  const columnsFinal = useMemo(
    () =>
      columns.map((column, index) => ({
        ...column,
        onCell: index>0 ? (record: Card, cardIndex: number) => ({
          cardWord: record.words[column.key as number].word,
          updateCardWord: (word: string) => {
            setCards((cards) => {
              const wordIndex = column.key as number;
              const oldCard = cards[cardIndex];
              const oldWord = oldCard.words[wordIndex];
              const newWord: Word = { ...oldWord, word };
              const newCard: Card = {
                ...oldCard,
                words: oldCard.words.map((word, index) => (index === wordIndex ? newWord : word)) as CardWords,
              };
              const newCards = [...cards];
              newCards[cardIndex] = newCard;
              return newCards;
            });
          },
        }) : undefined,
      })),
    [setCards],
  );

  return (
      <Table<Card>
        bordered
        pagination={false}
        rowClassName={() => "editable-row"}
        dataSource={cards}
        columns={columnsFinal as TableProps<Card>["columns"]}
        components={components}
        rowKey={(card) => card.id}
      />
  );
};
