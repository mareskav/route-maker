import { areaPath, chartPath } from "./routeSummaryChart"
import { formatElevation } from "./routeSummaryFormat"

import { LoadingSpinner, SkeletonBlock } from "@/components/ui/loading"
import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"
import type { ElevationProfile as Profile } from "@/lib/routing/elevation"

type DistanceMark = {
  label: string
  left: number
}

type Props = {
  distanceMarks: DistanceMark[]
  height: number
  language: Language
  padding: number
  profile: Profile | null
  status: "idle" | "loading" | "error"
  width: number
}

const ElevationProfileSkeleton = ({ language }: { language: Language }) => {
  const t = translations[language].routeSummary

  return (
    <div className="relative h-[178px] overflow-hidden px-4 py-3">
      <SkeletonBlock className="absolute left-5 top-5 h-3 w-14 bg-slate-200" />
      <SkeletonBlock className="absolute right-5 top-10 h-3 w-12 bg-slate-200" />
      <div className="absolute inset-x-4 bottom-9 top-12">
        <div className="absolute left-1/3 top-0 h-full w-px bg-slate-200" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-slate-200" />
        <svg viewBox="0 0 320 112" className="loading-shimmer h-full w-full" aria-hidden="true">
          <path
            d="M0 90 C 36 72, 54 82, 86 58 S 148 28, 184 54 S 254 86, 320 42"
            fill="none"
            stroke="#cbd5e1"
            strokeLinecap="round"
            strokeWidth="7"
          />
          <path
            d="M0 112 L0 90 C 36 72, 54 82, 86 58 S 148 28, 184 54 S 254 86, 320 42 L320 112 Z"
            fill="#e2e8f0"
            opacity="0.7"
          />
        </svg>
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-black/5">
        <LoadingSpinner className="size-3.5 text-blue-700" />
        {t.loadingElevations}
      </div>
      <SkeletonBlock className="absolute bottom-4 left-1/3 h-3 w-12 -translate-x-1/2 bg-slate-200" />
      <SkeletonBlock className="absolute bottom-4 left-2/3 h-3 w-12 -translate-x-1/2 bg-slate-200" />
    </div>
  )
}

export const ElevationProfileChart = ({
  distanceMarks,
  height,
  language,
  padding,
  profile,
  status,
  width
}: Props) => {
  const t = translations[language].routeSummary

  return (
    <div className="h-52 overflow-hidden rounded-md bg-gradient-to-b from-white to-slate-50">
      <div className="px-3 pt-1.5 text-sm font-semibold text-slate-700">{t.profile}</div>
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
    ) : status === "loading" ? (
      <ElevationProfileSkeleton language={language} />
    ) : (
      <div className="grid h-[178px] place-items-center text-sm text-slate-500">
        {t.elevationUnavailable}
      </div>
    )}
    </div>
  )
}
