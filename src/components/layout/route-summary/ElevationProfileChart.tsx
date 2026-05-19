import { areaPath, chartPath } from "./routeSummaryChart"
import { formatElevation } from "./routeSummaryFormat"

import type { ElevationProfile as Profile } from "@/lib/routing/elevation"

type DistanceMark = {
  label: string
  left: number
}

type Props = {
  distanceMarks: DistanceMark[]
  height: number
  padding: number
  profile: Profile | null
  status: "idle" | "loading" | "error"
  width: number
}

export const ElevationProfileChart = ({
  distanceMarks,
  height,
  padding,
  profile,
  status,
  width
}: Props) => (
  <div className="h-52 overflow-hidden rounded-md bg-gradient-to-b from-white to-slate-50">
    <div className="px-3 pt-1.5 text-sm font-semibold text-slate-700">Výškový profil</div>
    {profile ? (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[178px] w-full" role="img">
        <defs>
          <linearGradient id="elevation-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {distanceMarks.map((mark) => (
          <line
            key={mark.label}
            x1={mark.left}
            x2={mark.left}
            y1={padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath(profile, width, height, padding)} fill="url(#elevation-fill)" />
        <path
          d={chartPath(profile, width, height, padding)}
          fill="none"
          stroke="#9ca3af"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <text x={width / 2} y={17} textAnchor="middle" className="fill-slate-500 text-sm">
          {formatElevation(profile.maxElevation)}
        </text>
        <text x={width - padding} y={38} textAnchor="end" className="fill-slate-500 text-sm">
          {formatElevation(profile.minElevation)}
        </text>
        {distanceMarks.map((mark) => (
          <text
            key={`label-${mark.label}`}
            x={mark.left}
            y={height - 10}
            textAnchor="middle"
            className="fill-slate-500 text-sm"
          >
            {mark.label}
          </text>
        ))}
      </svg>
    ) : (
      <div className="grid h-[178px] place-items-center text-sm text-slate-500">
        {status === "loading" ? "Načítám výšky…" : "Výškový profil není dostupný."}
      </div>
    )}
  </div>
)
