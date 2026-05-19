import type { LeafletMouseEvent } from "leaflet"
import { useEffect, useRef } from "react"
import { useMap, useMapEvents } from "react-leaflet"

import type { RouteClickMode } from "@/components/layout/HeaderBar.tsx"

type Props = {
  routeClickMode: RouteClickMode
  onAddRoutePoint: (lat: number, lng: number) => void
  onMapClick?: () => void
}

export const MapInteractions = ({ routeClickMode, onAddRoutePoint, onMapClick }: Props) => {
  const map = useMap()
  const suppressClickUntilRef = useRef(0)

  useEffect(() => {
    const el = map.getContainer()
    const isDrawingRoute = ["road", "free"].includes(routeClickMode)

    el.classList.toggle("route-map-browse", !isDrawingRoute)
    el.classList.toggle("route-map-draw", isDrawingRoute)

    return () => {
      el.classList.remove("route-map-browse", "route-map-draw")
    }
  }, [map, routeClickMode])

  useMapEvents({
    dragstart() {
      suppressClickUntilRef.current = Date.now() + 500
    },
    dragend() {
      suppressClickUntilRef.current = Date.now() + 500
    },
    click(e: LeafletMouseEvent) {
      if (Date.now() < suppressClickUntilRef.current) {
        return
      }

      onMapClick?.()

      if (!["road", "free"].includes(routeClickMode)) return

      onAddRoutePoint(e.latlng.lat, e.latlng.lng)
    }
  })

  return null
}
