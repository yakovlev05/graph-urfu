import { GraphExplorer } from './components/GraphExplorer/GraphExplorer'
import { Loader } from './components/Loader/Loader'
import { useGraphData } from './hooks/useGraphData'

export default function App() {
  const data = useGraphData()

  if (data.status === 'loading') return <Loader />
  if (data.status === 'error') return <Loader error={data.message} />
  return <GraphExplorer model={data.model} />
}
