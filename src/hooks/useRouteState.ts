import { useEffect, useMemo, useRef, useState } from "react"

import type { RouteClickMode } from "@/components/layout/HeaderBar"
import { downloadRouteGpx, routePointsFromGpx } from "@/lib/routing/routeFile"
import { fetchRoute } from "@/lib/routing/api"
import {
  buildFreeSegments,
  buildRoadConnectors,
  buildRoadSections,
  calculateFreeRouteLength,
  pointsAreClose,
  routeKey,
  toGeoJsonLines,
  type RoadRoute,
  type RoutePoint,
  type RouteSegmentMode
} from "@/lib/routing/routeGeometry"

type MarkerContextMenu = {
  index: number
  x: number
  y: number
}

type Options = {
  apiKey: string
  clearRouteSignal: number
  loadRouteRequest: { contents: string; id: number } | null
  onRoutePointCountChange: (count: number) => void
  onRouteLengthMetersChange: (meters: number) => void
  removeLastRoutePointSignal: number
  routeClickMode: RouteClickMode
  saveRouteSignal: number
  showRouteMarkers: boolean
}

export const useRouteState = ({
  apiKey,
  clearRouteSignal,
  loadRouteRequest,
  onRoutePointCountChange,
  onRouteLengthMetersChange,
  removeLastRoutePointSignal,
  routeClickMode,
  saveRouteSignal,
  showRouteMarkers
}: Options) => {
  const freeSegmentsRef = useRef<ReturnType<typeof buildFreeSegments>>([])
  const roadRoutesRef = useRef<RoadRoute[]>([])
  const routePointsRef = useRef<RoutePoint[]>([])

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
  const roadRouteLines = useMemo(
    () =>
      roadRoutes.map((route) => ({
        ...route,
        lines: toGeoJsonLines(route.geoJson)
      })),
    [roadRoutes]
  )

  useEffect(() => {
    onRouteLengthMetersChange(freeLengthMeters + roadLengthMeters)
  }, [freeLengthMeters, onRouteLengthMetersChange, roadLengthMeters])

  useEffect(() => {
    onRoutePointCountChange(routePoints.length)
  }, [onRoutePointCountChange, routePoints.length])

  useEffect(() => {
    freeSegmentsRef.current = freeSegments
    roadRoutesRef.current = roadRoutes
    routePointsRef.current = routePoints
  }, [freeSegments, roadRoutes, routePoints])

  useEffect(() => {
    setRoutePoints([])
    setRoadRoutes([])
    setMarkerContextMenu(null)
  }, [clearRouteSignal])

  useEffect(() => {
    setRoutePoints((prev) => {
      const next = prev.slice(0, -1)
      if (next[0]) next[0] = { ...next[0], segmentMode: undefined }

      return next
    })
    setMarkerContextMenu(null)
  }, [removeLastRoutePointSignal])

  useEffect(() => {
    if (!showRouteMarkers) setMarkerContextMenu(null)
  }, [showRouteMarkers])

  useEffect(() => {
    if (saveRouteSignal === 0) return

    downloadRouteGpx({
      freeSegments: freeSegmentsRef.current,
      roadRoutes: roadRoutesRef.current,
      routePoints: routePointsRef.current
    })
  }, [saveRouteSignal])

  useEffect(() => {
    if (!loadRouteRequest) return

    try {
      setMarkerContextMenu(null)
      setRoutePoints(routePointsFromGpx(loadRouteRequest.contents))
    } catch (error) {
      console.error("Route file could not be loaded:", error)
      window.alert(error instanceof Error ? error.message : "Soubor trasy se nepodařilo načíst.")
    }
  }, [loadRouteRequest])

  useEffect(() => {
    if (!apiKey || roadSections.length === 0) {
      setRoadRoutes([])
      return
    }

    const controller = new AbortController()
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

  const addRoutePoint = (lat: number, lng: number) => {
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

  const removeRoutePoint = (index: number) => {
    setMarkerContextMenu(null)

    setRoutePoints((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (next[0]) next[0] = { ...next[0], segmentMode: undefined }

      return next
    })
  }

  const moveRoutePoint = (index: number, lat: number, lng: number) => {
    setMarkerContextMenu(null)

    setRoutePoints((prev) => {
      const next = [...prev]
      const point = next[index]
      if (!point) return prev

      next[index] = { ...point, lat, lng }

      return next
    })
  }

  return {
    addRoutePoint,
    freeSegments,
    markerContextMenu,
    moveRoutePoint,
    removeRoutePoint,
    roadRouteLines,
    roadRoutes,
    routePoints,
    setMarkerContextMenu
  }
}
