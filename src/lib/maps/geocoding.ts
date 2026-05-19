import type { LatLngBoundsLiteral, LatLngLiteral } from "leaflet"

type MapyGeocodeItem = {
  name?: string
  label?: string
  location?: string
  position?: {
    lat?: number
    lon?: number
  }
  bbox?: [number, number, number, number]
}

type MapyGeocodeResponse = {
  items?: MapyGeocodeItem[]
}

export type PlaceSearchResult = {
  name: string
  label: string
  location: string
  position: LatLngLiteral
  bounds: LatLngBoundsLiteral | null
}

const toBounds = (bbox: MapyGeocodeItem["bbox"]): LatLngBoundsLiteral | null => {
  if (!bbox || bbox.length !== 4) return null

  const [minLng, minLat, maxLng, maxLat] = bbox
  if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) return null

  return [
    [minLat, minLng],
    [maxLat, maxLng]
  ]
}

const toPlaceSearchResult = (
  item: MapyGeocodeItem,
  fallbackName: string
): PlaceSearchResult | null => {
  const lat = item.position?.lat
  const lng = item.position?.lon

  if (typeof lat !== "number" || typeof lng !== "number") return null

  return {
    name: item.name ?? fallbackName,
    label: item.label ?? "",
    location: item.location ?? "",
    position: { lat, lng },
    bounds: toBounds(item.bbox)
  }
}

export async function searchPlace({
  apiKey,
  preferNear,
  query,
  signal
}: {
  apiKey: string
  preferNear?: LatLngLiteral
  query: string
  signal?: AbortSignal
}): Promise<PlaceSearchResult | null> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return null

  const url = new URL("https://api.mapy.com/v1/geocode")
  url.searchParams.set("apikey", apiKey)
  url.searchParams.set("query", trimmedQuery)
  url.searchParams.set("lang", "cs")
  url.searchParams.set("limit", "1")

  if (preferNear) {
    url.searchParams.set("preferNear", `${preferNear.lng},${preferNear.lat}`)
    url.searchParams.set("preferNearPrecision", "50000")
  }

  const response = await fetch(url.toString(), { signal })
  if (!response.ok) throw new Error(`Place search failed: ${response.status} ${response.statusText}`)

  const data = (await response.json()) as MapyGeocodeResponse
  const item = data.items?.[0]
  if (!item) return null

  return toPlaceSearchResult(item, trimmedQuery)
}

export async function suggestPlaces({
  apiKey,
  query,
  signal
}: {
  apiKey: string
  query: string
  signal?: AbortSignal
}): Promise<PlaceSearchResult[]> {
  const trimmedQuery = query.trim()
  if (trimmedQuery.length < 2) return []

  const url = new URL("https://api.mapy.com/v1/suggest")
  url.searchParams.set("apikey", apiKey)
  url.searchParams.set("query", trimmedQuery)
  url.searchParams.set("lang", "cs")
  url.searchParams.set("limit", "5")

  const response = await fetch(url.toString(), { signal })
  if (!response.ok) throw new Error(`Place suggest failed: ${response.status} ${response.statusText}`)

  const data = (await response.json()) as MapyGeocodeResponse

  return (
    data.items
      ?.map((item) => toPlaceSearchResult(item, trimmedQuery))
      .filter((item): item is PlaceSearchResult => Boolean(item)) ?? []
  )
}
