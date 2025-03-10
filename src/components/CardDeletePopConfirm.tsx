import { Popconfirm, PopconfirmProps } from "antd";
import { useCardsStore } from "../store";
import { Card } from "../types";
import { useCallback } from "react";

type CardDeletePopConfirm = { card: Card } & Omit<
  PopconfirmProps,
  "title" | "description" | "onConfirm" | "okText" | "cancelText"
>;

export const CardDeletePopConfirm = ({ card, children, ...props }: CardDeletePopConfirm) => {
  const deleteCard = useCardsStore((state) => state.deleteCard);

  const confirmDeleteCard = useCallback(() => {
    deleteCard(card);
  }, [card, deleteCard]);

  return (
    <Popconfirm
      title="Delete the card"
      description="Are you sure to delete this card?"
      onConfirm={confirmDeleteCard}
      okText="Yes"
      cancelText="No"
      {...props}
    >
      {children}
    </Popconfirm>
  );
};
