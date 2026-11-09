import { css } from "lit";

/** Styles every component shares: token-based font and a consistent focus ring. */
export const base = css`
  :host {
    font-family: var(--hb-font-family-sans);
    font-size: var(--hb-font-size-md);
    color: var(--hb-color-text);
    box-sizing: border-box;
  }
  *, *::before, *::after { box-sizing: inherit; }
  :host([hidden]), [hidden] { display: none !important; }
  .focus-ring:focus-visible {
    outline: 2px solid var(--hb-color-focus);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
`;

let counter = 0;
/** Stable unique ids for wiring labels and descriptions inside a shadow root. */
export const uid = (prefix: string) => `${prefix}-${++counter}`;
