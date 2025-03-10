import { Flex, Space, ColorPicker, Typography, FlexProps } from "antd";
import { wordPositionName } from "../constants";
import { useCardsStore } from "../store";

type ColorsChangerProps = Omit<FlexProps, "children">;

export const ColorsChanger = ({ ...props }: ColorsChangerProps) => {
  const colors = useCardsStore((state) => state.colors);
  const changeColorArIndex = useCardsStore((state) => state.changeColorArIndex);
  console.log("change colors", colors);
  return (
    <Flex vertical gap="middle" {...props}>
      <Space>
        <Typography.Title level={5}>{wordPositionName[2]}:</Typography.Title>
        <ColorPicker
          disabledAlpha
          value={colors[2]}
          onChangeComplete={(color) => changeColorArIndex(color.toHexString(), 2)}
        />
      </Space>
      <Space>
        <Typography.Title level={5}>{wordPositionName[1]}:</Typography.Title>
        <ColorPicker
          disabledAlpha
          value={colors[1]}
          onChangeComplete={(color) => changeColorArIndex(color.toHexString(), 1)}
        />
      </Space>
      <Space>
        <Typography.Title level={5}>{wordPositionName[0]}:</Typography.Title>
        <ColorPicker
          disabledAlpha
          value={colors[0]}
          onChangeComplete={(color) => changeColorArIndex(color.toHexString(), 0)}
        />
      </Space>
    </Flex>
  );
};
