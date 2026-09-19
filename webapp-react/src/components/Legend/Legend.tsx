import { DEGREE_GRADIENT } from '../../lib/colors'
import '../Panel.css'
import './Legend.css'

interface Props {
  maxDegree: number
}

const HINTS = [
  ['Колесо', 'масштаб'],
  ['Перетаскивание', 'перемещение'],
  ['Клик', 'выбрать студента'],
  ['Линия', 'наведите — общие дисциплины'],
  ['Esc', 'снять выделение'],
]

export function Legend({ maxDegree }: Props) {
  return (
    <div className="panel legend">
      <div className="legend__scale">
        <span className="legend__caption">Количество связей</span>
        <div className="legend__bar" style={{ background: `linear-gradient(90deg, ${DEGREE_GRADIENT.join(', ')})` }} />
        <div className="legend__ticks">
          <span>0</span>
          <span>{maxDegree}</span>
        </div>
      </div>
      <div className="legend__links">
        <span className="legend__line legend__line--weak" />
        <span className="legend__line legend__line--strong" />
        толщина линии — сила связи
      </div>
      <ul className="legend__hints">
        {HINTS.map(([key, action]) => (
          <li key={key}>
            <kbd>{key}</kbd>
            {action}
          </li>
        ))}
      </ul>
    </div>
  )
}
