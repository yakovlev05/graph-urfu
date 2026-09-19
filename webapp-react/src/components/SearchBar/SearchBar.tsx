import { useState, type KeyboardEvent } from 'react'
import { useStudentSearch } from '../../hooks/useStudentSearch'
import type { GraphModel } from '../../types/graph'
import '../Panel.css'
import { SearchResults } from './SearchResults'
import './SearchBar.css'

interface Props {
  model: GraphModel
  onFound: (id: number) => void
}

export function SearchBar({ model, onFound }: Props) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [open, setOpen] = useState(false)
  const results = useStudentSearch(model, query)

  const choose = (id: number) => {
    onFound(id)
    setQuery('')
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setCursor((current) => (current + step + results.length) % Math.max(results.length, 1))
    } else if (event.key === 'Enter' && results[cursor]) {
      choose(results[cursor].id)
    } else if (event.key === 'Escape') {
      event.currentTarget.blur()
    }
  }

  const showResults = open && query.trim() !== ''

  return (
    <div className="search-wrap">
      <div className={`panel search ${showResults && results.length === 0 ? 'search--error' : ''}`}>
        <svg className="search__icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          placeholder="Найти студента по ФИО"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setCursor(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showResults && <SearchResults results={results} cursor={cursor} onChoose={choose} onHover={setCursor} />}
    </div>
  )
}
