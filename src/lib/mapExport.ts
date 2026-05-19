import L from "leaflet"
import type { LatLngLiteral } from "leaflet"

import type { MapTone } from "@/lib/mapMode"
import type { RoadRoute, RoutePoint } from "@/lib/routing/routeGeometry"
import { toGeoJsonLines } from "@/lib/routing/routeGeometry"

export type ExportMapOptions = {
  freeSegments: [LatLngLiteral, LatLngLiteral][]
  mapTone: MapTone
  roadRoutes: RoadRoute[]
  routeColor: string
  routeDash: number
  routeOpacity: number
  routePoints: RoutePoint[]
  routeWidth: number
  showRouteMarkers: boolean
}

export type ExportScaleOption = {
  label: string
  meters: number
}

export type ExportMode = "view" | "large"

export type ExportSizeOption = {
  label: string
  size: number
}

export type RouteExportVisibility = "full" | "partial" | "none"

type LargeMapOptions = ExportMapOptions & {
  center?: LatLngLiteral
  renderSize?: number
  scaleMeters: number
  showTouristOverlay: boolean
  size: number
  tileUrl: string
}

export const EXPORT_SCALE_OPTIONS: ExportScaleOption[] = [
  { label: "300 m", meters: 300 },
  { label: "500 m", meters: 500 },
  { label: "1 km", meters: 1000 },
  { label: "2 km", meters: 2000 },
  { label: "5 km", meters: 5000 }
]

export const EXPORT_SIZE_OPTIONS: ExportSizeOption[] = [
  { label: "2000 x 2000", size: 2000 },
  { label: "3000 x 3000", size: 3000 },
  { label: "5000 x 5000", size: 5000 },
  { label: "7000 x 7000", size: 7000 }
]

export const DEFAULT_LARGE_EXPORT_SIZE = 5000

const createImageFilename = () => {
  const now = new Date()
  const pad = (value: number) => value.toString().padStart(2, "0")

  return `trasovnik-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.png`
}

export const downloadCanvas = (canvas: HTMLCanvasElement) => {
  const link = document.createElement("a")
  link.download = createImageFilename()
  link.href = canvas.toDataURL("image/png")
  link.click()
}

const safeHexColor = (color: string) => {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#2563eb"
}

const drawImageElement = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  mapBounds: DOMRect,
  scale: number
) => {
  const bounds = image.getBoundingClientRect()

  if (!image.complete || image.naturalWidth === 0 || bounds.width <= 0 || bounds.height <= 0) return

  const opacity = Number.parseFloat(window.getComputedStyle(image).opacity)

  context.save()
  context.globalAlpha = Number.isFinite(opacity) ? opacity : 1
  context.drawImage(
    image,
    (bounds.left - mapBounds.left) * scale,
    (bounds.top - mapBounds.top) * scale,
    bounds.width * scale,
    bounds.height * scale
  )
  context.restore()
}

const drawCanvasElement = (
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  mapBounds: DOMRect,
  scale: number
) => {
  const bounds = source.getBoundingClientRect()

  if (source.width <= 0 || source.height <= 0 || bounds.width <= 0 || bounds.height <= 0) return

  context.drawImage(
    source,
    (bounds.left - mapBounds.left) * scale,
    (bounds.top - mapBounds.top) * scale,
    bounds.width * scale,
    bounds.height * scale
  )
}

const applyMapTone = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = context.getImageData(0, 0, width, height)
  const { data } = imageData

  for (let index = 0; index < data.length; index += 4) {
    const gray = data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722
    const adjusted = Math.max(0, Math.min(255, (gray * 0.96 - 128) * 1.08 + 128))

    data[index] = adjusted
    data[index + 1] = adjusted
    data[index + 2] = adjusted
  }

  context.putImageData(imageData, 0, 0)
}

