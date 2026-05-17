import { useEffect } from "react"
import { useMap } from "react-leaflet"

type Props = {
  enabled?: boolean
}

export const GrayMapTiles = ({ enabled = true }: Props) => {
  const map = useMap()

  useEffect(() => {
    const pane = map.getPane("tilePane")
    if (!pane) return

    pane.style.filter = enabled ? "grayscale(100%) contrast(1.08) brightness(0.96)" : ""
  }, [map, enabled])

  return null
}
