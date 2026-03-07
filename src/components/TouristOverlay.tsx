import { TileLayer } from "react-leaflet"

type Props = {
  enabled?: boolean
}

export const TouristOverlay = ({ enabled = true }: Props) => {
  if (!enabled) return null

  return <TileLayer url="/api/touristOverlay/{z}/{x}/{y}" pane="touristPane" keepBuffer={4} />
}
