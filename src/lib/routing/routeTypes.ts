import type { LatLngLiteral } from "leaflet"

export type RouteType =
  | "car_fast"
  | "car_fast_traffic"
  | "car_short"
  | "foot_fast"
  | "foot_hiking"
  | "bike_road"
  | "bike_mountain"

export type RouteTypeOption = {
  label: string
  routeType: RouteType
}

export const ROUTE_TYPE_OPTIONS: RouteTypeOption[] = [
  { routeType: "foot_hiking", label: "Pěšky turistická" },
  { routeType: "foot_fast", label: "Pěšky rychlá" },
  { routeType: "bike_road", label: "Kolo silniční" },
  { routeType: "bike_mountain", label: "Kolo horské" },
  { routeType: "car_fast_traffic", label: "Auto rychlá s provozem" },
  { routeType: "car_fast", label: "Auto rychlá" },
  { routeType: "car_short", label: "Auto krátká" }
]

export type RoutingResult = {
  durationSeconds: number
  geoJson: GeoJSON.FeatureCollection
  lengthMeters: number
  mappedPoints: LatLngLiteral[]
  routeParts: RoutePartResponse[]
}

export type RouteResponse = {
  length: number
  duration: number
  geometry: unknown
  parts?: RoutePartResponse[]
  routePoints?: RoutePointResponse[]
}

export type RoutePartResponse = {
  duration: number
  length: number
}

export type RoutePointResponse = {
  mappedPosition?: unknown
  originalPosition?: unknown
}
