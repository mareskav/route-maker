import { useCallback, useState } from "react"

import { HeaderBar, type RouteClickMode } from "@/components/HeaderBar.tsx"
import { MapView } from "@/components/MapView.tsx"
import type { BaseMapSet, MapTone } from "@/lib/mapMode"

const App = () => {
  const [routeClickMode, setRouteClickMode] = useState<RouteClickMode>("none")
  const [routeLength, setRouteLength] = useState<number>(0)
  const [clearRouteSignal, setClearRouteSignal] = useState(0)
  const [removeLastRoutePointSignal, setRemoveLastRoutePointSignal] = useState(0)
  const [saveRouteSignal, setSaveRouteSignal] = useState(0)
  const [loadRouteSignal, setLoadRouteSignal] = useState(0)
  const [routeColor, setRouteColor] = useState("#2563eb")
  const [routeWidth, setRouteWidth] = useState(5)
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
        routeOpacity={routeOpacity}
        setRouteOpacity={setRouteOpacity}
        showRouteMarkers={showRouteMarkers}
        setShowRouteMarkers={setShowRouteMarkers}
        baseMapSet={baseMapSet}
        setBaseMapSet={setBaseMapSet}
        mapTone={mapTone}
        setMapTone={setMapTone}
        showTouristOverlay={showTouristOverlay}
        setShowTouristOverlay={setShowTouristOverlay}
        onClearRoute={clearRoute}
        onRemoveLastRoutePoint={() => setRemoveLastRoutePointSignal((signal) => signal + 1)}
        onSaveRoute={() => setSaveRouteSignal((signal) => signal + 1)}
        onLoadRoute={() => setLoadRouteSignal((signal) => signal + 1)}
      />
      <div className="flex-1">
        <MapView
          routeClickMode={routeClickMode}
          clearRouteSignal={clearRouteSignal}
          removeLastRoutePointSignal={removeLastRoutePointSignal}
          saveRouteSignal={saveRouteSignal}
          loadRouteSignal={loadRouteSignal}
          routeColor={routeColor}
          routeWidth={routeWidth}
          routeOpacity={routeOpacity}
          showRouteMarkers={showRouteMarkers}
          baseMapSet={baseMapSet}
          mapTone={mapTone}
          showTouristOverlay={showTouristOverlay}
          onRouteLengthMetersChange={calculateRouteLength}
        />
      </div>
    </div>
  )
}

export default App
