import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

// Dark Storybook chrome (sidebar, toolbar, addon panel) using Harbor's own palette.
// The story canvas still follows the Theme toolbar toggle.
addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "Harbor UI",
    brandUrl: "https://github.com/wedwu/harbor-ui",
    brandTarget: "_self",

    colorPrimary: "#8eaee3",
    colorSecondary: "#2f63c7",

    appBg: "#0d1117",
    appContentBg: "#161b21",
    appPreviewBg: "#ffffff",
    appBorderColor: "#3b434c",
    appBorderRadius: 8,

    textColor: "#f6f8fa",
    textInverseColor: "#0d1117",
    textMutedColor: "#8b96a3",

    barBg: "#161b21",
    barTextColor: "#8b96a3",
    barSelectedColor: "#8eaee3",
    barHoverColor: "#d6e2f5",

    inputBg: "#22282f",
    inputBorder: "#3b434c",
    inputTextColor: "#f6f8fa",
    inputBorderRadius: 6,

    fontBase: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontCode: "'JetBrains Mono', ui-monospace, monospace",
  }),
});
