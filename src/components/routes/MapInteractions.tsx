import { useEffect } from "react"
import { useMap, useMapEvents } from "react-leaflet"
import type { RouteClickMode } from "@/components/HeaderBar.tsx"
import type { LeafletMouseEvent } from "leaflet"

type Props = {
  routeClickMode: RouteClickMode
  onAddRoutePoint: (lat: number, lng: number) => void
}

export const MapInteractions = ({ routeClickMode, onAddRoutePoint }: Props) => {
  const map = useMap()

  useEffect(() => {
    const el = map.getContainer()
    el.style.cursor = ["road", "free"].includes(routeClickMode) ? "crosshair" : ""

    return () => {
      el.style.cursor = ""
    }
  }, [map, routeClickMode])

  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (!["road", "free"].includes(routeClickMode)) return

      onAddRoutePoint(e.latlng.lat, e.latlng.lng)
    }
  })

  return null
}
