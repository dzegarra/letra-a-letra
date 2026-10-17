import fontColorContrastModule from "font-color-contrast";

type FontColorContrast = typeof fontColorContrastModule;

// The package is CommonJS with `exports.default`; depending on the bundler (Vite dev vs. build) the default import is
// either the function or the whole `exports` object, so unwrap it.
export const fontColorContrast: FontColorContrast =
  (fontColorContrastModule as unknown as { default?: FontColorContrast }).default ?? fontColorContrastModule;
