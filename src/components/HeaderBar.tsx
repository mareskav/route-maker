import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type RouteClickMode = "none" | "road" | "free"

type Props = {
  routeClickMode: RouteClickMode
  setRouteClickMode: (mode: RouteClickMode) => void
  routeLength: number
  onClearRoute?: () => void
}

const toggleItemClass = (bgColor: string = "amber-300") => {
  return `rounded-lg px-3 text-white hover:bg-white/10 hover:text-white data-[state=on]:bg-${bgColor} data-[state=on]:text-blue-950 data-[state=on]:shadow-sm`
}

export const HeaderBar = (props: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-blue-800 text-white shadow-[0_1px_7px_rgba(0,0,0,0.7)]">
      <div className="mx-auto flex min-h-14 max-w-screen-2xl items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-10">
          <h1 className="shrink-0 text-base font-semibold tracking-tight sm:text-lg">Trasovník</h1>

          <div className="flex items-center gap-2">
            {/*<span className="hidden text-sm font-medium text-blue-100 sm:inline">Režim:</span>*/}

            <ToggleGroup
              type="single"
              value={props.routeClickMode}
              onValueChange={(value) => {
                if (value) props.setRouteClickMode(value as RouteClickMode)
              }}
              className="rounded-xl bg-blue-950/35 p-1 shadow-inner"
            >
              <ToggleGroupItem value="none" size="sm" className={toggleItemClass("white")}>
                Prohlížet
              </ToggleGroupItem>
              <ToggleGroupItem value="road" size="sm" className={toggleItemClass()}>
                Trasa po cestách
              </ToggleGroupItem>
              <ToggleGroupItem value="free" size="sm" className={toggleItemClass()}>
                Trasa volně
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center gap-1">
            <span className="hidden text-sm font-medium text-blue-100 sm:inline">
              Délka trasy: {props.routeLength} km
            </span>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={props.onClearRoute}
          className="shrink-0 font-semibold"
        >
          Smazat
        </Button>
      </div>
    </header>
  )
}
