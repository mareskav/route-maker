import L from "leaflet"
import type { LatLngLiteral } from "leaflet"

export type ElevationProfilePoint = LatLngLiteral & {
  distanceMeters: number
  elevation: number
}

export type ElevationProfile = {
  ascentMeters: number
  descentMeters: number
  distanceMeters: number
  maxElevation: number
  minElevation: number
  points: ElevationProfilePoint[]
}

type ElevationResponse = {
  items: {
    elevation: number
    position: {
      lat: number
      lon: number
    }
  }[]
}

type TrackPoint = LatLngLiteral & {
  distanceMeters: number
}

const MAX_ELEVATION_POSITIONS = 256
const MISSING_ELEVATION = -100000

const distance = (first: LatLngLiteral, second: LatLngLiteral) => L.latLng(first).distanceTo(second)

const interpolatePoint = (
  first: TrackPoint,
  second: TrackPoint,
  distanceMeters: number
): TrackPoint => {
  const segmentLength = second.distanceMeters - first.distanceMeters
  const ratio = segmentLength > 0 ? (distanceMeters - first.distanceMeters) / segmentLength : 0

  return {
    lat: first.lat + (second.lat - first.lat) * ratio,
    lng: first.lng + (second.lng - first.lng) * ratio,
    distanceMeters
  }
}

const flattenLines = (lines: LatLngLiteral[][]) => {
  const points: TrackPoint[] = []
  let distanceMeters = 0

  lines.forEach((line) => {
    if (line.length < 2) return

    line.forEach((point, index) => {
      if (index > 0) distanceMeters += distance(line[index - 1], point)
      if (points.length > 0 && distance(points[points.length - 1], point) < 0.1) return

      points.push({ ...point, distanceMeters })
    })
  })

  return points
}

const sampleTrack = (lines: LatLngLiteral[][]) => {
  const track = flattenLines(lines)
  if (track.length < 2) return []

  const totalDistance = track[track.length - 1].distanceMeters
  if (totalDistance <= 0) return []

  const count = Math.min(MAX_ELEVATION_POSITIONS, Math.max(2, Math.ceil(totalDistance / 250) + 1))
  const step = totalDistance / (count - 1)
  const sampled: TrackPoint[] = []
  let cursor = 1

  for (let index = 0; index < count; index++) {
    const targetDistance = index === count - 1 ? totalDistance : index * step

    while (cursor < track.length - 1 && track[cursor].distanceMeters < targetDistance) {
      cursor += 1
    }

    sampled.push(interpolatePoint(track[cursor - 1], track[cursor], targetDistance))
  }

  return sampled
}

const calculateClimb = (points: ElevationProfilePoint[]) => {
  let ascentMeters = 0
  let descentMeters = 0

  points.forEach((point, index) => {
    if (index === 0) return

    const diff = point.elevation - points[index - 1].elevation
    if (Math.abs(diff) < 1) return
    if (diff > 0) ascentMeters += diff
    else descentMeters += Math.abs(diff)
  })

  return {
    ascentMeters: Math.round(ascentMeters),
    descentMeters: Math.round(descentMeters)
  }
}

export const fetchElevationProfile = async ({
  apiKey,
  lines,
  signal
}: {
  apiKey: string
  lines: LatLngLiteral[][]
  signal: AbortSignal
}): Promise<ElevationProfile | null> => {
  const sampledPoints = sampleTrack(lines)
  if (sampledPoints.length < 2) return null

  const url = new URL("https://api.mapy.com/v1/elevation")
  url.searchParams.set("apikey", apiKey)
  url.searchParams.set("lang", "cs")
  sampledPoints.forEach((point) => {
    url.searchParams.append("positions", `${point.lng},${point.lat}`)
  })

  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`Elevation failed: ${res.status} ${res.statusText}`)

  const data = (await res.json()) as ElevationResponse
  const points = data.items
    .map((item, index): ElevationProfilePoint | null => {
      const sampledPoint = sampledPoints[index]
      if (!sampledPoint || item.elevation <= MISSING_ELEVATION) return null

      return {
        lat: item.position.lat,
        lng: item.position.lon,
        distanceMeters: sampledPoint.distanceMeters,
        elevation: item.elevation
      }
    })
    .filter((point): point is ElevationProfilePoint => point !== null)

  if (points.length < 2) return null

  const elevations = points.map((point) => point.elevation)
  const climb = calculateClimb(points)

  return {
    ...climb,
    distanceMeters: points[points.length - 1].distanceMeters,
    maxElevation: Math.max(...elevations),
    minElevation: Math.min(...elevations),
    points
  }
}
