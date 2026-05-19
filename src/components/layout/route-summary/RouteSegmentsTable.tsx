import { useState } from "react"

import { formatDistance, formatDuration, formatElevation } from "./routeSummaryFormat"

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
  rows: SegmentRow[]
}

type ColumnId = "distance" | "duration" | "ascent" | "descent"

const COLUMN_OPTIONS: { id: ColumnId; label: string }[] = [
  { id: "distance", label: "Vzdálenost" },
  { id: "duration", label: "Čas" },
  { id: "ascent", label: "Nahoru" },
  { id: "descent", label: "Dolů" }
]

export const RouteSegmentsTable = ({ rows }: Props) => {
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnId, boolean>>({
    ascent: true,
    descent: true,
    distance: true,
    duration: true
  })

  const toggleColumn = (column: ColumnId) => {
    setVisibleColumns((current) => ({
      ...current,
      [column]: !current[column]
    }))
  }

  return (
    <div className="h-52 min-h-0 overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-1.5">
        <div className="text-sm font-semibold text-slate-700">Úseky mezi body</div>
        <div className="flex flex-wrap justify-end gap-1.5 text-xs text-slate-600">
          {COLUMN_OPTIONS.map((column) => (
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
              {column.label}
            </label>
          ))}
        </div>
      </div>
      <div className="h-[178px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-2 py-2 text-left">Body</th>
              {visibleColumns.distance && (
                <th className="px-2 py-2 text-right">Vzdálenost</th>
              )}
              {visibleColumns.duration && <th className="px-2 py-2 text-right">Čas</th>}
              {visibleColumns.ascent && <th className="px-2 py-2 text-right">Nahoru</th>}
              {visibleColumns.descent && <th className="px-2 py-2 text-right">Dolů</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((segment) => (
              <tr key={`${segment.from}-${segment.to}`} className="text-slate-700">
                <td className="px-2 py-2 font-medium">
                  {segment.from} - {segment.to}
                </td>
                {visibleColumns.distance && (
                  <td className="px-2 py-2 text-right">{formatDistance(segment.lengthMeters)}</td>
                )}
                {visibleColumns.duration && (
                  <td className="px-2 py-2 text-right">
                    {formatDuration(segment.durationSeconds)}
                  </td>
                )}
                {visibleColumns.ascent && (
                  <td className="px-2 py-2 text-right">
                    {formatElevation(segment.elevation.ascentMeters)}
                  </td>
                )}
                {visibleColumns.descent && (
                  <td className="px-2 py-2 text-right">
                    {formatElevation(segment.elevation.descentMeters)}
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
