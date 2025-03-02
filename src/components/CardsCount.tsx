import { CopyOutlined } from "@ant-design/icons";
import { Flex, Tooltip } from "antd";

type CardsCountProps = {
  count: number;
};

export const CardsCount = ({ count }: CardsCountProps) => (
  <Tooltip title="Total number of cards">
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
      <span className="leading-none text-gray-500 text-xs">Cards</span>
      <span className="leading-none text-lg">
        <CopyOutlined /> {count}
      </span>
    </Flex>
  </Tooltip>
);
