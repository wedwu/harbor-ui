import type { Preview } from "@storybook/web-components";
import "../src/tokens/tokens.css";
import "../src/index";
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (story, context) => {
      document.documentElement.dataset.theme = context.globals.theme ?? "light";
      return story();
    },
  ],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: { test: "error" },
    options: { storySort: { order: ["Introduction", "Foundations", "Components", "Patterns"] } },
  },
  tags: ["autodocs"],
};
export default preview;
