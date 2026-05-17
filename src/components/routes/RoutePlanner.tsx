import type { LatLngLiteral } from "leaflet"
import { useEffect, useState } from "react"
import { GeoJSON as LeafletGeoJSON } from "react-leaflet"
import L from "leaflet"

import { ClickToAddPoint } from "@/components/routes/ClickToAddPoint.tsx"
import { RoutePointMarker } from "@/components/routes/RoutePointMarker.tsx"
import { fetchRoute } from "@/lib/routing/api.ts"
import type { RouteType } from "@/lib/routing/routeTypes.ts"

// Fix pro defaultní Leaflet marker ikony
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

type Props = {
  apiKey: string
  enabled: boolean
  routeType?: RouteType
  onLengthMetersChange?: (meters: number) => void
}

export function RoutePlanner({
  apiKey,
  enabled,
  routeType = "car_fast",
  onLengthMetersChange
}: Props) {
  const [points, setPoints] = useState<LatLngLiteral[]>([])
  const [routedPoints, setRoutedPoints] = useState<LatLngLiteral[]>([])
  const [routeGeoJson, setRouteGeoJson] = useState<GeoJSON.GeoJsonObject | null>(null)

  // Když planner vypneš, mapu “ukliď”
  useEffect(() => {
    if (!enabled) {
      setPoints([])
      setRoutedPoints([])
      setRouteGeoJson(null)
      onLengthMetersChange?.(0)
    }
  }, [enabled, onLengthMetersChange])

  // Routing call při změně bodů
  useEffect(() => {
    if (!enabled) return
    if (!apiKey) return

    if (points.length < 2) {
      setRoutedPoints([])
      setRouteGeoJson(null)
      onLengthMetersChange?.(0)
      return
    }

    const controller = new AbortController()

    ;(async () => {
      try {
        const route = await fetchRoute({
          apiKey,
          routeType,
          points,
          signal: controller.signal
        })

        onLengthMetersChange?.(route.lengthMeters)
        setRoutedPoints(route.mappedPoints.length === points.length ? route.mappedPoints : points)
        setRouteGeoJson(route.geoJson)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Routing error:", error)
      }
    })()

    return () => controller.abort()
  }, [apiKey, enabled, points, routeType, onLengthMetersChange])

  const markerPoints = routeGeoJson ? routedPoints : points

  return (
    <>
      <ClickToAddPoint enabled={enabled} onAdd={(p) => setPoints((prev) => [...prev, p])} />

      {enabled &&
        markerPoints.map((p, idx) => (
          <RoutePointMarker key={`${p.lat},${p.lng},${idx}`} position={p} number={idx + 1} />
        ))}

      {enabled && routeGeoJson && (
        <LeafletGeoJSON
          key={`route-${points.length}`}
          data={routeGeoJson}
          style={() => ({
            weight: 5,
            opacity: 0.9,
            color: '#3388ff'
          })}
        />
      )}
    </>
  )
}
