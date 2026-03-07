import { useEffect } from "react"
import { useMap, useMapEvents } from "react-leaflet"

type Props = {
  routingEnabled: boolean
  onAddRoutePoint: (lat: number, lng: number) => void
}

export const MapInteractions = ({ routingEnabled, onAddRoutePoint }: Props) => {
  const map = useMap()

  useEffect(() => {
    const el = map.getContainer()
    el.style.cursor = routingEnabled ? "crosshair" : ""

    return () => {
      el.style.cursor = ""
    }
  }, [map, routingEnabled])

  useMapEvents({
    click(e) {
      if (!routingEnabled) return

      onAddRoutePoint(e.latlng.lat, e.latlng.lng)
    }
  })

  return null
}
