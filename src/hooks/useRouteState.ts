import { useEffect, useMemo, useRef, useState } from "react"

import type { RouteClickMode } from "@/components/layout/HeaderBar"
import { fetchRoute } from "@/lib/routing/api"
import { downloadRouteGpx, routePointsFromGpx } from "@/lib/routing/routeFile"
import {
  buildFreeSegments,
  buildProfileLines,
  buildRoadConnectors,
  buildRoadSections,
  buildRouteSegmentSummaries,
  calculateFreeRouteLength,
  pointsAreClose,
  routeKey,
  toGeoJsonLines,
  type RoadRoute,
  type RoutePoint,
  type RouteSegmentMode
} from "@/lib/routing/routeGeometry"
import type { RouteType } from "@/lib/routing/routeTypes"

type MarkerContextMenu = {
  index: number
  x: number
  y: number
}

const freeRouteMetersPerSecond = (routeType: RouteType) => {
  if (routeType.startsWith("car_")) return 60_000 / 3_600
  if (routeType.startsWith("bike_")) return 18_000 / 3_600

  return 4_000 / 3_600
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
  routeType: RouteType
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
  showRouteMarkers,
  routeType
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
  const freeDurationSeconds = Math.round(freeLengthMeters / freeRouteMetersPerSecond(routeType))
  const roadDurationSeconds = roadRoutes.reduce(
    (duration, route) => duration + route.durationSeconds,
    0
  )
  const roadLengthMeters = roadRoutes.reduce((length, route) => length + route.lengthMeters, 0)
  const routeLengthMeters = freeLengthMeters + roadLengthMeters
  const routeDurationSeconds = freeDurationSeconds + roadDurationSeconds
  const routeSegmentSummaries = useMemo(
    () =>
      buildRouteSegmentSummaries(
        routePoints,
        roadRoutes,
        freeRouteMetersPerSecond(routeType)
      ),
    [roadRoutes, routePoints, routeType]
  )
  const profileLines = useMemo(() => buildProfileLines(routePoints, roadRoutes), [
    roadRoutes,
    routePoints
  ])
  const roadRouteLines = useMemo(
    () =>
      roadRoutes.map((route) => ({
        ...route,
        lines: toGeoJsonLines(route.geoJson)
      })),
    [roadRoutes]
  )

  useEffect(() => {
    onRouteLengthMetersChange(routeLengthMeters)
  }, [onRouteLengthMetersChange, routeLengthMeters])

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
              routeType,
              points: section.points,
              signal: controller.signal
            })
            const connectorSegments = buildRoadConnectors(section.points, route.mappedPoints)
            const connectorLengthMeters = connectorSegments.reduce((length, segment) => {
              return length + calculateFreeRouteLength(segment)
            }, 0)
            const segmentLengthsMeters = route.routeParts.map((part) => part.length)
            const segmentDurationsSeconds = route.routeParts.map((part) => part.duration)

            if (segmentLengthsMeters.length > 0) {
              const firstConnector = connectorSegments.find((segment) =>
                pointsAreClose(segment[0], section.points[0])
              )
              const lastConnector = connectorSegments.find((segment) =>
                pointsAreClose(segment[0], section.points[section.points.length - 1])
              )

              if (firstConnector) {
                const length = calculateFreeRouteLength(firstConnector)
                segmentLengthsMeters[0] += length
                segmentDurationsSeconds[0] += Math.round(
                  length / freeRouteMetersPerSecond(routeType)
                )
              }

              if (lastConnector) {
                const length = calculateFreeRouteLength(lastConnector)
                const lastIndex = segmentLengthsMeters.length - 1
                segmentLengthsMeters[lastIndex] += length
                segmentDurationsSeconds[lastIndex] += Math.round(
                  length / freeRouteMetersPerSecond(routeType)
                )
              }
            }

            return {
              key: routeKey(section.points),
              durationSeconds: section.renderRoute
                ? route.durationSeconds +
                  Math.round(connectorLengthMeters / freeRouteMetersPerSecond(routeType))
                : 0,
              geoJson: route.geoJson,
              lengthMeters: section.renderRoute
                ? route.lengthMeters + connectorLengthMeters
                : 0,
              connectorSegments,
              mappedPoints: route.mappedPoints,
              pointIndexes: section.pointIndexes,
              segmentDurationsSeconds: section.renderRoute ? segmentDurationsSeconds : [],
              segmentLengthsMeters: section.renderRoute ? segmentLengthsMeters : [],
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
              durationSeconds: route.durationSeconds,
              geoJson: route.geoJson,
              lengthMeters: route.lengthMeters,
              connectorSegments: route.connectorSegments,
              pointIndexes: route.pointIndexes,
              segmentDurationsSeconds: route.segmentDurationsSeconds,
              segmentLengthsMeters: route.segmentLengthsMeters
            }))
        )
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Routing error:", error)
      }
    })()

    return () => controller.abort()
  }, [apiKey, roadSections, routeType])

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
    profileLines,
    removeRoutePoint,
    roadRouteLines,
    roadRoutes,
    routeDurationSeconds,
    routeLengthMeters,
    routePoints,
    routeSegmentSummaries,
    setMarkerContextMenu
  }
}
