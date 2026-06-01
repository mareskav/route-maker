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
import { LoadingSpinner, SkeletonBlock } from "@/components/ui/loading"
import type { Language } from "@/lib/i18n"
import { interpolate, translations } from "@/lib/i18n"
import {
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
import { type RoadRoute, type RoutePoint } from "@/lib/routing/routeGeometry"

type Props = {
  freeSegments: [LatLngLiteral, LatLngLiteral][]
  language: Language
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

const formatMapDistance = (meters: number) => {
  if (meters < 1000) return `${meters} m`

  const kilometers = meters / 1000

  return Number.isInteger(kilometers) ? `${kilometers} km` : `${kilometers.toFixed(1)} km`
}

const MapPreviewSkeleton = ({ language }: { language: Language }) => {
  const t = translations[language].exportDialog

  return (
    <div className="relative h-full w-full overflow-hidden bg-emerald-50">
      <SkeletonBlock className="absolute -left-10 top-5 h-36 w-52 rounded-[48%] bg-emerald-200/70" />
      <SkeletonBlock className="absolute right-8 top-8 h-28 w-44 rounded-[45%] bg-lime-200/70" />
      <SkeletonBlock className="absolute bottom-6 left-10 h-32 w-56 rounded-[50%] bg-green-200/70" />
      <SkeletonBlock className="absolute bottom-12 right-4 h-36 w-52 rounded-[48%] bg-emerald-200/60" />
      <div className="absolute -right-8 top-1/3 h-16 w-56 rotate-[-18deg] rounded-full bg-sky-100/80 shadow-inner" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 360" aria-hidden="true">
        <path
          d="M-20 270 C 95 215, 140 260, 232 194 S 390 102, 512 154 S 600 206, 668 118"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="28"
        />
        <path
          d="M-20 270 C 95 215, 140 260, 232 194 S 390 102, 512 154 S 600 206, 668 118"
          fill="none"
          stroke="#d6b982"
          strokeDasharray="18 18"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M44 78 C 82 58, 128 60, 162 88"
          fill="none"
          stroke="#86efac"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M448 282 C 492 246, 548 250, 590 286"
          fill="none"
          stroke="#86efac"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-black/5">
        <LoadingSpinner className="text-blue-700" />
        {t.previewLoading}
      </div>
    </div>
  )
}

export const MapImageExportDialog = ({
  freeSegments,
  language,
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
  const t = translations[language].exportDialog
  const [mode, setMode] = useState<ExportMode>("view")
  const [scaleMeters, setScaleMeters] = useState(EXPORT_SCALE_OPTIONS[2].meters)
  const [centerSize, setCenterSize] = useState(3000)
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

  const exportGeometry = useMemo(() => {
    const map = mapRef.current
    if (!map || mode !== "large") return { center: undefined, size: centerSize }

    const zoom = zoomForScale(map, scaleMeters)
    const manualCenter = map.unproject(
      map.project(map.getCenter(), zoom).add([centerOffset.x, centerOffset.y]),
      zoom
    )

    return {
      center: { lat: manualCenter.lat, lng: manualCenter.lng },
      size: centerSize
    }
  }, [centerOffset.x, centerOffset.y, centerSize, mapRef, mode, scaleMeters])

  const exportCenter = exportGeometry.center
  const largeSize = exportGeometry.size

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
      window.alert(t.mapLoadAlert)
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
      window.alert(t.saveFailed)
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
            <h2 className="text-lg font-semibold">{t.save}</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label={t.close}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[320px_1fr]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-5 md:border-r md:border-b-0">
            <div className="space-y-5">
              <div>
                <div className="mb-2 text-sm font-medium text-slate-700">{t.scope}</div>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border border-slate-300">
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm font-medium ${mode === "view" ? "bg-blue-600 text-white" : "bg-white text-slate-800 hover:bg-slate-50"}`}
                    onClick={() => setMode("view")}
                  >
                    {t.currentView}
                  </button>
                  <button
                    type="button"
                    className={`border-l border-slate-300 px-3 py-2 text-sm font-medium ${mode === "large" ? "bg-blue-600 text-white" : "bg-white text-slate-800 hover:bg-slate-50"}`}
                    onClick={() => setMode("large")}
                  >
                    {t.largeMap}
                  </button>
                </div>
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">{t.imageSize}</div>
                <div className="grid grid-cols-2 gap-2">
                  {EXPORT_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.size}
                      type="button"
                      disabled={mode === "view"}
                      className={`rounded-md border px-3 py-2 text-left disabled:cursor-not-allowed ${centerSize === option.size && mode === "large" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`}
                      onClick={() => setCenterSize(option.size)}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="block text-xs text-slate-500">{option.size} × {option.size} px</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">{t.mapScale}</div>
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
                        {t.scaleHints[option.meters as keyof typeof t.scaleHints] ??
                          t.scaleFallback}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                {mode === "view"
                  ? t.viewDescription
                  : interpolate(t.largeDescription, {
                      height: formatMapDistance(largeMapWidthMeters),
                      scale: formatMapDistance(scaleMeters),
                      size: largeSize,
                      width: formatMapDistance(largeMapWidthMeters)
                    })}
              </div>

              <div className={mode === "view" ? "opacity-45" : ""}>
                <div className="mb-2 text-sm font-medium text-slate-700">{t.centerTitle}</div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="grid w-28 grid-cols-3 gap-1">
                    <div />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view"}
                      onClick={() => nudgeCenter(0, -CENTER_NUDGE_PIXELS)}
                      aria-label={t.moveCenterUp}
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
                      aria-label={t.moveCenterLeft}
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view" || !hasCenterOffset}
                      onClick={() => setCenterOffset({ x: 0, y: 0 })}
                      aria-label={t.resetCenter}
                    >
                      <Crosshair className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={mode === "view"}
                      onClick={() => nudgeCenter(CENTER_NUDGE_PIXELS, 0)}
                      aria-label={t.moveCenterRight}
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
                      aria-label={t.moveCenterDown}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <div />
                  </div>
                  <div className="text-xs leading-5 text-slate-600">
                    {hasCenterOffset
                      ? t.centerMoved
                      : t.centerDefault}
                  </div>
                </div>
              </div>

              {routeVisibility !== "full" && (
                <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    {routeVisibility === "none" ? t.routeOutside : t.routePartiallyOutside}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden bg-slate-100">
            <div className="min-h-0 flex-1 p-3 sm:p-4">
              <div className="grid h-full min-h-[220px] place-items-center overflow-hidden rounded-md border border-slate-300 bg-white md:min-h-0">
                {isGeneratingPreview ? (
                  <MapPreviewSkeleton language={language} />
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={t.imageAlt}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-slate-500">{t.noPreview}</div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.close}
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <LoadingSpinner /> : <Download className="size-4" />}
                {isSaving ? t.saving : t.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
