import { useEffect, useMemo, useState } from "react"
import { GeoJSON as LeafletGeoJSON, MapContainer, Polyline, TileLayer } from "react-leaflet"
import L from "leaflet"
import type { LatLngLiteral } from "leaflet"

import { GrayMapTiles } from "@/components/maps/GrayMapTiles.tsx"
import { TouristOverlay } from "@/components/maps/TouristOverlay.tsx"
import { MapPanes } from "@/components/maps/MapPanes.tsx"
import { MapInteractions } from "@/components/routes/MapInteractions.tsx"
import type { RouteClickMode } from "@/components/HeaderBar.tsx"
import { RoutePointMarker } from "@/components/routes/RoutePointMarker.tsx"
import { fetchRoute } from "@/lib/routing/api.ts"

type TileJson = {
  tiles: string[]
  attribution?: string
  minZoom?: number
  maxZoom?: number
}

// Štoky is default
const CENTER: [number, number] = [49.502485, 15.5886289]
const ZOOM = 14
const MAPSET = "basic" // basic | outdoor | aerial | names-overlay | winter

type Props = {
  routeClickMode: RouteClickMode
  clearRouteSignal: number
  onRouteLengthMetersChange: (meters: number) => void
}

type RouteSegmentMode = "road" | "free"

type RoutePoint = LatLngLiteral & {
  segmentMode?: RouteSegmentMode
}

type RoadRoute = {
  key: string
  geoJson: GeoJSON.GeoJsonObject
  lengthMeters: number
}

const toPolylinePosition = (point: LatLngLiteral): [number, number] => [point.lat, point.lng]

const routeKey = (points: LatLngLiteral[]) =>
  points.map((point) => `${point.lat},${point.lng}`).join("|")

const calculateFreeRouteLength = (points: LatLngLiteral[]) => {
  return points.reduce((length, point, index) => {
    if (index === 0) return length

    return length + L.latLng(points[index - 1]).distanceTo(point)
  }, 0)
}

const buildFreeSegments = (points: RoutePoint[]) => {
  const segments: [LatLngLiteral, LatLngLiteral][] = []

  for (let index = 1; index < points.length; index++) {
    if (points[index].segmentMode === "free") {
      segments.push([points[index - 1], points[index]])
    }
  }

  return segments
}

const buildRoadSections = (points: RoutePoint[]) => {
  const sections: LatLngLiteral[][] = []
  let section: LatLngLiteral[] = []

  for (let index = 1; index < points.length; index++) {
    if (points[index].segmentMode === "road") {
      if (section.length === 0) section = [points[index - 1]]
      section.push(points[index])
    } else if (section.length > 0) {
      sections.push(section)
      section = []
    }
  }

  if (section.length > 0) sections.push(section)

  return sections
}

export const MapView = (props: Props) => {
  const { onRouteLengthMetersChange, routeClickMode } = props
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string

  const [tileJson, setTileJson] = useState<TileJson | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [roadRoutes, setRoadRoutes] = useState<RoadRoute[]>([])
  const freeSegments = useMemo(() => buildFreeSegments(routePoints), [routePoints])
  const roadSections = useMemo(() => buildRoadSections(routePoints), [routePoints])
  const freeLengthMeters = useMemo(
    () =>
      freeSegments.reduce((length, segment) => {
        return length + calculateFreeRouteLength(segment)
      }, 0),
    [freeSegments]
  )
  const roadLengthMeters = roadRoutes.reduce((length, route) => length + route.lengthMeters, 0)

  const tileJsonUrl = useMemo(() => {
    return `https://api.mapy.com/v1/maptiles/${MAPSET}/tiles.json?apikey=${encodeURIComponent(apiKey)}`
  }, [apiKey])

  useEffect(() => {
    onRouteLengthMetersChange(freeLengthMeters + roadLengthMeters)
  }, [freeLengthMeters, onRouteLengthMetersChange, roadLengthMeters])

  useEffect(() => {
    setRoutePoints([])
    setRoadRoutes([])
  }, [props.clearRouteSignal])

  useEffect(() => {
    if (!apiKey) {
      setErr("Chybí VITE_MAPY_API_KEY v .env")
      return
    }

    ;(async () => {
      try {
        setErr(null)
        const res = await fetch(tileJsonUrl)
        if (!res.ok) {
          throw new Error(`TileJSON fetch failed: ${res.status} ${res.statusText}`)
        }

        const data = (await res.json()) as TileJson

        if (!data.tiles?.length) {
          throw new Error("TileJSON neobsahuje pole tiles[]")
        }

        setTileJson(data)
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : String(e))
      }
    })()
  }, [apiKey, tileJsonUrl])

  useEffect(() => {
    if (!apiKey || roadSections.length === 0) {
      setRoadRoutes([])
      return
    }

    const controller = new AbortController()
    setRoadRoutes([])

    ;(async () => {
      try {
        const routes = await Promise.all(
          roadSections.map(async (section) => {
            const route = await fetchRoute({
              apiKey,
              routeType: "foot_hiking",
              points: section,
              signal: controller.signal
            })

            return {
              key: routeKey(section),
              geoJson: route.geoJson,
              lengthMeters: route.lengthMeters
            }
          })
        )

        setRoadRoutes(routes)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Routing error:", error)
      }
    })()

    return () => controller.abort()
  }, [apiKey, roadSections])

  const handleAddRoutePoint = (lat: number, lng: number) => {
    if (!["road", "free"].includes(routeClickMode)) return

    const segmentMode: RouteSegmentMode = routeClickMode === "road" ? "road" : "free"

    setRoutePoints((prev) => [
      ...prev,
      {
        lat,
        lng,
        segmentMode: prev.length === 0 ? undefined : segmentMode
      }
    ])
  }

  const handleRemoveRoutePoint = (index: number) => {
    setRoutePoints((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (next[0]) next[0] = { ...next[0], segmentMode: undefined }

      return next
    })
  }

  if (err) return <div style={{ padding: 16 }}>Error {err}</div>
  if (!tileJson) return <div style={{ padding: 16 }}>Načítám mapu…</div>

  const tileUrl = tileJson.tiles[0]
  const attribution = tileJson.attribution ?? ""

  return (
    <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full">
      <MapPanes />
      <MapInteractions
        routeClickMode={routeClickMode}
        onAddRoutePoint={handleAddRoutePoint}
      />

      <TileLayer
        url={tileUrl}
        attribution={attribution}
        minZoom={tileJson.minZoom}
        maxZoom={tileJson.maxZoom}
      />

      <TouristOverlay enabled={false} />
      <GrayMapTiles enabled={false} />

      {freeSegments.map((segment) => (
        <Polyline
          key={`free-${routeKey(segment)}`}
          positions={segment.map(toPolylinePosition)}
          weight={4}
          opacity={0.9}
        />
      ))}

      {roadRoutes.map((route) => (
        <LeafletGeoJSON
          key={`road-${route.key}`}
          data={route.geoJson}
          style={() => ({
            weight: 5,
            opacity: 0.9,
            color: '#3388ff'
          })}
        />
      ))}

      {routePoints.map((point, index) => (
        <RoutePointMarker
          key={`${point.lat},${point.lng},${index}`}
          number={index + 1}
          position={point}
          onClick={() => handleRemoveRoutePoint(index)}
        />
      ))}
    </MapContainer>
  )
}
