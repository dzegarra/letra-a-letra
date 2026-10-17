import { CopyOutlined } from "@ant-design/icons";
import { Flex, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

type CardsCountProps = {
  count: number;
  compact?: boolean;
};

export const CardsCount = ({ count, compact = false }: CardsCountProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("totalNumberOfCards")} placement="bottomRight">
      {/* Plain text on the header, so it reads as information and not as one more button */}
      <Flex
        vertical
        gap={4}
        style={{ minWidth: compact ? undefined : "64px", color: "white", cursor: "default" }}
      >
        {!compact && <span className="leading-none text-xs text-white/60">{t("cards")}</span>}
        <span className="leading-none text-lg">
          <CopyOutlined /> {count}
        </span>
      </Flex>
    </Tooltip>
  );
};
