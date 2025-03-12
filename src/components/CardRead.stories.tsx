import type { Meta, StoryObj } from "@storybook/react";
import { CardRear } from "./CardRear";

const meta: Meta<typeof CardRear> = {
  component: CardRear,
};

export default meta;

type Story = StoryObj<typeof CardRear>;

export const Default: Story = {
  args: {
    color: "#000000",
  },
  render: (props) => <CardRear {...props}></CardRear>,
};
