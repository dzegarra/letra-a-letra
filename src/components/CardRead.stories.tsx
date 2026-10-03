import type { Meta, StoryObj } from "@storybook/react";
import { CardRear } from "./CardRear";
import { rearDesigns } from "../rearDesigns";

const meta: Meta<typeof CardRear> = {
  component: CardRear,
  argTypes: {
    design: {
      control: "select",
      options: Object.keys(rearDesigns),
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardRear>;

export const Default: Story = {
  args: {
    color: "#000000",
    design: "rings",
  },
  render: (props) => <CardRear {...props}></CardRear>,
};
