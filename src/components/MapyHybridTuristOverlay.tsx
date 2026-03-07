import { TileLayer } from "react-leaflet"

type Props = {
  enabled?: boolean
  opacity?: number
}

export const MapyInternalTrailOverlay = ({ enabled = true, opacity = 1 }: Props) => {
  if (!enabled) return null

  return (
    <TileLayer
      url="https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}"
      opacity={opacity}
      zIndex={300}
    />
  )
}
