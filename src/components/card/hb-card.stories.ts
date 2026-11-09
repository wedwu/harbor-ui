import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./hb-card";
import "../button/hb-button";

type Args = { elevated: boolean };

const meta: Meta<Args> = {
  title: "Components/Card",
  component: "hb-card",
  args: { elevated: false },
  render: (a) => html`<div style="max-width:420px">
    <hb-card ?elevated=${a.elevated}>
      <span slot="header">Team plan</span>
      Up to 25 seats, shared projects and priority support. Billed monthly, cancel any time.
      <hb-button slot="footer" variant="ghost">Compare plans</hb-button>
      <hb-button slot="footer">Upgrade</hb-button>
    </hb-card>
  </div>`,
  parameters: {
    docs: { description: { component: "Header and footer are optional slots. They only render, borders included, when content is placed in them." } },
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Elevated: Story = { args: { elevated: true } };
export const BodyOnly: Story = {
  render: () => html`<div style="max-width:420px"><hb-card>A card with only body content and no header or footer.</hb-card></div>`,
};
