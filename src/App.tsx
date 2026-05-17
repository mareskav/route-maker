import { MapView } from "@/components/MapView.tsx"
import { HeaderBar, type RouteClickMode } from "@/components/HeaderBar.tsx"
import { useCallback, useState } from "react"

const App = () => {
  const [routeClickMode, setRouteClickMode] = useState<RouteClickMode>("none")
  const [routeLength, setRouteLength] = useState<number>(0)
  const [clearRouteSignal, setClearRouteSignal] = useState(0)

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
        onClearRoute={clearRoute}
      />
      <div className="flex-1">
        <MapView
          routeClickMode={routeClickMode}
          clearRouteSignal={clearRouteSignal}
          onRouteLengthMetersChange={calculateRouteLength}
        />
      </div>
    </div>
  )
}

export default App
