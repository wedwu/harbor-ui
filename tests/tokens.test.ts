import { describe, expect, it } from "vitest";
import { primitives, semanticLight, semanticDark } from "../src/tokens/tokens";

type Theme = Record<string, string>;
const resolve = (theme: Theme, token: string): string => {
  const raw = theme[token];
  const m = /^\{(.+)\}$/.exec(raw);
  if (!m) return raw;
  const key = m[1].replaceAll(".", "-") as keyof typeof primitives;
  return primitives[key];
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum ratio]: 4.5 for text, 3 for icons, borders and focus rings (WCAG 1.4.3 / 1.4.11).
const pairs: [string, string, number][] = [
  ["color-text", "color-bg", 4.5],
  ["color-text", "color-surface", 4.5],
  ["color-text-muted", "color-bg", 4.5],
  ["color-text-muted", "color-surface", 4.5],
  ["color-text-on-action", "color-action", 4.5],
  ["color-text-on-action", "color-action-hover", 4.5],
  ["color-action", "color-bg", 4.5],
  ["color-action", "color-surface", 4.5],
  ["color-action", "color-action-subtle", 4.5],
  ["color-bg", "color-danger-fg", 4.5],
  ["color-danger-fg", "color-surface", 4.5],
  ["color-text", "color-info-bg", 4.5],
  ["color-text", "color-success-bg", 4.5],
  ["color-text", "color-warning-bg", 4.5],
  ["color-text", "color-danger-bg", 4.5],
  ["color-info-fg", "color-info-bg", 3],
  ["color-success-fg", "color-success-bg", 3],
  ["color-warning-fg", "color-warning-bg", 3],
  ["color-danger-fg", "color-danger-bg", 3],
  ["color-border-strong", "color-surface", 3],
  ["color-focus", "color-bg", 3],
];

describe.each([
  ["light", semanticLight as Theme],
  ["dark", semanticDark as Theme],
])("%s theme", (_name, theme) => {
  it("defines the same tokens as the light theme", () => {
    expect(Object.keys(theme).sort()).toEqual(Object.keys(semanticLight).sort());
  });

  it("only references primitives that exist", () => {
    for (const [token, value] of Object.entries(theme)) {
      if (value.startsWith("{")) expect(resolve(theme, token), token).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it.each(pairs)("%s on %s meets %s:1", (fg, bg, min) => {
    const ratio = contrast(resolve(theme, fg), resolve(theme, bg));
    expect(ratio, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
  });
});
