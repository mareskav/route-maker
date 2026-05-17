import type { LeafletMouseEvent } from "leaflet"
import { useEffect } from "react"
import { useMap, useMapEvents } from "react-leaflet"

import type { RouteClickMode } from "@/components/HeaderBar.tsx"

type Props = {
  routeClickMode: RouteClickMode
  onAddRoutePoint: (lat: number, lng: number) => void
  onMapClick?: () => void
}

export const MapInteractions = ({ routeClickMode, onAddRoutePoint, onMapClick }: Props) => {
  const map = useMap()

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
    click(e: LeafletMouseEvent) {
      onMapClick?.()

      if (!["road", "free"].includes(routeClickMode)) return

      onAddRoutePoint(e.latlng.lat, e.latlng.lng)
    }
  })

  return null
}
