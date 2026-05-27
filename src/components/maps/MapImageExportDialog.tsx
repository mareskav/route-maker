import L from "leaflet"
import type { LatLngLiteral } from "leaflet"
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  Download,
  ImageDown,
  X
} from "lucide-react"
import type { RefObject } from "react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  downloadCanvas,
  EXPORT_SCALE_OPTIONS,
  exportLargeMapCanvas,
  exportMapCanvas,
  routeVisibilityInLargeExport,
  routeVisibilityInViewExport,
  type ExportMode,
  zoomForScale
} from "@/lib/maps/mapExport"
import type { MapTone } from "@/lib/maps/mapMode"
import { toGeoJsonLines, type RoadRoute, type RoutePoint } from "@/lib/routing/routeGeometry"

type Props = {
  freeSegments: [LatLngLiteral, LatLngLiteral][]
  mapRef: RefObject<L.Map | null>
  mapTone: MapTone
  onOpenChange: (open: boolean) => void
  open: boolean
  roadRoutes: RoadRoute[]
  routeColor: string
  routeDash: number
  routeOpacity: number
  routePoints: RoutePoint[]
  routeWidth: number
  showRouteMarkers: boolean
  showTouristOverlay: boolean
  tileUrl: string
}

const PREVIEW_SIZE = 900
const CENTER_NUDGE_PIXELS = 160
const CENTER_AREA_SIZE = 5000
const MAX_LARGE_EXPORT_SIZE = 9000
const ROUTE_PADDING_PIXELS = 240

type ExportAreaMode = "route" | "center" | "czechia"

const EXPORT_AREA_OPTIONS: { label: string; mode: ExportAreaMode }[] = [
  { label: "Celá trasa", mode: "route" },
  { label: "Okolí středu", mode: "center" },
  { label: "Celá ČR", mode: "czechia" }
]

const CZECHIA_BOUNDS = L.latLngBounds([
  [48.55, 12.09],
  [51.06, 18.86]
])

const EXPORT_SCALE_HINTS: Record<number, string> = {
  100: "ulice a lesní cesty",
  200: "detailní turistická mapa",
  300: "trasa s blízkým okolím",
  500: "města a krajina",
  1000: "širší oblast",
  2000: "region",
  5000: "velký přehled",
  10000: "stát a okolí"
}

const formatMapDistance = (meters: number) => {
  if (meters < 1000) return `${meters} m`

  const kilometers = meters / 1000

  return Number.isInteger(kilometers) ? `${kilometers} km` : `${kilometers.toFixed(1)} km`
}

