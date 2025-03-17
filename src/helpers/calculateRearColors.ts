type Color = string;

export function calculateRearColors(total: number, colors: Color[]): Color[] {
  const result: Color[] = [];
  const colorsCount = colors.length;

  for (let i = 0; i < total; i++) {
    const colorIndex = i % colorsCount;
    result.push(colors[colorIndex]);
  }

  return result;
}
