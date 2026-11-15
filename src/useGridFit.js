import { useLayoutEffect, useState } from 'react'

export const GRID_GAP = 12

// Measures the stage element's content box and returns the largest row height
// that fits `rows` rows x `cols` columns (capped so tiles are never taller than wide).
export function useGridFit(ref, cols, rows) {
  const [size, setSize] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const cs = getComputedStyle(el)
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      const byWidth = Math.floor((w - GRID_GAP * (cols - 1)) / cols)
      const byHeight = Math.floor((h - GRID_GAP * (rows - 1)) / rows)
      setSize(Math.max(0, Math.min(byWidth, byHeight)))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, cols, rows])

  return size
}