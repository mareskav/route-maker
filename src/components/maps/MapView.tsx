import L from "leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import type { RouteClickMode } from "@/components/layout/HeaderBar.tsx"
import { GrayMapTiles } from "@/components/maps/GrayMapTiles.tsx"
import { MapImageExportDialog } from "@/components/maps/MapImageExportDialog.tsx"
import { MapInstance } from "@/components/maps/MapInstance.tsx"
import { MapPanes } from "@/components/maps/MapPanes.tsx"
import { MapScale } from "@/components/maps/MapScale.tsx"
import { TouristOverlay } from "@/components/maps/TouristOverlay.tsx"
import { MapInteractions } from "@/components/routes/MapInteractions.tsx"
import { RouteLayers } from "@/components/routes/RouteLayers.tsx"
import { RouteMarkerContextMenu } from "@/components/routes/RouteMarkerContextMenu.tsx"
import { RoutePointMarker } from "@/components/routes/RoutePointMarker.tsx"
import { useRouteState } from "@/hooks/useRouteState.ts"
import { useTileJson } from "@/hooks/useTileJson.ts"
import { searchPlace, type PlaceSearchResult } from "@/lib/maps/geocoding"
import type { BaseMapSet, MapTone } from "@/lib/maps/mapMode"

// Štoky is default
const CENTER: [number, number] = [49.502485, 15.5886289]
const ZOOM = 14

type Props = {
  routeClickMode: RouteClickMode
  clearRouteSignal: number
  removeLastRoutePointSignal: number
  saveRouteSignal: number
  loadRouteRequest: { contents: string; id: number } | null
  saveImageSignal: number
  placeSearchRequest: { query: string; id: number } | null
  selectedPlaceRequest: { place: PlaceSearchResult; id: number } | null
  routeColor: string
  routeWidth: number
  routeDash: number
  routeOpacity: number
  showRouteMarkers: boolean
  baseMapSet: BaseMapSet
  mapTone: MapTone
  showTouristOverlay: boolean
  onRoutePointCountChange: (count: number) => void
  onRouteLengthMetersChange: (meters: number) => void
}

