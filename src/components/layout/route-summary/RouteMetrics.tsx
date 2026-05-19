import { ArrowDownRight, ArrowUpRight, Clock, Route } from "lucide-react"

type Props = {
  ascentLabel: string
  descentLabel: string
  durationLabel: string
  lengthLabel: string
  compact?: boolean
}

export const RouteMetrics = ({
  ascentLabel,
  compact = false,
  descentLabel,
  durationLabel,
  lengthLabel
}: Props) => {
  const iconClass = compact ? "size-4 text-blue-100" : "size-5 text-blue-100"

  return (
    <>
      <span className="flex items-center gap-1">
        <Route className={iconClass} />
        {lengthLabel}
      </span>
      <span className="flex items-center gap-1">
        <Clock className={iconClass} />
        {durationLabel}
      </span>
      <span className="flex items-center gap-1">
        <ArrowUpRight className={iconClass} />
        {ascentLabel}
      </span>
      <span className="flex items-center gap-1">
        <ArrowDownRight className={iconClass} />
        {descentLabel}
      </span>
    </>
  )
}
