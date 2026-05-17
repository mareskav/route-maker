import type { Dispatch } from "react"

import { MapMenu } from "@/components/MapMenu"
import { RouteMenu } from "@/components/RouteMenu"
import { Menubar } from "@/components/ui/menubar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { BaseMapSet, MapTone } from "@/lib/mapMode"

export type RouteClickMode = "none" | "road" | "free"

type Props = {
  routeClickMode: RouteClickMode
  setRouteClickMode: Dispatch<RouteClickMode>
  routeLength: number
  routeColor: string
  setRouteColor: Dispatch<string>
  routeWidth: number
  setRouteWidth: Dispatch<number>
  routeOpacity: number
  setRouteOpacity: Dispatch<number>
  showRouteMarkers: boolean
  setShowRouteMarkers: Dispatch<boolean>
  baseMapSet: BaseMapSet
  setBaseMapSet: Dispatch<BaseMapSet>
  mapTone: MapTone
  setMapTone: Dispatch<MapTone>
  showTouristOverlay: boolean
  setShowTouristOverlay: Dispatch<boolean>
  onClearRoute?: () => void
  onRemoveLastRoutePoint?: () => void
  onSaveRoute?: () => void
  onLoadRoute?: () => void
}

const browseToggleItemClass =
  "rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-white data-[state=on]:text-blue-950 data-[state=on]:shadow-sm"
const roadToggleItemClass =
  "rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-amber-200 data-[state=on]:text-blue-950 data-[state=on]:shadow-sm"
const freeToggleItemClass =
  "rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-orange-300 data-[state=on]:text-blue-950 data-[state=on]:shadow-sm"

export const HeaderBar = (props: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-blue-600 text-white shadow-[0_1px_7px_rgba(0,0,0,0.7)]">
      <div className="mx-auto flex min-h-14 max-w-screen-2xl items-center gap-3 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-5">
          <button
            type="button"
            className="shrink-0 rounded-sm text-base font-semibold tracking-tight outline-offset-4 hover:text-blue-100 focus:outline-2 focus:outline-white sm:text-lg"
            onClick={() => window.location.reload()}
          >
            Trasovník
          </button>

          <ToggleGroup
            type="single"
            value={props.routeClickMode}
            onValueChange={(value) => {
              if (value) props.setRouteClickMode(value as RouteClickMode)
            }}
            spacing={1}
            className="rounded-xl bg-blue-950/35 p-1 shadow-inner"
          >
            <ToggleGroupItem value="none" size="sm" className={browseToggleItemClass}>
              Prohlížet
            </ToggleGroupItem>
            <ToggleGroupItem value="road" size="sm" className={roadToggleItemClass}>
              Trasa po cestách
            </ToggleGroupItem>
            <ToggleGroupItem value="free" size="sm" className={freeToggleItemClass}>
              Trasa volně
            </ToggleGroupItem>
          </ToggleGroup>

          <span className="shrink-0 text-sm font-medium text-blue-100">
            Délka trasy: {props.routeLength} km
          </span>

          <Menubar className="h-auto border-0 bg-transparent p-0 shadow-none">
            <RouteMenu
              routeColor={props.routeColor}
              setRouteColor={props.setRouteColor}
              routeWidth={props.routeWidth}
              setRouteWidth={props.setRouteWidth}
              routeOpacity={props.routeOpacity}
              setRouteOpacity={props.setRouteOpacity}
              showRouteMarkers={props.showRouteMarkers}
              setShowRouteMarkers={props.setShowRouteMarkers}
              onClearRoute={props.onClearRoute}
              onRemoveLastRoutePoint={props.onRemoveLastRoutePoint}
              onSaveRoute={props.onSaveRoute}
              onLoadRoute={props.onLoadRoute}
            />
            <MapMenu
              baseMapSet={props.baseMapSet}
              setBaseMapSet={props.setBaseMapSet}
              mapTone={props.mapTone}
              setMapTone={props.setMapTone}
              showTouristOverlay={props.showTouristOverlay}
              setShowTouristOverlay={props.setShowTouristOverlay}
            />
          </Menubar>
        </div>
      </div>
    </header>
  )
}
