import { MapPin, Search } from "lucide-react"
import type { Dispatch, FormEvent, KeyboardEvent } from "react"
import { useEffect, useState } from "react"

import { MapMenu } from "@/components/maps/MapMenu"
import { RouteMenu } from "@/components/routes/RouteMenu"
import { Menubar } from "@/components/ui/menubar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { suggestPlaces, type PlaceSearchResult } from "@/lib/maps/geocoding"
import type { BaseMapSet, MapTone } from "@/lib/maps/mapMode"

export type RouteClickMode = "none" | "road" | "free"

type Props = {
  routeClickMode: RouteClickMode
  setRouteClickMode: Dispatch<RouteClickMode>
  routeLength: number
  routeColor: string
  setRouteColor: Dispatch<string>
  routeWidth: number
  setRouteWidth: Dispatch<number>
  routeDash: number
  setRouteDash: Dispatch<number>
  routeOpacity: number
  setRouteOpacity: Dispatch<number>
  showRouteMarkers: boolean
  setShowRouteMarkers: Dispatch<boolean>
  canSaveRoute: boolean
  baseMapSet: BaseMapSet
  setBaseMapSet: Dispatch<BaseMapSet>
  mapTone: MapTone
  setMapTone: Dispatch<MapTone>
  showTouristOverlay: boolean
  setShowTouristOverlay: Dispatch<boolean>
  onClearRoute?: () => void
  onRemoveLastRoutePoint?: () => void
  onSaveRoute?: () => void
  onLoadRoute?: (contents: string) => void
  onSaveImage?: () => void
  onSearchPlace?: (query: string) => void
  onSelectPlace?: (place: PlaceSearchResult) => void
}

const browseToggleItemClass =
  "rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-white data-[state=on]:text-blue-950 data-[state=on]:shadow-sm"
const roadToggleItemClass =
  "rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-amber-200 data-[state=on]:text-blue-950 data-[state=on]:shadow-sm"
const freeToggleItemClass =
  "rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-orange-300 data-[state=on]:text-blue-950 data-[state=on]:shadow-sm"

export const HeaderBar = (props: Props) => {
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string
  const [placeQuery, setPlaceQuery] = useState("")
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSearchResult[]>([])
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false)
  const [activePlaceSuggestionIndex, setActivePlaceSuggestionIndex] = useState(0)

  useEffect(() => {
    const query = placeQuery.trim()
    if (!apiKey || query.length < 2) {
      setPlaceSuggestions([])
      setShowPlaceSuggestions(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      suggestPlaces({ apiKey, query, signal: controller.signal })
        .then((suggestions) => {
          setPlaceSuggestions(suggestions)
          setActivePlaceSuggestionIndex(0)
          setShowPlaceSuggestions(suggestions.length > 0)
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return
          setPlaceSuggestions([])
          setShowPlaceSuggestions(false)
        })
    }, 220)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [apiKey, placeQuery])

  const handleSearchPlace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (showPlaceSuggestions && placeSuggestions[activePlaceSuggestionIndex]) {
      handleSelectPlace(placeSuggestions[activePlaceSuggestionIndex])
      return
    }

    setShowPlaceSuggestions(false)
    props.onSearchPlace?.(placeQuery)
  }

  const handleSelectPlace = (place: PlaceSearchResult) => {
    setPlaceQuery(place.name)
    setShowPlaceSuggestions(false)
    props.onSelectPlace?.(place)
  }

  const handlePlaceSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showPlaceSuggestions || !placeSuggestions.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActivePlaceSuggestionIndex((index) => (index + 1) % placeSuggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActivePlaceSuggestionIndex(
        (index) => (index - 1 + placeSuggestions.length) % placeSuggestions.length
      )
    } else if (event.key === "Escape") {
      setShowPlaceSuggestions(false)
    }
  }

  return (
    <header className="sticky top-0 z-[1000] w-full bg-blue-600 text-white shadow-[0_1px_7px_rgba(0,0,0,0.7)]">
      <div className="mx-auto max-w-screen-2xl px-3 py-2 sm:px-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            className="shrink-0 rounded-sm text-base font-semibold tracking-tight outline-offset-4 hover:text-blue-100 focus:outline-2 focus:outline-white sm:text-lg"
            onClick={() => window.location.reload()}
          >
            Trasovník
          </button>

          <form className="relative ml-auto shrink-0 sm:order-last" onSubmit={handleSearchPlace}>
            <label className="sr-only" htmlFor="place-search">
              Hledej místo
            </label>
            <div className="relative">
              <input
                id="place-search"
                className="h-9 w-40 rounded-md border border-white/25 bg-white py-1 pl-3 pr-9 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-500 focus:border-white focus:ring-2 focus:ring-white/45 sm:w-52 lg:w-72"
                type="search"
                value={placeQuery}
                placeholder="Hledej místo..."
                autoComplete="off"
                onBlur={() => window.setTimeout(() => setShowPlaceSuggestions(false), 120)}
                onChange={(event) => {
                  setPlaceQuery(event.target.value)
                  setShowPlaceSuggestions(true)
                }}
                onFocus={() => setShowPlaceSuggestions(placeSuggestions.length > 0)}
                onKeyDown={handlePlaceSearchKeyDown}
              />
              <Search className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            </div>

            {showPlaceSuggestions && placeSuggestions.length > 0 && (
              <div className="absolute right-0 top-full z-[1010] mt-1 w-80 overflow-hidden rounded-md bg-white text-slate-900 shadow-xl ring-1 ring-black/10">
                {placeSuggestions.map((place, index) => (
                  <button
                    key={`${place.name}-${place.label}-${place.location}-${place.position.lat}-${place.position.lng}`}
                    type="button"
                    className={`flex w-full items-start gap-3 px-3 py-2 text-left text-sm ${
                      index === activePlaceSuggestionIndex ? "bg-slate-100" : "bg-white"
                    } hover:bg-slate-100`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectPlace(place)}
                  >
                    <MapPin className="mt-0.5 size-5 shrink-0 text-slate-500" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{place.name}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {[place.label, place.location].filter(Boolean).join(", ")}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-5">
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
                routeDash={props.routeDash}
                setRouteDash={props.setRouteDash}
                routeOpacity={props.routeOpacity}
                setRouteOpacity={props.setRouteOpacity}
                showRouteMarkers={props.showRouteMarkers}
                setShowRouteMarkers={props.setShowRouteMarkers}
                canSaveRoute={props.canSaveRoute}
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
                onSaveImage={props.onSaveImage}
              />
            </Menubar>
          </div>
        </div>
      </div>
    </header>
  )
}
