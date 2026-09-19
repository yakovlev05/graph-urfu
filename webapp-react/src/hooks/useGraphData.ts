import { useEffect, useState } from 'react'
import { buildGraphModel } from '../data/graphModel'
import type { GraphModel, RawGraph } from '../types/graph'

// В проде файл отдаёт nginx, при разработке Vite проксирует запрос на локальный сервер (см. README).
const GRAPH_DATA_URL = '/data/graph_data.json'

type GraphDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; model: GraphModel }

export function useGraphData(): GraphDataState {
  const [state, setState] = useState<GraphDataState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(GRAPH_DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<RawGraph>
      })
      .then((raw) => setState({ status: 'ready', model: buildGraphModel(raw) }))
      .catch((error: Error) => {
        if (!controller.signal.aborted) setState({ status: 'error', message: error.message })
      })

    return () => controller.abort()
  }, [])

  return state
}
