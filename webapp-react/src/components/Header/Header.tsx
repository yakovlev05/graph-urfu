import type { GraphModel } from '../../types/graph'
import '../Panel.css'
import './Header.css'

interface Props {
  model: GraphModel
}

export function Header({ model }: Props) {
  const isolated = model.nodes.filter((node) => node.degree === 0).length
  const avgDegree = (2 * model.links.length) / model.nodes.length

  const stats = [
    { label: 'студентов', value: model.nodes.length },
    { label: 'связей', value: model.links.length },
    { label: 'в среднем', value: avgDegree.toFixed(1) },
    { label: 'без связей', value: isolated },
  ]

  return (
    <header className="panel header">
      <div className="header__title">
        <span className="header__logo" aria-hidden />
        <div>
          <h1>Граф студентов</h1>
          <p>Связь — студенты учились в одной группе</p>
        </div>
      </div>
      <dl className="header__stats">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
