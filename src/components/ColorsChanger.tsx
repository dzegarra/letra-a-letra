import { Flex, Space, ColorPicker, Typography, FlexProps } from "antd";
import { useCardsColor } from "../hooks/useCardsColor";
import { Card } from "../types";

type ColorsChangerProps = {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
} & Omit<FlexProps, "children">;

export const ColorsChanger = ({ cards, setCards, ...props }: ColorsChangerProps) => {
  const { colors, updateColorAtIndex } = useCardsColor(cards, setCards);

  return (
    <Flex vertical gap="middle" {...props}>
      <Space>
        <Typography.Title level={5}>Color #1:</Typography.Title>
        <ColorPicker disabledAlpha defaultValue={colors[0]} onChangeComplete={(color) => updateColorAtIndex(color.toHexString(), 0)} />
      </Space>
      <Space>
        <Typography.Title level={5}>Color #2:</Typography.Title>
        <ColorPicker disabledAlpha defaultValue={colors[1]} onChangeComplete={(color) => updateColorAtIndex(color.toHexString(), 1)} />
      </Space>
      <Space>
        <Typography.Title level={5}>Color #3:</Typography.Title>
        <ColorPicker disabledAlpha defaultValue={colors[2]} onChangeComplete={(color) => updateColorAtIndex(color.toHexString(), 2)} />
      </Space>
    </Flex>
  );
};
