import { Check, ChevronDown, HelpCircle, Search } from "lucide-react"
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react"
import type { Dispatch, KeyboardEvent } from "react"

import { PlaceSearch } from "@/components/layout/PlaceSearch"
import { MapMenu } from "@/components/maps/MapMenu"
import { RouteMenu } from "@/components/routes/RouteMenu"
import { Menubar } from "@/components/ui/menubar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { helpGuideButtonLabels } from "@/lib/helpGuideLabels"
import type { Language } from "@/lib/i18n"
import { languageFlagCountries, languageLabels, languages, translations } from "@/lib/i18n"
import type { PlaceSearchResult } from "@/lib/maps/geocoding"
import type { BaseMapSet, MapTone } from "@/lib/maps/mapMode"

export type RouteClickMode = "none" | "road" | "free"

const HelpGuideDialog = lazy(() =>
  import("@/components/layout/HelpGuideDialog").then((module) => ({
    default: module.HelpGuideDialog
  }))
)

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

const countryToFlagEmoji = (country: string) =>
  country
    .toUpperCase()
    .replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))

const FlagCluster = ({
  countries,
  className = ""
}: {
  countries: readonly string[]
  className?: string
}) => (
  <span className={`flex shrink-0 items-center overflow-visible ${className}`} aria-hidden="true">
    {countries.map((country) => (
      <span
        key={country}
        className="relative -ml-2 flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-slate-100 text-[9px] font-bold uppercase leading-none text-slate-500 shadow-[0_0_0_1px_rgba(15,23,42,0.18)] first:ml-0"
      >
        <span>{countryToFlagEmoji(country)}</span>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={`https://flagcdn.com/w40/${country}.png`}
          srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
          alt=""
          loading="eager"
          onError={(event) => {
            event.currentTarget.style.display = "none"
          }}
        />
      </span>
    ))}
  </span>
)

const LanguageOptionFlag = ({ country }: { country: string }) => (
  <span
    className="relative flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-slate-100 text-[8px] font-bold uppercase leading-none text-slate-500 shadow-[0_0_0_1px_rgba(15,23,42,0.18)]"
    aria-hidden="true"
  >
    {country.toUpperCase()}
    <img
      className="absolute inset-0 h-full w-full object-cover"
      src={`https://flagcdn.com/w40/${country}.png`}
      srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
      alt=""
      loading="eager"
      onError={(event) => {
        event.currentTarget.style.display = "none"
      }}
    />
  </span>
)

const normalizeLanguageSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()

const LanguageSelect = ({
  label,
  language,
  setLanguage
}: {
  label: string
  language: Language
  setLanguage: Dispatch<Language>
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = normalizeLanguageSearch(query)

    if (!normalizedQuery) return languages

    return languages.filter((option) =>
      normalizeLanguageSearch(`${languageLabels[option]} ${option}`).includes(normalizedQuery)
    )
  }, [query])

  useEffect(() => {
    if (!open) return

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())

    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }

    document.addEventListener("pointerdown", onPointerDown)

    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [open, query])

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    setOpen(false)
    setQuery("")
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) =>
        filteredLanguages.length ? Math.min(index + 1, filteredLanguages.length - 1) : 0
      )
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const nextLanguage = filteredLanguages[activeIndex]
      if (nextLanguage) selectLanguage(nextLanguage)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      setQuery("")
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex h-9 max-w-[12rem] items-center gap-1.5 rounded-lg bg-blue-950/35 px-2.5 text-sm font-semibold text-white shadow-inner outline-offset-2 hover:bg-blue-950/45 focus:outline-2 focus:outline-white data-[state=open]:bg-white data-[state=open]:text-blue-950"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        data-state={open ? "open" : "closed"}
        title={label}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        <FlagCluster countries={languageFlagCountries[language]} />
        <span className="hidden min-w-0 truncate sm:inline">{languageLabels[language]}</span>
        <span className="sm:hidden">{language.toUpperCase()}</span>
        <ChevronDown className="size-3.5 shrink-0 opacity-80" />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-[3100] mt-2 w-64 max-w-[calc(100vw-1rem)] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          <div className="flex h-9 items-center gap-2 rounded-sm border bg-background px-2 text-sm">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder={label}
              type="search"
            />
          </div>

          <div className="mt-1 max-h-72 overflow-y-auto" role="listbox" aria-label={label}>
            {filteredLanguages.map((option, index) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === language}
                className={`grid w-full grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none ${
                  index === activeIndex ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => selectLanguage(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <LanguageOptionFlag country={languageFlagCountries[option][0]} />
                <span className="min-w-0 truncate">{languageLabels[option]}</span>
                {option === language ? (
                  <Check className="size-4 justify-self-end text-blue-600" />
                ) : (
                  <span className="justify-self-end text-xs font-semibold text-muted-foreground">
                    {option.toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const HeaderBar = (props: Props) => {
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string
  const t = translations[props.language]
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const helpLabel = helpGuideButtonLabels[props.language]

  return (
    <header className="sticky top-0 z-[2500] w-full bg-blue-600 text-white shadow-[0_1px_7px_rgba(0,0,0,0.7)]">
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

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-6">
            <PlaceSearch
              apiKey={apiKey}
              language={props.language}
              onSearchPlace={props.onSearchPlace}
              onSelectPlace={props.onSelectPlace}
            />

            <LanguageSelect
              label={t.header.language}
              language={props.language}
              setLanguage={props.setLanguage}
            />

            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-blue-950/35 px-2.5 text-sm font-semibold text-white shadow-inner outline-offset-2 hover:bg-blue-950/45 focus:outline-2 focus:outline-white"
              onClick={() => setIsHelpOpen(true)}
              aria-label={helpLabel}
              title={helpLabel}
            >
              <HelpCircle className="size-4 shrink-0" />
              <span className="hidden sm:inline">{helpLabel}</span>
            </button>
          </div>
        </div>
      </div>
      {isHelpOpen ? (
        <Suspense fallback={null}>
          <HelpGuideDialog
            language={props.language}
            open={isHelpOpen}
            onOpenChange={setIsHelpOpen}
          />
        </Suspense>
      ) : null}
    </header>
  )
}
