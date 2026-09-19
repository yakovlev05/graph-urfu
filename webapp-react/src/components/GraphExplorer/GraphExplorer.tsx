import { useCallback, useRef, useState } from 'react'
import { useGraphCamera } from '../../hooks/useGraphCamera'
import { useHighlight } from '../../hooks/useHighlight'
import { useKey } from '../../hooks/useKey'
import { useWindowSize } from '../../hooks/useWindowSize'
import type { GraphApi, GraphModel, StudentLink } from '../../types/graph'
import { Controls } from '../Controls/Controls'
import { Header } from '../Header/Header'
import { Legend } from '../Legend/Legend'
import { LinkTooltip } from '../LinkTooltip/LinkTooltip'
import { NodePanel } from '../NodePanel/NodePanel'
import { SearchBar } from '../SearchBar/SearchBar'
import { StudentGraph } from '../StudentGraph/StudentGraph'
import './GraphExplorer.css'

interface Props {
  model: GraphModel
}

export function GraphExplorer({ model }: Props) {
  const graphRef = useRef<GraphApi | undefined>(undefined)
  const camera = useGraphCamera(graphRef)
  const { width, height } = useWindowSize()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [hoveredLink, setHoveredLink] = useState<StudentLink | null>(null)
  const [hideIsolated, setHideIsolated] = useState(false)

  const activeId = hoveredId ?? selectedId
  const highlight = useHighlight(model, activeId)
  const selectedNode = selectedId === null ? undefined : model.nodeById.get(selectedId)

  const selectNode = useCallback(
    (id: number | null) => {
      setSelectedId(id)
      const node = id === null ? undefined : model.nodeById.get(id)
      if (node) camera.focus(node)
    },
    [camera, model],
  )

  const clearSelection = useCallback(() => setSelectedId(null), [])
  useKey('Escape', clearSelection)

  const isPointer = hoveredId !== null || hoveredLink !== null

  return (
    <main className={`app ${isPointer ? 'app--pointer' : ''}`}>
      <StudentGraph
        graphRef={graphRef}
        model={model}
        width={width}
        height={height}
        activeId={activeId}
        highlight={highlight}
        hoveredLink={hoveredLink}
        hideIsolated={hideIsolated}
        onHover={setHoveredId}
        onLinkHover={setHoveredLink}
        onSelect={selectNode}
      />

      <div className="overlay overlay--top-left">
        <Header model={model} />
      </div>

      <div className="overlay overlay--top-right">
        <SearchBar model={model} onFound={selectNode} />
        {selectedNode && (
          <NodePanel key={selectedNode.id} model={model} node={selectedNode} onSelect={selectNode} onClose={clearSelection} />
        )}
      </div>

      <div className="overlay overlay--bottom-left">
        <Legend maxDegree={model.maxDegree} />
      </div>

      <div className="overlay overlay--bottom-center">
        <Controls camera={camera} hideIsolated={hideIsolated} onToggleIsolated={() => setHideIsolated((value) => !value)} />
      </div>

      <LinkTooltip model={model} link={hoveredId === null ? hoveredLink : null} />
    </main>
  )
}
