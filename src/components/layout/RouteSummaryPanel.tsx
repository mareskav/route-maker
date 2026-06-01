import type { LatLngLiteral } from "leaflet"
import { ChevronDown, ChevronUp, Download, FileText, Route } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { ElevationProfileChart } from "./route-summary/ElevationProfileChart"
import { RouteMetrics } from "./route-summary/RouteMetrics"
import { RouteModeControls } from "./route-summary/RouteModeControls"
import {
  DEFAULT_ROUTE_SEGMENT_COLUMN_VISIBILITY,
  ROUTE_SEGMENT_COLUMN_OPTIONS
} from "./route-summary/routeSegmentColumns"
import type { RouteSegmentColumnVisibility } from "./route-summary/routeSegmentColumns"
import { RouteSegmentsTable } from "./route-summary/RouteSegmentsTable"
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

import { fetchElevationProfile, type ElevationProfile as Profile } from "@/lib/routing/elevation"
import type { RouteSegmentSummary } from "@/lib/routing/routeGeometry"
import type { RouteType } from "@/lib/routing/routeTypes"

type Props = {
  apiKey: string
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
  onCollapsedChange,
  onRouteTypeChange,
  routeDurationSeconds,
  routeLengthMeters,
  routeLines,
  routeSegmentSummaries,
  routeType
}: Props) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isRouteTypeMenuOpen, setIsRouteTypeMenuOpen] = useState(false)
  const [visibleSegmentColumns, setVisibleSegmentColumns] =
    useState<RouteSegmentColumnVisibility>(DEFAULT_ROUTE_SEGMENT_COLUMN_VISIBILITY)
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
        label: formatDistance(profile.distanceMeters * ratio)
      }))
    : []
  const ascentLabel = profile ? formatElevation(profile.ascentMeters) : "--"
  const descentLabel = profile ? formatElevation(profile.descentMeters) : "--"
  const durationLabel = formatDuration(routeDurationSeconds)
  const lengthLabel = formatTotalDistance(routeLengthMeters)
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
        <text x="32" y="44" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#1f2937">Výškový profil</text>
        <text x="32" y="76" font-family="Arial, sans-serif" font-size="15" fill="#475569">Délka ${escapeHtml(lengthLabel)} · Čas ${escapeHtml(durationLabel)} · Nahoru ${escapeHtml(ascentLabel)} · Dolů ${escapeHtml(descentLabel)}</text>
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
      downloadBlob(pngBlob, routeExportFilename("vyskovy-profil", "png"))
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
                  return `<td>${escapeHtml(formatDistance(segment.lengthMeters))}</td>`
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
    const headings = activeColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")
    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Úseky trasy</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1f2937; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; }
            th:first-child, td:first-child { text-align: left; }
            th { background: #eff6ff; }
          </style>
        </head>
        <body>
          <h1>Úseky trasy</h1>
          <p>Délka: ${escapeHtml(lengthLabel)} · Čas: ${escapeHtml(durationLabel)} · Nahoru: ${escapeHtml(ascentLabel)} · Dolů: ${escapeHtml(descentLabel)}</p>
          <table>
            <thead>
              <tr><th>Body</th>${headings}</tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`

    downloadBlob(
      new Blob([html], { type: "application/msword;charset=utf-8" }),
      routeExportFilename("useky-trasy", "doc")
    )
  }

  const routeModeControls = (
    <RouteModeControls
      isOpen={isRouteTypeMenuOpen}
      onOpenChange={setIsRouteTypeMenuOpen}
      onRouteTypeChange={onRouteTypeChange}
      routeType={routeType}
    />
  )

  if (isCollapsed) {
    return (
      <aside className="absolute inset-x-0 bottom-0 z-[460] border-t border-blue-500 bg-blue-600 text-white shadow-[0_-2px_9px_rgba(15,23,42,0.3)]">
        <div className="mx-auto grid min-h-11 max-w-screen-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 px-3 py-1.5 sm:px-4">
          <button
            type="button"
            className="flex min-w-0 justify-self-start items-center gap-2 text-left text-sm font-semibold text-white hover:text-blue-100"
            onClick={() => setIsCollapsed(false)}
            aria-expanded="false"
          >
            <Route className="size-5 shrink-0" />
            <span className="truncate">Přehled trasy</span>
            <ChevronUp className="size-4 shrink-0 text-blue-100" />
          </button>

          <div className="justify-self-center">{routeModeControls}</div>

          <span className="flex shrink-0 items-center gap-3 justify-self-end text-sm font-semibold text-blue-50 sm:gap-5">
            <RouteMetrics
              ascentLabel={ascentLabel}
              compact
              descentLabel={descentLabel}
              durationLabel={durationLabel}
              isElevationLoading={status === "loading"}
              lengthLabel={lengthLabel}
            />
          </span>
        </div>
      </aside>
    )
  }

  return (
    <aside className="absolute inset-x-0 bottom-0 z-[460] border-t border-blue-500 bg-blue-600 text-white shadow-[0_-2px_12px_rgba(15,23,42,0.35)]">
      <div className="mx-auto max-w-screen-2xl px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-md px-1 py-1 text-left text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => setIsCollapsed(true)}
            aria-expanded="true"
          >
            <Route className="size-5 shrink-0" />
            <span>Přehled trasy</span>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-3 text-blue-100">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium hover:bg-white/10"
              onClick={() => setIsCollapsed(true)}
              aria-expanded="true"
            >
              <span className="hidden sm:inline">Kliknutím sbalit</span>
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 grid gap-3 md:grid-cols-[260px_minmax(0,520px)_1fr] md:items-start">
          <div className="grid grid-cols-3 gap-2 text-sm md:grid-cols-1">
            <div className="col-span-3 md:col-span-1">{routeModeControls}</div>
            <div className="contents font-semibold text-blue-50 md:block md:space-y-2">
              <RouteMetrics
                ascentLabel={ascentLabel}
                descentLabel={descentLabel}
                durationLabel={durationLabel}
                isElevationLoading={status === "loading"}
                lengthLabel={lengthLabel}
              />
            </div>
            <div className="col-span-3 pt-1 md:col-span-1">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                Export
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-2 text-sm font-medium text-blue-950 shadow-sm ring-1 ring-white/30 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={exportProfilePng}
                  disabled={!profile}
                >
                  <Download className="size-4" />
                  Profil PNG
                </button>
                <button
                  type="button"
                  className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-2 text-sm font-medium text-blue-950 shadow-sm ring-1 ring-white/30 hover:bg-blue-50"
                  onClick={exportSegmentsDoc}
                >
                  <FileText className="size-4" />
                  Tabulka DOC
                </button>
              </div>
            </div>
          </div>

          <ElevationProfileChart
            distanceMarks={distanceMarks}
            height={height}
            padding={padding}
            profile={profile}
            status={status}
            width={width}
          />

          <RouteSegmentsTable
            isElevationLoading={status === "loading"}
            onVisibleColumnsChange={setVisibleSegmentColumns}
            rows={segmentRows}
            visibleColumns={visibleSegmentColumns}
          />
        </div>

        <div className="absolute bottom-1.5 right-3 flex items-center gap-2 text-xs font-medium text-blue-100/90 sm:right-4">
          <span>Udělal Vašek M. pro Michal K.</span>
          <a
            href="https://github.com/mareskav/route-maker"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline-offset-2 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </aside>
  )
}
