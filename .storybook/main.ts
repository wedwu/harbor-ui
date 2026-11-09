import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/docs/*.mdx", "../src/components/**/*.stories.ts"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: { name: "@storybook/web-components-vite", options: {} },
  docs: { defaultName: "Docs" },
  core: { disableTelemetry: true },
};
export default config;
