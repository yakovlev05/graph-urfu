import { useMemo } from 'react'
import type { GraphModel, Highlight } from '../types/graph'

export function useHighlight(model: GraphModel, activeId: number | null): Highlight {
  return useMemo(() => {
    if (activeId === null) return { nodes: new Set(), links: new Set() }
    return {
      nodes: new Set([activeId, ...(model.neighbors.get(activeId) ?? [])]),
      links: new Set(model.linksByNode.get(activeId) ?? []),
    }
  }, [model, activeId])
}
