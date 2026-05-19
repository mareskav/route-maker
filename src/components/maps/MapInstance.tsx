import L from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

type Props = {
  onReady: (map: L.Map | null) => void
}

export const MapInstance = ({ onReady }: Props) => {
  const map = useMap()

  useEffect(() => {
    onReady(map)

    return () => onReady(null)
  }, [map, onReady])

  return null
}
