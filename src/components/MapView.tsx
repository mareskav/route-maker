import L from "leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"

import type { RouteClickMode } from "@/components/HeaderBar.tsx"
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
import type { BaseMapSet, MapTone } from "@/lib/mapMode"

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
      </MapContainer>

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
