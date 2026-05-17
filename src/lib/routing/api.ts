import type { LatLngLiteral } from "leaflet"

import type { RoutePointResponse, RouteResponse, RouteType, RoutingResult } from "@/lib/routing/routeTypes.ts"

const toLatLngLiteral = (position: unknown): LatLngLiteral | null => {
  if (Array.isArray(position) && position.length >= 2) {
    const [lng, lat] = position
    if (typeof lat === "number" && typeof lng === "number") {
      return { lat, lng }
    }
  }

  if (!position || typeof position !== "object") {
    return null
  }

  const value = position as {
    lat?: unknown
    lng?: unknown
    lon?: unknown
  }

  const lat = value.lat
  const lng = value.lng ?? value.lon

  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng }
  }

  return null
}

const toRouteFeatures = (geometry: unknown): GeoJSON.Feature[] => {
  const value = typeof geometry === "string" ? JSON.parse(geometry) : geometry

  if (!value || typeof value !== "object" || !("type" in value)) {
    return []
  }

  const geoJson = value as GeoJSON.GeoJsonObject

  if (geoJson.type === "FeatureCollection") {
    return (geoJson as GeoJSON.FeatureCollection).features
  }

  if (geoJson.type === "Feature") {
    return [geoJson as GeoJSON.Feature]
  }

  return [
    {
      type: "Feature",
      properties: {},
      geometry: geoJson as GeoJSON.Geometry
    }
  ]
}

const buildRouteUrl = (apiKey: string, routeType: RouteType, start: LatLngLiteral, end: LatLngLiteral) => {
  const url = new URL("https://api.mapy.com/v1/routing/route")
  url.searchParams.set("apikey", apiKey)
  url.searchParams.set("routeType", routeType)
  url.searchParams.set("format", "geojson")

  // API chce "lon,lat"; Leaflet drží body jako lat/lng.
  url.searchParams.set("start", `${start.lng},${start.lat}`)
  url.searchParams.set("end", `${end.lng},${end.lat}`)

  return url
}

const toMappedSegmentPoints = (
  routePoints: RoutePointResponse[] | undefined,
  fallback: [LatLngLiteral, LatLngLiteral]
) => {
  const mappedPoints =
    routePoints
      ?.map((point) => toLatLngLiteral(point.mappedPosition) ?? toLatLngLiteral(point.originalPosition))
      .filter((point): point is LatLngLiteral => Boolean(point)) ?? []

  return mappedPoints.length === fallback.length ? mappedPoints : fallback
}

export async function fetchRoute({
  apiKey,
  routeType,
  points,
  signal
}: {
  apiKey: string
  routeType: RouteType
  points: LatLngLiteral[]
  signal: AbortSignal
}): Promise<RoutingResult> {
  const features: GeoJSON.Feature[] = []
  const mappedPoints: LatLngLiteral[] = []
  let lengthMeters = 0

  for (let i = 0; i < points.length - 1; i++) {
    const segment: [LatLngLiteral, LatLngLiteral] = [points[i], points[i + 1]]
    const url = buildRouteUrl(apiKey, routeType, segment[0], segment[1])
    const res = await fetch(url.toString(), { signal })
    if (!res.ok) throw new Error(`Routing segment ${i + 1} failed: ${res.status} ${res.statusText}`)

    const data = (await res.json()) as RouteResponse
    const segmentFeatures = toRouteFeatures(data.geometry)
    if (!segmentFeatures.length) {
      throw new Error(`Routing segment ${i + 1} response does not contain valid GeoJSON geometry`)
    }

    const segmentMappedPoints = toMappedSegmentPoints(data.routePoints, segment)

    features.push(...segmentFeatures)
    lengthMeters += data.length ?? 0
    mappedPoints.push(...(i === 0 ? segmentMappedPoints : segmentMappedPoints.slice(1)))
  }

  return {
    geoJson: {
      type: "FeatureCollection",
      features
    },
    lengthMeters,
    mappedPoints: mappedPoints.length === points.length ? mappedPoints : []
  }
}
