import { MapPin, Search } from "lucide-react"
import type { FormEvent, KeyboardEvent } from "react"
import { useEffect, useState } from "react"

import { LoadingSpinner } from "@/components/ui/loading"
import { suggestPlaces, type PlaceSearchResult } from "@/lib/maps/geocoding"

type Props = {
  apiKey: string
  onSearchPlace?: (query: string) => void
  onSelectPlace?: (place: PlaceSearchResult) => void
}

export const PlaceSearch = ({ apiKey, onSearchPlace, onSelectPlace }: Props) => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceSearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [isSuggesting, setIsSuggesting] = useState(false)

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (!apiKey || trimmedQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      setIsSuggesting(false)
      return
    }

    const controller = new AbortController()
    let cancelled = false
    const timeout = window.setTimeout(() => {
      setIsSuggesting(true)
      suggestPlaces({ apiKey, query: trimmedQuery, signal: controller.signal })
        .then((nextSuggestions) => {
          if (cancelled) return
          setSuggestions(nextSuggestions)
          setActiveSuggestionIndex(0)
          setShowSuggestions(nextSuggestions.length > 0)
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return
          if (cancelled) return
          setSuggestions([])
          setShowSuggestions(false)
        })
        .finally(() => {
          if (!cancelled) setIsSuggesting(false)
        })
    }, 220)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [apiKey, query])

  const selectPlace = (place: PlaceSearchResult) => {
    setQuery(place.name)
    setShowSuggestions(false)
    onSelectPlace?.(place)
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (showSuggestions && suggestions[activeSuggestionIndex]) {
      selectPlace(suggestions[activeSuggestionIndex])
      return
    }

    setShowSuggestions(false)
    onSearchPlace?.(query)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || !suggestions.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveSuggestionIndex((index) => (index + 1) % suggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveSuggestionIndex((index) => (index - 1 + suggestions.length) % suggestions.length)
    } else if (event.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <form className="relative ml-auto shrink-0 sm:order-last" onSubmit={handleSearch}>
      <label className="sr-only" htmlFor="place-search">
        Hledej místo
      </label>
      <div className="relative">
        <input
          id="place-search"
          className="h-9 w-40 rounded-md border border-white/25 bg-white py-1 pl-3 pr-9 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-500 focus:border-white focus:ring-2 focus:ring-white/45 sm:w-52 lg:w-72"
          type="search"
          value={query}
          placeholder="Hledej místo..."
          autoComplete="off"
          onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
          onChange={(event) => {
            setQuery(event.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onKeyDown={handleKeyDown}
        />
        {isSuggesting ? (
          <LoadingSpinner className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-700" />
        ) : (
          <Search className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        )}
      </div>

      {showSuggestions && (suggestions.length > 0 || isSuggesting) && (
        <div className="absolute right-0 top-full z-[1010] mt-1 w-80 overflow-hidden rounded-md bg-white text-slate-900 shadow-xl ring-1 ring-black/10">
          {isSuggesting && suggestions.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
              <LoadingSpinner className="text-blue-700" />
              Hledám…
            </div>
          )}
          {suggestions.map((place, index) => (
            <button
              key={`${place.name}-${place.label}-${place.location}-${place.position.lat}-${place.position.lng}`}
              type="button"
              className={`flex w-full items-start gap-3 px-3 py-2 text-left text-sm ${
                index === activeSuggestionIndex ? "bg-slate-100" : "bg-white"
              } hover:bg-slate-100`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectPlace(place)}
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-slate-500" />
              <span className="min-w-0">
                <span className="block truncate font-medium">{place.name}</span>
                <span className="block truncate text-xs text-slate-500">
                  {[place.label, place.location].filter(Boolean).join(", ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
