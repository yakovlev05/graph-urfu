import { useEffect, useState } from 'react'

const readSize = () => ({ width: window.innerWidth, height: window.innerHeight })

export function useWindowSize() {
  const [size, setSize] = useState(readSize)

  useEffect(() => {
    const onResize = () => setSize(readSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}
