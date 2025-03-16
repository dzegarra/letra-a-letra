import { PlusOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import { ComponentProps } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCardsStore } from "../store";

type EmptyCardsProps = ComponentProps<"div">;

export const EmptyCards = ({ className, ...props }: EmptyCardsProps) => {
  const addCard = useCardsStore((state) => state.addCard);
  const { t } = useTranslation();

  return (
    <div className={clsx("flex items-center justify-center", className)} {...props}>
      <Empty data-testid="empty" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("emptyCardsMessage")}>
        <Button type="primary" onClick={addCard} icon={<PlusOutlined />}>
          {t("addNewCard")}
        </Button>
      </Empty>
    </div>
  );
};
