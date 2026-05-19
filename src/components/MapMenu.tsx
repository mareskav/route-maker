import { ChevronDown } from "lucide-react"
import type { Dispatch } from "react"

import {
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger
} from "@/components/ui/menubar"
import type { BaseMapSet, MapTone } from "@/lib/mapMode"

type Props = {
  baseMapSet: BaseMapSet
  setBaseMapSet: Dispatch<BaseMapSet>
  mapTone: MapTone
  setMapTone: Dispatch<MapTone>
  showTouristOverlay: boolean
  setShowTouristOverlay: Dispatch<boolean>
  onSaveImage?: () => void
}

const baseMapSets: { label: string; value: BaseMapSet }[] = [
  { label: "Základní", value: "basic" },
  { label: "Turistická", value: "outdoor" },
  { label: "Letecká", value: "aerial" },
  { label: "Zimní", value: "winter" }
]

const mapTones: { label: string; value: MapTone }[] = [
  { label: "Barevná", value: "color" },
  { label: "Černobílá", value: "grayscale" }
]

export const MapMenu = (props: Props) => {
  return (
    <MenubarMenu>
      <MenubarTrigger className="gap-1 rounded-sm px-3 py-2 text-base text-blue-100 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white">
        Mapa <ChevronDown className="size-4" />
      </MenubarTrigger>
      <MenubarContent className="z-[2000] max-h-[calc(100vh-5rem)] w-[270px] overflow-y-auto p-0 text-sm">
        <MenubarLabel className="px-4 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
          Tón mapy
        </MenubarLabel>
        <MenubarRadioGroup
          value={props.mapTone}
          onValueChange={(value) => props.setMapTone(value as MapTone)}
        >
          {mapTones.map((tone) => (
            <MenubarRadioItem
              key={tone.value}
              value={tone.value}
              className="px-4 py-2 pl-9 text-sm"
            >
              {tone.label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>

        <MenubarSeparator className="my-0" />
        <MenubarLabel className="px-4 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
          Podklad
        </MenubarLabel>
        <MenubarRadioGroup
          value={props.baseMapSet}
          onValueChange={(value) => props.setBaseMapSet(value as BaseMapSet)}
        >
          {baseMapSets.map((mapSet) => (
            <MenubarRadioItem
              key={mapSet.value}
              value={mapSet.value}
              className="px-4 py-2 pl-9 text-sm"
            >
              {mapSet.label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>

        <MenubarSeparator className="my-0" />
        <MenubarLabel className="px-4 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase text-slate-500">
          Vrstvy
        </MenubarLabel>
        <MenubarItem className="px-4 py-2 text-sm" onSelect={(event) => event.preventDefault()}>
          <label className="flex w-full cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={props.showTouristOverlay}
              onChange={(event) => props.setShowTouristOverlay(event.target.checked)}
              className="size-4 accent-blue-600"
            />
            <span>Turistické trasy</span>
          </label>
        </MenubarItem>

        <MenubarSeparator className="my-0" />
        <MenubarItem
          className="px-4 py-2 text-sm"
          onSelect={(event) => {
            event.preventDefault()
            props.onSaveImage?.()
          }}
        >
          Uložit obrázek
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
