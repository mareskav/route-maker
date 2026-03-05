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
    const tilePane = map.getContainer().querySelector<HTMLElement>(".leaflet-tile-pane")
    if (!tilePane) return

    if (enabled) {
      tilePane.style.filter = "grayscale(100%)"
      // případně ještě: tilePane.style.opacity = "0.9"
    } else {
      tilePane.style.filter = ""
      tilePane.style.opacity = ""
    }
  }, [map, enabled])

  return null
}
