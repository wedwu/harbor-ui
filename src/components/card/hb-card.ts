import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { base } from "../shared";

/**
 * A surface for grouping related content. Header and footer only render when something is slotted into them.
 *
 * @slot header - Title area
 * @slot - Body
 * @slot footer - Actions, aligned to the end
 */
@customElement("hb-card")
export class HbCard extends LitElement {
  static styles = [
    base,
    css`
      :host { display: block; }
      article {
        background: var(--hb-color-surface);
        border: 1px solid var(--hb-color-border);
        border-radius: var(--hb-radius-lg);
        overflow: hidden;
      }
      :host([elevated]) article { border-color: transparent; box-shadow: var(--hb-shadow-lg); }
      header, footer { padding: var(--hb-space-4) var(--hb-space-5); }
      header { border-bottom: 1px solid var(--hb-color-border); font-weight: var(--hb-font-weight-bold); font-size: var(--hb-font-size-lg); }
      .body { padding: var(--hb-space-5); line-height: 1.5; }
      footer {
        border-top: 1px solid var(--hb-color-border); background: var(--hb-color-bg-subtle);
        display: flex; justify-content: flex-end; gap: var(--hb-space-2); flex-wrap: wrap;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) elevated = false;
  @state() private hasHeader = false;
  @state() private hasFooter = false;

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const filled = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === "header") this.hasHeader = filled;
    if (slot.name === "footer") this.hasFooter = filled;
  }

  render() {
    return html`
      <article part="base">
        <header ?hidden=${!this.hasHeader}><slot name="header" @slotchange=${this.onSlotChange}></slot></header>
        <div class="body"><slot></slot></div>
        <footer ?hidden=${!this.hasFooter}><slot name="footer" @slotchange=${this.onSlotChange}></slot></footer>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "hb-card": HbCard; }
}
