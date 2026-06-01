import type { LatLngLiteral } from "leaflet"

import {
  toGeoJsonLines,
  type RoadRoute,
  type RoutePoint,
  type RouteSegmentMode
} from "@/lib/routing/routeGeometry"

type RouteFileMessages = {
  emptyFile: string
  parseFailed: string
}

type ExportRouteFileOptions = {
  freeSegments: [LatLngLiteral, LatLngLiteral][]
  roadRoutes: RoadRoute[]
  routePoints: RoutePoint[]
}

const GPX_NS = "http://www.topografix.com/GPX/1/1"
const ROUTE_MAKER_NS = "https://route-maker.local/gpx/1"

const createRouteFilename = () => {
  const now = new Date()
  const pad = (value: number) => value.toString().padStart(2, "0")

  return `trasovnik-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.gpx`
}

const appendTextElement = (
  xmlDocument: XMLDocument,
  parent: Element,
  name: string,
  value: string,
  namespace = GPX_NS
) => {
  const element = xmlDocument.createElementNS(namespace, name)
  element.textContent = value
  parent.appendChild(element)

  return element
}

const appendTrackPoint = (xmlDocument: XMLDocument, parent: Element, point: LatLngLiteral) => {
  const trackPoint = xmlDocument.createElementNS(GPX_NS, "trkpt")
  trackPoint.setAttribute("lat", String(point.lat))
  trackPoint.setAttribute("lon", String(point.lng))
  parent.appendChild(trackPoint)
}

const appendRoutePoint = (xmlDocument: XMLDocument, parent: Element, point: RoutePoint) => {
  const routePoint = xmlDocument.createElementNS(GPX_NS, "rtept")
  routePoint.setAttribute("lat", String(point.lat))
  routePoint.setAttribute("lon", String(point.lng))

  if (point.segmentMode) {
    const extensions = xmlDocument.createElementNS(GPX_NS, "extensions")
    appendTextElement(
      xmlDocument,
      extensions,
      "route-maker:segmentMode",
      point.segmentMode,
      ROUTE_MAKER_NS
    )
    routePoint.appendChild(extensions)
  }

  parent.appendChild(routePoint)
}

const routeLinesFromOptions = (options: ExportRouteFileOptions) => [
  ...options.freeSegments,
  ...options.roadRoutes.flatMap((route) => [
    ...toGeoJsonLines(route.geoJson),
    ...route.connectorSegments
  ])
]

export const routePointsFromGpx = (contents: string, messages?: RouteFileMessages) => {
  const document = new DOMParser().parseFromString(contents, "application/xml")
  const parserError = document.querySelector("parsererror")

  if (parserError) throw new Error(messages?.parseFailed ?? "Soubor GPX se nepodařilo přečíst.")

  const routePointElements = Array.from(document.getElementsByTagNameNS("*", "rtept"))
  const trackPointElements = Array.from(document.getElementsByTagNameNS("*", "trkpt"))
  const sourceElements = routePointElements.length > 0 ? routePointElements : trackPointElements
  const routePoints = sourceElements
    .map((element, index): RoutePoint | null => {
      const lat = Number(element.getAttribute("lat"))
      const lng = Number(element.getAttribute("lon"))

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

      const modeElement = Array.from(element.getElementsByTagNameNS("*", "segmentMode"))[0]
      const parsedMode = modeElement?.textContent
      const segmentMode: RouteSegmentMode | undefined =
        index === 0 ? undefined : parsedMode === "road" || parsedMode === "free" ? parsedMode : "free"

      return { lat, lng, segmentMode }
    })
    .filter((point): point is RoutePoint => point !== null)

  if (routePoints.length === 0) {
    throw new Error(messages?.emptyFile ?? "Soubor neobsahuje žádné body trasy.")
  }

  return routePoints
}

export const createRouteGpx = (options: ExportRouteFileOptions) => {
  const xmlDocument = document.implementation.createDocument(GPX_NS, "gpx")
  const gpx = xmlDocument.documentElement
  gpx.setAttribute("version", "1.1")
  gpx.setAttribute("creator", "Trasovnik")
  gpx.setAttribute("xmlns:route-maker", ROUTE_MAKER_NS)

  const metadata = xmlDocument.createElementNS(GPX_NS, "metadata")
  appendTextElement(xmlDocument, metadata, "name", "Trasa")
  gpx.appendChild(metadata)

  const route = xmlDocument.createElementNS(GPX_NS, "rte")
  appendTextElement(xmlDocument, route, "name", "Editacni body trasy")
  options.routePoints.forEach((point) => appendRoutePoint(xmlDocument, route, point))
  gpx.appendChild(route)

  const track = xmlDocument.createElementNS(GPX_NS, "trk")
  appendTextElement(xmlDocument, track, "name", "Trasa")

  routeLinesFromOptions(options).forEach((line) => {
    if (line.length < 2) return

    const segment = xmlDocument.createElementNS(GPX_NS, "trkseg")
    line.forEach((point) => appendTrackPoint(xmlDocument, segment, point))
    track.appendChild(segment)
  })

  if (track.getElementsByTagNameNS(GPX_NS, "trkseg").length > 0) gpx.appendChild(track)

  return new XMLSerializer().serializeToString(xmlDocument)
}

export const downloadRouteGpx = (options: ExportRouteFileOptions) => {
  const link = document.createElement("a")
  const blob = new Blob([createRouteGpx(options)], { type: "application/gpx+xml;charset=utf-8" })

  link.download = createRouteFilename()
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
}
