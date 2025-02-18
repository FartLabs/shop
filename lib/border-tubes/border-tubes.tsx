export function makeBorderTubeHref(tubeBorderColor: BorderTubeColor) {
  return `https://fartlabs.org/tube-${tubeBorderColor}.css`;
}

export type BorderTubeColor = (typeof borderTubeColors)[number];

/**
 * @see https://etok.codes/border-tube-code-generator
 */
export const borderTubeColors = [
  "green",
  "purple",
  "yellow",
  "turquoise",
  "magenta",
  "orange",
  "blue",
] as const;

export function borderTubeColorAt(i: number): BorderTubeColor {
  return borderTubeColors[i % borderTubeColors.length];
}