export const MapView = (props: Props) => {
  const { onRouteLengthMetersChange, routeClickMode } = props
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string
  const mapRef = useRef<L.Map | null>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [placeSearchResult, setPlaceSearchResult] = useState<PlaceSearchResult | null>(null)
  const [placeSearchStatus, setPlaceSearchStatus] = useState<string | null>(null)
  const { error, tileJson } = useTileJson({ apiKey, baseMapSet: props.baseMapSet })
  const {
    addRoutePoint,
    freeSegments,
    markerContextMenu,
    moveRoutePoint,
    removeRoutePoint,
    roadRouteLines,
    roadRoutes,
    routePoints,
    setMarkerContextMenu
  } = useRouteState({
    apiKey,
    clearRouteSignal: props.clearRouteSignal,
    loadRouteRequest: props.loadRouteRequest,
    onRoutePointCountChange: props.onRoutePointCountChange,
    onRouteLengthMetersChange,
    removeLastRoutePointSignal: props.removeLastRoutePointSignal,
    routeClickMode,
    saveRouteSignal: props.saveRouteSignal,
    showRouteMarkers: props.showRouteMarkers
  })

  const handleMapReady = useCallback((map: L.Map | null) => {
    mapRef.current = map
  }, [])

  useEffect(() => {
    if (props.saveImageSignal > 0) setIsExportDialogOpen(true)
  }, [props.saveImageSignal])

  const showPlaceOnMap = useCallback((result: PlaceSearchResult) => {
    const map = mapRef.current

    setPlaceSearchResult(result)
    setPlaceSearchStatus(null)

    if (result.bounds) {
      map?.fitBounds(result.bounds, { maxZoom: 17, padding: [28, 28] })
    } else {
      map?.setView(result.position, Math.max(map?.getZoom() ?? 16, 16))
    }
  }, [])

  useEffect(() => {
    if (props.selectedPlaceRequest) showPlaceOnMap(props.selectedPlaceRequest.place)
  }, [props.selectedPlaceRequest, showPlaceOnMap])

  useEffect(() => {
    if (!props.placeSearchRequest) return

    const query = props.placeSearchRequest.query.trim()
    if (!query) return

    if (!apiKey) {
      setPlaceSearchStatus("Chybí Mapy.com API klíč.")
      return
    }

    const controller = new AbortController()
    const map = mapRef.current
    const center = map?.getCenter()

    setPlaceSearchStatus("Hledám místo…")

    searchPlace({
      apiKey,
      preferNear: center ? { lat: center.lat, lng: center.lng } : undefined,
      query,
      signal: controller.signal
    })
      .then((result) => {
        if (!result) {
          setPlaceSearchResult(null)
          setPlaceSearchStatus("Místo nebylo nalezeno.")
          return
        }

        showPlaceOnMap(result)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setPlaceSearchStatus("Hledání se nepovedlo.")
      })

    return () => controller.abort()
  }, [apiKey, props.placeSearchRequest, showPlaceOnMap])

  if (error) return <div style={{ padding: 16 }}>Error {error}</div>
  if (!tileJson) return <div style={{ padding: 16 }}>Načítám mapu…</div>

  const tileUrl = tileJson.tiles[0]
  const attribution = tileJson.attribution ?? ""

  return (
    <div className="relative h-full w-full">
      <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full">
        <MapInstance onReady={handleMapReady} />
        <MapPanes />
        <MapInteractions
          routeClickMode={routeClickMode}
          onAddRoutePoint={addRoutePoint}
          onMapClick={() => setMarkerContextMenu(null)}
        />
        <MapScale />

        <TileLayer
          url={tileUrl}
          attribution={attribution}
          crossOrigin="anonymous"
          minZoom={tileJson.minZoom}
          maxZoom={tileJson.maxZoom}
        />

        <TouristOverlay enabled={props.showTouristOverlay} />
        <GrayMapTiles enabled={props.mapTone === "grayscale"} />

        <RouteLayers
          freeSegments={freeSegments}
          roadRouteLines={roadRouteLines}
          routeColor={props.routeColor}
          routeDash={props.routeDash}
          routeOpacity={props.routeOpacity}
          routeWidth={props.routeWidth}
        />

        {props.showRouteMarkers &&
          routePoints.map((point, index) => (
            <RoutePointMarker
              key={`${point.lat},${point.lng},${index}`}
              number={index + 1}
              position={point}
              color={props.routeColor}
              onClick={() => removeRoutePoint(index)}
              onContextMenu={(menuPoint) =>
                setMarkerContextMenu({ index, x: menuPoint.x, y: menuPoint.y })
              }
              onDragEnd={(lat, lng) => moveRoutePoint(index, lat, lng)}
            />
          ))}

        {placeSearchResult && (
          <Marker
            position={placeSearchResult.position}
            icon={L.divIcon({
              className: "place-search-marker",
              html: "",
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <strong>{placeSearchResult.name}</strong>
              {placeSearchResult.label && <div>{placeSearchResult.label}</div>}
              {placeSearchResult.location && <div>{placeSearchResult.location}</div>}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {placeSearchStatus && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[450] -translate-x-1/2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-lg">
          {placeSearchStatus}
        </div>
      )}

      {markerContextMenu && (
        <RouteMarkerContextMenu
          left={markerContextMenu.x}
          top={markerContextMenu.y}
          onRemove={() => removeRoutePoint(markerContextMenu.index)}
        />
      )}

      <MapImageExportDialog
        freeSegments={freeSegments}
        mapRef={mapRef}
        mapTone={props.mapTone}
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        roadRoutes={roadRoutes}
        routeColor={props.routeColor}
        routeDash={props.routeDash}
        routeOpacity={props.routeOpacity}
        routePoints={routePoints}
        routeWidth={props.routeWidth}
        showRouteMarkers={props.showRouteMarkers}
        showTouristOverlay={props.showTouristOverlay}
        tileUrl={tileUrl}
      />
    </div>
  )
}
