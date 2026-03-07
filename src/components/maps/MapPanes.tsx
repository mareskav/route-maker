import { useMap } from "react-leaflet"
import { useEffect } from "react"

export const MapPanes = () => {
  const map = useMap()

  useEffect(() => {
    if (!map.getPane("touristPane")) {
      const pane = map.createPane("touristPane")
      pane.style.zIndex = "450"
    }
  }, [map])

  return null
}
