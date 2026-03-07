import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type Props = {
  routingEnabled?: boolean
  setRoutingEnabled?: (enabled: boolean) => void
}

export const HeaderBar = (props: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-blue-800 text-white shadow-[0_1px_7px_rgba(0,0,0,0.7)]">
      <div className="mx-auto flex min-h-14 max-w-screen-2xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">Trasovník</h1>

        <div className="flex shrink-0 items-center gap-2">
          <Switch checked={props.routingEnabled} onCheckedChange={props.setRoutingEnabled}></Switch>

          {/*<Button size="sm" onClick={() => setRoutePoints([])}>*/}
          {/*  Smazat trasu*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  size="sm"*/}
          {/*  variant="secondary"*/}
          {/*  onClick={() => setRoutePoints((prev) => prev.slice(0, -1))}*/}
          {/*  disabled={routePoints.length === 0}*/}
          {/*>*/}
          {/*  Zpět*/}
          {/*</Button>*/}

          <Button size="sm" variant="default">
            Plánovat
          </Button>
          <Button size="sm" variant="secondary">
            Smazat
          </Button>
        </div>
      </div>
    </header>
  )
}
