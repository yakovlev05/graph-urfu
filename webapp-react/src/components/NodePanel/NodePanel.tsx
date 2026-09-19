import { useState } from 'react'
import type { Discipline, GraphModel, StudentNode } from '../../types/graph'
import '../Panel.css'
import { Tabs } from '../Tabs/Tabs'
import { DisciplinesBySemester } from '../DisciplinesBySemester/DisciplinesBySemester'
import { NeighborList } from './NeighborList'
import './NodePanel.css'

interface Props {
  model: GraphModel
  node: StudentNode
  onSelect: (id: number) => void
  onClose: () => void
}

type TabId = 'neighbors' | 'disciplines'

function semesterRange(disciplines: Discipline[]): string {
  const semesters = disciplines.map((discipline) => discipline.semester)
  if (semesters.length === 0) return 'нет дисциплин'
  const [min, max] = [Math.min(...semesters), Math.max(...semesters)]
  return min === max ? `${min} семестр` : `${min}–${max} семестры`
}

export function NodePanel({ model, node, onSelect, onClose }: Props) {
  const [tab, setTab] = useState<TabId>('neighbors')

  return (
    <aside className="panel node-panel">
      <div className="node-panel__head">
        <span className="node-panel__dot" style={{ background: node.color, boxShadow: `0 0 18px ${node.color}` }} />
        <div className="node-panel__title">
          <h2>{node.name}</h2>
          <span className="node-panel__caption">{semesterRange(node.realizations)}</span>
        </div>
        <button className="node-panel__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>

      <Tabs
        tabs={[
          { id: 'neighbors', label: 'Одногруппники', count: node.degree },
          { id: 'disciplines', label: 'Дисциплины', count: node.realizations.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="node-panel__body">
        {tab === 'neighbors' ? (
          <NeighborList model={model} node={node} onSelect={onSelect} />
        ) : (
          <DisciplinesBySemester disciplines={node.realizations} />
        )}
      </div>
    </aside>
  )
}
