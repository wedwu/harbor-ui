import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./hb-alert";

type Args = { variant: string; dismissible: boolean; heading: string; message: string };

const meta: Meta<Args> = {
  title: "Components/Alert",
  component: "hb-alert",
  args: { variant: "info", dismissible: false, heading: "Scheduled maintenance", message: "Reports will be read-only on Sunday from 2:00 to 4:00 AM ET." },
  argTypes: { variant: { control: "inline-radio", options: ["info", "success", "warning", "danger"] } },
  render: (a) => html`<hb-alert variant=${a.variant} ?dismissible=${a.dismissible}>
    ${a.heading ? html`<span slot="heading">${a.heading}</span>` : ""}${a.message}
  </hb-alert>`,
  parameters: {
    docs: {
      description: {
        component:
          "Danger alerts use `role=\"alert\"` and interrupt the screen reader. The other variants use `role=\"status\"` and wait their turn. " +
          "Color is never the only signal: each variant has its own icon, and the heading should say what happened.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:grid;gap:12px;max-width:560px">
      <hb-alert variant="info"><span slot="heading">Heads up</span>A new version of the dashboard is available.</hb-alert>
      <hb-alert variant="success"><span slot="heading">Saved</span>Your changes were published.</hb-alert>
      <hb-alert variant="warning"><span slot="heading">Storage almost full</span>You have used 92% of your workspace storage.</hb-alert>
      <hb-alert variant="danger" dismissible><span slot="heading">Payment failed</span>Update the card on file to keep your plan active.</hb-alert>
    </div>`,
};
