import type { StudentNode } from '../../types/graph'

interface Props {
  results: StudentNode[]
  cursor: number
  onChoose: (id: number) => void
  onHover: (index: number) => void
}

export function SearchResults({ results, cursor, onChoose, onHover }: Props) {
  if (results.length === 0) {
    return <div className="panel search-results search-results--empty">Никого не нашлось</div>
  }

  return (
    <ul className="panel search-results">
      {results.map((node, index) => (
        <li key={node.id}>
          <button
            className={index === cursor ? 'search-results__item--active' : ''}
            // mousedown срабатывает раньше blur у поля ввода, который закрыл бы список
            onMouseDown={(event) => {
              event.preventDefault()
              onChoose(node.id)
            }}
            onMouseEnter={() => onHover(index)}
          >
            <span className="search-results__dot" style={{ background: node.color }} />
            <span className="search-results__name">{node.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
