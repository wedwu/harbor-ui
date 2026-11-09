// Browser checks against the built Storybook (npm run build-storybook first).
// 1. Runs axe on every story in light and dark themes.
// 2. Exercises the behaviour that unit tests cannot: native form validation, dialog focus handling, alert dismiss.
// Usage: node tests/a11y-and-behavior.mjs [baseUrl]
import { chromium } from "playwright";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = process.argv[2] ?? "http://localhost:6007";
let failures = 0;
const fail = (msg) => { failures++; console.error("FAIL", msg); };
const pass = (msg) => console.log("ok  ", msg);

const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(10000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const story = async (id, theme = "light") => {
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForSelector("#storybook-root > *", { state: "attached" });
  await page.waitForTimeout(150);
};

// 1. axe on every story
const index = await (await fetch(`${base}/index.json`)).json();
const stories = Object.values(index.entries).filter((e) => e.type === "story");
for (const s of stories) {
  for (const theme of ["light", "dark"]) {
    await story(s.id, theme);
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () =>
      (await window.axe.run(document, { resultTypes: ["violations"], runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] })).violations
        .filter((v) => v.id !== "region" && v.id !== "landmark-one-main" && v.id !== "page-has-heading-one")
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
    );
    if (result.length) fail(`axe ${s.id} [${theme}]\n      ${result.join("\n      ")}`);
  }
}
if (!failures) pass(`axe: ${stories.length} stories x 2 themes, no violations`);

// 2a. Form: invalid submit shows errors and blocks; valid submit sends FormData; reset clears.
await story("patterns-sign-up-form--sign-up");
const field = (name) => page.locator(`hb-text-field[name=${name}] input`);
await page.locator("hb-button[type=submit]").click();
const errorsShown = await page.locator("hb-text-field").evaluateAll((els) => els.map((el) => el.shadowRoot.querySelector(".error").textContent.trim()));
errorsShown.every(Boolean) ? pass("form: empty submit shows an error on each required field") : fail(`form: errors ${JSON.stringify(errorsShown)}`);
(await page.locator("output").textContent()) === "" ? pass("form: invalid submit does not send") : fail("form: invalid submit sent data");
const invalid = await field("email").getAttribute("aria-invalid");
invalid === "true" ? pass("form: aria-invalid set on the input") : fail("form: aria-invalid missing");
await field("name").fill("Ada Lovelace");
await field("email").fill("ada@example.com");
await page.locator("hb-button[type=submit]").click();
const out = await page.locator("output").textContent();
out.includes('"email": "ada@example.com"') && out.includes('"name": "Ada Lovelace"') ? pass("form: valid submit includes both fields in FormData") : fail(`form: output ${out}`);
await page.locator("hb-button[type=reset]").click();
(await field("email").inputValue()) === "" ? pass("form: reset clears the fields") : fail("form: reset did not clear");

// 2b. Dialog: opens modal, focus moves inside, Escape closes, focus returns to the opener.
await story("components-dialog--confirm");
const opener = page.locator("hb-button").first();
await opener.focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(100);
const isOpen = await page.evaluate(() => document.querySelector("hb-dialog").shadowRoot.querySelector("dialog").open);
isOpen ? pass("dialog: Enter on the trigger opens it") : fail("dialog: did not open");
const focusInside = await page.evaluate(() => document.activeElement?.closest?.("hb-dialog") !== null || document.querySelector("hb-dialog").shadowRoot.activeElement !== null);
focusInside ? pass("dialog: focus moves into the dialog") : fail("dialog: focus stayed outside");
await page.evaluate(() => {
  window.__closeReason = "none";
  document.querySelector("hb-dialog").addEventListener("hb-close", (e) => (window.__closeReason = e.detail.reason), { once: true });
});
await page.keyboard.press("Escape");
await page.waitForTimeout(100);
const reason = page.evaluate(() => window.__closeReason);
(await reason) === "escape" ? pass("dialog: Escape closes with reason 'escape'") : fail("dialog: wrong close reason");
const backOnOpener = await page.evaluate(() => document.activeElement === document.querySelector("hb-button"));
backOnOpener ? pass("dialog: focus returns to the trigger") : fail("dialog: focus not returned");

// 2c. Alert: dismiss hides it and fires hb-dismiss; preventDefault keeps it.
await story("components-alert--all-variants");
const danger = page.locator("hb-alert[variant=danger]");
await danger.evaluate((el) => el.addEventListener("hb-dismiss", (e) => e.preventDefault(), { once: true }));
await danger.locator("button").click();
(await danger.isVisible()) ? pass("alert: cancelled hb-dismiss keeps it open") : fail("alert: closed despite preventDefault");
await danger.locator("button").click();
(await danger.isHidden()) ? pass("alert: dismiss hides it") : fail("alert: still visible");

// 2d. Disabled and loading buttons stay focusable and swallow clicks.
await story("components-button--states");
const clicks = await page.evaluate(() => {
  let n = 0;
  document.querySelectorAll("hb-button").forEach((b) => b.addEventListener("click", () => n++));
  document.querySelectorAll("hb-button").forEach((b) => b.shadowRoot.querySelector("button").click());
  return n;
});
clicks === 0 ? pass("button: disabled and loading buttons do not fire click") : fail(`button: ${clicks} clicks fired`);

if (errors.length) fail(`page errors: ${errors.join("; ")}`);
await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nAll browser checks passed");
process.exit(failures ? 1 : 0);
