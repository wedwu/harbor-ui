import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { base, uid } from "../shared";

/**
 * A labelled text input that takes part in native form submission and validation.
 *
 * @fires hb-input - On every keystroke. `detail.value` is the current value.
 * @fires hb-change - When the value is committed (blur or Enter).
 * @csspart input - The inner native input
 */
@customElement("hb-text-field")
export class HbTextField extends LitElement {
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = [
    base,
    css`
      :host { display: block; }
      .field { display: grid; gap: var(--hb-space-1); }
      label { font-weight: var(--hb-font-weight-medium); font-size: var(--hb-font-size-sm); }
      .required { color: var(--hb-color-danger-fg); margin-left: 2px; }
      input {
        font: inherit; color: var(--hb-color-text);
        background: var(--hb-color-surface);
        border: 1px solid var(--hb-color-border-strong);
        border-radius: var(--hb-radius-md);
        padding: var(--hb-space-2) var(--hb-space-3);
        min-height: 36px;
        transition: border-color var(--hb-motion-fast);
      }
      input:hover { border-color: var(--hb-color-text-muted); }
      input:focus-visible { outline: 2px solid var(--hb-color-focus); outline-offset: 1px; border-color: var(--hb-color-focus); }
      input[aria-invalid="true"] { border-color: var(--hb-color-danger-fg); }
      input:disabled { opacity: 0.55; cursor: not-allowed; }
      .hint { color: var(--hb-color-text-muted); font-size: var(--hb-font-size-sm); }
      .error { color: var(--hb-color-danger-fg); font-size: var(--hb-font-size-sm); }
    `,
  ];

  @property() label = "";
  @property() name = "";
  @property() value = "";
  @property() type: "text" | "email" | "password" | "search" | "tel" | "url" = "text";
  @property() placeholder = "";
  @property() hint = "";
  @property() autocomplete = "";
  /** Custom error message. Setting it marks the field invalid; clear it to make the field valid again. */
  @property() error = "";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Set after the user leaves the field once, so errors are not shown before they have typed anything. */
  @state() private touched = false;
  @query("input") private input!: HTMLInputElement;

  private readonly ids = { input: uid("hb-input"), hint: uid("hb-hint"), error: uid("hb-error") };
  private internals?: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals?.();
  }

  /** Message shown to the user: an explicit `error` wins, then the browser's own validation message once touched. */
  get validationMessage(): string {
    if (this.error) return this.error;
    if (!this.touched || !this.input) return "";
    return this.input.validationMessage;
  }

  checkValidity() {
    this.touched = true;
    return this.internals?.checkValidity() ?? true;
  }

  formResetCallback() {
    this.value = "";
    this.touched = false;
  }

  protected updated() {
    this.internals?.setFormValue(this.value);
    if (!this.input) return;
    if (this.error) this.internals?.setValidity({ customError: true }, this.error, this.input);
    else if (!this.input.validity.valid) this.internals?.setValidity(this.input.validity, this.input.validationMessage, this.input);
    else this.internals?.setValidity({});
  }

  private onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent("hb-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private onChange() {
    this.touched = true;
    this.dispatchEvent(new CustomEvent("hb-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  render() {
    const message = this.validationMessage;
    const describedBy = [this.hint ? this.ids.hint : "", message ? this.ids.error : ""].filter(Boolean).join(" ");
    return html`
      <div class="field">
        <label for=${this.ids.input}>
          ${this.label}${this.required ? html`<span class="required" aria-hidden="true">*</span>` : nothing}
        </label>
        <input
          part="input"
          id=${this.ids.input}
          .value=${this.value}
          type=${this.type}
          name=${this.name || nothing}
          placeholder=${this.placeholder || nothing}
          autocomplete=${(this.autocomplete || nothing) as never}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${message ? "true" : "false"}
          aria-describedby=${describedBy || nothing}
          @input=${this.onInput}
          @change=${this.onChange}
          @blur=${() => (this.touched = true)}
        />
        ${this.hint ? html`<span class="hint" id=${this.ids.hint}>${this.hint}</span>` : nothing}
        <span class="error" id=${this.ids.error} role="alert" ?hidden=${!message}>${message}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "hb-text-field": HbTextField; }
}
