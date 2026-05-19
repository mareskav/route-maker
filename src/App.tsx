import { useCallback, useState } from "react"

import { HeaderBar, type RouteClickMode } from "@/components/HeaderBar.tsx"
import { MapView } from "@/components/MapView.tsx"
import type { BaseMapSet, MapTone } from "@/lib/mapMode"

const App = () => {
  const [routeClickMode, setRouteClickMode] = useState<RouteClickMode>("none")
  const [routeLength, setRouteLength] = useState<number>(0)
  const [routePointCount, setRoutePointCount] = useState(0)
  const [clearRouteSignal, setClearRouteSignal] = useState(0)
  const [removeLastRoutePointSignal, setRemoveLastRoutePointSignal] = useState(0)
  const [saveRouteSignal, setSaveRouteSignal] = useState(0)
  const [loadRouteRequest, setLoadRouteRequest] = useState<{ contents: string; id: number } | null>(
    null
  )
  const [saveImageSignal, setSaveImageSignal] = useState(0)
  const [routeColor, setRouteColor] = useState("#dc2626")
  const [routeWidth, setRouteWidth] = useState(5)
  const [routeDash, setRouteDash] = useState(0)
  const [routeOpacity, setRouteOpacity] = useState(1)
  const [showRouteMarkers, setShowRouteMarkers] = useState(true)
  const [baseMapSet, setBaseMapSet] = useState<BaseMapSet>("outdoor")
  const [mapTone, setMapTone] = useState<MapTone>("color")
  const [showTouristOverlay, setShowTouristOverlay] = useState(true)

  const calculateRouteLength = useCallback((meters: number) => {
    setRouteLength(Math.round((meters / 1000) * 100) / 100)
  }, [])

  const clearRoute = useCallback(() => {
    setClearRouteSignal((signal) => signal + 1)
    setRouteLength(0)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeaderBar
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
        onSaveImage={() => setSaveImageSignal((signal) => signal + 1)}
      />
      <div className="flex-1">
        <MapView
          routeClickMode={routeClickMode}
          clearRouteSignal={clearRouteSignal}
          removeLastRoutePointSignal={removeLastRoutePointSignal}
          saveRouteSignal={saveRouteSignal}
          loadRouteRequest={loadRouteRequest}
          saveImageSignal={saveImageSignal}
          routeColor={routeColor}
          routeWidth={routeWidth}
          routeDash={routeDash}
          routeOpacity={routeOpacity}
          showRouteMarkers={showRouteMarkers}
          baseMapSet={baseMapSet}
          mapTone={mapTone}
          showTouristOverlay={showTouristOverlay}
          onRoutePointCountChange={setRoutePointCount}
          onRouteLengthMetersChange={calculateRouteLength}
        />
      </div>
    </div>
  )
}

export default App
