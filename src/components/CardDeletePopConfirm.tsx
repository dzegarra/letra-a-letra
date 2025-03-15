import { Popconfirm, PopconfirmProps } from "antd";
import { useCardsStore } from "../store";
import { Card } from "../types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type CardDeletePopConfirm = { card: Card } & Omit<
  PopconfirmProps,
  "title" | "description" | "onConfirm" | "okText" | "cancelText"
>;

export const CardDeletePopConfirm = ({ card, children, ...props }: CardDeletePopConfirm) => {
  const deleteCard = useCardsStore((state) => state.deleteCard);
  const { t } = useTranslation();

  const confirmDeleteCard = useCallback(() => {
    deleteCard(card);
  }, [card, deleteCard]);

  return (
    <Popconfirm
      title={t("deleteCard")}
      description={t("areYouSureToDeleteThisCard")}
      onConfirm={confirmDeleteCard}
      okText={t("yes")}
      cancelText={t("no")}
      {...props}
    >
      {children}
    </Popconfirm>
  );
};
