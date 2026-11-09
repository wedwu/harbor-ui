import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { base, uid } from "../shared";

/**
 * A modal dialog built on the native <dialog> element, so the browser handles the focus trap,
 * the Escape key and making the rest of the page inert. Focus returns to whatever opened it.
 *
 * @slot - Body
 * @slot footer - Actions
 * @fires hb-close - After the dialog closes. `detail.reason` is "close-button", "escape", "backdrop" or "api".
 */
@customElement("hb-dialog")
export class HbDialog extends LitElement {
  static styles = [
    base,
    css`
      dialog {
        width: min(520px, calc(100vw - 32px));
        padding: 0; border: 0;
        border-radius: var(--hb-radius-lg);
        background: var(--hb-color-surface); color: var(--hb-color-text);
        box-shadow: var(--hb-shadow-lg);
      }
      dialog::backdrop { background: var(--hb-color-backdrop); }
      header { display: flex; align-items: center; justify-content: space-between; gap: var(--hb-space-3); padding: var(--hb-space-4) var(--hb-space-5) 0; }
      h2 { margin: 0; font-size: var(--hb-font-size-xl); font-weight: var(--hb-font-weight-bold); }
      .body { padding: var(--hb-space-4) var(--hb-space-5); line-height: 1.5; }
      footer { display: flex; justify-content: flex-end; gap: var(--hb-space-2); padding: 0 var(--hb-space-5) var(--hb-space-5); flex-wrap: wrap; }
      .close {
        all: unset; cursor: pointer; width: 32px; height: 32px; display: grid; place-items: center;
        border-radius: var(--hb-radius-sm); color: var(--hb-color-text-muted);
      }
      .close:hover { background: var(--hb-color-bg-subtle); color: var(--hb-color-text); }
    `,
  ];

  @property() label = "";
  @property({ type: Boolean, reflect: true }) open = false;
  /** Close when the backdrop is clicked. Off by default for dialogs that hold unsaved input. */
  @property({ type: Boolean, attribute: "close-on-backdrop" }) closeOnBackdrop = false;

  @query("dialog") private dialog!: HTMLDialogElement;
  private readonly headingId = uid("hb-dialog-title");
  private reason = "api";
  private opener: Element | null = null;

  show() { this.open = true; }
  close(reason = "api") { this.reason = reason; this.open = false; }

  protected updated(changed: Map<string, unknown>) {
    if (!changed.has("open") || !this.dialog) return;
    if (this.open && !this.dialog.open) {
      this.opener = document.activeElement;
      this.dialog.showModal?.();
    } else if (!this.open && this.dialog.open) {
      this.dialog.close();
    }
  }

  private onNativeClose() {
    this.open = false;
    (this.opener as HTMLElement | null)?.focus?.();
    this.dispatchEvent(new CustomEvent("hb-close", { detail: { reason: this.reason }, bubbles: true, composed: true }));
    this.reason = "api";
  }

  private onCancel() { this.reason = "escape"; }

  private onClick(e: MouseEvent) {
    // A click whose target is the <dialog> itself landed on the backdrop, outside the content box.
    if (this.closeOnBackdrop && e.target === this.dialog) this.close("backdrop");
  }

  render() {
    return html`
      <dialog aria-labelledby=${this.headingId} @close=${this.onNativeClose} @cancel=${this.onCancel} @click=${this.onClick}>
        <header>
          <h2 id=${this.headingId}>${this.label}</h2>
          <button class="close focus-ring" aria-label="Close" @click=${() => this.close("close-button")}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"></path></svg>
          </button>
        </header>
        <div class="body"><slot></slot></div>
        <footer><slot name="footer"></slot></footer>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "hb-dialog": HbDialog; }
}
