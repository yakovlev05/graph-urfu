import './Tabs.css'

export interface Tab<T extends string> {
  id: T
  label: string
  count: number
}

interface Props<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
}

export function Tabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={tab.id === active}
          className={`tabs__tab ${tab.id === active ? 'tabs__tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          <span className="tabs__count">{tab.count}</span>
        </button>
      ))}
    </div>
  )
}
