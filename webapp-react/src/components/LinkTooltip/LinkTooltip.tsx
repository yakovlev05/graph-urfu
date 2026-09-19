import { useMousePosition } from '../../hooks/useMousePosition'
import { endpointId } from '../../lib/links'
import type { GraphModel, StudentLink } from '../../types/graph'
import { DisciplinesBySemester } from '../DisciplinesBySemester/DisciplinesBySemester'
import '../Panel.css'
import './LinkTooltip.css'

interface Props {
  model: GraphModel
  link: StudentLink | null
}

const OFFSET = 18
const WIDTH = 320
const GROUPS_LIMIT = 8

export function LinkTooltip({ model, link }: Props) {
  const { x, y } = useMousePosition()
  if (!link) return null

  const [source, target] = [link.source, link.target].map((end) => model.nodeById.get(endpointId(end)))
  const flipX = x + OFFSET + WIDTH > window.innerWidth
  const flipY = y > window.innerHeight / 2

  return (
    <div
      className="panel link-tooltip"
      style={{
        width: WIDTH,
        left: flipX ? x - OFFSET - WIDTH : x + OFFSET,
        top: flipY ? undefined : y + OFFSET,
        bottom: flipY ? window.innerHeight - y + OFFSET : undefined,
      }}
    >
      <div className="link-tooltip__pair">
        <span>{source?.label}</span>
        <span className="link-tooltip__arrow">↔</span>
        <span>{target?.label}</span>
      </div>
      <div className="link-tooltip__stats">
        <span>
          <b>{link.commonGroupsCount}</b> общих групп
        </span>
        <span>
          вес <b>{link.weight.toFixed(2)}</b>
        </span>
      </div>
      <DisciplinesBySemester disciplines={link.commonGroups} limit={GROUPS_LIMIT} />
    </div>
  )
}
