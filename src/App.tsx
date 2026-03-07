import { MapView } from "@/components/MapView.tsx"
import { HeaderBar } from "@/components/HeaderBar.tsx"
import { useState } from "react"

const App = () => {
  const [routingEnabled, setRoutingEnabled] = useState(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeaderBar routingEnabled={routingEnabled} setRoutingEnabled={setRoutingEnabled} />
      <div className="flex-1">
        <MapView routingEnabled={routingEnabled} />
      </div>
    </div>
  )
}

export default App
