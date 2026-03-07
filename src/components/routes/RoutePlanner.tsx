import type { LatLngLiteral } from "leaflet"
import { useEffect, useState } from "react"
import { GeoJSON, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"

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
  routeType?: "car_fast" | "car_fast_traffic" | "car_short" | "bike" | "foot" | "foot_hiking"
  onLengthMetersChange?: (meters: number) => void
}

type RouteResponse = {
  length: number // meters
  duration: number // seconds
  geometry: GeoJSON.Geometry // LineString
}

function ClickToAddPoint({
  enabled,
  onAdd
}: {
  enabled: boolean
  onAdd: (p: LatLngLiteral) => void
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })
  return null
}

export function RoutePlanner({
  apiKey,
  enabled,
  routeType = "car_fast",
  onLengthMetersChange
}: Props) {
  const [points, setPoints] = useState<LatLngLiteral[]>([])
  const [routeFeature, setRouteFeature] = useState<GeoJSON.Feature | null>(xnull)

  // Když planner vypneš, mapu “ukliď”
  useEffect(() => {
    if (!enabled) {
      setPoints([])
      setRouteFeature(null)
      onLengthMetersChange?.(0)
    }
  }, [enabled, onLengthMetersChange])

  // Routing call při změně bodů
  useEffect(() => {
    if (!enabled) return
    if (!apiKey) return

    if (points.length < 2) {
      setRouteFeature(null)
      onLengthMetersChange?.(0)
      return
    }

    const controller = new AbortController()

    ;(async () => {
      try {
      const url = new URL("https://api.mapy.com/v1/routing/route")
      url.searchParams.set("apikey", apiKey)
      url.searchParams.set("routeType", routeType)
      url.searchParams.set("format", "geojson")

      // POZOR: API chce "lon,lat" (Leaflet je lat/lng)
      const start = points[0]
      const end = points[points.length - 1]
      url.searchParams.set("start", `${start.lng},${start.lat}`)
      url.searchParams.set("end", `${end.lng},${end.lat}`)

      for (let i = 1; i < points.length - 1; i++) {
        const p = points[i]
        url.searchParams.append("waypoints", `${p.lng},${p.lat}`)
      }

        const res = await fetch(url.toString(), { signal: controller.signal })
        if (!res.ok) throw new Error(`Routing failed: ${res.status} ${res.statusText}`)
        const data = (await res.json()) as RouteResponse

      onLengthMetersChange?.(data.length ?? 0)

        const feature: GeoJSON.Feature = {
          type: "Feature",
          properties: {},
          geometry: data.geometry
        }
        setRouteFeature(feature)
      } catch (error: any) {
        if (error?.name === "AbortError") return
        console.error("Routing error:", error)
        setRouteFeature(null)
        onLengthMetersChange?.(0)
      }
    })()

    return () => controller.abort()
  }, [apiKey, enabled, points, routeType, onLengthMetersChange])

  return (
    <>
      <ClickToAddPoint enabled={enabled} onAdd={(p) => setPoints((prev) => [...prev, p])} />

      {enabled && points.map((p, idx) => <Marker key={`${p.lat},${p.lng},${idx}`} position={p} />)}

      {enabled && routeFeature && (
        <GeoJSON
          key={`route-${points.length}`}
          data={routeFeature}
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
