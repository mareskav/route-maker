import type { LatLngLiteral } from "leaflet"

export type RouteType = "car_fast" | "car_fast_traffic" | "car_short" | "bike" | "foot" | "foot_hiking"

export type RoutingResult = {
  geoJson: GeoJSON.FeatureCollection
  lengthMeters: number
  mappedPoints: LatLngLiteral[]
}

export type RouteResponse = {
  length: number
  duration: number
  geometry: unknown
  routePoints?: RoutePointResponse[]
}

export type RoutePointResponse = {
  mappedPosition?: unknown
  originalPosition?: unknown
}
