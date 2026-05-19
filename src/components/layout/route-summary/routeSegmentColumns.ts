export type RouteSegmentColumnId = "distance" | "duration" | "ascent" | "descent"

export type RouteSegmentColumnVisibility = Record<RouteSegmentColumnId, boolean>

export const ROUTE_SEGMENT_COLUMN_OPTIONS: { id: RouteSegmentColumnId; label: string }[] = [
  { id: "distance", label: "Vzdálenost" },
  { id: "duration", label: "Čas" },
  { id: "ascent", label: "Nahoru" },
  { id: "descent", label: "Dolů" }
]

export const DEFAULT_ROUTE_SEGMENT_COLUMN_VISIBILITY: RouteSegmentColumnVisibility = {
  ascent: true,
  descent: true,
  distance: true,
  duration: true
}
