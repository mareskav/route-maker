import type { LatLngLiteral } from "leaflet"
import { useEffect, useState } from "react"
import { GeoJSON as LeafletGeoJSON, Marker, useMapEvents } from "react-leaflet"
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
  geometry: unknown
}

const toRouteGeoJson = (geometry: unknown): GeoJSON.GeoJsonObject | null => {
  const value = typeof geometry === "string" ? JSON.parse(geometry) : geometry

  if (!value || typeof value !== "object" || !("type" in value)) {
    return null
  }

  const geoJson = value as GeoJSON.GeoJsonObject

  if (geoJson.type === "Feature" || geoJson.type === "FeatureCollection") {
    return geoJson
  }

  const feature: GeoJSON.Feature = {
    type: "Feature",
    properties: {},
    geometry: geoJson as GeoJSON.Geometry
  }

  return feature
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
  const [routeGeoJson, setRouteGeoJson] = useState<GeoJSON.GeoJsonObject | null>(null)

  // Když planner vypneš, mapu “ukliď”
  useEffect(() => {
    if (!enabled) {
      setPoints([])
      setRouteGeoJson(null)
      onLengthMetersChange?.(0)
    }
  }, [enabled, onLengthMetersChange])

  // Routing call při změně bodů
  useEffect(() => {
    if (!enabled) return
    if (!apiKey) return

    if (points.length < 2) {
      setRouteGeoJson(null)
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

        const geoJson = toRouteGeoJson(data.geometry)
        if (!geoJson) throw new Error("Routing response does not contain valid GeoJSON geometry")

        setRouteGeoJson(geoJson)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Routing error:", error)
        setRouteGeoJson(null)
        onLengthMetersChange?.(0)
      }
    })()

    return () => controller.abort()
  }, [apiKey, enabled, points, routeType, onLengthMetersChange])

  return (
    <>
      <ClickToAddPoint enabled={enabled} onAdd={(p) => setPoints((prev) => [...prev, p])} />

      {enabled && points.map((p, idx) => <Marker key={`${p.lat},${p.lng},${idx}`} position={p} />)}

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
