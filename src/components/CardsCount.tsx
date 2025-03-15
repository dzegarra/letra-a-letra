import { CopyOutlined } from "@ant-design/icons";
import { Flex, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

type CardsCountProps = {
  count: number;
};

export const CardsCount = ({ count }: CardsCountProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("totalNumberOfCards")} placement="bottomRight">
      <Flex
        style={{
          padding: "4px 12px",
          minWidth: "90px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          backgroundColor: "white",
          borderRadius: "4px",
          cursor: "default",
        }}
      >
        <span className="leading-none text-gray-500 text-xs">{t("cards")}</span>
        <span className="leading-none text-lg">
          <CopyOutlined /> {count}
        </span>
      </Flex>
    </Tooltip>
  );
};
