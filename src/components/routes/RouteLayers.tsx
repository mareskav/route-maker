import L from "leaflet"
import type { LatLngLiteral } from "leaflet"
import { Fragment, useMemo } from "react"
import { Polyline } from "react-leaflet"

import {
  routeKey,
  toPolylinePosition,
  type RoadRoute
} from "@/lib/routing/routeGeometry"

type RoadRouteLines = RoadRoute & {
  lines: LatLngLiteral[][]
}

type Props = {
  freeSegments: [LatLngLiteral, LatLngLiteral][]
  roadRouteLines: RoadRouteLines[]
  routeColor: string
  routeDash: number
  routeOpacity: number
  routeWidth: number
}

export const RouteLayers = ({
  freeSegments,
  roadRouteLines,
  routeColor,
  routeDash,
  routeOpacity,
  routeWidth
}: Props) => {
  const routeRenderer = useMemo(() => L.svg({ pane: "routePane" }), [])
  const routePathOptions = useMemo(
    () => ({
      color: routeColor,
      opacity: routeOpacity,
      weight: routeWidth,
      fill: false,
      lineCap: "round" as const,
      lineJoin: "round" as const,
      dashArray:
        routeDash > 0 ? `${routeWidth * 1.8} ${routeWidth * (0.6 + routeDash / 12)}` : undefined
    }),
    [routeColor, routeDash, routeOpacity, routeWidth]
  )

  return (
    <>
      {freeSegments.map((segment) => (
        <Polyline
          key={`free-${routeKey(segment)}`}
          pane="routePane"
          renderer={routeRenderer}
          positions={segment.map(toPolylinePosition)}
          pathOptions={routePathOptions}
        />
      ))}

      {roadRouteLines.map((route) => (
        <Fragment key={`road-${route.key}`}>
          {route.lines.map((line, lineIndex) => (
            <Polyline
              key={`road-line-${route.key}-${lineIndex}`}
              pane="routePane"
              renderer={routeRenderer}
              positions={line.map(toPolylinePosition)}
              pathOptions={routePathOptions}
            />
          ))}
          {route.connectorSegments.map((segment) => (
            <Polyline
              key={`road-connector-${route.key}-${routeKey(segment)}`}
              pane="routePane"
              renderer={routeRenderer}
              positions={segment.map(toPolylinePosition)}
              pathOptions={routePathOptions}
            />
          ))}
        </Fragment>
      ))}
    </>
  )
}
