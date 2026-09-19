import type { StudentNode } from '../types/graph'

// Мягко притягивает узлы к центру, чтобы изолированные студенты не разлетались.
export function gravityForce(strength: number) {
  let nodes: StudentNode[] = []

  const force = (alpha: number) => {
    for (const node of nodes) {
      node.vx = (node.vx ?? 0) - (node.x ?? 0) * strength * alpha
      node.vy = (node.vy ?? 0) - (node.y ?? 0) * strength * alpha
    }
  }
  force.initialize = (initial: StudentNode[]) => {
    nodes = initial
  }

  return force
}