const drawRouteLineAtPoint = (
  context: CanvasRenderingContext2D,
  points: LatLngLiteral[],
  options: {
    color: string
    dash?: number[]
    opacity: number
    scale: number
    toPoint: (point: LatLngLiteral) => L.Point
    width: number
  }
) => {
  if (points.length < 2) return

  context.save()
  context.beginPath()
  context.strokeStyle = options.color
  context.globalAlpha = options.opacity
  context.lineCap = "round"
  context.lineJoin = "round"
  context.lineWidth = options.width * options.scale
  context.setLineDash((options.dash ?? []).map((value) => value * options.scale))

  points.forEach((point, index) => {
    const position = options.toPoint(point)
    const x = position.x * options.scale
    const y = position.y * options.scale

    if (index === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  })

  context.stroke()
  context.restore()
}

const drawRoutes = (
  context: CanvasRenderingContext2D,
  map: L.Map,
  options: ExportMapOptions & { scale: number }
) => {
  const toPoint = (point: LatLngLiteral) => map.latLngToContainerPoint(point)
  const dash =
    options.routeDash > 0
      ? [options.routeWidth * 1.8, options.routeWidth * (0.6 + options.routeDash / 12)]
      : undefined

  options.freeSegments.forEach((segment) => {
    drawRouteLineAtPoint(context, segment, {
      color: options.routeColor,
      dash,
      opacity: options.routeOpacity,
      scale: options.scale,
      toPoint,
      width: options.routeWidth
    })
  })

  options.roadRoutes.forEach((route) => {
    toGeoJsonLines(route.geoJson).forEach((line) => {
      drawRouteLineAtPoint(context, line, {
        color: options.routeColor,
        dash,
        opacity: options.routeOpacity,
        scale: options.scale,
        toPoint,
        width: options.routeWidth
      })
    })

    route.connectorSegments.forEach((segment) => {
      drawRouteLineAtPoint(context, segment, {
        color: options.routeColor,
        dash,
        opacity: options.routeOpacity,
        scale: options.scale,
        toPoint,
        width: options.routeWidth
      })
    })
  })
}

const drawRoutesAtPoint = (
  context: CanvasRenderingContext2D,
  options: ExportMapOptions & {
    scale: number
    toPoint: (point: LatLngLiteral) => L.Point
  }
) => {
  const dash =
    options.routeDash > 0
      ? [options.routeWidth * 1.8, options.routeWidth * (0.6 + options.routeDash / 12)]
      : undefined

  options.freeSegments.forEach((segment) => {
    drawRouteLineAtPoint(context, segment, {
      color: options.routeColor,
      dash,
      opacity: options.routeOpacity,
      scale: options.scale,
      toPoint: options.toPoint,
      width: options.routeWidth
    })
  })

  options.roadRoutes.forEach((route) => {
    toGeoJsonLines(route.geoJson).forEach((line) => {
      drawRouteLineAtPoint(context, line, {
        color: options.routeColor,
        dash,
        opacity: options.routeOpacity,
        scale: options.scale,
        toPoint: options.toPoint,
        width: options.routeWidth
      })
    })

    route.connectorSegments.forEach((segment) => {
      drawRouteLineAtPoint(context, segment, {
        color: options.routeColor,
        dash,
        opacity: options.routeOpacity,
        scale: options.scale,
        toPoint: options.toPoint,
        width: options.routeWidth
      })
    })
  })
}

const drawRouteMarkers = (
  context: CanvasRenderingContext2D,
  map: L.Map,
  points: RoutePoint[],
  color: string,
  scale: number
) => {
  const markerColor = safeHexColor(color)
  const markerPath = new Path2D(
    "M12.5 0.75C6.15 0.75 1 5.9 1 12.25C1 21.15 12.5 40.25 12.5 40.25C12.5 40.25 24 21.15 24 12.25C24 5.9 18.85 0.75 12.5 0.75Z"
  )

  points.forEach((point, index) => {
    const position = map.latLngToContainerPoint(point)
    const left = (position.x - 15) * scale
    const top = (position.y - 49) * scale

    context.save()
    context.translate(left, top)
    context.scale((30 / 25) * scale, (49 / 41) * scale)
    context.fillStyle = markerColor
    context.strokeStyle = "white"
    context.lineWidth = 1.5
    context.fill(markerPath)
    context.stroke(markerPath)
    context.fillStyle = "white"
    context.beginPath()
    context.arc(12.5, 12.25, 7.8, 0, Math.PI * 2)
    context.fill()
    context.restore()

    context.save()
    context.fillStyle = "#111827"
    context.font = `800 ${12 * scale}px sans-serif`
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(String(index + 1), position.x * scale, top + 15 * scale)
    context.restore()
  })
}

const drawRouteMarkersAtPoint = (
  context: CanvasRenderingContext2D,
  points: RoutePoint[],
  color: string,
  scale: number,
  toPoint: (point: LatLngLiteral) => L.Point
) => {
  const markerColor = safeHexColor(color)
  const markerPath = new Path2D(
    "M12.5 0.75C6.15 0.75 1 5.9 1 12.25C1 21.15 12.5 40.25 12.5 40.25C12.5 40.25 24 21.15 24 12.25C24 5.9 18.85 0.75 12.5 0.75Z"
  )

  points.forEach((point, index) => {
    const position = toPoint(point)
    const left = (position.x - 15) * scale
    const top = (position.y - 49) * scale

    context.save()
    context.translate(left, top)
    context.scale((30 / 25) * scale, (49 / 41) * scale)
    context.fillStyle = markerColor
    context.strokeStyle = "white"
    context.lineWidth = 1.5
    context.fill(markerPath)
    context.stroke(markerPath)
    context.fillStyle = "white"
    context.beginPath()
    context.arc(12.5, 12.25, 7.8, 0, Math.PI * 2)
    context.fill()
    context.restore()

    context.save()
    context.fillStyle = "#111827"
    context.font = `800 ${12 * scale}px sans-serif`
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(String(index + 1), position.x * scale, top + 15 * scale)
    context.restore()
  })
}

const tileUrlForPoint = (template: string, x: number, y: number, z: number) => {
  const invertedY = 2 ** z - y - 1

  return template
    .replace(/\{x}/g, String(x))
    .replace(/\{y}/g, String(y))
    .replace(/\{-y}/g, String(invertedY))
    .replace(/\{z}/g, String(z))
}

const loadTileImage = (url: string) => {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = url
  })
}

