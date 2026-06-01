import { ChevronDown, Globe2 } from "lucide-react"
import type { Dispatch } from "react"

import { PlaceSearch } from "@/components/layout/PlaceSearch"
import { MapMenu } from "@/components/maps/MapMenu"
import { RouteMenu } from "@/components/routes/RouteMenu"
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Language } from "@/lib/i18n"
import { languageFlagCountries, languageLabels, languages, translations } from "@/lib/i18n"
import type { PlaceSearchResult } from "@/lib/maps/geocoding"
import type { BaseMapSet, MapTone } from "@/lib/maps/mapMode"

export type RouteClickMode = "none" | "road" | "free"

type Props = {
  language: Language
  setLanguage: Dispatch<Language>
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

const FlagCluster = ({
  countries,
  className = "",
}: {
  countries: readonly string[]
  className?: string
}) => (
  <span className={`flex shrink-0 items-center ${className}`} aria-hidden="true">
    {countries.map((country) => (
      <img
        key={country}
        className="-ml-2 h-4 w-6 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.18)] first:ml-0"
        src={`https://flagcdn.com/w40/${country}.png`}
        srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
        alt=""
        loading="lazy"
      />
    ))}
  </span>
)

export const HeaderBar = (props: Props) => {
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string
  const t = translations[props.language]

  return (
    <header className="sticky top-0 z-[1000] w-full bg-blue-600 text-white shadow-[0_1px_7px_rgba(0,0,0,0.7)]">
      <div className="mx-auto max-w-screen-2xl px-3 py-2 sm:px-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            className="shrink-0 rounded-sm text-base font-semibold tracking-tight outline-offset-4 hover:text-blue-100 focus:outline-2 focus:outline-white sm:text-lg"
            onClick={() => window.location.reload()}
          >
            {t.appName}
          </button>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-5">
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
                {t.header.browse}
              </ToggleGroupItem>
              <ToggleGroupItem value="road" size="sm" className={roadToggleItemClass}>
                {t.header.roadRoute}
              </ToggleGroupItem>
              <ToggleGroupItem value="free" size="sm" className={freeToggleItemClass}>
                {t.header.freeRoute}
              </ToggleGroupItem>
            </ToggleGroup>

            {/*<span className="shrink-0 text-sm font-medium text-blue-100">*/}
            {/*  Délka trasy: {props.routeLength} km*/}
            {/*</span>*/}

            <Menubar className="h-auto border-0 bg-transparent p-0 shadow-none">
              <RouteMenu
                language={props.language}
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
                language={props.language}
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

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <PlaceSearch
              apiKey={apiKey}
              language={props.language}
              onSearchPlace={props.onSearchPlace}
              onSelectPlace={props.onSelectPlace}
            />

            <Menubar className="h-auto border-0 bg-transparent p-0 shadow-none">
              <MenubarMenu>
                <MenubarTrigger
                  className="h-9 gap-1.5 rounded-lg bg-blue-950/35 px-2.5 text-sm font-semibold text-white shadow-inner hover:bg-blue-950/45 focus:bg-blue-950/45 focus:text-white data-[state=open]:bg-white data-[state=open]:text-blue-950"
                  aria-label={t.header.language}
                  title={t.header.language}
                >
                  <Globe2 className="hidden size-4 sm:block" />
                  <FlagCluster countries={languageFlagCountries[props.language]} />
                  <span className="hidden max-w-28 truncate sm:inline">
                    {languageLabels[props.language]}
                  </span>
                  <span className="sm:hidden">{props.language.toUpperCase()}</span>
                  <ChevronDown className="size-3.5 opacity-80" />
                </MenubarTrigger>
                <MenubarContent align="end" className="min-w-64">
                  <MenubarRadioGroup
                    value={props.language}
                    onValueChange={(value) => props.setLanguage(value as Language)}
                  >
                    {languages.map((language) => (
                      <MenubarRadioItem key={language} value={language} className="gap-3">
                        <FlagCluster
                          countries={languageFlagCountries[language]}
                          className="w-16"
                        />
                        <span className="min-w-0 flex-1 truncate">{languageLabels[language]}</span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {language.toUpperCase()}
                        </span>
                      </MenubarRadioItem>
                    ))}
                  </MenubarRadioGroup>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </header>
  )
}
