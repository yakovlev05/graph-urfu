import type { StudentNode } from '../../types/graph'

export type NodeState = 'normal' | 'active' | 'neighbor' | 'dimmed'

export const nodeRadius = (node: StudentNode) => 2.5 + Math.sqrt(node.degree) * 1.1

const LABEL_ZOOM = 2.5

export function paintNode(ctx: CanvasRenderingContext2D, node: StudentNode, state: NodeState, scale: number) {
  const x = node.x ?? 0
  const y = node.y ?? 0
  const radius = nodeRadius(node)

  ctx.save()
  ctx.globalAlpha = state === 'dimmed' ? 0.12 : 1

  if (state === 'active' || state === 'neighbor') {
    ctx.shadowColor = node.color
    ctx.shadowBlur = state === 'active' ? 30 : 12
  }

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fillStyle = node.color
  ctx.fill()
  ctx.shadowBlur = 0

  if (state === 'active') {
    ctx.beginPath()
    ctx.arc(x, y, radius + 3 / scale, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.lineWidth = 1.5 / scale
    ctx.stroke()
  }

  if (state === 'active' || state === 'neighbor' || (state === 'normal' && scale >= LABEL_ZOOM)) {
    paintLabel(ctx, node.label, x, y + radius + 3 / scale, scale, state === 'active')
  }

  ctx.restore()
}

// Текст рисуем в экранных пикселях: шрифт в доли пикселя при сильном зуме рендерится с плохим кернингом.
function paintLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, scale: number, bold: boolean) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1 / scale, 1 / scale)
  ctx.font = `${bold ? 600 : 500} ${bold ? 13 : 11}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.strokeStyle = 'rgba(7, 8, 18, 0.85)'
  ctx.strokeText(text, 0, 0)
  ctx.fillStyle = bold ? '#ffffff' : 'rgba(226, 232, 255, 0.85)'
  ctx.fillText(text, 0, 0)
  ctx.restore()
}
