import type { DragEndEvent, LatLngExpression, LeafletMouseEvent } from "leaflet"
import L from "leaflet"
import { useMemo } from "react"
import { Marker } from "react-leaflet"

type Props = {
  number: number
  position: LatLngExpression
  color?: string
  onClick?: () => void
  onContextMenu?: (point: { x: number; y: number }) => void
  onDragEnd?: (lat: number, lng: number) => void
}

const safeHexColor = (color: string) => {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#2563eb"
}

export function RoutePointMarker({
  number,
  position,
  color = "#2563eb",
  onClick,
  onContextMenu,
  onDragEnd
}: Props) {
  const markerColor = safeHexColor(color)
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "route-point-marker",
        html: `
          <svg viewBox="0 0 25 41" aria-hidden="true">
            <path
              fill="${markerColor}"
              stroke="white"
              stroke-width="1.5"
              d="M12.5 0.75C6.15 0.75 1 5.9 1 12.25C1 21.15 12.5 40.25 12.5 40.25C12.5 40.25 24 21.15 24 12.25C24 5.9 18.85 0.75 12.5 0.75Z"
            />
            <circle cx="12.5" cy="12.25" r="7.8" fill="white" />
          </svg>
          <span>${number}</span>
        `,
        iconSize: [30, 49],
        iconAnchor: [15, 49],
        popupAnchor: [1, -41],
        tooltipAnchor: [18, -34]
      }),
    [markerColor, number]
  )

  return (
    <Marker
      position={position}
      icon={icon}
      draggable={Boolean(onDragEnd)}
      eventHandlers={{
        click: (e) => {
          if (onClick) {
            e.originalEvent.stopPropagation()
            onClick()
          }
        },
        contextmenu: (e: LeafletMouseEvent) => {
          if (onContextMenu) {
            e.originalEvent.preventDefault()
            e.originalEvent.stopPropagation()
            onContextMenu({ x: e.containerPoint.x, y: e.containerPoint.y })
          }
        },
        dragend: (e: DragEndEvent) => {
          if (onDragEnd) {
            const latLng = e.target.getLatLng()
            onDragEnd(latLng.lat, latLng.lng)
          }
        }
      }}
    />
  )
}
