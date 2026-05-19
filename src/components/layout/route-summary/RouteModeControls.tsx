import { Bike, Car, Check, ChevronDown, Footprints } from "lucide-react"
import type { Dispatch } from "react"

import { ROUTE_TYPE_OPTIONS, type RouteType } from "@/lib/routing/routeTypes"

type ModeGroup = {
  icon: typeof Footprints
  label: string
  routeType: RouteType
}

const MODE_GROUPS: ModeGroup[] = [
  { routeType: "foot_hiking", label: "Pěšky", icon: Footprints },
  { routeType: "bike_mountain", label: "Kolo", icon: Bike },
  { routeType: "car_fast_traffic", label: "Auto", icon: Car }
]

type Props = {
  isOpen: boolean
  onOpenChange: Dispatch<boolean>
  onRouteTypeChange: (routeType: RouteType) => void
  routeType: RouteType
}

export const RouteModeControls = ({
  isOpen,
  onOpenChange,
  onRouteTypeChange,
  routeType
}: Props) => {
  const routeTypeLabel =
    ROUTE_TYPE_OPTIONS.find((option) => option.routeType === routeType)?.label ?? "Trasa"
  const visibleRouteTypeOptions = ROUTE_TYPE_OPTIONS.filter((option) => {
    if (routeType.startsWith("foot_")) return option.routeType.startsWith("foot_")
    if (routeType.startsWith("bike_")) return option.routeType.startsWith("bike_")
    if (routeType.startsWith("car_")) return option.routeType.startsWith("car_")

    return true
  })

  return (
    <div className="flex min-w-0 items-center overflow-visible rounded-lg border border-blue-400/25 bg-blue-950/35 p-0.5 shadow-inner">
      <div className="flex shrink-0 gap-0.5">
        {MODE_GROUPS.map((group) => {
          const Icon = group.icon
          const isActive =
            group.routeType.startsWith("foot_") === routeType.startsWith("foot_") ||
            group.routeType.startsWith("bike_") === routeType.startsWith("bike_") ||
            group.routeType.startsWith("car_") === routeType.startsWith("car_")

          return (
            <button
              key={group.routeType}
              type="button"
              className={`grid size-7 place-items-center rounded-md transition-colors ${
                isActive
                  ? "bg-amber-200 text-blue-950 shadow-sm"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => onRouteTypeChange(group.routeType)}
              aria-label={group.label}
              title={group.label}
            >
              <Icon className="size-4" />
            </button>
          )
        })}
      </div>

      <div className="relative ml-1 min-w-0">
        <button
          type="button"
          className="flex h-7 min-w-36 max-w-52 items-center justify-between gap-2 rounded-md bg-white px-2.5 text-sm font-medium text-blue-950 shadow-sm ring-1 ring-white/30 hover:bg-blue-50"
          onClick={() => onOpenChange(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate">{routeTypeLabel}</span>
          <ChevronDown className="size-3.5 shrink-0 text-blue-800" />
        </button>

        {isOpen && (
          <div
            className="absolute bottom-full left-0 z-[520] mb-2 w-60 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm shadow-xl"
            role="listbox"
          >
            {visibleRouteTypeOptions.map((option) => (
              <button
                key={option.routeType}
                type="button"
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left ${
                  option.routeType === routeType
                    ? "bg-blue-50 font-semibold text-blue-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => {
                  onRouteTypeChange(option.routeType)
                  onOpenChange(false)
                }}
                role="option"
                aria-selected={option.routeType === routeType}
              >
                <span>{option.label}</span>
                {option.routeType === routeType && <Check className="size-4 text-blue-700" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
