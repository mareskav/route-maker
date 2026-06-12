import type { LatLngLiteral } from "leaflet"
import { useEffect, useMemo, useState } from "react"

import { RouteModeControls } from "./route-summary/RouteModeControls"
import {
  DEFAULT_ROUTE_SEGMENT_COLUMN_VISIBILITY,
  ROUTE_SEGMENT_COLUMN_OPTIONS
} from "./route-summary/routeSegmentColumns"
import type { RouteSegmentColumnVisibility } from "./route-summary/routeSegmentColumns"
import { RouteSummaryBottomBar } from "./route-summary/RouteSummaryBottomBar"
import { areaPath, chartPath } from "./route-summary/routeSummaryChart"
import {
  downloadBlob,
  escapeHtml,
  formatDistance,
  formatDuration,
  formatElevation,
  formatTotalDistance,
  routeExportFilename
} from "./route-summary/routeSummaryFormat"

import type { Language } from "@/lib/i18n"
import { interpolate, translations } from "@/lib/i18n"
import { fetchElevationProfile, type ElevationProfile as Profile } from "@/lib/routing/elevation"
import type { RouteSegmentSummary } from "@/lib/routing/routeGeometry"
import type { RouteType } from "@/lib/routing/routeTypes"

type Props = {
  apiKey: string
  language: Language
  onRouteTypeChange: (routeType: RouteType) => void
  onCollapsedChange: (isCollapsed: boolean) => void
  routeDurationSeconds: number
  routeLengthMeters: number
  routeLines: LatLngLiteral[][]
  routeSegmentSummaries: RouteSegmentSummary[]
  routeType: RouteType
}

const elevationAtDistance = (profile: Profile, distanceMeters: number) => {
  const points = profile.points
  if (distanceMeters <= points[0].distanceMeters) return points[0].elevation

  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1]
    const point = points[index]
    if (point.distanceMeters < distanceMeters) continue

    const range = point.distanceMeters - previous.distanceMeters
    const ratio = range > 0 ? (distanceMeters - previous.distanceMeters) / range : 0

    return previous.elevation + (point.elevation - previous.elevation) * ratio
  }

  return points[points.length - 1].elevation
}

const calculateSegmentElevation = (profile: Profile, startMeters: number, endMeters: number) => {
  const elevations = [
    elevationAtDistance(profile, startMeters),
    ...profile.points
      .filter((point) => point.distanceMeters > startMeters && point.distanceMeters < endMeters)
      .map((point) => point.elevation),
    elevationAtDistance(profile, endMeters)
  ]
  let ascentMeters = 0
  let descentMeters = 0

  elevations.forEach((elevation, index) => {
    if (index === 0) return

    const diff = elevation - elevations[index - 1]
    if (Math.abs(diff) < 1) return
    if (diff > 0) ascentMeters += diff
    else descentMeters += Math.abs(diff)
  })

  return {
    ascentMeters: Math.round(ascentMeters),
    descentMeters: Math.round(descentMeters)
  }
}

