import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { ComponentProps } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCardsStore } from "../store";
import { GameIntro } from "./GameIntro";

type EmptyCardsProps = ComponentProps<"div">;

/** Welcomes the visitor with an introduction to the game while the project has no cards */
export const EmptyCards = ({ className, ...props }: EmptyCardsProps) => {
  const addCard = useCardsStore((state) => state.addCard);
  const { t } = useTranslation();

  return (
    <div className={clsx("flex justify-center px-4 py-6 sm:py-10", className)} data-testid="empty" {...props}>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <Typography.Title level={2} className="!mb-2">
            {t("welcomeTitle")}
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="text-base">
            {t("welcomeDescription")}
          </Typography.Paragraph>
          <Button type="primary" size="large" onClick={addCard} icon={<PlusOutlined />}>
            {t("createFirstCard")}
          </Button>
        </div>

        <GameIntro showTitle />
      </div>
    </div>
  );
};
