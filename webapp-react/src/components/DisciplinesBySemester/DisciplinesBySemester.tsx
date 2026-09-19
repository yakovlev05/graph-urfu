import { groupBySemester } from '../../lib/links'
import type { Discipline } from '../../types/graph'
import './DisciplinesBySemester.css'

interface Props {
  disciplines: Discipline[]
  limit?: number
}

export function DisciplinesBySemester({ disciplines, limit = Infinity }: Props) {
  const visible = disciplines.slice(0, limit)
  const hidden = disciplines.length - visible.length

  return (
    <div className="disciplines">
      {groupBySemester(visible).map(([semester, realizations]) => (
        <section key={semester}>
          <h4>{semester} семестр</h4>
          <ul>
            {realizations.map((realization) => (
              <li key={realization}>{realization}</li>
            ))}
          </ul>
        </section>
      ))}
      {hidden > 0 && <p className="disciplines__more">и ещё {hidden}</p>}
    </div>
  )
}
