import { useEffect, useMemo, useState } from "react"

import type { BaseMapSet } from "@/lib/mapMode"

export type TileJson = {
  tiles: string[]
  attribution?: string
  minZoom?: number
  maxZoom?: number
}

type Options = {
  apiKey: string
  baseMapSet: BaseMapSet
}

export const useTileJson = ({ apiKey, baseMapSet }: Options) => {
  const [tileJson, setTileJson] = useState<TileJson | null>(null)
  const [error, setError] = useState<string | null>(null)

  const tileJsonUrl = useMemo(() => {
    return `https://api.mapy.com/v1/maptiles/${baseMapSet}/tiles.json?apikey=${encodeURIComponent(apiKey)}`
  }, [apiKey, baseMapSet])

  useEffect(() => {
    if (!apiKey) {
      setError("Chybí VITE_MAPY_API_KEY v .env")
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
          throw new Error("TileJSON neobsahuje pole tiles[]")
        }

        setTileJson(data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught))
      }
    })()
  }, [apiKey, tileJsonUrl])

  return { error, tileJson }
}
