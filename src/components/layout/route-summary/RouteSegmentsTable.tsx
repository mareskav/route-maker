import {
  ROUTE_SEGMENT_COLUMN_OPTIONS,
  type RouteSegmentColumnId,
  type RouteSegmentColumnVisibility
} from "./routeSegmentColumns"
import { formatDistance, formatDuration, formatElevation } from "./routeSummaryFormat"

import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"

export type SegmentRow = {
  durationSeconds: number
  elevation: {
    ascentMeters: number
    descentMeters: number
  }
  from: number
  lengthMeters: number
  to: number
}

type Props = {
  isElevationLoading?: boolean
  language: Language
  onVisibleColumnsChange: (visibleColumns: RouteSegmentColumnVisibility) => void
  rows: SegmentRow[]
  visibleColumns: RouteSegmentColumnVisibility
}

export const RouteSegmentsTable = ({
  isElevationLoading = false,
  language,
  onVisibleColumnsChange,
  rows,
  visibleColumns
}: Props) => {
  const t = translations[language].routeSummary
  const columnLabels = {
    ascent: t.ascent,
    descent: t.descent,
    distance: t.distance,
    duration: t.duration
  }

  const toggleColumn = (column: RouteSegmentColumnId) => {
    onVisibleColumnsChange({
      ...visibleColumns,
      [column]: !visibleColumns[column]
    })
  }

  return (
    <div className="h-52 min-h-0 overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-1.5">
        <div className="text-sm font-semibold text-slate-700">{t.segments}</div>
        <div className="flex flex-wrap justify-end gap-1.5 text-xs text-slate-600">
          {ROUTE_SEGMENT_COLUMN_OPTIONS.map((column) => (
            <label
              key={column.id}
              className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5"
            >
              <input
                type="checkbox"
                className="size-3 accent-blue-600"
                checked={visibleColumns[column.id]}
                onChange={() => toggleColumn(column.id)}
              />
              {columnLabels[column.id]}
            </label>
          ))}
        </div>
      </div>
      <div className="h-[178px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-2 py-2 text-left">{t.points}</th>
              {visibleColumns.distance && (
                <th className="px-2 py-2 text-right">{t.distance}</th>
              )}
              {visibleColumns.duration && <th className="px-2 py-2 text-right">{t.duration}</th>}
              {visibleColumns.ascent && <th className="px-2 py-2 text-right">{t.ascent}</th>}
              {visibleColumns.descent && <th className="px-2 py-2 text-right">{t.descent}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((segment) => (
              <tr key={`${segment.from}-${segment.to}`} className="text-slate-700">
                <td className="px-2 py-2 font-medium">
                  {segment.from} - {segment.to}
                </td>
                {visibleColumns.distance && (
                  <td className="px-2 py-2 text-right">
                    {formatDistance(segment.lengthMeters, language)}
                  </td>
                )}
                {visibleColumns.duration && (
                  <td className="px-2 py-2 text-right">
                    {formatDuration(segment.durationSeconds)}
                  </td>
                )}
                {visibleColumns.ascent && (
                  <td className="px-2 py-2 text-right">
                    {isElevationLoading ? (
                      <span className="loading-shimmer ml-auto block h-3.5 w-10 rounded bg-slate-200" />
                    ) : (
                      formatElevation(segment.elevation.ascentMeters)
                    )}
                  </td>
                )}
                {visibleColumns.descent && (
                  <td className="px-2 py-2 text-right">
                    {isElevationLoading ? (
                      <span className="loading-shimmer ml-auto block h-3.5 w-10 rounded bg-slate-200" />
                    ) : (
                      formatElevation(segment.elevation.descentMeters)
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