const metersPerPixelsAtZoom = (map: L.Map, zoom: number, pixels: number) => {
  const center = map.getCenter()
  const projected = map.project(center, zoom)
  const east = map.unproject(projected.add([pixels, 0]), zoom)

  return center.distanceTo(east)
}

export const zoomForScale = (map: L.Map, scaleMeters: number) => {
  const mapMinZoom = map.getMinZoom()
  const mapMaxZoom = map.getMaxZoom()
  const minZoom = Number.isFinite(mapMinZoom) ? mapMinZoom : 0
  const maxZoom = Number.isFinite(mapMaxZoom) && mapMaxZoom > minZoom ? mapMaxZoom : 19
  let bestZoom = map.getZoom()
  let bestDiff = Number.POSITIVE_INFINITY

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const diff = Math.abs(metersPerPixelsAtZoom(map, zoom, 100) - scaleMeters)
    if (diff < bestDiff) {
      bestDiff = diff
      bestZoom = zoom
    }
  }

  return bestZoom
}

const outCode = (point: L.Point, width: number, height: number) => {
  let code = 0
  if (point.x < 0) code |= 1
  if (point.x > width) code |= 2
  if (point.y < 0) code |= 4
  if (point.y > height) code |= 8

  return code
}

const lineIntersectsRect = (first: L.Point, second: L.Point, width: number, height: number) => {
  let x1 = first.x
  let y1 = first.y
  let x2 = second.x
  let y2 = second.y
  let code1 = outCode(first, width, height)
  let code2 = outCode(second, width, height)

  while (true) {
    if ((code1 | code2) === 0) return true
    if ((code1 & code2) !== 0) return false

    const code = code1 || code2
    let x = 0
    let y = 0

    if (code & 8) {
      x = x1 + ((x2 - x1) * (height - y1)) / (y2 - y1)
      y = height
    } else if (code & 4) {
      x = x1 + ((x2 - x1) * -y1) / (y2 - y1)
      y = 0
    } else if (code & 2) {
      y = y1 + ((y2 - y1) * (width - x1)) / (x2 - x1)
      x = width
    } else if (code & 1) {
      y = y1 + ((y2 - y1) * -x1) / (x2 - x1)
      x = 0
    }

    if (code === code1) {
      x1 = x
      y1 = y
      code1 = outCode(L.point(x1, y1), width, height)
    } else {
      x2 = x
      y2 = y
      code2 = outCode(L.point(x2, y2), width, height)
    }
  }
}

