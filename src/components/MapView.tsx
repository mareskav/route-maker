import L from "leaflet"
import type { LatLngLiteral } from "leaflet"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { GeoJSON as LeafletGeoJSON, MapContainer, Polyline, TileLayer } from "react-leaflet"

import type { RouteClickMode } from "@/components/HeaderBar.tsx"
import { GrayMapTiles } from "@/components/maps/GrayMapTiles.tsx"
import { MapPanes } from "@/components/maps/MapPanes.tsx"
import { MapScale } from "@/components/maps/MapScale.tsx"
import { TouristOverlay } from "@/components/maps/TouristOverlay.tsx"
import { MapInteractions } from "@/components/routes/MapInteractions.tsx"
import { RoutePointMarker } from "@/components/routes/RoutePointMarker.tsx"
import type { BaseMapSet, MapTone } from "@/lib/mapMode"
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

type Props = {
  routeClickMode: RouteClickMode
  clearRouteSignal: number
  removeLastRoutePointSignal: number
  saveRouteSignal: number
  loadRouteSignal: number
  routeColor: string
  routeWidth: number
  routeOpacity: number
  showRouteMarkers: boolean
  baseMapSet: BaseMapSet
  mapTone: MapTone
  showTouristOverlay: boolean
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
  connectorSegments: [LatLngLiteral, LatLngLiteral][]
}

type RoadSection = {
  points: LatLngLiteral[]
  pointIndexes: number[]
  snapPointIndexes: number[]
  renderRoute: boolean
}

type MarkerContextMenu = {
  index: number
  x: number
  y: number
}

const SAVED_ROUTE_KEY = "route-maker-route"

const toPolylinePosition = (point: LatLngLiteral): [number, number] => [point.lat, point.lng]

const routeKey = (points: LatLngLiteral[]) =>
  points.map((point) => `${point.lat},${point.lng}`).join("|")

const calculateFreeRouteLength = (points: LatLngLiteral[]) => {
  return points.reduce((length, point, index) => {
    if (index === 0) return length

    return length + L.latLng(points[index - 1]).distanceTo(point)
  }, 0)
}

const buildRoadConnectors = (
  originalPoints: LatLngLiteral[],
  mappedPoints: LatLngLiteral[]
): [LatLngLiteral, LatLngLiteral][] => {
  if (originalPoints.length < 2 || mappedPoints.length !== originalPoints.length) return []

  const firstIndex = 0
  const lastIndex = originalPoints.length - 1

  return [firstIndex, lastIndex]
    .map((index) => [originalPoints[index], mappedPoints[index]] as [LatLngLiteral, LatLngLiteral])
    .filter((segment) => calculateFreeRouteLength(segment) > 1)
}

const pointsAreClose = (first: LatLngLiteral, second: LatLngLiteral) => {
  return L.latLng(first).distanceTo(second) < 0.5
}

const buildFreeSegments = (points: RoutePoint[]) => {
  const segments: [LatLngLiteral, LatLngLiteral][] = []

  for (let index = 1; index < points.length; index++) {
    const isFreeSegment =
      points[index].segmentMode === "free" ||
      (points[index].segmentMode === "road" && points[index - 1].segmentMode === "free")

    if (isFreeSegment) {
      segments.push([points[index - 1], points[index]])
    }
  }

  return segments
}

const buildRoadSections = (points: RoutePoint[]) => {
  const sections: RoadSection[] = []
  let section: RoadSection = {
    points: [],
    pointIndexes: [],
    snapPointIndexes: [],
    renderRoute: true
  }

  const flushSection = () => {
    if (section.points.length > 0) sections.push(section)
    section = {
      points: [],
      pointIndexes: [],
      snapPointIndexes: [],
      renderRoute: true
    }
  }

  for (let index = 1; index < points.length; index++) {
    if (points[index].segmentMode === "road") {
      if (points[index - 1].segmentMode === "free") {
        flushSection()
        sections.push({
          points: [points[index - 1], points[index]],
          pointIndexes: [index - 1, index],
          snapPointIndexes: [index],
          renderRoute: false
        })
        continue
      }

      if (section.points.length === 0) {
        section = {
          points: [points[index - 1]],
          pointIndexes: [index - 1],
          snapPointIndexes: [index - 1],
          renderRoute: true
        }
      }
      section.points.push(points[index])
      section.pointIndexes.push(index)
      section.snapPointIndexes.push(index)
    } else if (section.points.length > 0) {
      flushSection()
    }
  }

  flushSection()

  return sections
}

