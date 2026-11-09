import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./hb-text-field";

type Args = { label: string; hint: string; error: string; placeholder: string; required: boolean; disabled: boolean; type: string };

const meta: Meta<Args> = {
  title: "Components/Text field",
  component: "hb-text-field",
  args: { label: "Email", hint: "We only use this for order receipts.", error: "", placeholder: "you@example.com", required: true, disabled: false, type: "email" },
  argTypes: { type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] } },
  render: (a) => html`<div style="max-width:360px">
    <hb-text-field label=${a.label} hint=${a.hint} error=${a.error} placeholder=${a.placeholder} type=${a.type} ?required=${a.required} ?disabled=${a.disabled}></hb-text-field>
  </div>`,
  parameters: {
    docs: {
      description: {
        component:
          "The label, hint and error are wired to the input with `for` and `aria-describedby`, so screen readers read all three. " +
          "The field is form-associated through `ElementInternals`: it submits with its `name`, resets with the form, and reports validity to `form.checkValidity()`. " +
          "Errors appear only after the user leaves the field, not while they are still typing.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const WithError: Story = { args: { error: "Enter an email address like name@example.com." } };
export const Disabled: Story = { args: { disabled: true, hint: "" } };
