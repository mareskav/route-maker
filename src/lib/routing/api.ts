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

const buildRouteUrl = (apiKey: string, routeType: RouteType, points: LatLngLiteral[]) => {
  const start = points[0]
  const end = points[points.length - 1]
  const url = new URL("https://api.mapy.com/v1/routing/route")
  url.searchParams.set("apikey", apiKey)
  url.searchParams.set("routeType", routeType)
  url.searchParams.set("format", "geojson")

  // API chce "lon,lat"; Leaflet drží body jako lat/lng.
  url.searchParams.set("start", `${start.lng},${start.lat}`)
  url.searchParams.set("end", `${end.lng},${end.lat}`)
  points.slice(1, -1).forEach((point) => {
    url.searchParams.append("waypoints", `${point.lng},${point.lat}`)
  })

  return url
}

const toMappedSegmentPoints = (
  routePoints: RoutePointResponse[] | undefined,
  fallback: LatLngLiteral[]
) => {
  const mappedPoints =
    routePoints
      ?.map((point) => toLatLngLiteral(point.mappedPosition) ?? toLatLngLiteral(point.originalPosition))
      .filter((point): point is LatLngLiteral => Boolean(point)) ?? []

  return mappedPoints.length === fallback.length ? mappedPoints : fallback
}

async function fetchRouteChunk({
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
  const url = buildRouteUrl(apiKey, routeType, points)
  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`Routing failed: ${res.status} ${res.statusText}`)

  const data = (await res.json()) as RouteResponse
  const features = toRouteFeatures(data.geometry)
  if (!features.length) {
    throw new Error("Routing response does not contain valid GeoJSON geometry")
  }

  return {
    durationSeconds: data.duration ?? 0,
    geoJson: {
      type: "FeatureCollection",
      features
    },
    lengthMeters: data.length ?? 0,
    mappedPoints: toMappedSegmentPoints(data.routePoints, points),
    routeParts: data.parts ?? []
  }
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
  const maxPointsPerRequest = 17

  if (points.length <= maxPointsPerRequest) {
    return fetchRouteChunk({ apiKey, routeType, points, signal })
  }

  const features: GeoJSON.Feature[] = []
  const mappedPoints: LatLngLiteral[] = []
  const routeParts: RoutingResult["routeParts"] = []
  let durationSeconds = 0
  let lengthMeters = 0

  for (let startIndex = 0; startIndex < points.length - 1; startIndex += maxPointsPerRequest - 1) {
    const chunk = points.slice(startIndex, startIndex + maxPointsPerRequest)
    const route = await fetchRouteChunk({ apiKey, routeType, points: chunk, signal })

    features.push(...route.geoJson.features)
    durationSeconds += route.durationSeconds
    lengthMeters += route.lengthMeters
    mappedPoints.push(...(startIndex === 0 ? route.mappedPoints : route.mappedPoints.slice(1)))
    routeParts.push(...route.routeParts)
  }

  return {
    durationSeconds,
    geoJson: {
      type: "FeatureCollection",
      features
    },
    lengthMeters,
    mappedPoints: mappedPoints.length === points.length ? mappedPoints : [],
    routeParts
  }
}
