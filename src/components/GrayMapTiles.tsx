import { useEffect } from "react"
import { useMap } from "react-leaflet"

type Props = {
  enabled?: boolean
  // můžeš doladit intenzitu bez magie v kódu
  opacity?: number // default 0.7..0.9
  grayscale?: number // 0..1
  brightness?: number // 0..2 (1 = bez změny)
  contrast?: number // 0..2
  saturate?: number // 0..2
}

export const GrayMapTiles = ({ enabled = true }: Props) => {
  const map = useMap()

  useEffect(() => {
    const pane = map.getPane("tilePane")
    if (!pane) return

    if (enabled) {
      pane.style.filter = "grayscale(100%)"
    } else {
      pane.style.filter = ""
    }
  }, [map, enabled])

  return null
}
