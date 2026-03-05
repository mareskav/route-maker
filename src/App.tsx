import { MainMap } from "@/components/MainMap.tsx"
import { TopBar } from "@/components/TopBar"

const App = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex-1">
        <MainMap />
      </div>
    </div>
  )
}

export default App
