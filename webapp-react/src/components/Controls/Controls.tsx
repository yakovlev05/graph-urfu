import type { ReactNode } from 'react'
import type { GraphCamera } from '../../hooks/useGraphCamera'
import '../Panel.css'
import './Controls.css'

interface Props {
  camera: GraphCamera
  hideIsolated: boolean
  onToggleIsolated: () => void
}

interface ControlButtonProps {
  title: string
  onClick: () => void
  active?: boolean
  children: ReactNode
}

function ControlButton({ title, onClick, active = false, children }: ControlButtonProps) {
  return (
    <button className={`controls__button ${active ? 'controls__button--active' : ''}`} title={title} aria-label={title} onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden>
        {children}
      </svg>
    </button>
  )
}

export function Controls({ camera, hideIsolated, onToggleIsolated }: Props) {
  return (
    <div className="panel controls">
      <ControlButton title="Приблизить" onClick={() => camera.zoomBy(1.5)}>
        <path d="M12 5v14M5 12h14" />
      </ControlButton>
      <ControlButton title="Отдалить" onClick={() => camera.zoomBy(1 / 1.5)}>
        <path d="M5 12h14" />
      </ControlButton>
      <ControlButton title="Показать весь граф" onClick={camera.fit}>
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      </ControlButton>
      <span className="controls__divider" />
      <ControlButton title={hideIsolated ? 'Показать студентов без связей' : 'Скрыть студентов без связей'} active={hideIsolated} onClick={onToggleIsolated}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M4 20 20 4" />
      </ControlButton>
    </div>
  )
}
