import { useMemo, type RefObject } from 'react'
import type { GraphApi, StudentNode } from '../types/graph'

const FOCUS_ZOOM = 4
const DURATION = 700

export function useGraphCamera(graphRef: RefObject<GraphApi | undefined>) {
  return useMemo(
    () => ({
      focus(node: StudentNode) {
        const graph = graphRef.current
        if (!graph || node.x === undefined || node.y === undefined) return
        graph.centerAt(node.x, node.y, DURATION)
        graph.zoom(Math.max(graph.zoom(), FOCUS_ZOOM), DURATION)
      },
      zoomBy(factor: number) {
        const graph = graphRef.current
        graph?.zoom(graph.zoom() * factor, 300)
      },
      fit() {
        graphRef.current?.zoomToFit(DURATION, 60)
      },
    }),
    [graphRef],
  )
}

export type GraphCamera = ReturnType<typeof useGraphCamera>