const routeHasVisiblePoint = (
  points: LatLngLiteral[],
  toPoint: (point: LatLngLiteral) => L.Point,
  width: number,
  height: number
) => {
  return points.some((point) => {
    const projected = toPoint(point)

    return projected.x >= 0 && projected.x <= width && projected.y >= 0 && projected.y <= height
  })
}

const routeHasVisibleLine = (
  lines: LatLngLiteral[][],
  toPoint: (point: LatLngLiteral) => L.Point,
  width: number,
  height: number
) => {
  return lines.some((line) => {
    for (let index = 1; index < line.length; index++) {
      if (lineIntersectsRect(toPoint(line[index - 1]), toPoint(line[index]), width, height)) {
        return true
      }
    }

    return false
  })
}

const isPointInsideRect = (point: L.Point, width: number, height: number, padding = 0) => {
  return (
    point.x >= padding &&
    point.x <= width - padding &&
    point.y >= padding &&
    point.y <= height - padding
  )
}

const routeFullyFitsRect = (
  points: RoutePoint[],
  lines: LatLngLiteral[][],
  toPoint: (point: LatLngLiteral) => L.Point,
  width: number,
  height: number
) => {
  const padding = 56
  const pointLocations = points.map(toPoint)
  const lineLocations = lines.flatMap((line) => line.map(toPoint))
  const allLocations = [...pointLocations, ...lineLocations]

  return allLocations.every((point) => isPointInsideRect(point, width, height, padding))
}

const routeLinesFromOptions = (options: ExportMapOptions) => {
  return [
    ...options.freeSegments,
    ...options.roadRoutes.flatMap((route) => [
      ...toGeoJsonLines(route.geoJson),
      ...route.connectorSegments
    ])
  ]
}

const routeVisibilityInRect = (
  options: ExportMapOptions,
  toPoint: (point: LatLngLiteral) => L.Point,
  width: number,
  height: number
): RouteExportVisibility => {
  if (options.routePoints.length === 0) return "full"

  const lines = routeLinesFromOptions(options)
  const hasVisibleRoute =
    routeHasVisiblePoint(options.routePoints, toPoint, width, height) ||
    routeHasVisibleLine(lines, toPoint, width, height)

  if (!hasVisibleRoute) return "none"

  return routeFullyFitsRect(options.routePoints, lines, toPoint, width, height) ? "full" : "partial"
}

export const routeVisibilityInViewExport = (map: L.Map, options: ExportMapOptions) => {
  if (options.routePoints.length === 0) return "full"

  const size = map.getSize()
  const toPoint = (point: LatLngLiteral) => map.latLngToContainerPoint(point)

  return routeVisibilityInRect(options, toPoint, size.x, size.y)
}

export const routeVisibilityInLargeExport = (
  map: L.Map,
  options: ExportMapOptions & { center?: LatLngLiteral; scaleMeters: number; size: number }
) => {
  if (options.routePoints.length === 0) return "full"

  const zoom = zoomForScale(map, options.scaleMeters)
  const centerPoint = map.project(options.center ?? map.getCenter(), zoom)
  const topLeft = centerPoint.subtract([options.size / 2, options.size / 2])
  const toPoint = (point: LatLngLiteral) => map.project(point, zoom).subtract(topLeft)

  return routeVisibilityInRect(options, toPoint, options.size, options.size)
}

