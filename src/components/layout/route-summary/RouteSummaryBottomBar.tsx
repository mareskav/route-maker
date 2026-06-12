import { ChevronDown, ChevronUp, Download, FileText, Route } from "lucide-react"
import type { ReactNode } from "react"

import { ElevationProfileChart } from "./ElevationProfileChart"
import { RouteMetrics } from "./RouteMetrics"
import type { RouteSegmentColumnVisibility } from "./routeSegmentColumns"
import { RouteSegmentsTable, type SegmentRow } from "./RouteSegmentsTable"

import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"
import type { ElevationProfile as Profile } from "@/lib/routing/elevation"

type DistanceMark = {
  label: string
  left: number
}

type Props = {
  ascentLabel: string
  descentLabel: string
  distanceMarks: DistanceMark[]
  durationLabel: string
  height: number
  isCollapsed: boolean
  language: Language
  lengthLabel: string
  onCollapsedChange: (isCollapsed: boolean) => void
  onExportProfilePng: () => void
  onExportSegmentsDoc: () => void
  onVisibleSegmentColumnsChange: (visibleColumns: RouteSegmentColumnVisibility) => void
  padding: number
  profile: Profile | null
  routeModeControls: ReactNode
  segmentRows: SegmentRow[]
  status: "idle" | "loading" | "error"
  visibleSegmentColumns: RouteSegmentColumnVisibility
  width: number
}

export const RouteSummaryBottomBar = ({
  ascentLabel,
  descentLabel,
  distanceMarks,
  durationLabel,
  height,
  isCollapsed,
  language,
  lengthLabel,
  onCollapsedChange,
  onExportProfilePng,
  onExportSegmentsDoc,
  onVisibleSegmentColumnsChange,
  padding,
  profile,
  routeModeControls,
  segmentRows,
  status,
  visibleSegmentColumns,
  width
}: Props) => {
  const t = translations[language].routeSummary
  const isElevationLoading = status === "loading"

  if (isCollapsed) {
    return (
      <aside className="absolute inset-x-0 bottom-0 z-460 border-t border-blue-500 bg-blue-600 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-2px_9px_rgba(15,23,42,0.3)]">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1.5 px-3 py-2 sm:min-h-11 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-1 sm:px-4 sm:py-1.5">
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 justify-self-start text-left text-sm font-semibold text-white hover:text-blue-100"
            onClick={() => onCollapsedChange(false)}
            aria-expanded="false"
          >
            <Route className="size-5 shrink-0" />
            <span className="truncate">{t.routeOverview}</span>
            <ChevronUp className="size-4 shrink-0 text-blue-100" />
          </button>

          <div className="justify-self-center">{routeModeControls}</div>

          <span className="col-span-2 grid min-w-0 grid-cols-4 items-center gap-1 rounded-lg bg-blue-950/20 px-2 py-1.5 text-xs font-semibold text-blue-50 sm:col-auto sm:flex sm:shrink-0 sm:justify-self-end sm:gap-5 sm:bg-transparent sm:p-0 sm:text-sm">
            <RouteMetrics
              ascentLabel={ascentLabel}
              compact
              descentLabel={descentLabel}
              durationLabel={durationLabel}
              isElevationLoading={isElevationLoading}
              lengthLabel={lengthLabel}
            />
          </span>
        </div>
      </aside>
    )
  }

  return (
    <aside className="absolute inset-x-0 bottom-0 z-460 border-t border-blue-500 bg-blue-600 text-white shadow-[0_-2px_12px_rgba(15,23,42,0.35)]">
      <div className="mx-auto max-w-screen-2xl px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-md px-1 py-1 text-left text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => onCollapsedChange(true)}
            aria-expanded="true"
          >
            <Route className="size-5 shrink-0" />
            <span>{t.routeOverview}</span>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-3 text-blue-100">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium hover:bg-white/10"
              onClick={() => onCollapsedChange(true)}
              aria-expanded="true"
            >
              <span className="hidden sm:inline">{t.collapse}</span>
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
                isElevationLoading={isElevationLoading}
                lengthLabel={lengthLabel}
              />
            </div>
            <div className="col-span-3 pt-1 md:col-span-1">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                {t.export}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-2 text-sm font-medium text-blue-950 shadow-sm ring-1 ring-white/30 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={onExportProfilePng}
                  disabled={!profile}
                >
                  <Download className="size-4" />
                  {t.profilePng}
                </button>
                <button
                  type="button"
                  className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-2 text-sm font-medium text-blue-950 shadow-sm ring-1 ring-white/30 hover:bg-blue-50"
                  onClick={onExportSegmentsDoc}
                >
                  <FileText className="size-4" />
                  {t.segmentsDoc}
                </button>
              </div>
            </div>
          </div>

          <ElevationProfileChart
            distanceMarks={distanceMarks}
            height={height}
            language={language}
            padding={padding}
            profile={profile}
            status={status}
            width={width}
          />

          <RouteSegmentsTable
            isElevationLoading={isElevationLoading}
            language={language}
            onVisibleColumnsChange={onVisibleSegmentColumnsChange}
            rows={segmentRows}
            visibleColumns={visibleSegmentColumns}
          />
        </div>

        <div className="absolute bottom-1.5 right-3 flex items-center gap-2 text-xs font-medium text-blue-100/90 sm:right-4">
          <span>{t.footer}</span>
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