export const RouteSummaryPanel = ({
  apiKey,
  language,
  onCollapsedChange,
  onRouteTypeChange,
  routeDurationSeconds,
  routeLengthMeters,
  routeLines,
  routeSegmentSummaries,
  routeType
}: Props) => {
  const t = translations[language].routeSummary
  const [profile, setProfile] = useState<Profile | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isRouteTypeMenuOpen, setIsRouteTypeMenuOpen] = useState(false)
  const [visibleSegmentColumns, setVisibleSegmentColumns] = useState<RouteSegmentColumnVisibility>(
    DEFAULT_ROUTE_SEGMENT_COLUMN_VISIBILITY
  )
  const routeKey = useMemo(
    () =>
      routeLines
        .flat()
        .map((point) => `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`)
        .join("|"),
    [routeLines]
  )

  useEffect(() => {
    onCollapsedChange(isCollapsed)
  }, [isCollapsed, onCollapsedChange])

  useEffect(() => {
    if (!apiKey || routeLines.length === 0) {
      setProfile(null)
      setStatus("idle")
      return
    }

    const controller = new AbortController()
    setProfile(null)
    setStatus("loading")

    fetchElevationProfile({ apiKey, lines: routeLines, signal: controller.signal })
      .then((profile) => {
        setProfile(profile)
        setStatus(profile ? "idle" : "error")
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Elevation profile error:", error)
        setProfile(null)
        setStatus("error")
      })

    return () => controller.abort()
  }, [apiKey, routeKey, routeLines])

  if (routeLines.length === 0) return null

  const width = 380
  const height = 176
  const padding = 22
  const distanceMarks = profile
    ? [0.33, 0.66].map((ratio) => ({
        left: padding + ratio * (width - padding * 2),
        label: formatDistance(profile.distanceMeters * ratio, language)
      }))
    : []
  const ascentLabel = profile ? formatElevation(profile.ascentMeters) : "--"
  const descentLabel = profile ? formatElevation(profile.descentMeters) : "--"
  const durationLabel = formatDuration(routeDurationSeconds)
  const lengthLabel = formatTotalDistance(routeLengthMeters, language)
  const segmentRows = routeSegmentSummaries.map((segment) => {
    const startMeters = routeSegmentSummaries
      .filter((candidate) => candidate.to <= segment.from)
      .reduce((length, candidate) => length + candidate.lengthMeters, 0)
    const endMeters = startMeters + segment.lengthMeters

    return {
      ...segment,
      elevation: profile
        ? calculateSegmentElevation(profile, startMeters, endMeters)
        : { ascentMeters: 0, descentMeters: 0 }
    }
  })

  const exportProfilePng = async () => {
    if (!profile) return

    const exportWidth = 960
    const exportHeight = 420
    const exportPadding = 64
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="32" y="44" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#1f2937">${escapeHtml(t.profile)}</text>
        <text x="32" y="76" font-family="Arial, sans-serif" font-size="15" fill="#475569">${escapeHtml(
          interpolate(t.imageProfileSummary, {
            ascent: ascentLabel,
            descent: descentLabel,
            duration: durationLabel,
            length: lengthLabel
          })
        )}</text>
        <defs>
          <linearGradient id="export-elevation-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#9ca3af" stop-opacity="0.34"/>
            <stop offset="100%" stop-color="#9ca3af" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <g transform="translate(0 88)">
          ${distanceMarks
            .map(
              (mark) =>
                `<line x1="${(mark.left / width) * exportWidth}" x2="${(mark.left / width) * exportWidth}" y1="${exportPadding}" y2="${exportHeight - 130}" stroke="#e5e7eb" stroke-width="2"/>`
            )
            .join("")}
          <path d="${areaPath(profile, exportWidth, exportHeight - 88, exportPadding)}" fill="url(#export-elevation-fill)"/>
          <path d="${chartPath(profile, exportWidth, exportHeight - 88, exportPadding)}" fill="none" stroke="#9ca3af" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="${exportWidth / 2}" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">${escapeHtml(formatElevation(profile.maxElevation))}</text>
          <text x="${exportWidth - exportPadding}" y="58" text-anchor="end" font-family="Arial, sans-serif" font-size="18" fill="#475569">${escapeHtml(formatElevation(profile.minElevation))}</text>
          ${distanceMarks
            .map(
              (mark) =>
                `<text x="${(mark.left / width) * exportWidth}" y="${exportHeight - 104}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">${escapeHtml(mark.label)}</text>`
            )
            .join("")}
        </g>
      </svg>`
    const image = new Image()
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = reject
      image.src = url
    })

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return

    canvas.width = exportWidth
    canvas.height = exportHeight
    context.drawImage(image, 0, 0)
    URL.revokeObjectURL(url)
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return
      downloadBlob(
        pngBlob,
        routeExportFilename(language === "cs" ? "vyskovy-profil" : "elevation-profile", "png")
      )
    }, "image/png")
  }

  const exportSegmentsDoc = () => {
    const activeColumns = ROUTE_SEGMENT_COLUMN_OPTIONS.filter(
      (column) => visibleSegmentColumns[column.id]
    )
    const rows = segmentRows
      .map(
        (segment) => `
          <tr>
            <td>${segment.from} - ${segment.to}</td>
            ${activeColumns
              .map((column) => {
                if (column.id === "distance") {
                  return `<td>${escapeHtml(formatDistance(segment.lengthMeters, language))}</td>`
                }
                if (column.id === "duration") {
                  return `<td>${escapeHtml(formatDuration(segment.durationSeconds))}</td>`
                }
                if (column.id === "ascent") {
                  return `<td>${escapeHtml(formatElevation(segment.elevation.ascentMeters))}</td>`
                }

                return `<td>${escapeHtml(formatElevation(segment.elevation.descentMeters))}</td>`
              })
              .join("")}
          </tr>`
      )
      .join("")
    const columnLabels = {
      ascent: t.ascent,
      descent: t.descent,
      distance: t.distance,
      duration: t.duration
    }
    const headings = activeColumns
      .map((column) => `<th>${escapeHtml(columnLabels[column.id])}</th>`)
      .join("")
    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escapeHtml(t.segmentsTitle)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1f2937; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; }
            th:first-child, td:first-child { text-align: left; }
            th { background: #eff6ff; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(t.segmentsTitle)}</h1>
          <p>${escapeHtml(
            interpolate(t.summaryLine, {
              ascent: ascentLabel,
              descent: descentLabel,
              duration: durationLabel,
              length: lengthLabel
            })
          )}</p>
          <table>
            <thead>
              <tr><th>${escapeHtml(t.points)}</th>${headings}</tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`

    downloadBlob(
      new Blob([html], { type: "application/msword;charset=utf-8" }),
      routeExportFilename(language === "cs" ? "useky-trasy" : "route-segments", "doc")
    )
  }

  const routeModeControls = (
    <RouteModeControls
      isOpen={isRouteTypeMenuOpen}
      onOpenChange={setIsRouteTypeMenuOpen}
      onRouteTypeChange={onRouteTypeChange}
      language={language}
      routeType={routeType}
    />
  )

  return (
    <RouteSummaryBottomBar
      ascentLabel={ascentLabel}
      descentLabel={descentLabel}
      distanceMarks={distanceMarks}
      durationLabel={durationLabel}
      height={height}
      isCollapsed={isCollapsed}
      language={language}
      lengthLabel={lengthLabel}
      onCollapsedChange={setIsCollapsed}
      onExportProfilePng={exportProfilePng}
      onExportSegmentsDoc={exportSegmentsDoc}
      onVisibleSegmentColumnsChange={setVisibleSegmentColumns}
      padding={padding}
      profile={profile}
      routeModeControls={routeModeControls}
      segmentRows={segmentRows}
      status={status}
      visibleSegmentColumns={visibleSegmentColumns}
      width={width}
    />
  )
}
