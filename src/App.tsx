import { useCallback, useEffect, useState } from "react"

import { HeaderBar, type RouteClickMode } from "@/components/layout/HeaderBar.tsx"
import { MapView } from "@/components/maps/MapView.tsx"
import type { Language } from "@/lib/i18n"
import { htmlLanguageCodes, languages } from "@/lib/i18n"
import type { PlaceSearchResult } from "@/lib/maps/geocoding"
import type { BaseMapSet, MapTone } from "@/lib/maps/mapMode"
import type { RouteType } from "@/lib/routing/routeTypes"

const IMAGE_EXPORT_PATH = "/obrazek"
const HOME_PATH = "/"

const normalizePath = (path: string) => path.replace(/\/+$/, "") || HOME_PATH

const isImageExportRoute = () =>
  typeof window !== "undefined" && normalizePath(window.location.pathname) === IMAGE_EXPORT_PATH

const initialLanguage = (): Language => {
  if (typeof window === "undefined") return "cs"

  const savedLanguage = window.localStorage.getItem("route-maker-language")

  return languages.includes(savedLanguage as Language) ? (savedLanguage as Language) : "cs"
}

const App = () => {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [routeClickMode, setRouteClickMode] = useState<RouteClickMode>("none")
  const [routeLength, setRouteLength] = useState<number>(0)
  const [routePointCount, setRoutePointCount] = useState(0)
  const [clearRouteSignal, setClearRouteSignal] = useState(0)
  const [removeLastRoutePointSignal, setRemoveLastRoutePointSignal] = useState(0)
  const [saveRouteSignal, setSaveRouteSignal] = useState(0)
  const [loadRouteRequest, setLoadRouteRequest] = useState<{ contents: string; id: number } | null>(
    null
  )
  const [saveImageSignal, setSaveImageSignal] = useState(() => (isImageExportRoute() ? 1 : 0))
  const [placeSearchRequest, setPlaceSearchRequest] = useState<{ query: string; id: number } | null>(
    null
  )
  const [selectedPlaceRequest, setSelectedPlaceRequest] = useState<{
    place: PlaceSearchResult
    id: number
  } | null>(null)
  const [routeColor, setRouteColor] = useState("#dc2626")
  const [routeWidth, setRouteWidth] = useState(5)
  const [routeDash, setRouteDash] = useState(0)
  const [routeOpacity, setRouteOpacity] = useState(1)
  const [showRouteMarkers, setShowRouteMarkers] = useState(true)
  const [routeType, setRouteType] = useState<RouteType>("foot_hiking")
  const [baseMapSet, setBaseMapSet] = useState<BaseMapSet>("outdoor")
  const [mapTone, setMapTone] = useState<MapTone>("color")
  const [showTouristOverlay, setShowTouristOverlay] = useState(true)

  useEffect(() => {
    document.documentElement.lang = htmlLanguageCodes[language]
    window.localStorage.setItem("route-maker-language", language)
  }, [language])

  const calculateRouteLength = useCallback((meters: number) => {
    setRouteLength(Math.round((meters / 1000) * 100) / 100)
  }, [])

  const clearRoute = useCallback(() => {
    setClearRouteSignal((signal) => signal + 1)
    setRouteLength(0)
  }, [])

  const openImageExport = useCallback(() => {
    if (!isImageExportRoute()) window.history.pushState(null, "", IMAGE_EXPORT_PATH)
    setSaveImageSignal((signal) => signal + 1)
  }, [])

  const handleImageExportOpenChange = useCallback((open: boolean) => {
    if (!open && isImageExportRoute()) window.history.replaceState(null, "", HOME_PATH)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeaderBar
        language={language}
        setLanguage={setLanguage}
        routeClickMode={routeClickMode}
        setRouteClickMode={setRouteClickMode}
        routeLength={routeLength}
        routeColor={routeColor}
        setRouteColor={setRouteColor}
        routeWidth={routeWidth}
        setRouteWidth={setRouteWidth}
        routeDash={routeDash}
        setRouteDash={setRouteDash}
        routeOpacity={routeOpacity}
        setRouteOpacity={setRouteOpacity}
        showRouteMarkers={showRouteMarkers}
        setShowRouteMarkers={setShowRouteMarkers}
        canSaveRoute={routePointCount > 0}
        baseMapSet={baseMapSet}
        setBaseMapSet={setBaseMapSet}
        mapTone={mapTone}
        setMapTone={setMapTone}
        showTouristOverlay={showTouristOverlay}
        setShowTouristOverlay={setShowTouristOverlay}
        onClearRoute={clearRoute}
        onRemoveLastRoutePoint={() => setRemoveLastRoutePointSignal((signal) => signal + 1)}
        onSaveRoute={() => setSaveRouteSignal((signal) => signal + 1)}
        onLoadRoute={(contents) =>
          setLoadRouteRequest((request) => ({ contents, id: (request?.id ?? 0) + 1 }))
        }
        onSaveImage={openImageExport}
        onSearchPlace={(query) =>
          setPlaceSearchRequest((request) => ({ query, id: (request?.id ?? 0) + 1 }))
        }
        onSelectPlace={(place) =>
          setSelectedPlaceRequest((request) => ({ place, id: (request?.id ?? 0) + 1 }))
        }
      />
      <div className="min-h-0 flex-1">
        <MapView
          language={language}
          routeClickMode={routeClickMode}
          clearRouteSignal={clearRouteSignal}
          removeLastRoutePointSignal={removeLastRoutePointSignal}
          saveRouteSignal={saveRouteSignal}
          loadRouteRequest={loadRouteRequest}
          saveImageSignal={saveImageSignal}
          placeSearchRequest={placeSearchRequest}
          selectedPlaceRequest={selectedPlaceRequest}
          routeColor={routeColor}
          routeWidth={routeWidth}
          routeDash={routeDash}
          routeOpacity={routeOpacity}
          routeType={routeType}
          setRouteType={setRouteType}
          showRouteMarkers={showRouteMarkers}
          baseMapSet={baseMapSet}
          mapTone={mapTone}
          showTouristOverlay={showTouristOverlay}
          onImageExportOpenChange={handleImageExportOpenChange}
          onRoutePointCountChange={setRoutePointCount}
          onRouteLengthMetersChange={calculateRouteLength}
        />
      </div>
    </div>
  )
}

export default App