export const MapView = (props: Props) => {
  const { onRouteLengthMetersChange, routeClickMode } = props
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string
  const didMountSaveRouteEffect = useRef(false)
  const routePointsRef = useRef<RoutePoint[]>([])

  const [tileJson, setTileJson] = useState<TileJson | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [roadRoutes, setRoadRoutes] = useState<RoadRoute[]>([])
  const [markerContextMenu, setMarkerContextMenu] = useState<MarkerContextMenu | null>(null)
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
  const routePathOptions = useMemo(
    () => ({
      color: props.routeColor,
      opacity: props.routeOpacity,
      weight: props.routeWidth,
      fill: false,
      lineCap: "round" as const,
      lineJoin: "round" as const
    }),
    [props.routeColor, props.routeOpacity, props.routeWidth]
  )
  const freeRoutePathOptions = useMemo(
    () => ({
      color: props.routeColor,
      opacity: props.routeOpacity,
      weight: props.routeWidth,
      fill: false,
      dashArray: `${props.routeWidth * 1.8} ${props.routeWidth * 1.5}`,
      lineCap: "round" as const,
      lineJoin: "round" as const
    }),
    [props.routeColor, props.routeOpacity, props.routeWidth]
  )

  const tileJsonUrl = useMemo(() => {
    return `https://api.mapy.com/v1/maptiles/${props.baseMapSet}/tiles.json?apikey=${encodeURIComponent(apiKey)}`
  }, [apiKey, props.baseMapSet])

  useEffect(() => {
    onRouteLengthMetersChange(freeLengthMeters + roadLengthMeters)
  }, [freeLengthMeters, onRouteLengthMetersChange, roadLengthMeters])

  useEffect(() => {
    routePointsRef.current = routePoints
  }, [routePoints])

  useEffect(() => {
    setRoutePoints([])
    setRoadRoutes([])
    setMarkerContextMenu(null)
  }, [props.clearRouteSignal])

  useEffect(() => {
    setRoutePoints((prev) => {
      const next = prev.slice(0, -1)
      if (next[0]) next[0] = { ...next[0], segmentMode: undefined }

      return next
    })
    setMarkerContextMenu(null)
  }, [props.removeLastRoutePointSignal])

  useEffect(() => {
    if (!props.showRouteMarkers) setMarkerContextMenu(null)
  }, [props.showRouteMarkers])

  useEffect(() => {
    if (!didMountSaveRouteEffect.current) {
      didMountSaveRouteEffect.current = true
      return
    }

    window.localStorage.setItem(SAVED_ROUTE_KEY, JSON.stringify(routePointsRef.current))
  }, [props.saveRouteSignal])

  useEffect(() => {
    const savedRoute = window.localStorage.getItem(SAVED_ROUTE_KEY)
    if (!savedRoute) return

    try {
      const parsed = JSON.parse(savedRoute) as RoutePoint[]
      if (!Array.isArray(parsed)) return

      setRoutePoints(
        parsed
          .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
          .map((point, index) => ({
            lat: point.lat,
            lng: point.lng,
            segmentMode: index === 0 ? undefined : point.segmentMode === "free" ? "free" : "road"
          }))
      )
    } catch (error) {
      console.error("Saved route could not be loaded:", error)
    }
  }, [props.loadRouteSignal])

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
              points: section.points,
              signal: controller.signal
            })
            const connectorSegments = buildRoadConnectors(section.points, route.mappedPoints)

            return {
              key: routeKey(section.points),
              geoJson: route.geoJson,
              lengthMeters: section.renderRoute
                ? route.lengthMeters +
                  connectorSegments.reduce((length, segment) => {
                    return length + calculateFreeRouteLength(segment)
                  }, 0)
                : 0,
              connectorSegments,
              mappedPoints: route.mappedPoints,
              pointIndexes: section.pointIndexes,
              snapPointIndexes: section.snapPointIndexes,
              renderRoute: section.renderRoute
            }
          })
        )

        setRoutePoints((prev) => {
          const next = [...prev]
          let changed = false

          routes.forEach((route) => {
            if (route.mappedPoints.length !== route.pointIndexes.length) return

            route.mappedPoints.forEach((mappedPoint, mappedIndex) => {
              const pointIndex = route.pointIndexes[mappedIndex]
              if (!route.snapPointIndexes.includes(pointIndex)) return

              const point = next[pointIndex]
              if (!point || pointsAreClose(point, mappedPoint)) return

              next[pointIndex] = { ...point, lat: mappedPoint.lat, lng: mappedPoint.lng }
              changed = true
            })
          })

          return changed ? next : prev
        })
        setRoadRoutes(
          routes
            .filter((route) => route.renderRoute)
            .map((route) => ({
              key: route.key,
              geoJson: route.geoJson,
              lengthMeters: route.lengthMeters,
              connectorSegments: route.connectorSegments
            }))
        )
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Routing error:", error)
      }
    })()

    return () => controller.abort()
  }, [apiKey, roadSections])

  const handleAddRoutePoint = (lat: number, lng: number) => {
    setMarkerContextMenu(null)

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
    setMarkerContextMenu(null)

    setRoutePoints((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (next[0]) next[0] = { ...next[0], segmentMode: undefined }

      return next
    })
  }

  const handleMoveRoutePoint = (index: number, lat: number, lng: number) => {
    setMarkerContextMenu(null)

    setRoutePoints((prev) => {
      const next = [...prev]
      const point = next[index]
      if (!point) return prev

      next[index] = { ...point, lat, lng }

      return next
    })
  }

  if (err) return <div style={{ padding: 16 }}>Error {err}</div>
  if (!tileJson) return <div style={{ padding: 16 }}>Načítám mapu…</div>

  const tileUrl = tileJson.tiles[0]
  const attribution = tileJson.attribution ?? ""

  return (
    <div className="relative h-full w-full">
      <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full">
        <MapPanes />
        <MapInteractions
          routeClickMode={routeClickMode}
          onAddRoutePoint={handleAddRoutePoint}
          onMapClick={() => setMarkerContextMenu(null)}
        />
        <MapScale />

        <TileLayer
          url={tileUrl}
          attribution={attribution}
          minZoom={tileJson.minZoom}
          maxZoom={tileJson.maxZoom}
        />

        <TouristOverlay enabled={props.showTouristOverlay} />
        <GrayMapTiles enabled={props.mapTone === "grayscale"} />

        {freeSegments.map((segment) => (
          <Polyline
            key={`free-${routeKey(segment)}`}
            pane="routePane"
            positions={segment.map(toPolylinePosition)}
            pathOptions={freeRoutePathOptions}
          />
        ))}

        {roadRoutes.map((route) => (
          <Fragment key={`road-${route.key}`}>
            <LeafletGeoJSON
              pane="routePane"
              data={route.geoJson}
              style={() => routePathOptions}
            />
            {route.connectorSegments.map((segment) => (
              <Polyline
                key={`road-connector-${route.key}-${routeKey(segment)}`}
                pane="routePane"
                positions={segment.map(toPolylinePosition)}
                pathOptions={routePathOptions}
              />
            ))}
          </Fragment>
        ))}

        {props.showRouteMarkers &&
          routePoints.map((point, index) => (
            <RoutePointMarker
              key={`${point.lat},${point.lng},${index}`}
              number={index + 1}
              position={point}
              color={props.routeColor}
              onClick={() => handleRemoveRoutePoint(index)}
              onContextMenu={(menuPoint) =>
                setMarkerContextMenu({ index, x: menuPoint.x, y: menuPoint.y })
              }
              onDragEnd={(lat, lng) => handleMoveRoutePoint(index, lat, lng)}
            />
          ))}
      </MapContainer>

      {markerContextMenu && (
        <div
          className="absolute z-[1200] min-w-40 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm text-slate-900 shadow-lg"
          style={{ left: markerContextMenu.x, top: markerContextMenu.y }}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button
            type="button"
            className="block w-full px-4 py-2 text-left hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
            onClick={() => handleRemoveRoutePoint(markerContextMenu.index)}
          >
            Vymazat bod
          </button>
        </div>
      )}
    </div>
  )
}
