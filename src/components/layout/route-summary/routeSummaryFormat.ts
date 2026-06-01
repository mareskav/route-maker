import type { Language } from "@/lib/i18n"

const decimalPointLanguages = new Set<Language>(["en", "ja", "ko"])

const formatDecimal = (value: number, language: Language) =>
  value.toFixed(2).replace(".", decimalPointLanguages.has(language) ? "." : ",")

export const formatDistance = (meters: number, language: Language = "cs") => {
  if (meters < 1000) return `${Math.round(meters)} m`

  return `${formatDecimal(meters / 1000, language)} km`
}

export const formatTotalDistance = (meters: number, language: Language = "cs") =>
  `${formatDecimal(meters / 1000, language)} km`

export const formatElevation = (meters: number) => `${Math.round(meters)} m`

export const formatDuration = (seconds: number) => {
  if (seconds <= 0) return "--"

  const minutes = Math.round(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours} h`

  return `${hours} h ${remainingMinutes} min`
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export const routeExportFilename = (suffix: string, extension: string) => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")

  return `trasovnik-${suffix}-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}-${pad(now.getHours())}${pad(now.getMinutes())}.${extension}`
}

export const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement("a")
  link.download = filename
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
}
