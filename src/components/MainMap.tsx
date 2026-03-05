import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"

import { GrayMapTiles } from "@/components/GrayMapTiles.tsx"

type TileJson = {
  tiles: string[]
  attribution?: string
  minZoom?: number
  maxZoom?: number
}

// Štoky is default
const CENTER: [number, number] = [49.502485, 15.5886289]
const ZOOM = 14
const MAPSET = "outdoor" // basic | outdoor | aerial | names-overlay | winter

export const MainMap = () => {
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string

  const [tileJson, setTileJson] = useState<TileJson | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const tileJsonUrl = useMemo(() => {
    return `https://api.mapy.com/v1/maptiles/${MAPSET}/tiles.json?apikey=${encodeURIComponent(apiKey)}`
  }, [apiKey])

  useEffect(() => {
    if (!apiKey) {
      setErr("Chybí VITE_MAPY_API_KEY v .env")
      return
    }

    ;(async () => {
      try {
        setErr(null)
        const res = await fetch(tileJsonUrl)
        if (!res.ok) throw new Error(`TileJSON fetch failed: ${res.status} ${res.statusText}`)
        const data = (await res.json()) as TileJson

        if (!data.tiles?.length) throw new Error("TileJSON neobsahuje pole tiles[]")
        setTileJson(data)
      } catch (e: any) {
        setErr(e?.message ?? String(e))
      }
    })()
  }, [apiKey, tileJsonUrl])

  if (err) return <div style={{ padding: 16 }}>❌ {err}</div>
  if (!tileJson) return <div style={{ padding: 16 }}>Načítám mapu…</div>

  const tileUrl = tileJson.tiles[0]
  const attribution = tileJson.attribution ?? ""

  return (
    // @ts-ignore
    <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full">
      <TileLayer
        url={tileUrl}
        // @ts-ignore
        attribution={attribution}
        {...(tileJson.minZoom && { minZoom: tileJson.minZoom })}
        {...(tileJson.maxZoom && { maxZoom: tileJson.maxZoom })}
      />
      <GrayMapTiles enabled />

      {/*<Polyline positions={routeLatLngs} />*/}
    </MapContainer>
  )
}
