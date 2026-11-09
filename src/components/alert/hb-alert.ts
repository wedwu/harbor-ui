import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { base } from "../shared";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const icons: Record<AlertVariant, string> = {
  info: "M12 8h.01M11 12h1v4h1",
  success: "M8 12.5l2.5 2.5L16 9.5",
  warning: "M12 8v4m0 4h.01",
  danger: "M9 9l6 6m0-6l-6 6",
};

/**
 * An inline message. Danger alerts use role="alert" so screen readers announce them right away;
 * the others use role="status" and are announced politely.
 *
 * @slot - Message body
 * @slot heading - Optional bold first line
 * @fires hb-dismiss - When the close button is pressed. Cancel it to keep the alert open.
 */
@customElement("hb-alert")
export class HbAlert extends LitElement {
  static styles = [
    base,
    css`
      :host { display: block; }
      .alert {
        display: flex; gap: var(--hb-space-3); align-items: flex-start;
        padding: var(--hb-space-3) var(--hb-space-4);
        border-radius: var(--hb-radius-md);
        border-left: 4px solid var(--fg);
        background: var(--bg); color: var(--hb-color-text);
      }
      .info    { --bg: var(--hb-color-info-bg);    --fg: var(--hb-color-info-fg); }
      .success { --bg: var(--hb-color-success-bg); --fg: var(--hb-color-success-fg); }
      .warning { --bg: var(--hb-color-warning-bg); --fg: var(--hb-color-warning-fg); }
      .danger  { --bg: var(--hb-color-danger-bg);  --fg: var(--hb-color-danger-fg); }
      svg { flex: none; width: 20px; height: 20px; color: var(--fg); margin-top: 1px; }
      .body { flex: 1; line-height: 1.45; }
      ::slotted([slot="heading"]) { display: block; font-weight: var(--hb-font-weight-bold); margin-bottom: 2px; }
      .close {
        all: unset; cursor: pointer; flex: none;
        width: 28px; height: 28px; display: grid; place-items: center;
        margin: -4px -8px -4px 0; border-radius: var(--hb-radius-sm); color: var(--hb-color-text-muted);
      }
      .close:hover { background: rgb(0 0 0 / 0.06); color: var(--hb-color-text); }
    `,
  ];

  @property({ reflect: true }) variant: AlertVariant = "info";
  @property({ type: Boolean }) dismissible = false;
  @property({ attribute: "close-label" }) closeLabel = "Dismiss";

  private dismiss() {
    const ok = this.dispatchEvent(new CustomEvent("hb-dismiss", { bubbles: true, composed: true, cancelable: true }));
    if (ok) this.hidden = true;
  }

  render() {
    return html`
      <div class="alert ${this.variant}" role=${this.variant === "danger" ? "alert" : "status"}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d=${icons[this.variant]}></path>
        </svg>
        <div class="body"><slot name="heading"></slot><slot></slot></div>
        ${this.dismissible
          ? html`<button class="close focus-ring" aria-label=${this.closeLabel} @click=${this.dismiss}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"></path></svg>
            </button>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "hb-alert": HbAlert; }
}
