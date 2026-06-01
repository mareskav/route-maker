import L from "leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import type { RouteClickMode } from "@/components/layout/HeaderBar.tsx"
import { RouteSummaryPanel } from "@/components/layout/RouteSummaryPanel.tsx"
import { GrayMapTiles } from "@/components/maps/GrayMapTiles.tsx"
import { MapImageExportDialog } from "@/components/maps/MapImageExportDialog.tsx"
import { MapInstance } from "@/components/maps/MapInstance.tsx"
import { MapLoadingState } from "@/components/maps/MapLoadingState.tsx"
import { MapPanes } from "@/components/maps/MapPanes.tsx"
import { MapScale } from "@/components/maps/MapScale.tsx"
import { TouristOverlay } from "@/components/maps/TouristOverlay.tsx"
import { MapInteractions } from "@/components/routes/MapInteractions.tsx"
import { RouteLayers } from "@/components/routes/RouteLayers.tsx"
import { RouteMarkerContextMenu } from "@/components/routes/RouteMarkerContextMenu.tsx"
import { RoutePointMarker } from "@/components/routes/RoutePointMarker.tsx"
import { LoadingSpinner } from "@/components/ui/loading"
import { useRouteState } from "@/hooks/useRouteState.ts"
import { useTileJson } from "@/hooks/useTileJson.ts"
import type { Language } from "@/lib/i18n"
import { translations } from "@/lib/i18n"
import { searchPlace, type PlaceSearchResult } from "@/lib/maps/geocoding"
import type { BaseMapSet, MapTone } from "@/lib/maps/mapMode"
import type { RouteType } from "@/lib/routing/routeTypes"

// Štoky is default
const CENTER: [number, number] = [49.502485, 15.5886289]
const ZOOM = 14

type Props = {
  language: Language
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
  routeType: RouteType
  setRouteType: (routeType: RouteType) => void
  showRouteMarkers: boolean
  baseMapSet: BaseMapSet
  mapTone: MapTone
  showTouristOverlay: boolean
  onImageExportOpenChange?: (open: boolean) => void
  onRoutePointCountChange: (count: number) => void
  onRouteLengthMetersChange: (meters: number) => void
}

export const MapView = (props: Props) => {
  const { onImageExportOpenChange, onRouteLengthMetersChange, routeClickMode } = props
  const t = translations[props.language].mapView
  const apiKey = import.meta.env.VITE_MAPY_API_KEY as string
  const mapRef = useRef<L.Map | null>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isRoutePanelCollapsed, setIsRoutePanelCollapsed] = useState(true)
  const [placeSearchResult, setPlaceSearchResult] = useState<PlaceSearchResult | null>(null)
  const [placeSearchStatus, setPlaceSearchStatus] = useState<string | null>(null)
  const { error, tileJson } = useTileJson({
    apiKey,
    baseMapSet: props.baseMapSet,
    language: props.language
  })
  const {
    addRoutePoint,
    freeSegments,
    markerContextMenu,
    moveRoutePoint,
    profileLines,
    removeRoutePoint,
    roadRouteLines,
    roadRoutes,
    routeDurationSeconds,
    routeLengthMeters,
    routePoints,
    routeSegmentSummaries,
    routingStatus,
    setMarkerContextMenu
  } = useRouteState({
    apiKey,
    clearRouteSignal: props.clearRouteSignal,
    loadRouteRequest: props.loadRouteRequest,
    onRoutePointCountChange: props.onRoutePointCountChange,
    onRouteLengthMetersChange,
    removeLastRoutePointSignal: props.removeLastRoutePointSignal,
    routeClickMode,
    language: props.language,
    routeType: props.routeType,
    saveRouteSignal: props.saveRouteSignal,
    showRouteMarkers: props.showRouteMarkers
  })

  const handleMapReady = useCallback((map: L.Map | null) => {
    mapRef.current = map
  }, [])

  useEffect(() => {
    if (props.saveImageSignal > 0) setIsExportDialogOpen(true)
  }, [props.saveImageSignal])

  const handleExportDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsExportDialogOpen(open)
      onImageExportOpenChange?.(open)
    },
    [onImageExportOpenChange]
  )

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
      setPlaceSearchStatus(t.missingApiKey)
      return
    }

    const controller = new AbortController()
    const map = mapRef.current
    const center = map?.getCenter()

    setPlaceSearchStatus(t.searchingPlace)

    searchPlace({
      apiKey,
      preferNear: center ? { lat: center.lat, lng: center.lng } : undefined,
      query,
      signal: controller.signal
    })
      .then((result) => {
        if (!result) {
          setPlaceSearchResult(null)
          setPlaceSearchStatus(t.placeNotFound)
          return
        }

        showPlaceOnMap(result)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setPlaceSearchStatus(t.searchFailed)
      })

    return () => controller.abort()
  }, [apiKey, props.placeSearchRequest, showPlaceOnMap, t])

  if (error) {
    return (
      <div className="grid h-full place-items-center bg-slate-100 p-4 text-center text-sm text-slate-700">
        <div className="rounded-md bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
          {t.mapLoadFailed} {error}
        </div>
      </div>
    )
  }
  if (!tileJson) return <MapLoadingState language={props.language} />

  const tileUrl = tileJson.tiles[0]
  const attribution = tileJson.attribution ?? ""

  return (
    <div
      className={`relative h-full w-full ${
        isRoutePanelCollapsed ? "route-panel-collapsed" : "route-panel-expanded"
      }`}
    >
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

      {(placeSearchStatus || routingStatus !== "idle") && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[450] flex -translate-x-1/2 flex-col items-center gap-2">
          {placeSearchStatus && (
            <div className="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-lg ring-1 ring-black/5">
              {placeSearchStatus}
            </div>
          )}
          {routingStatus === "loading" && (
            <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-lg ring-1 ring-black/5">
              <LoadingSpinner className="text-blue-700" />
              {t.routeLoading}
            </div>
          )}
          {routingStatus === "error" && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-lg ring-1 ring-red-200">
              {t.routeFailed}
            </div>
          )}
        </div>
      )}

      <RouteSummaryPanel
        apiKey={apiKey}
        language={props.language}
        onCollapsedChange={setIsRoutePanelCollapsed}
        routeDurationSeconds={routeDurationSeconds}
        routeLengthMeters={routeLengthMeters}
        routeSegmentSummaries={routeSegmentSummaries}
        routeType={props.routeType}
        routeLines={profileLines}
        onRouteTypeChange={props.setRouteType}
      />

      {markerContextMenu && (
        <RouteMarkerContextMenu
          left={markerContextMenu.x}
          top={markerContextMenu.y}
          onRemove={() => removeRoutePoint(markerContextMenu.index)}
          language={props.language}
        />
      )}

      <MapImageExportDialog
        freeSegments={freeSegments}
        language={props.language}
        mapRef={mapRef}
        mapTone={props.mapTone}
        open={isExportDialogOpen}
        onOpenChange={handleExportDialogOpenChange}
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
