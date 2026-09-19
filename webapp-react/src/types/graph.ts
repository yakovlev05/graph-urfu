import type { ForceGraphMethods, LinkObject, NodeObject } from 'react-force-graph-2d'

export interface Discipline {
  semester: number
  realization: string
}

export interface RawNode {
  id: number
  name: string
  realizations: Discipline[]
}

export interface RawLink {
  source: number
  target: number
  weight: number
  commonGroupsCount: number
  commonGroups: Discipline[]
}

export interface RawGraph {
  nodes: RawNode[]
  links: RawLink[]
}

export interface Student extends RawNode {
  label: string
  degree: number
  color: string
}

export interface Relation extends Omit<RawLink, 'source' | 'target'> {
  /** Вес, нормированный к диапазону 0..1 */
  strength: number
}

export type StudentNode = NodeObject<Student>
export type StudentLink = LinkObject<Student, Relation>
export type GraphApi = ForceGraphMethods<StudentNode, StudentLink>

export interface GraphModel {
  nodes: StudentNode[]
  links: StudentLink[]
  nodeById: Map<number, StudentNode>
  neighbors: Map<number, Set<number>>
  linksByNode: Map<number, StudentLink[]>
  linkBetween: (a: number, b: number) => StudentLink | undefined
  maxDegree: number
}

export interface Highlight {
  nodes: Set<number>
  links: Set<StudentLink>
}
