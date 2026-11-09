import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./hb-dialog";
import "../button/hb-button";
import "../text-field/hb-text-field";
import type { HbDialog } from "./hb-dialog";

const open = (e: Event) => ((e.currentTarget as HTMLElement).nextElementSibling as HbDialog).show();
const closeParent = (e: Event) => (e.currentTarget as HTMLElement).closest("hb-dialog")?.close("action");

const meta: Meta = {
  title: "Components/Dialog",
  component: "hb-dialog",
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 360 },
      description: {
        component:
          "Built on the native `<dialog>` element with `showModal()`, so the browser traps focus, closes on Escape and makes the page behind it inert. " +
          "Focus returns to the button that opened it. The heading labels the dialog through `aria-labelledby`.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Confirm: Story = {
  render: () => html`
    <hb-button variant="danger" @click=${open}>Delete project</hb-button>
    <hb-dialog label="Delete this project?">
      This removes the project and its 14 reports for everyone on your team. You cannot undo this.
      <hb-button slot="footer" variant="secondary" @click=${closeParent}>Cancel</hb-button>
      <hb-button slot="footer" variant="danger" @click=${closeParent}>Delete project</hb-button>
    </hb-dialog>`,
};

export const WithForm: Story = {
  render: () => html`
    <hb-button @click=${open}>Invite teammate</hb-button>
    <hb-dialog label="Invite a teammate">
      <hb-text-field label="Email" type="email" required hint="They will get an invite link that expires in 7 days."></hb-text-field>
      <hb-button slot="footer" variant="secondary" @click=${closeParent}>Cancel</hb-button>
      <hb-button slot="footer" @click=${closeParent}>Send invite</hb-button>
    </hb-dialog>`,
};

export const OpenByDefault: Story = {
  name: "Open (static preview)",
  render: () => html`
    <hb-dialog label="Session expiring" open>
      You will be signed out in 2 minutes. Stay signed in?
      <hb-button slot="footer" variant="secondary" @click=${closeParent}>Sign out</hb-button>
      <hb-button slot="footer" @click=${closeParent}>Stay signed in</hb-button>
    </hb-dialog>`,
};
