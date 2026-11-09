import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { fn } from "@storybook/test";
import "./hb-button";

type Args = { variant: string; size: string; disabled: boolean; loading: boolean; label: string; onClick: () => void };

const meta: Meta<Args> = {
  title: "Components/Button",
  component: "hb-button",
  args: { variant: "primary", size: "md", disabled: false, loading: false, label: "Save changes", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: (a) => html`<hb-button variant=${a.variant} size=${a.size} ?disabled=${a.disabled} ?loading=${a.loading} @click=${a.onClick}>${a.label}</hb-button>`,
  parameters: {
    docs: {
      description: {
        component:
          "Use **primary** for the one main action on a screen, **secondary** for the rest, **ghost** for low-emphasis actions in toolbars, and **danger** only for destructive actions. " +
          "Disabled and loading buttons stay focusable and announce their state with `aria-disabled` and `aria-busy`, rather than disappearing from the tab order.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <hb-button>Primary</hb-button>
      <hb-button variant="secondary">Secondary</hb-button>
      <hb-button variant="ghost">Ghost</hb-button>
      <hb-button variant="danger">Delete</hb-button>
    </div>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center">
      <hb-button size="sm">Small</hb-button>
      <hb-button size="md">Medium</hb-button>
      <hb-button size="lg">Large</hb-button>
    </div>`,
};

export const States: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <hb-button loading>Saving</hb-button>
      <hb-button disabled>Disabled</hb-button>
      <hb-button variant="secondary" disabled>Disabled</hb-button>
    </div>`,
};

export const WithIcon: Story = {
  render: () => html`
    <hb-button variant="secondary">
      <svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
      New project
    </hb-button>`,
};
