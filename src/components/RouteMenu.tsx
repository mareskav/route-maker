import { ChevronDown } from "lucide-react"
import type { Dispatch } from "react"
import { HexColorPicker } from "react-colorful"

import {
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "@/components/ui/menubar"

type Props = {
  routeColor: string
  setRouteColor: Dispatch<string>
  routeWidth: number
  setRouteWidth: Dispatch<number>
  routeOpacity: number
  setRouteOpacity: Dispatch<number>
  showRouteMarkers: boolean
  setShowRouteMarkers: Dispatch<boolean>
  onClearRoute?: () => void
  onRemoveLastRoutePoint?: () => void
  onSaveRoute?: () => void
  onLoadRoute?: () => void
}

const routeColors = [
  { label: "červená", value: "#dc2626" },
  { label: "modrá", value: "#2563eb" },
  { label: "zelená", value: "#16a34a" },
  { label: "oranžová", value: "#f97316" },
  { label: "žlutá", value: "#facc15" },
  { label: "fialová", value: "#7e22ce" }
]

export const RouteMenu = (props: Props) => {
  return (
    <MenubarMenu>
      <MenubarTrigger className="gap-1 rounded-sm px-3 py-2 text-base text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">
        Trasa <ChevronDown className="size-4" />
      </MenubarTrigger>
      <MenubarContent className="z-[2000] max-h-[calc(100vh-5rem)] w-[305px] overflow-y-auto p-0 text-base">
        <div className="space-y-2.5 px-5 pb-4" onKeyDown={(event) => event.stopPropagation()}>
          <MenubarLabel className="px-0 pt-3 pb-1 text-xs font-semibold uppercase text-slate-500">
            Vzhled trasy
          </MenubarLabel>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <span>Barva trasy:</span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-sm text-slate-700">
                {props.routeColor.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Základní barvy trasy">
              {routeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className="size-7 rounded-full border border-slate-300 shadow-sm outline-offset-2 focus:outline-2 focus:outline-blue-500"
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                  aria-label={color.label}
                  onClick={() => props.setRouteColor(color.value)}
                />
              ))}
            </div>

            <HexColorPicker
              color={props.routeColor}
              onChange={props.setRouteColor}
              className="route-color-picker"
            />
          </div>

          <label className="block space-y-2">
            <span>Šířka trasy:</span>
            <input
              type="range"
              min={2}
              max={12}
              value={props.routeWidth}
              onChange={(event) => props.setRouteWidth(Number(event.target.value))}
              className="w-full accent-blue-600"
            />
          </label>

          <label className="block space-y-2">
            <span>Viditelnost trasy: {Math.round(props.routeOpacity * 100)} %</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(props.routeOpacity * 100)}
              onChange={(event) => props.setRouteOpacity(Number(event.target.value) / 100)}
              className="w-full accent-blue-600"
            />
          </label>

          <MenubarSeparator className="-mx-5 my-1" />
          <MenubarLabel className="px-0 pt-2 pb-1 text-xs font-semibold uppercase text-slate-500">
            Zobrazení
          </MenubarLabel>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={!props.showRouteMarkers}
              onChange={(event) => props.setShowRouteMarkers(!event.target.checked)}
              className="size-4 accent-blue-600"
            />
            <span>Skrýt značky</span>
          </label>
        </div>

        <MenubarSeparator className="my-0" />
        <MenubarLabel className="px-5 pt-3 pb-1 text-xs font-semibold uppercase text-slate-500">
          Soubor
        </MenubarLabel>
        <MenubarItem className="px-5 py-2.5 text-base" onSelect={props.onLoadRoute}>
          Načíst trasu
        </MenubarItem>
        <MenubarItem className="px-5 py-2.5 text-base" onSelect={props.onSaveRoute}>
          Uložit trasu
        </MenubarItem>
        <MenubarSeparator className="my-0" />
        <MenubarLabel className="px-5 pt-3 pb-1 text-xs font-semibold uppercase text-slate-500">
          Akce
        </MenubarLabel>
        <MenubarItem className="px-5 py-2.5 text-base" onSelect={props.onClearRoute}>
          Vymazat trasu
        </MenubarItem>
        {/*<MenubarItem className="px-7 py-4 text-base" onSelect={props.onRemoveLastRoutePoint}>*/}
        {/*  Vymazat poslední bod trasy*/}
        {/*</MenubarItem>*/}
      </MenubarContent>
    </MenubarMenu>
  )
}
