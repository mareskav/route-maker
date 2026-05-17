import type { LatLngLiteral } from "leaflet"
import { useMapEvents } from "react-leaflet"

type Props = {
  enabled: boolean
  onAdd: (point: LatLngLiteral) => void
}

export function ClickToAddPoint({ enabled, onAdd }: Props) {
  useMapEvents({
    click(e) {
      if (!enabled) return
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })

  return null
}
