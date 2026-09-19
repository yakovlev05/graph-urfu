import { gradientColor } from '../lib/colors'
import { pairKey } from '../lib/links'
import { shortName } from '../lib/names'
import type { GraphModel, RawGraph, StudentLink, StudentNode } from '../types/graph'

function addToMap<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const list = map.get(key)
  if (list) list.push(value)
  else map.set(key, [value])
}

export function buildGraphModel(raw: RawGraph): GraphModel {
  const maxWeight = Math.max(...raw.links.map((link) => link.weight))
  const minWeight = Math.min(...raw.links.map((link) => link.weight))
  const weightRange = maxWeight - minWeight || 1

  const links: StudentLink[] = raw.links.map((link) => ({
    ...link,
    strength: Math.sqrt((link.weight - minWeight) / weightRange),
  }))

  const linksByNode = new Map<number, StudentLink[]>()
  const linkByPair = new Map<string, StudentLink>()
  const neighbors = new Map<number, Set<number>>(raw.nodes.map(({ id }) => [id, new Set()]))

  raw.links.forEach(({ source, target }, index) => {
    neighbors.get(source)?.add(target)
    neighbors.get(target)?.add(source)
    addToMap(linksByNode, source, links[index])
    addToMap(linksByNode, target, links[index])
    linkByPair.set(pairKey(source, target), links[index])
  })

  const maxDegree = Math.max(1, ...[...neighbors.values()].map((set) => set.size))

  const nodes: StudentNode[] = raw.nodes.map((node) => {
    const degree = neighbors.get(node.id)?.size ?? 0
    return { ...node, label: shortName(node.name), degree, color: gradientColor(Math.sqrt(degree / maxDegree)) }
  })

  return {
    nodes,
    links,
    nodeById: new Map(nodes.map((node) => [node.id, node])),
    neighbors,
    linksByNode,
    linkBetween: (a, b) => linkByPair.get(pairKey(a, b)),
    maxDegree,
  }
}
