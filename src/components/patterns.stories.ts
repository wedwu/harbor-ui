import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../index";

const meta: Meta = {
  title: "Patterns/Sign-up form",
  parameters: {
    docs: {
      description: {
        component:
          "Components composed inside a plain `<form>`. Submitting runs native validation through `ElementInternals`; a valid submit shows the collected `FormData`.",
      },
    },
  },
};
export default meta;

const submit = (e: SubmitEvent) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const out = form.querySelector("output")!;
  const fields = [...form.querySelectorAll("hb-text-field")];
  if (!fields.map((f) => f.checkValidity()).every(Boolean)) {
    out.textContent = "";
    return;
  }
  out.textContent = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);
};

export const SignUp: StoryObj = {
  render: () => html`
    <form @submit=${submit} novalidate style="max-width:400px">
      <hb-card>
        <span slot="header">Create your account</span>
        <div style="display:grid;gap:16px">
          <hb-text-field name="name" label="Full name" required autocomplete="name"></hb-text-field>
          <hb-text-field name="email" label="Work email" type="email" required autocomplete="email" hint="We will send a confirmation link."></hb-text-field>
          <hb-alert variant="info">You can invite teammates after signing up.</hb-alert>
          <output style="white-space:pre;font-family:var(--hb-font-family-mono);font-size:13px"></output>
        </div>
        <hb-button slot="footer" type="reset" variant="ghost">Clear</hb-button>
        <hb-button slot="footer" type="submit">Create account</hb-button>
      </hb-card>
    </form>`,
};
