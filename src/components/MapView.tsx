import { useEffect, useMemo, useState } from "react"
import { CircleMarker, MapContainer, Polyline, TileLayer } from "react-leaflet"

import { GrayMapTiles } from "@/components/maps/GrayMapTiles.tsx"
import { TouristOverlay } from "@/components/maps/TouristOverlay.tsx"
import { MapPanes } from "@/components/maps/MapPanes.tsx"
import { MapInteractions } from "@/components/routes/MapInteractions.tsx"

type TileJson = {
  tiles: string[]
  attribution?: string
  minZoom?: number
  maxZoom?: number
}

// Štoky is default
const CENTER: [number, number] = [49.502485, 15.5886289]
const ZOOM = 14
const MAPSET = "basic" // basic | outdoor | aerial | names-overlay | winter

type Props = {
  routingEnabled: boolean
}

export const MapView = ({ routingEnabled }: Props) => {
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string

  const [tileJson, setTileJson] = useState<TileJson | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const [routePoints, setRoutePoints] = useState<[number, number][]>([])

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
        if (!res.ok) {
          throw new Error(`TileJSON fetch failed: ${res.status} ${res.statusText}`)
        }

        const data = (await res.json()) as TileJson

        if (!data.tiles?.length) {
          throw new Error("TileJSON neobsahuje pole tiles[]")
        }

        setTileJson(data)
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : String(e))
      }
    })()
  }, [apiKey, tileJsonUrl])

  const handleAddRoutePoint = (lat: number, lng: number) => {
    setRoutePoints((prev) => [...prev, [lat, lng]])
  }

  const handleRemoveRoutePoint = (index: number) => {
    setRoutePoints((prev) => prev.filter((_, i) => i !== index))
  }

  if (err) return <div style={{ padding: 16 }}>Error {err}</div>
  if (!tileJson) return <div style={{ padding: 16 }}>Načítám mapu…</div>

  const tileUrl = tileJson.tiles[0]
  const attribution = tileJson.attribution ?? ""

  return (
    <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full">
      <MapPanes />
      <MapInteractions routingEnabled={routingEnabled} onAddRoutePoint={handleAddRoutePoint} />

      <TileLayer
        url={tileUrl}
        attribution={attribution}
        minZoom={tileJson.minZoom}
        maxZoom={tileJson.maxZoom}
      />

      <TouristOverlay enabled />
      <GrayMapTiles enabled />

      {routePoints.length > 1 && <Polyline positions={routePoints} weight={4} opacity={0.9} />}

      {routePoints.map((point, index) => (
        <CircleMarker
          key={index}
          center={point}
          radius={index === 0 ? 7 : 5}
          eventHandlers={{
            click: (e) => {
              e.originalEvent.stopPropagation()
              handleRemoveRoutePoint(index)
            },
            mouseover: (e) => {
              e.target._path.style.cursor = "pointer"
            }
          }}
        />
      ))}
    </MapContainer>
  )
}
