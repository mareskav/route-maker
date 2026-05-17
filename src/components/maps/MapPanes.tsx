import { useEffect } from "react"
import { useMap } from "react-leaflet"

export const MapPanes = () => {
  const map = useMap()

  useEffect(() => {
    if (!map.getPane("touristPane")) {
      const pane = map.createPane("touristPane")
      pane.style.zIndex = "450"
      pane.style.pointerEvents = "none"
    }

    if (!map.getPane("routePane")) {
      const pane = map.createPane("routePane")
      pane.style.zIndex = "500"
      pane.style.pointerEvents = "none"
    }
  }, [map])

  return null
}
