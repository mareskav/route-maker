import L from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

export function MapScale() {
  const map = useMap()

  useEffect(() => {
    const scale = L.control.scale({
      imperial: false,
      metric: true,
      position: "bottomleft"
    })

    scale.addTo(map)

    return () => {
      scale.remove()
    }
  }, [map])

  return null
}
