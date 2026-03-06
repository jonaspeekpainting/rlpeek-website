import { createTheme, MantineColorsTuple } from "@mantine/core";

/**
 * Brand palette: muted warm stone / dusty clay. Professional and understated,
 * still ties to the logo’s warm mountain tones without being vibrant.
 */
const brandMuted: MantineColorsTuple = [
  "#fbf8f6", // 0 – lightest (backgrounds, hover)
  "#f5eee8",
  "#e8dcd2",
  "#d4c0b0",
  "#b89f8a",
  "#9a7d66",
  "#7d634f", // 6 – main brand (buttons, links, CTAs)
  "#66503f",
  "#524032",
  "#433528", // 9 – darkest
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: brandMuted,
  },
  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  headings: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    fontWeight: "700",
  },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
    },
    Card: {
      defaultProps: {
        shadow: "sm",
        padding: "lg",
        radius: "md",
      },
    },
  },
});
