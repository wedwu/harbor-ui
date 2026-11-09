import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { base } from "../shared";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * A button that works inside native forms.
 *
 * @slot - Button label
 * @slot start - Icon before the label
 * @csspart base - The inner native button
 */
@customElement("hb-button")
export class HbButton extends LitElement {
  static formAssociated = true;
  /** host.focus() moves focus to the inner button, so focus management works on the element itself. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = [
    base,
    css`
      :host { display: inline-block; }
      :host([full-width]) { display: block; }
      button {
        all: unset;
        box-sizing: border-box;
        display: inline-flex; align-items: center; justify-content: center; gap: var(--hb-space-2);
        width: 100%;
        font: inherit; font-weight: var(--hb-font-weight-medium); line-height: 1;
        border-radius: var(--hb-radius-md);
        border: 1px solid transparent;
        cursor: pointer;
        transition: background-color var(--hb-motion-fast), border-color var(--hb-motion-fast), color var(--hb-motion-fast);
      }
      .sm { padding: var(--hb-space-1) var(--hb-space-3); font-size: var(--hb-font-size-sm); min-height: 28px; }
      .md { padding: var(--hb-space-2) var(--hb-space-4); min-height: 36px; }
      .lg { padding: var(--hb-space-3) var(--hb-space-5); font-size: var(--hb-font-size-lg); min-height: 44px; }

      .primary { background: var(--hb-color-action); color: var(--hb-color-text-on-action); }
      .primary:hover { background: var(--hb-color-action-hover); }
      .secondary { background: var(--hb-color-surface); color: var(--hb-color-action); border-color: var(--hb-color-border-strong); }
      .secondary:hover { background: var(--hb-color-action-subtle); }
      .ghost { background: transparent; color: var(--hb-color-action); }
      .ghost:hover { background: var(--hb-color-action-subtle); }
      .danger { background: var(--hb-color-danger-fg); color: var(--hb-color-bg); }
      .danger:hover { filter: brightness(0.92); }

      button[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
      .spinner {
        width: 1em; height: 1em; border-radius: 50%;
        border: 2px solid currentColor; border-right-color: transparent;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `,
  ];

  @property({ reflect: true }) variant: ButtonVariant = "primary";
  @property({ reflect: true }) size: ButtonSize = "md";
  @property() type: "button" | "submit" | "reset" = "button";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Shows a spinner and blocks clicks, but keeps the button focusable so screen readers hear the busy state. */
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: "full-width" }) fullWidth = false;

  private internals?: ElementInternals;

  constructor() {
    super();
    // Older test DOMs lack ElementInternals; the button still works there, just without form submission.
    this.internals = this.attachInternals?.();
  }

  private handleClick(e: MouseEvent) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    const form = this.internals?.form;
    if (!form) return;
    if (this.type === "submit") form.requestSubmit();
    if (this.type === "reset") form.reset();
  }

  render() {
    const inactive = this.disabled || this.loading;
    return html`
      <button
        part="base"
        class="focus-ring ${this.variant} ${this.size}"
        type="button"
        aria-disabled=${inactive ? "true" : "false"}
        aria-busy=${this.loading ? "true" : "false"}
        @click=${this.handleClick}
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : html`<slot name="start"></slot>`}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "hb-button": HbButton; }
}
