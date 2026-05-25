import type L from "leaflet"
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
  DEFAULT_LARGE_EXPORT_SIZE,
  downloadCanvas,
  EXPORT_SCALE_OPTIONS,
  EXPORT_SIZE_OPTIONS,
  exportLargeMapCanvas,
  exportMapCanvas,
  routeVisibilityInLargeExport,
  routeVisibilityInViewExport,
  type ExportMode,
  zoomForScale
} from "@/lib/maps/mapExport"
import type { MapTone } from "@/lib/maps/mapMode"
import type { RoadRoute, RoutePoint } from "@/lib/routing/routeGeometry"

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

const EXPORT_SIZE_NAMES: Record<number, string> = {
  2000: "Rychlý náhled",
  3000: "Sdílení",
  5000: "Tisk",
  7000: "Velký tisk"
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
  const [largeSize, setLargeSize] = useState(DEFAULT_LARGE_EXPORT_SIZE)
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

  const exportCenter = useMemo<LatLngLiteral | undefined>(() => {
    const map = mapRef.current
    if (!map || mode !== "large") return undefined

    const zoom = zoomForScale(map, scaleMeters)
    const center = map.unproject(
      map.project(map.getCenter(), zoom).add([centerOffset.x, centerOffset.y]),
      zoom
    )

    return { lat: center.lat, lng: center.lng }
  }, [centerOffset.x, centerOffset.y, mapRef, mode, scaleMeters])

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
                <div className="mb-2 text-sm font-medium text-slate-700">Kvalita obrázku</div>
                <div className="grid grid-cols-2 gap-2">
                  {EXPORT_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.size}
                      type="button"
                      disabled={mode === "view"}
                      className={`rounded-md border px-3 py-2 text-left disabled:cursor-not-allowed ${largeSize === option.size && mode === "large" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`}
                      onClick={() => setLargeSize(option.size)}
                    >
                      <span className="block text-sm font-semibold">
                        {EXPORT_SIZE_NAMES[option.size] ?? option.label}
                      </span>
                      <span className="block text-xs text-slate-500">{option.label} px</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">Záběr velké mapy</div>
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
                        {formatMapDistance((largeSize / 100) * option.meters)} na šířku
                      </span>
                      <span className="block text-xs text-slate-500">
                        Detail mapy {option.label} / 100 px
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                {mode === "view"
                  ? "Uloží se přesně aktuální výřez mapy."
                  : `Výsledný obrázek pokryje přibližně ${formatMapDistance(largeMapWidthMeters)} x ${formatMapDistance(largeMapWidthMeters)} kolem zvoleného středu.`}
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
                      disabled={mode === "view"}
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
                      disabled={mode === "view"}
                      onClick={() => nudgeCenter(-CENTER_NUDGE_PIXELS, 0)}
                      aria-label="Posunout střed doleva"
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || !hasCenterOffset}
                      onClick={() => setCenterOffset({ x: 0, y: 0 })}
                      aria-label="Vrátit aktuální střed mapy"
                    >
                      <Crosshair className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view"}
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
                      disabled={mode === "view"}
                      onClick={() => nudgeCenter(0, CENTER_NUDGE_PIXELS)}
                      aria-label="Posunout střed dolů"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <div />
                  </div>
                  <div className="text-xs leading-5 text-slate-600">
                    {hasCenterOffset
                      ? "Náhled i export používají posunutý střed."
                      : "Výchozí je aktuální střed mapy."}
                  </div>
                </div>
              </div>

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
                {isGeneratingPreview ? (
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
              <Button type="button" onClick={handleSave} disabled={isSaving}>
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
