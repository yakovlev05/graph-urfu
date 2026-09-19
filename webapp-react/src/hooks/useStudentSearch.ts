import { useMemo } from 'react'
import type { GraphModel, StudentNode } from '../types/graph'

const LIMIT = 8

export function useStudentSearch(model: GraphModel, query: string): StudentNode[] {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []

    return model.nodes.filter((node) => node.name.toLowerCase().includes(normalized)).slice(0, LIMIT)
  }, [model, query])
}
