import { useState } from 'react'
import type { GraphModel, StudentNode } from '../../types/graph'
import { DisciplinesBySemester } from '../DisciplinesBySemester/DisciplinesBySemester'

interface Props {
  model: GraphModel
  node: StudentNode
  onSelect: (id: number) => void
}

export function NeighborList({ model, node, onSelect }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const rows = [...(model.neighbors.get(node.id) ?? [])]
    .flatMap((id) => {
      const neighbor = model.nodeById.get(id)
      const link = model.linkBetween(node.id, id)
      return neighbor && link ? [{ neighbor, link }] : []
    })
    .sort((a, b) => b.link.commonGroupsCount - a.link.commonGroupsCount || b.link.weight - a.link.weight)

  if (rows.length === 0) {
    return <p className="node-panel__empty">Нет достаточно сильных связей с другими студентами</p>
  }

  return (
    <ul className="neighbor-list">
      {rows.map(({ neighbor, link }) => {
        const expanded = expandedId === neighbor.id
        return (
          <li key={neighbor.id} className={expanded ? 'neighbor-list__item--expanded' : ''}>
            <div className="neighbor-list__row">
              <button className="neighbor-list__toggle" onClick={() => setExpandedId(expanded ? null : neighbor.id)}>
                <span className="neighbor-list__dot" style={{ background: neighbor.color }} />
                <span className="neighbor-list__name">{neighbor.name}</span>
                <span className="neighbor-list__count" title="Общих групп">
                  {link.commonGroupsCount}
                </span>
              </button>
              <button className="neighbor-list__go" title="Перейти к студенту" aria-label="Перейти к студенту" onClick={() => onSelect(neighbor.id)}>
                →
              </button>
            </div>
            {expanded && (
              <div className="neighbor-list__details">
                <DisciplinesBySemester disciplines={link.commonGroups} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
