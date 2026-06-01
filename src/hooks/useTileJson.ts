import { useEffect, useMemo, useState } from "react"

import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"
import type { BaseMapSet } from "@/lib/maps/mapMode"

export type TileJson = {
  tiles: string[]
  attribution?: string
  minZoom?: number
  maxZoom?: number
}

type Options = {
  apiKey: string
  baseMapSet: BaseMapSet
  language: Language
}

export const useTileJson = ({ apiKey, baseMapSet, language }: Options) => {
  const t = translations[language].tileJson
  const [tileJson, setTileJson] = useState<TileJson | null>(null)
  const [error, setError] = useState<string | null>(null)

  const tileJsonUrl = useMemo(() => {
    return `https://api.mapy.com/v1/maptiles/${baseMapSet}/tiles.json?apikey=${encodeURIComponent(apiKey)}`
  }, [apiKey, baseMapSet])

  useEffect(() => {
    if (!apiKey) {
      setError(t.missingApiKey)
      return
    }

    ;(async () => {
      try {
        setError(null)
        const response = await fetch(tileJsonUrl)
        if (!response.ok) {
          throw new Error(`TileJSON fetch failed: ${response.status} ${response.statusText}`)
        }

        const data = (await response.json()) as TileJson

        if (!data.tiles?.length) {
          throw new Error(t.missingTiles)
        }

        setTileJson(data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught))
      }
    })()
  }, [apiKey, t, tileJsonUrl])

  return { error, tileJson }
}
