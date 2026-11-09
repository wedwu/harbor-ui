import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Harbor UI",
    brandUrl: "https://github.com/wedwu/harbor-ui",
    colorPrimary: "#2552a8",
    colorSecondary: "#2552a8",
  }),
});
