import { Popconfirm, PopconfirmProps } from "antd";
import { useCardsStore } from "../store";
import { useTranslation } from "react-i18next";

type NewProjectConfirmProps = Omit<PopconfirmProps, "title" | "description" | "onConfirm" | "okText" | "cancelText">;

export const NewProjectPopConfirm = ({ children, ...props }: NewProjectConfirmProps) => {
  const deleteAllCards = useCardsStore((state) => state.deleteAllCards);
  const { t } = useTranslation();

  return (
    <Popconfirm
      title={t("newProject")}
      description={t("newProjectConfirmationMessage")}
      onConfirm={deleteAllCards}
      okText={t("yes")}
      cancelText={t("no")}
      {...props}
    >
      {children}
    </Popconfirm>
  );
};
