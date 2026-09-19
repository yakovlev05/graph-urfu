export const DEGREE_GRADIENT = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb923c']

const rgbStops = DEGREE_GRADIENT.map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)))

export function gradientColor(t: number): string {
  const clamped = Math.min(Math.max(t, 0), 1) * (rgbStops.length - 1)
  const index = Math.min(Math.floor(clamped), rgbStops.length - 2)
  const local = clamped - index
  const [r, g, b] = rgbStops[index].map((from, i) => Math.round(from + (rgbStops[index + 1][i] - from) * local))
  return `rgb(${r}, ${g}, ${b})`
}
