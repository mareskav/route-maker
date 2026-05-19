import { TileLayer } from "react-leaflet"

type Props = {
  enabled?: boolean
}

const TRANSPARENT_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="

export const TouristOverlay = ({ enabled = true }: Props) => {
  if (!enabled) return null

  return (
    <TileLayer
      url="/api/touristOverlay/{z}/{x}/{y}"
      pane="touristPane"
      crossOrigin="anonymous"
      keepBuffer={8}
      updateWhenIdle
      updateWhenZooming={false}
      errorTileUrl={TRANSPARENT_TILE}
    />
  )
}
