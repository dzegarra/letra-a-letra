type Color = string;

export function calculateRearColors(total: number, colors: Color[]): Color[] {
  const result: Color[] = [];
  const colorCount = colors.length;
  const baseCount = Math.floor(total / colorCount);
  const remainder = total % colorCount;

  for (let i = 0; i < colorCount; i++) {
    for (let j = 0; j < baseCount; j++) {
      result.push(colors[i]);
    }
  }

  for (let i = 0; i < remainder; i++) {
    result.push(colors[i]);
  }

  return result;
}
