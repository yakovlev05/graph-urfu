import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { gravityForce } from '../../lib/gravityForce'
import type { GraphApi, GraphModel, Highlight, Relation, Student, StudentLink, StudentNode } from '../../types/graph'
import { nodeRadius, paintNode, type NodeState } from './paint'

interface Props {
  graphRef: RefObject<GraphApi | undefined>
  model: GraphModel
  width: number
  height: number
  activeId: number | null
  highlight: Highlight
  hoveredLink: StudentLink | null
  hideIsolated: boolean
  onHover: (id: number | null) => void
  onLinkHover: (link: StudentLink | null) => void
  onSelect: (id: number | null) => void
}

const WARMUP_TICKS = 150
const EMPTY_GRAPH = { nodes: [], links: [] }

const linkRgba = (alpha: number) => `rgba(148, 163, 255, ${alpha})`
const linkDistance = (link: StudentLink) => 20 / Math.sqrt(link.weight)

export function StudentGraph({
  graphRef,
  model,
  width,
  height,
  activeId,
  highlight,
  hoveredLink,
  hideIsolated,
  onHover,
  onLinkHover,
  onSelect,
}: Props) {
  const [forcesReady, setForcesReady] = useState(false)
  const fittedRef = useRef(false)
  const settledRef = useRef(false)

  // Силы настраиваются через ref уже после монтирования, а warmup выполняется при получении данных.
  // Поэтому данные отдаём только после настройки сил, иначе предрасчёт пойдёт с силами по умолчанию.
  useEffect(() => {
    const graph = graphRef.current
    if (!graph) return
    graph.d3Force('charge')?.strength(-70).distanceMax(260)
    graph.d3Force('link')?.distance(linkDistance)
    graph.d3Force('gravity', gravityForce(0.02))
    setForcesReady(true)
  }, [graphRef])

  const graphData = useMemo(() => {
    if (!forcesReady) return EMPTY_GRAPH
    return {
      nodes: hideIsolated ? model.nodes.filter((node) => node.degree > 0) : model.nodes,
      links: model.links,
    }
  }, [model, hideIsolated, forcesReady])

  const isEmphasized = useCallback((link: StudentLink) => link === hoveredLink || highlight.links.has(link), [hoveredLink, highlight])

  const nodeState = useCallback(
    (node: StudentNode): NodeState => {
      if (activeId === null) return 'normal'
      if (node.id === activeId) return 'active'
      return highlight.nodes.has(node.id) ? 'neighbor' : 'dimmed'
    },
    [activeId, highlight],
  )

  const linkColor = useCallback(
    (link: StudentLink) => {
      if (isEmphasized(link)) return `rgba(255, 255, 255, ${0.45 + link.strength * 0.5})`
      if (activeId !== null) return linkRgba(0.03)
      return linkRgba(0.07 + link.strength * 0.35)
    },
    [activeId, isEmphasized],
  )

  const linkWidth = useCallback(
    (link: StudentLink) => (0.4 + link.strength * 1.6) * (isEmphasized(link) ? 2 : 1),
    [isEmphasized],
  )

  // Раскладка предрассчитана (warmup), поэтому масштаб можно подогнать уже на первом кадре.
  const handleEngineTick = useCallback(() => {
    if (fittedRef.current || !forcesReady) return
    fittedRef.current = true
    graphRef.current?.zoomToFit(0, 80)
  }, [graphRef, forcesReady])

  const handleEngineStop = useCallback(() => {
    if (settledRef.current) return
    settledRef.current = true
    graphRef.current?.zoomToFit(800, 80)
  }, [graphRef])

  return (
    <ForceGraph2D<Student, Relation>
      ref={graphRef}
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="rgba(0, 0, 0, 0)"
      nodeRelSize={1}
      nodeVal={(node) => nodeRadius(node) ** 2}
      nodeLabel={() => ''}
      nodeCanvasObject={(node, ctx, scale) => paintNode(ctx, node, nodeState(node), scale)}
      linkLabel={() => ''}
      linkColor={linkColor}
      linkWidth={linkWidth}
      linkHoverPrecision={6}
      linkDirectionalParticles={(link) => (highlight.links.has(link) ? 2 : 0)}
      linkDirectionalParticleWidth={2.5}
      linkDirectionalParticleSpeed={0.006}
      linkDirectionalParticleColor={() => '#ffffff'}
      warmupTicks={WARMUP_TICKS}
      cooldownTicks={200}
      onEngineTick={handleEngineTick}
      onEngineStop={handleEngineStop}
      onNodeHover={(node) => onHover(node?.id ?? null)}
      onLinkHover={onLinkHover}
      onNodeClick={(node) => onSelect(node.id)}
      onBackgroundClick={() => onSelect(null)}
    />
  )
}