export const exportMapCanvas = async (map: L.Map, options: ExportMapOptions) => {
  const container = map.getContainer()
  const mapBounds = container.getBoundingClientRect()
  const scale = window.devicePixelRatio || 1
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) throw new Error("Canvas context is not available.")

  canvas.width = Math.round(mapBounds.width * scale)
  canvas.height = Math.round(mapBounds.height * scale)
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)

  container
    .querySelectorAll<HTMLImageElement>(".leaflet-tile-pane img.leaflet-tile")
    .forEach((image) => drawImageElement(context, image, mapBounds, scale))

  container
    .querySelectorAll<HTMLImageElement>(".leaflet-pane:not(.leaflet-tile-pane) img.leaflet-tile")
    .forEach((image) => drawImageElement(context, image, mapBounds, scale))

  container
    .querySelectorAll<HTMLCanvasElement>(".leaflet-pane canvas")
    .forEach((source) => drawCanvasElement(context, source, mapBounds, scale))

  if (options.mapTone === "grayscale") applyMapTone(context, canvas.width, canvas.height)

  drawRoutes(context, map, { ...options, scale })

  if (options.showRouteMarkers) {
    drawRouteMarkers(context, map, options.routePoints, options.routeColor, scale)
  }

  return canvas
}

export const exportLargeMapCanvas = async (map: L.Map, options: LargeMapOptions) => {
  const zoom = zoomForScale(map, options.scaleMeters)
  const tileSize = 256
  const renderSize = options.renderSize ?? options.size
  const scale = renderSize / options.size
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) throw new Error("Canvas context is not available.")

  canvas.width = renderSize
  canvas.height = renderSize
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)

  const centerPoint = map.project(options.center ?? map.getCenter(), zoom)
  const topLeft = centerPoint.subtract([options.size / 2, options.size / 2])
  const minTileX = Math.floor(topLeft.x / tileSize)
  const minTileY = Math.floor(topLeft.y / tileSize)
  const maxTileX = Math.floor((topLeft.x + options.size) / tileSize)
  const maxTileY = Math.floor((topLeft.y + options.size) / tileSize)
  const tileCount = 2 ** zoom

  for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
    if (tileY < 0 || tileY >= tileCount) continue

    for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
      const wrappedTileX = ((tileX % tileCount) + tileCount) % tileCount
      const image = await loadTileImage(tileUrlForPoint(options.tileUrl, wrappedTileX, tileY, zoom))

      if (!image) continue

      context.drawImage(
        image,
        Math.round((tileX * tileSize - topLeft.x) * scale),
        Math.round((tileY * tileSize - topLeft.y) * scale),
        tileSize * scale,
        tileSize * scale
      )
    }
  }

  if (options.showTouristOverlay) {
    for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
      if (tileY < 0 || tileY >= tileCount) continue

      for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
        const wrappedTileX = ((tileX % tileCount) + tileCount) % tileCount
        const image = await loadTileImage(
          `/api/touristOverlay/${zoom}/${wrappedTileX}/${tileY}`
        )

        if (!image) continue

        context.drawImage(
          image,
          Math.round((tileX * tileSize - topLeft.x) * scale),
          Math.round((tileY * tileSize - topLeft.y) * scale),
          tileSize * scale,
          tileSize * scale
        )
      }
    }
  }

  if (options.mapTone === "grayscale") applyMapTone(context, canvas.width, canvas.height)

  const toPoint = (point: LatLngLiteral) => map.project(point, zoom).subtract(topLeft)

  drawRoutesAtPoint(context, { ...options, scale, toPoint })
  if (options.showRouteMarkers) {
    drawRouteMarkersAtPoint(context, options.routePoints, options.routeColor, scale, toPoint)
  }

  return canvas
}
