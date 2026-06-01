import { ChevronDown } from "lucide-react"
import type { Dispatch } from "react"
import { useRef } from "react"
import { HexColorPicker } from "react-colorful"

import {
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "@/components/ui/menubar"
import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"

type Props = {
  language: Language
  routeColor: string
  setRouteColor: Dispatch<string>
  routeWidth: number
  setRouteWidth: Dispatch<number>
  routeDash: number
  setRouteDash: Dispatch<number>
  routeOpacity: number
  setRouteOpacity: Dispatch<number>
  showRouteMarkers: boolean
  setShowRouteMarkers: Dispatch<boolean>
  canSaveRoute: boolean
  onClearRoute?: () => void
  onRemoveLastRoutePoint?: () => void
  onSaveRoute?: () => void
  onLoadRoute?: (contents: string) => void
}

export const RouteMenu = (props: Props) => {
  const t = translations[props.language].routeMenu
  const routeFileInputRef = useRef<HTMLInputElement | null>(null)
  const routeColors = [
    { label: t.colors.red, value: "#dc2626" },
    { label: t.colors.blue, value: "#2563eb" },
    { label: t.colors.green, value: "#16a34a" },
    { label: t.colors.orange, value: "#f97316" },
    { label: t.colors.yellow, value: "#facc15" },
    { label: t.colors.purple, value: "#7e22ce" }
  ]

  const handleRouteFileChange = async () => {
    const file = routeFileInputRef.current?.files?.[0]
    if (!file) return

    props.onLoadRoute?.(await file.text())

    if (routeFileInputRef.current) routeFileInputRef.current.value = ""
  }

  return (
    <>
      <input
        ref={routeFileInputRef}
        type="file"
        accept=".gpx,application/gpx+xml,application/xml,text/xml"
        className="hidden"
        onChange={handleRouteFileChange}
      />
      <MenubarMenu>
        <MenubarTrigger className="gap-1 rounded-sm px-3 py-2 text-base text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">
          {t.route} <ChevronDown className="size-4" />
        </MenubarTrigger>
        <MenubarContent className="z-[2000] max-h-[calc(100vh-5rem)] w-[285px] overflow-y-auto p-0 text-sm">
          <div className="space-y-2 px-4 pb-3" onKeyDown={(event) => event.stopPropagation()}>
            <MenubarLabel className="px-0 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
              {t.appearance}
            </MenubarLabel>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span>{t.color}</span>
                <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-700">
                  {props.routeColor.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5" aria-label={t.basicColors}>
                {routeColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className="size-6 rounded-full border border-slate-300 shadow-sm outline-offset-2 focus:outline-2 focus:outline-blue-500"
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

            <label className="block space-y-1">
              <span>{t.width}:</span>
              <input
                type="range"
                min={2}
                max={12}
                value={props.routeWidth}
                onChange={(event) => props.setRouteWidth(Number(event.target.value))}
                className="w-full accent-blue-600"
              />
            </label>

            <label className="block space-y-1">
              <span>
                {t.dash}: {props.routeDash === 0 ? t.hidden : `${props.routeDash} %`}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={props.routeDash}
                onChange={(event) => props.setRouteDash(Number(event.target.value))}
                className="w-full accent-blue-600"
              />
            </label>

            <label className="block space-y-1">
              <span>{t.opacity}: {Math.round(props.routeOpacity * 100)} %</span>
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

            <MenubarSeparator className="-mx-4 my-0.5" />
            <MenubarLabel className="px-0 pt-1.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
              {t.display}
            </MenubarLabel>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={!props.showRouteMarkers}
                onChange={(event) => props.setShowRouteMarkers(!event.target.checked)}
                className="size-4 accent-blue-600"
              />
              <span>{t.hideMarkers}</span>
            </label>
          </div>

          <MenubarSeparator className="my-0" />
          <MenubarLabel className="px-4 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
            {t.file}
          </MenubarLabel>
          <MenubarItem
            className="px-4 py-2 text-sm"
            onSelect={() => routeFileInputRef.current?.click()}
          >
            {t.loadRoute}
          </MenubarItem>
          <MenubarItem
            className="px-4 py-2 text-sm"
            disabled={!props.canSaveRoute}
            onSelect={props.onSaveRoute}
          >
            {t.saveRoute}
          </MenubarItem>
          <MenubarSeparator className="my-0" />
          <MenubarLabel className="px-4 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
            {t.actions}
          </MenubarLabel>
          <MenubarItem className="px-4 py-2 text-sm" onSelect={props.onClearRoute}>
            {t.clearRoute}
          </MenubarItem>
          {/*<MenubarItem className="px-7 py-4 text-base" onSelect={props.onRemoveLastRoutePoint}>*/}
          {/*  Vymazat poslední bod trasy*/}
          {/*</MenubarItem>*/}
        </MenubarContent>
      </MenubarMenu>
    </>
  )
}
