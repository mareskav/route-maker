import { ArrowDownRight, ArrowUpRight, Clock, Route } from "lucide-react"

type Props = {
  ascentLabel: string
  descentLabel: string
  durationLabel: string
  lengthLabel: string
  compact?: boolean
  isElevationLoading?: boolean
}

export const RouteMetrics = ({
  ascentLabel,
  compact = false,
  descentLabel,
  durationLabel,
  isElevationLoading = false,
  lengthLabel
}: Props) => {
  const iconClass = compact ? "size-4 text-blue-100" : "size-5 text-blue-100"
  const skeletonClass = compact ? "h-3 w-8" : "h-3.5 w-10"
  const metricClass = compact
    ? "flex min-w-0 items-center justify-center gap-1 whitespace-nowrap sm:justify-start"
    : "flex min-w-0 items-center gap-1 whitespace-nowrap"

  return (
    <>
      <span className={metricClass}>
        <Route className={iconClass} />
        {lengthLabel}
      </span>
      <span className={metricClass}>
        <Clock className={iconClass} />
        {durationLabel}
      </span>
      <span className={metricClass}>
        <ArrowUpRight className={iconClass} />
        {isElevationLoading ? (
          <span className={`loading-shimmer rounded bg-blue-200/70 ${skeletonClass}`} />
        ) : (
          ascentLabel
        )}
      </span>
      <span className={metricClass}>
        <ArrowDownRight className={iconClass} />
        {isElevationLoading ? (
          <span className={`loading-shimmer rounded bg-blue-200/70 ${skeletonClass}`} />
        ) : (
          descentLabel
        )}
      </span>
    </>
  )
}
