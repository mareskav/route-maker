import { MapView } from "@/components/MapView.tsx"
import { HeaderBar, type RouteClickMode } from "@/components/HeaderBar.tsx"
import { useCallback, useState } from "react"

const App = () => {
  const [routeClickMode, setRouteClickMode] = useState<RouteClickMode>("none")
  const [routeLength, setRouteLength] = useState<number>(0)

  const calculateRouteLength = useCallback((meters: number) => {
    setRouteLength(Math.round(meters / 100) / 10)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeaderBar
        routeClickMode={routeClickMode}
        setRouteClickMode={setRouteClickMode}
        routeLength={routeLength}
      />
      <div className="flex-1">
        <MapView
          routeClickMode={routeClickMode}
          onRouteLengthMetersChange={calculateRouteLength}
        />
      </div>
    </div>
  )
}

export default App
