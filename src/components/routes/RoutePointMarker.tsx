import type { LatLngExpression } from "leaflet"
import L from "leaflet"
import { useMemo } from "react"
import { Marker } from "react-leaflet"

type Props = {
  number: number
  position: LatLngExpression
  onClick?: () => void
}

export function RoutePointMarker({ number, position, onClick }: Props) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "route-point-marker",
        html: `<span>${number}</span>`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28]
      }),
    [number]
  )

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={
        onClick
          ? {
              click: (e) => {
                e.originalEvent.stopPropagation()
                onClick()
              }
            }
          : undefined
      }
    />
  )
}
