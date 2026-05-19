import L from "leaflet"
import type { LatLngLiteral } from "leaflet"

export type RouteSegmentMode = "road" | "free"

export type RoutePoint = LatLngLiteral & {
  segmentMode?: RouteSegmentMode
}

export type RoadRoute = {
  durationSeconds: number
  key: string
  geoJson: GeoJSON.GeoJsonObject
  lengthMeters: number
  connectorSegments: [LatLngLiteral, LatLngLiteral][]
  pointIndexes: number[]
  segmentDurationsSeconds: number[]
  segmentLengthsMeters: number[]
}

export type RoadSection = {
  points: LatLngLiteral[]
  pointIndexes: number[]
  snapPointIndexes: number[]
  renderRoute: boolean
}

export const toPolylinePosition = (point: LatLngLiteral): [number, number] => [point.lat, point.lng]

export const routeKey = (points: LatLngLiteral[]) =>
  points.map((point) => `${point.lat},${point.lng}`).join("|")

export const calculateFreeRouteLength = (points: LatLngLiteral[]) => {
  return points.reduce((length, point, index) => {
    if (index === 0) return length

    return length + L.latLng(points[index - 1]).distanceTo(point)
  }, 0)
}

export const buildRoadConnectors = (
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

export const pointsAreClose = (first: LatLngLiteral, second: LatLngLiteral) => {
  return L.latLng(first).distanceTo(second) < 0.5
}

export const buildFreeSegments = (points: RoutePoint[]) => {
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

export const buildRoadSections = (points: RoutePoint[]) => {
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

export const toGeoJsonLines = (geoJson: GeoJSON.GeoJsonObject): LatLngLiteral[][] => {
  if (geoJson.type === "FeatureCollection") {
    const collection = geoJson as GeoJSON.FeatureCollection

    return collection.features.flatMap((feature) => toGeoJsonLines(feature))
  }

  if (geoJson.type === "Feature") {
    const feature = geoJson as GeoJSON.Feature

    return feature.geometry ? toGeoJsonLines(feature.geometry) : []
  }

  if (geoJson.type === "LineString") {
    const line = geoJson as GeoJSON.LineString

    return [line.coordinates.map(([lng, lat]) => ({ lat, lng }))]
  }

  if (geoJson.type === "MultiLineString") {
    const multiLine = geoJson as GeoJSON.MultiLineString

    return multiLine.coordinates.map((line) => line.map(([lng, lat]) => ({ lat, lng })))
  }

  return []
}

export type RouteSegmentSummary = {
  durationSeconds: number
  from: number
  lengthMeters: number
  mode: RouteSegmentMode
  to: number
}

export const buildProfileLines = (points: RoutePoint[], roadRoutes: RoadRoute[]) => {
  const lines: LatLngLiteral[][] = []
  const roadRoutesByStartIndex = new Map<number, RoadRoute>()

  roadRoutes.forEach((route) => {
    const startIndex = route.pointIndexes[0]
    if (startIndex !== undefined) roadRoutesByStartIndex.set(startIndex, route)
  })

  for (let index = 1; index < points.length; index++) {
    const previousPoint = points[index - 1]
    const point = points[index]

    if (
      point.segmentMode === "free" ||
      (point.segmentMode === "road" && previousPoint.segmentMode === "free")
    ) {
      lines.push([previousPoint, point])
      continue
    }

    if (point.segmentMode !== "road") continue

    const route = roadRoutesByStartIndex.get(index - 1)
    if (!route) continue

    const [startConnector, endConnector] = route.connectorSegments
    if (startConnector) lines.push(startConnector)
    lines.push(...toGeoJsonLines(route.geoJson))
    if (endConnector) lines.push(endConnector)
  }

  return lines
}

export const buildRouteSegmentSummaries = (
  points: RoutePoint[],
  roadRoutes: RoadRoute[],
  routeTypeMetersPerSecond: number
) => {
  const summaries: RouteSegmentSummary[] = []

  for (let index = 1; index < points.length; index++) {
    const previousPoint = points[index - 1]
    const point = points[index]
    const isFreeSegment =
      point.segmentMode === "free" ||
      (point.segmentMode === "road" && previousPoint.segmentMode === "free")

    if (isFreeSegment || point.segmentMode !== "road") {
      const lengthMeters = calculateFreeRouteLength([previousPoint, point])
      summaries.push({
        durationSeconds: Math.round(lengthMeters / routeTypeMetersPerSecond),
        from: index,
        lengthMeters,
        mode: "free",
        to: index + 1
      })
      continue
    }

    const roadRoute = roadRoutes.find((route) => {
      const localIndex = route.pointIndexes.indexOf(index - 1)

      return localIndex >= 0 && route.pointIndexes[localIndex + 1] === index
    })
    const localIndex = roadRoute?.pointIndexes.indexOf(index - 1) ?? -1
    const lengthMeters =
      roadRoute && localIndex >= 0
        ? (roadRoute.segmentLengthsMeters[localIndex] ?? calculateFreeRouteLength([previousPoint, point]))
        : calculateFreeRouteLength([previousPoint, point])
    const durationSeconds =
      roadRoute && localIndex >= 0
        ? (roadRoute.segmentDurationsSeconds[localIndex] ??
          Math.round(lengthMeters / routeTypeMetersPerSecond))
        : Math.round(lengthMeters / routeTypeMetersPerSecond)

    summaries.push({
      durationSeconds,
      from: index,
      lengthMeters,
      mode: "road",
      to: index + 1
    })
  }

  return summaries
}
