import type { ElevationProfile as Profile } from "@/lib/routing/elevation"

export const chartPath = (profile: Profile, width: number, height: number, padding: number) => {
  const distanceRange = Math.max(profile.distanceMeters, 1)
  const elevationRange = Math.max(profile.maxElevation - profile.minElevation, 1)

  return profile.points
    .map((point, index) => {
      const x = padding + (point.distanceMeters / distanceRange) * (width - padding * 2)
      const y =
        padding +
        ((profile.maxElevation - point.elevation) / elevationRange) * (height - padding * 2)

      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

export const areaPath = (profile: Profile, width: number, height: number, padding: number) => {
  const line = chartPath(profile, width, height, padding)
  const bottom = height - padding

  return `${line} L ${width - padding} ${bottom} L ${padding} ${bottom} Z`
}
