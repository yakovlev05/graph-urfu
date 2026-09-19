import type { Discipline, StudentLink, StudentNode } from '../types/graph'

// После запуска симуляции force-graph заменяет id в source/target на объекты узлов.
export function endpointId(end: StudentLink['source']): number {
  return typeof end === 'object' ? (end as StudentNode).id : Number(end)
}

export const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)

export function groupBySemester(disciplines: Discipline[]): [number, string[]][] {
  const bySemester = new Map<number, string[]>()
  for (const { semester, realization } of disciplines) {
    bySemester.set(semester, [...(bySemester.get(semester) ?? []), realization])
  }
  return [...bySemester.entries()]
    .sort(([a], [b]) => a - b)
    .map(([semester, realizations]) => [semester, realizations.sort((a, b) => a.localeCompare(b, 'ru'))])
}