export const MapImageExportDialog = ({
  freeSegments,
  mapRef,
  mapTone,
  onOpenChange,
  open,
  roadRoutes,
  routeColor,
  routeDash,
  routeOpacity,
  routePoints,
  routeWidth,
  showRouteMarkers,
  showTouristOverlay,
  tileUrl
}: Props) => {
  const [mode, setMode] = useState<ExportMode>("view")
  const [scaleMeters, setScaleMeters] = useState(EXPORT_SCALE_OPTIONS[1].meters)
  const [areaMode, setAreaMode] = useState<ExportAreaMode>("route")
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const exportOptions = useMemo(
    () => ({
      freeSegments,
      mapTone,
      roadRoutes,
      routeColor,
      routeDash,
      routeOpacity,
      routePoints,
      routeWidth,
      showRouteMarkers
    }),
    [
      freeSegments,
      mapTone,
      roadRoutes,
      routeColor,
      routeDash,
      routeOpacity,
      routePoints,
      routeWidth,
      showRouteMarkers
    ]
  )

  const routeBounds = useMemo(() => {
    const points: LatLngLiteral[] = [
      ...routePoints,
      ...freeSegments.flatMap((segment) => segment),
      ...roadRoutes.flatMap((route) => [
        ...toGeoJsonLines(route.geoJson).flat(),
        ...route.connectorSegments.flat()
      ])
    ]

    if (points.length === 0) return null

    return L.latLngBounds(points.map((point) => [point.lat, point.lng]))
  }, [freeSegments, roadRoutes, routePoints])

  const exportGeometry = useMemo(() => {
    const map = mapRef.current
    if (!map || mode !== "large") return { center: undefined, size: CENTER_AREA_SIZE }

    const zoom = zoomForScale(map, scaleMeters)
    const manualCenter = map.unproject(
      map.project(map.getCenter(), zoom).add([centerOffset.x, centerOffset.y]),
      zoom
    )

    if (areaMode === "center") {
      return {
        center: { lat: manualCenter.lat, lng: manualCenter.lng },
        size: CENTER_AREA_SIZE
      }
    }

    const bounds = areaMode === "czechia" ? CZECHIA_BOUNDS : routeBounds
    if (!bounds?.isValid()) {
      return {
        center: { lat: manualCenter.lat, lng: manualCenter.lng },
        size: CENTER_AREA_SIZE
      }
    }

    const northWest = map.project(bounds.getNorthWest(), zoom)
    const southEast = map.project(bounds.getSouthEast(), zoom)
    const projectedSize = Math.max(
      Math.abs(southEast.x - northWest.x),
      Math.abs(southEast.y - northWest.y)
    )
    const center = bounds.getCenter()

    return {
      center: { lat: center.lat, lng: center.lng },
      size: Math.ceil(projectedSize + ROUTE_PADDING_PIXELS)
    }
  }, [areaMode, centerOffset.x, centerOffset.y, mapRef, mode, routeBounds, scaleMeters])

  const exportCenter = exportGeometry.center
  const largeSize = exportGeometry.size
  const isExportTooLarge = mode === "large" && largeSize > MAX_LARGE_EXPORT_SIZE

  const routeVisibility = useMemo(() => {
    const map = mapRef.current
    if (!map) return "full"

    return mode === "view"
      ? routeVisibilityInViewExport(map, exportOptions)
      : routeVisibilityInLargeExport(map, {
          ...exportOptions,
          center: exportCenter,
          scaleMeters,
          size: largeSize
        })
  }, [exportCenter, exportOptions, largeSize, mapRef, mode, scaleMeters])

  useEffect(() => {
    if (open) setCenterOffset({ x: 0, y: 0 })
  }, [open])

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null)
      return
    }

    const map = mapRef.current
    if (!map) return
    if (isExportTooLarge) {
      setPreviewUrl(null)
      setIsGeneratingPreview(false)
      return
    }

    let cancelled = false
    setIsGeneratingPreview(true)

    ;(async () => {
      try {
        const canvas =
          mode === "view"
            ? await exportMapCanvas(map, exportOptions)
            : await exportLargeMapCanvas(map, {
                ...exportOptions,
                renderSize: PREVIEW_SIZE,
                scaleMeters,
                showTouristOverlay,
                size: largeSize,
                center: exportCenter,
                tileUrl
              })

        if (cancelled) return

        setPreviewUrl(canvas.toDataURL("image/png"))
      } catch (error) {
        console.error("Map image preview failed:", error)
        if (!cancelled) setPreviewUrl(null)
      } finally {
        if (!cancelled) setIsGeneratingPreview(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [
    exportCenter,
    exportOptions,
    largeSize,
    isExportTooLarge,
    mapRef,
    mode,
    open,
    scaleMeters,
    showTouristOverlay,
    tileUrl
  ])

  if (!open) return null

  const handleSave = async () => {
    const map = mapRef.current
    if (!map) {
      window.alert("Mapu se nepodařilo uložit, protože ještě není načtená.")
      return
    }
    if (isExportTooLarge) {
      window.alert("Výsledný obrázek by byl příliš velký. Zvolte menší rozsah nebo méně podrobné měřítko mapy.")
      return
    }

    setIsSaving(true)
    try {
      const canvas =
        mode === "view"
          ? await exportMapCanvas(map, exportOptions)
          : await exportLargeMapCanvas(map, {
              ...exportOptions,
              center: exportCenter,
              scaleMeters,
              showTouristOverlay,
              size: largeSize,
              tileUrl
            })

      downloadCanvas(canvas)
    } catch (error) {
      console.error("Map image export failed:", error)
      window.alert("Obrázek se nepodařilo uložit. Některá mapa nebo vrstva blokuje export.")
    } finally {
      setIsSaving(false)
    }
  }

  const nudgeCenter = (x: number, y: number) => {
    setCenterOffset((offset) => ({ x: offset.x + x, y: offset.y + y }))
  }

  const hasCenterOffset = centerOffset.x !== 0 || centerOffset.y !== 0
  const largeMapWidthMeters = (largeSize / 100) * scaleMeters

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/55 p-2 sm:p-4">
      <div className="flex h-[calc(100dvh-1rem)] max-h-[860px] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white text-slate-950 shadow-2xl sm:h-[calc(100dvh-2rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <ImageDown className="size-5 text-blue-700" />
            <h2 className="text-lg font-semibold">Uložit obrázek</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Zavřít"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[320px_1fr]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-5 md:border-r md:border-b-0">
            <div className="space-y-5">
              <div>
                <div className="mb-2 text-sm font-medium text-slate-700">Rozsah</div>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border border-slate-300">
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm font-medium ${mode === "view" ? "bg-blue-600 text-white" : "bg-white text-slate-800 hover:bg-slate-50"}`}
                    onClick={() => setMode("view")}
                  >
                    Aktuální výřez
                  </button>
                  <button
                    type="button"
                    className={`border-l border-slate-300 px-3 py-2 text-sm font-medium ${mode === "large" ? "bg-blue-600 text-white" : "bg-white text-slate-800 hover:bg-slate-50"}`}
                    onClick={() => setMode("large")}
                  >
                    Velká mapa
                  </button>
                </div>
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">Rozsah výsledku</div>
                <div className="grid grid-cols-1 gap-2">
                  {EXPORT_AREA_OPTIONS.map((option) => (
                    <button
                      key={option.mode}
                      type="button"
                      disabled={mode === "view"}
                      className={`rounded-md border px-3 py-2 text-left disabled:cursor-not-allowed ${areaMode === option.mode && mode === "large" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`}
                      onClick={() => setAreaMode(option.mode)}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">Měřítko mapy</div>
                <div className="grid grid-cols-2 gap-2">
                  {EXPORT_SCALE_OPTIONS.map((option) => (
                    <button
                      key={option.meters}
                      type="button"
                      disabled={mode === "view"}
                      className={`rounded-md border px-3 py-2 text-left disabled:cursor-not-allowed ${scaleMeters === option.meters && mode === "large" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`}
                      onClick={() => setScaleMeters(option.meters)}
                    >
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {EXPORT_SCALE_HINTS[option.meters] ?? "měřítko podkladu"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                {mode === "view"
                  ? "Uloží se přesně aktuální výřez mapy."
                  : `Uloží se ${formatMapDistance(largeMapWidthMeters)} x ${formatMapDistance(largeMapWidthMeters)} při měřítku ${formatMapDistance(scaleMeters)}. Výsledný PNG bude přibližně ${largeSize} x ${largeSize} px.`}
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">Střed velké mapy</div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="grid w-28 grid-cols-3 gap-1">
                    <div />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || areaMode !== "center"}
                      onClick={() => nudgeCenter(0, -CENTER_NUDGE_PIXELS)}
                      aria-label="Posunout střed nahoru"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <div />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || areaMode !== "center"}
                      onClick={() => nudgeCenter(-CENTER_NUDGE_PIXELS, 0)}
                      aria-label="Posunout střed doleva"
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || areaMode !== "center" || !hasCenterOffset}
                      onClick={() => setCenterOffset({ x: 0, y: 0 })}
                      aria-label="Vrátit aktuální střed mapy"
                    >
                      <Crosshair className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || areaMode !== "center"}
                      onClick={() => nudgeCenter(CENTER_NUDGE_PIXELS, 0)}
                      aria-label="Posunout střed doprava"
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                    <div />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || areaMode !== "center"}
                      onClick={() => nudgeCenter(0, CENTER_NUDGE_PIXELS)}
                      aria-label="Posunout střed dolů"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <div />
                  </div>
                  <div className="text-xs leading-5 text-slate-600">
                    {areaMode !== "center"
                      ? "Střed se určí podle zvoleného rozsahu."
                      : hasCenterOffset
                      ? "Náhled i export používají posunutý střed."
                      : "Výchozí je aktuální střed mapy."}
                  </div>
                </div>
              </div>

              {isExportTooLarge && (
                <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    Tato kombinace rozsahu a měřítka by vytvořila příliš velký obrázek. Zvolte
                    menší rozsah nebo hrubší měřítko mapy.
                  </div>
                </div>
              )}

              {routeVisibility !== "full" && (
                <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    {routeVisibility === "none"
                      ? "Trasa pravděpodobně nebude ve výsledném obrázku."
                      : "Část trasy bude pravděpodobně mimo výsledný obrázek."}{" "}
                    Posuňte mapu blíž k trase, zvolte větší obrázek nebo měřítko s větším
                    pokrytím.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden bg-slate-100">
            <div className="min-h-0 flex-1 p-3 sm:p-4">
              <div className="grid h-full min-h-[220px] place-items-center overflow-hidden rounded-md border border-slate-300 bg-white md:min-h-0">
                {isExportTooLarge ? (
                  <div className="px-4 text-center text-sm text-slate-500">
                    Náhled se nevytváří, protože by výsledný obrázek byl příliš velký.
                  </div>
                ) : isGeneratingPreview ? (
                  <div className="text-sm text-slate-500">Generuji náhled…</div>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Náhled exportu mapy"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-slate-500">Náhled není dostupný</div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Zavřít
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving || isExportTooLarge}>
                <Download className="size-4" />
                {isSaving ? "Ukládám…" : "Uložit obrázek"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
