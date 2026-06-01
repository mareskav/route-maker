import type { RouteType } from "@/lib/routing/routeTypes"

export const languages = [
  "cs",
  "en",
  "de",
  "fr",
  "hu",
  "fi",
  "pl",
  "sk",
  "bcs",
  "vi",
  "ko",
  "ja",
] as const

export type Language = (typeof languages)[number]

export const htmlLanguageCodes: Record<Language, string> = {
  bcs: "sr-Latn",
  cs: "cs",
  de: "de",
  en: "en",
  fi: "fi",
  fr: "fr",
  hu: "hu",
  ja: "ja",
  ko: "ko",
  pl: "pl",
  vi: "vi",
  sk: "sk"
}

export const languageLabels: Record<Language, string> = {
  bcs: "BCS latinica",
  cs: "Čeština",
  de: "Deutsch",
  en: "English",
  fi: "Suomi",
  fr: "Français",
  hu: "Magyar",
  ja: "日本語",
  ko: "한국어",
  pl: "Polski",
  vi: "Tiếng Việt",
  sk: "Slovenština"
}

export const languageFlagCountries: Record<Language, readonly string[]> = {
  bcs: ["si", "ba", "hr", "rs", "me"],
  cs: ["cz"],
  de: ["de"],
  en: ["gb"],
  fi: ["fi"],
  fr: ["fr"],
  hu: ["hu"],
  ja: ["jp"],
  ko: ["kr"],
  pl: ["pl"],
  vi: ["vn"],
  sk: ["sk"]
}

const baseTranslations = {
  cs: {
    appName: "Trasovník",
    common: {
      close: "Zavřít",
      export: "Export",
      github: "GitHub",
      loadingMap: "Načítám mapu"
    },
    header: {
      browse: "Prohlížet",
      freeRoute: "Trasa volně",
      language: "Jazyk",
      roadRoute: "Trasa po cestách"
    },
    placeSearch: {
      label: "Hledej místo",
      loading: "Hledám...",
      placeholder: "Hledej místo..."
    },
    routeMenu: {
      actions: "Akce",
      appearance: "Vzhled trasy",
      basicColors: "Základní barvy trasy",
      clearRoute: "Vymazat trasu",
      color: "Barva trasy:",
      colors: {
        blue: "modrá",
        green: "zelená",
        orange: "oranžová",
        purple: "fialová",
        red: "červená",
        yellow: "žlutá"
      },
      dash: "Šrafování trasy",
      display: "Zobrazení",
      file: "Soubor",
      hidden: "vypnuto",
      hideMarkers: "Skrýt značky",
      loadRoute: "Načíst trasu",
      opacity: "Viditelnost trasy",
      route: "Trasa",
      saveRoute: "Uložit trasu",
      width: "Šířka trasy"
    },
    mapMenu: {
      aerial: "Letecká",
      base: "Podklad",
      basic: "Základní",
      color: "Barevná",
      grayscale: "Černobílá",
      layers: "Vrstvy",
      map: "Mapa",
      mapTone: "Tón mapy",
      outdoor: "Turistická",
      saveImage: "Uložit obrázek",
      touristRoutes: "Turistické trasy",
      winter: "Zimní"
    },
    mapView: {
      missingApiKey: "Chybí Mapy.com API klíč.",
      mapLoadFailed: "Mapu se nepodařilo načíst:",
      placeNotFound: "Místo nebylo nalezeno.",
      routeFailed: "Trasu se nepodařilo přepočítat.",
      routeLoading: "Přepočítávám trasu",
      searchFailed: "Hledání se nepovedlo.",
      searchingPlace: "Hledám místo..."
    },
    routeSummary: {
      ascent: "Nahoru",
      collapse: "Kliknutím sbalit",
      descent: "Dolů",
      distance: "Vzdálenost",
      duration: "Čas",
      elevationUnavailable: "Výškový profil není dostupný.",
      export: "Export",
      footer: "Udělal Vašek M. pro Michal K.",
      imageProfileSummary: "Délka {length} · Čas {duration} · Nahoru {ascent} · Dolů {descent}",
      loadingElevations: "Načítám výšky",
      points: "Body",
      profile: "Výškový profil",
      profilePng: "Profil PNG",
      routeOverview: "Přehled trasy",
      segments: "Úseky mezi body",
      segmentsDoc: "Tabulka DOC",
      segmentsTitle: "Úseky trasy",
      summaryLine: "Délka: {length} · Čas: {duration} · Nahoru: {ascent} · Dolů: {descent}"
    },
    routeModes: {
      bike: "Kolo",
      car: "Auto",
      foot: "Pěšky",
      route: "Trasa",
      types: {
        bike_mountain: "Kolo horské",
        bike_road: "Kolo silniční",
        car_fast: "Auto rychlá",
        car_fast_traffic: "Auto rychlá s provozem",
        car_short: "Auto krátká",
        foot_fast: "Pěšky rychlá",
        foot_hiking: "Pěšky turistická"
      }
    },
    exportDialog: {
      centerDefault: "Výchozí je aktuální střed mapy.",
      centerMoved: "Náhled i export používají posunutý střed.",
      centerTitle: "Střed velké mapy",
      close: "Zavřít",
      currentView: "Aktuální výřez",
      imageAlt: "Náhled exportu mapy",
      imageSize: "Velikost obrázku",
      largeMap: "Velká mapa",
      mapLoadAlert: "Mapu se nepodařilo uložit, protože ještě není načtená.",
      mapScale: "Měřítko mapy",
      moveCenterDown: "Posunout střed dolů",
      moveCenterLeft: "Posunout střed doleva",
      moveCenterRight: "Posunout střed doprava",
      moveCenterUp: "Posunout střed nahoru",
      noPreview: "Náhled není dostupný",
      previewLoading: "Generuji náhled",
      resetCenter: "Vrátit aktuální střed mapy",
      routePartiallyOutside:
        "Část trasy bude pravděpodobně mimo výsledný obrázek. Posuňte mapu blíž k trase, zvolte větší obrázek nebo měřítko s větším pokrytím.",
      routeOutside:
        "Trasa pravděpodobně nebude ve výsledném obrázku. Posuňte mapu blíž k trase, zvolte větší obrázek nebo měřítko s větším pokrytím.",
      save: "Uložit obrázek",
      saveFailed: "Obrázek se nepodařilo uložit. Některá mapa nebo vrstva blokuje export.",
      saving: "Ukládám...",
      scope: "Rozsah",
      scaleFallback: "měřítko podkladu",
      scaleHints: {
        100: "ulice a lesní cesty",
        200: "detailní turistická mapa",
        300: "trasa s blízkým okolím",
        500: "města a krajina",
        1000: "širší oblast",
        2000: "region",
        5000: "velký přehled",
        10000: "stát a okolí"
      },
      viewDescription: "Uloží se přesně aktuální výřez mapy.",
      largeDescription:
        "Uloží se {width} x {height} při měřítku {scale}. Výsledný PNG bude přibližně {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Vymazat bod"
    },
    routeFile: {
      emptyFile: "Soubor neobsahuje žádné body trasy.",
      loadFailed: "Soubor trasy se nepodařilo načíst.",
      parseFailed: "Soubor GPX se nepodařilo přečíst."
    },
    tileJson: {
      missingApiKey: "Chybí VITE_MAPY_API_KEY v .env",
      missingTiles: "TileJSON neobsahuje pole tiles[]"
    }
  },
  en: {
    appName: "Route Maker",
    common: {
      close: "Close",
      export: "Export",
      github: "GitHub",
      loadingMap: "Loading map"
    },
    header: {
      browse: "Browse",
      freeRoute: "Free route",
      language: "Language",
      roadRoute: "Route on roads"
    },
    placeSearch: {
      label: "Search for a place",
      loading: "Searching...",
      placeholder: "Search for a place..."
    },
    routeMenu: {
      actions: "Actions",
      appearance: "Route style",
      basicColors: "Basic route colors",
      clearRoute: "Clear route",
      color: "Route color:",
      colors: {
        blue: "blue",
        green: "green",
        orange: "orange",
        purple: "purple",
        red: "red",
        yellow: "yellow"
      },
      dash: "Route dashes",
      display: "Display",
      file: "File",
      hidden: "off",
      hideMarkers: "Hide markers",
      loadRoute: "Load route",
      opacity: "Route visibility",
      route: "Route",
      saveRoute: "Save route",
      width: "Route width"
    },
    mapMenu: {
      aerial: "Aerial",
      base: "Base map",
      basic: "Basic",
      color: "Color",
      grayscale: "Black and white",
      layers: "Layers",
      map: "Map",
      mapTone: "Map tone",
      outdoor: "Outdoor",
      saveImage: "Save image",
      touristRoutes: "Tourist routes",
      winter: "Winter"
    },
    mapView: {
      missingApiKey: "Missing Mapy.com API key.",
      mapLoadFailed: "The map could not be loaded:",
      placeNotFound: "Place was not found.",
      routeFailed: "The route could not be recalculated.",
      routeLoading: "Recalculating route",
      searchFailed: "Search failed.",
      searchingPlace: "Searching for place..."
    },
    routeSummary: {
      ascent: "Ascent",
      collapse: "Click to collapse",
      descent: "Descent",
      distance: "Distance",
      duration: "Time",
      elevationUnavailable: "Elevation profile is not available.",
      export: "Export",
      footer: "Made by Vašek M. for Michal K.",
      imageProfileSummary:
        "Distance {length} · Time {duration} · Ascent {ascent} · Descent {descent}",
      loadingElevations: "Loading elevations",
      points: "Points",
      profile: "Elevation profile",
      profilePng: "Profile PNG",
      routeOverview: "Route overview",
      segments: "Segments between points",
      segmentsDoc: "Table DOC",
      segmentsTitle: "Route segments",
      summaryLine: "Distance: {length} · Time: {duration} · Ascent: {ascent} · Descent: {descent}"
    },
    routeModes: {
      bike: "Bike",
      car: "Car",
      foot: "Walk",
      route: "Route",
      types: {
        bike_mountain: "Mountain bike",
        bike_road: "Road bike",
        car_fast: "Car fast",
        car_fast_traffic: "Car fast with traffic",
        car_short: "Car short",
        foot_fast: "Walk fast",
        foot_hiking: "Hiking"
      }
    },
    exportDialog: {
      centerDefault: "The default is the current map center.",
      centerMoved: "Preview and export use the shifted center.",
      centerTitle: "Large map center",
      close: "Close",
      currentView: "Current view",
      imageAlt: "Map export preview",
      imageSize: "Image size",
      largeMap: "Large map",
      mapLoadAlert: "The map could not be saved because it has not loaded yet.",
      mapScale: "Map scale",
      moveCenterDown: "Move center down",
      moveCenterLeft: "Move center left",
      moveCenterRight: "Move center right",
      moveCenterUp: "Move center up",
      noPreview: "Preview is not available",
      previewLoading: "Generating preview",
      resetCenter: "Reset to current map center",
      routePartiallyOutside:
        "Part of the route will probably be outside the final image. Move the map closer to the route, choose a larger image, or use a scale with wider coverage.",
      routeOutside:
        "The route will probably not be in the final image. Move the map closer to the route, choose a larger image, or use a scale with wider coverage.",
      save: "Save image",
      saveFailed: "The image could not be saved. A map or layer is blocking export.",
      saving: "Saving...",
      scope: "Scope",
      scaleFallback: "base map scale",
      scaleHints: {
        100: "streets and forest paths",
        200: "detailed tourist map",
        300: "route with nearby area",
        500: "towns and landscape",
        1000: "wider area",
        2000: "region",
        5000: "large overview",
        10000: "country and surroundings"
      },
      viewDescription: "The current map view will be saved exactly.",
      largeDescription:
        "Saves {width} x {height} at {scale} scale. The final PNG will be about {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Delete point"
    },
    routeFile: {
      emptyFile: "The file does not contain any route points.",
      loadFailed: "The route file could not be loaded.",
      parseFailed: "The GPX file could not be read."
    },
    tileJson: {
      missingApiKey: "Missing VITE_MAPY_API_KEY in .env",
      missingTiles: "TileJSON does not contain tiles[]"
    }
  },
  pl: {
    appName: "Planer tras",
    common: {
      close: "Zamknij",
      export: "Eksport",
      github: "GitHub",
      loadingMap: "Wczytywanie mapy"
    },
    header: {
      browse: "Przeglądaj",
      freeRoute: "Trasa dowolna",
      language: "Język",
      roadRoute: "Trasa po drogach"
    },
    placeSearch: {
      label: "Szukaj miejsca",
      loading: "Szukam...",
      placeholder: "Szukaj miejsca..."
    },
    routeMenu: {
      actions: "Akcje",
      appearance: "Wygląd trasy",
      basicColors: "Podstawowe kolory trasy",
      clearRoute: "Wyczyść trasę",
      color: "Kolor trasy:",
      colors: {
        blue: "niebieski",
        green: "zielony",
        orange: "pomarańczowy",
        purple: "fioletowy",
        red: "czerwony",
        yellow: "żółty"
      },
      dash: "Kreskowanie trasy",
      display: "Wyświetlanie",
      file: "Plik",
      hidden: "wyłączone",
      hideMarkers: "Ukryj znaczniki",
      loadRoute: "Wczytaj trasę",
      opacity: "Widoczność trasy",
      route: "Trasa",
      saveRoute: "Zapisz trasę",
      width: "Szerokość trasy"
    },
    mapMenu: {
      aerial: "Lotnicza",
      base: "Podkład",
      basic: "Podstawowa",
      color: "Kolorowa",
      grayscale: "Czarno-biała",
      layers: "Warstwy",
      map: "Mapa",
      mapTone: "Ton mapy",
      outdoor: "Turystyczna",
      saveImage: "Zapisz obraz",
      touristRoutes: "Szlaki turystyczne",
      winter: "Zimowa"
    },
    mapView: {
      missingApiKey: "Brakuje klucza API Mapy.com.",
      mapLoadFailed: "Nie udało się wczytać mapy:",
      placeNotFound: "Nie znaleziono miejsca.",
      routeFailed: "Nie udało się przeliczyć trasy.",
      routeLoading: "Przeliczanie trasy",
      searchFailed: "Wyszukiwanie nie powiodło się.",
      searchingPlace: "Szukam miejsca..."
    },
    routeSummary: {
      ascent: "Podejście",
      collapse: "Kliknij, aby zwinąć",
      descent: "Zejście",
      distance: "Dystans",
      duration: "Czas",
      elevationUnavailable: "Profil wysokościowy jest niedostępny.",
      export: "Eksport",
      footer: "Stworzył Vašek M. dla Michal K.",
      imageProfileSummary:
        "Dystans {length} · Czas {duration} · Podejście {ascent} · Zejście {descent}",
      loadingElevations: "Wczytywanie wysokości",
      points: "Punkty",
      profile: "Profil wysokościowy",
      profilePng: "Profil PNG",
      routeOverview: "Podsumowanie trasy",
      segments: "Odcinki między punktami",
      segmentsDoc: "Tabela DOC",
      segmentsTitle: "Odcinki trasy",
      summaryLine: "Dystans: {length} · Czas: {duration} · Podejście: {ascent} · Zejście: {descent}"
    },
    routeModes: {
      bike: "Rower",
      car: "Auto",
      foot: "Pieszo",
      route: "Trasa",
      types: {
        bike_mountain: "Rower górski",
        bike_road: "Rower szosowy",
        car_fast: "Auto szybka",
        car_fast_traffic: "Auto szybka z ruchem",
        car_short: "Auto krótka",
        foot_fast: "Pieszo szybka",
        foot_hiking: "Piesza turystyczna"
      }
    },
    exportDialog: {
      centerDefault: "Domyślnie używany jest aktualny środek mapy.",
      centerMoved: "Podgląd i eksport używają przesuniętego środka.",
      centerTitle: "Środek dużej mapy",
      close: "Zamknij",
      currentView: "Aktualny widok",
      imageAlt: "Podgląd eksportu mapy",
      imageSize: "Rozmiar obrazu",
      largeMap: "Duża mapa",
      mapLoadAlert: "Nie można zapisać mapy, ponieważ nie została jeszcze wczytana.",
      mapScale: "Skala mapy",
      moveCenterDown: "Przesuń środek w dół",
      moveCenterLeft: "Przesuń środek w lewo",
      moveCenterRight: "Przesuń środek w prawo",
      moveCenterUp: "Przesuń środek w górę",
      noPreview: "Podgląd jest niedostępny",
      previewLoading: "Generowanie podglądu",
      resetCenter: "Przywróć aktualny środek mapy",
      routePartiallyOutside:
        "Część trasy prawdopodobnie znajdzie się poza końcowym obrazem. Przesuń mapę bliżej trasy, wybierz większy obraz albo skalę z większym zasięgiem.",
      routeOutside:
        "Trasy prawdopodobnie nie będzie na końcowym obrazie. Przesuń mapę bliżej trasy, wybierz większy obraz albo skalę z większym zasięgiem.",
      save: "Zapisz obraz",
      saveFailed: "Nie udało się zapisać obrazu. Mapa lub warstwa blokuje eksport.",
      saving: "Zapisywanie...",
      scope: "Zakres",
      scaleFallback: "skala podkładu",
      scaleHints: {
        100: "ulice i leśne drogi",
        200: "szczegółowa mapa turystyczna",
        300: "trasa z najbliższą okolicą",
        500: "miasta i krajobraz",
        1000: "szerszy obszar",
        2000: "region",
        5000: "duży przegląd",
        10000: "kraj i okolice"
      },
      viewDescription: "Zostanie zapisany dokładnie aktualny widok mapy.",
      largeDescription:
        "Zapisze {width} x {height} przy skali {scale}. Wynikowy PNG będzie miał około {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Usuń punkt"
    },
    routeFile: {
      emptyFile: "Plik nie zawiera żadnych punktów trasy.",
      loadFailed: "Nie udało się wczytać pliku trasy.",
      parseFailed: "Nie udało się odczytać pliku GPX."
    },
    tileJson: {
      missingApiKey: "Brakuje VITE_MAPY_API_KEY w .env",
      missingTiles: "TileJSON nie zawiera pola tiles[]"
    }
  },
  sk: {
    appName: "Trasovník",
    common: {
      close: "Zavrieť",
      export: "Export",
      github: "GitHub",
      loadingMap: "Načítavam mapu"
    },
    header: {
      browse: "Prehliadať",
      freeRoute: "Trasa voľne",
      language: "Jazyk",
      roadRoute: "Trasa po cestách"
    },
    placeSearch: {
      label: "Hľadať miesto",
      loading: "Hľadám...",
      placeholder: "Hľadať miesto..."
    },
    routeMenu: {
      actions: "Akcie",
      appearance: "Vzhľad trasy",
      basicColors: "Základné farby trasy",
      clearRoute: "Vymazať trasu",
      color: "Farba trasy:",
      colors: {
        blue: "modrá",
        green: "zelená",
        orange: "oranžová",
        purple: "fialová",
        red: "červená",
        yellow: "žltá"
      },
      dash: "Šrafovanie trasy",
      display: "Zobrazenie",
      file: "Súbor",
      hidden: "vypnuté",
      hideMarkers: "Skryť značky",
      loadRoute: "Načítať trasu",
      opacity: "Viditeľnosť trasy",
      route: "Trasa",
      saveRoute: "Uložiť trasu",
      width: "Šírka trasy"
    },
    mapMenu: {
      aerial: "Letecká",
      base: "Podklad",
      basic: "Základná",
      color: "Farebná",
      grayscale: "Čiernobiela",
      layers: "Vrstvy",
      map: "Mapa",
      mapTone: "Tón mapy",
      outdoor: "Turistická",
      saveImage: "Uložiť obrázok",
      touristRoutes: "Turistické trasy",
      winter: "Zimná"
    },
    mapView: {
      missingApiKey: "Chýba API kľúč Mapy.com.",
      mapLoadFailed: "Mapu sa nepodarilo načítať:",
      placeNotFound: "Miesto nebolo nájdené.",
      routeFailed: "Trasu sa nepodarilo prepočítať.",
      routeLoading: "Prepočítavam trasu",
      searchFailed: "Hľadanie sa nepodarilo.",
      searchingPlace: "Hľadám miesto..."
    },
    routeSummary: {
      ascent: "Stúpanie",
      collapse: "Kliknutím zbaliť",
      descent: "Klesanie",
      distance: "Vzdialenosť",
      duration: "Čas",
      elevationUnavailable: "Výškový profil nie je dostupný.",
      export: "Export",
      footer: "Urobil Vašek M. pre Michal K.",
      imageProfileSummary:
        "Dĺžka {length} · Čas {duration} · Stúpanie {ascent} · Klesanie {descent}",
      loadingElevations: "Načítavam výšky",
      points: "Body",
      profile: "Výškový profil",
      profilePng: "Profil PNG",
      routeOverview: "Prehľad trasy",
      segments: "Úseky medzi bodmi",
      segmentsDoc: "Tabuľka DOC",
      segmentsTitle: "Úseky trasy",
      summaryLine: "Dĺžka: {length} · Čas: {duration} · Stúpanie: {ascent} · Klesanie: {descent}"
    },
    routeModes: {
      bike: "Bicykel",
      car: "Auto",
      foot: "Pešo",
      route: "Trasa",
      types: {
        bike_mountain: "Horský bicykel",
        bike_road: "Cestný bicykel",
        car_fast: "Auto rýchla",
        car_fast_traffic: "Auto rýchla s premávkou",
        car_short: "Auto krátka",
        foot_fast: "Pešo rýchla",
        foot_hiking: "Pešo turistická"
      }
    },
    exportDialog: {
      centerDefault: "Predvolený je aktuálny stred mapy.",
      centerMoved: "Náhľad aj export používajú posunutý stred.",
      centerTitle: "Stred veľkej mapy",
      close: "Zavrieť",
      currentView: "Aktuálny výrez",
      imageAlt: "Náhľad exportu mapy",
      imageSize: "Veľkosť obrázka",
      largeMap: "Veľká mapa",
      mapLoadAlert: "Mapu sa nepodarilo uložiť, pretože ešte nie je načítaná.",
      mapScale: "Mierka mapy",
      moveCenterDown: "Posunúť stred nadol",
      moveCenterLeft: "Posunúť stred doľava",
      moveCenterRight: "Posunúť stred doprava",
      moveCenterUp: "Posunúť stred nahor",
      noPreview: "Náhľad nie je dostupný",
      previewLoading: "Generujem náhľad",
      resetCenter: "Vrátiť aktuálny stred mapy",
      routePartiallyOutside:
        "Časť trasy bude pravdepodobne mimo výsledného obrázka. Posuňte mapu bližšie k trase, zvoľte väčší obrázok alebo mierku s väčším pokrytím.",
      routeOutside:
        "Trasa pravdepodobne nebude vo výslednom obrázku. Posuňte mapu bližšie k trase, zvoľte väčší obrázok alebo mierku s väčším pokrytím.",
      save: "Uložiť obrázok",
      saveFailed: "Obrázok sa nepodarilo uložiť. Niektorá mapa alebo vrstva blokuje export.",
      saving: "Ukladám...",
      scope: "Rozsah",
      scaleFallback: "mierka podkladu",
      scaleHints: {
        100: "ulice a lesné cesty",
        200: "detailná turistická mapa",
        300: "trasa s blízkym okolím",
        500: "mestá a krajina",
        1000: "širšia oblasť",
        2000: "región",
        5000: "veľký prehľad",
        10000: "štát a okolie"
      },
      viewDescription: "Uloží sa presne aktuálny výrez mapy.",
      largeDescription:
        "Uloží sa {width} x {height} pri mierke {scale}. Výsledný PNG bude mať približne {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Vymazať bod"
    },
    routeFile: {
      emptyFile: "Súbor neobsahuje žiadne body trasy.",
      loadFailed: "Súbor trasy sa nepodarilo načítať.",
      parseFailed: "Súbor GPX sa nepodarilo prečítať."
    },
    tileJson: {
      missingApiKey: "Chýba VITE_MAPY_API_KEY v .env",
      missingTiles: "TileJSON neobsahuje pole tiles[]"
    }
  },
  bcs: {
    appName: "Planer ruta",
    common: {
      close: "Zatvori",
      export: "Izvoz",
      github: "GitHub",
      loadingMap: "Učitavam kartu"
    },
    header: {
      browse: "Pregled",
      freeRoute: "Slobodna ruta",
      language: "Jezik",
      roadRoute: "Ruta po cestama"
    },
    placeSearch: {
      label: "Pretraži lokaciju",
      loading: "Pretražujem...",
      placeholder: "Pretraži lokaciju..."
    },
    routeMenu: {
      actions: "Akcije",
      appearance: "Izgled rute",
      basicColors: "Osnovne boje rute",
      clearRoute: "Obriši rutu",
      color: "Boja rute:",
      colors: {
        blue: "plava",
        green: "zelena",
        orange: "narandžasta",
        purple: "ljubičasta",
        red: "crvena",
        yellow: "žuta"
      },
      dash: "Isprekidana ruta",
      display: "Prikaz",
      file: "Datoteka",
      hidden: "isključeno",
      hideMarkers: "Sakrij oznake",
      loadRoute: "Učitaj rutu",
      opacity: "Vidljivost rute",
      route: "Ruta",
      saveRoute: "Spremi rutu",
      width: "Širina rute"
    },
    mapMenu: {
      aerial: "Satelitska",
      base: "Podloga",
      basic: "Osnovna",
      color: "U boji",
      grayscale: "Crno-bijela",
      layers: "Slojevi",
      map: "Karta",
      mapTone: "Ton karte",
      outdoor: "Turistička",
      saveImage: "Spremi sliku",
      touristRoutes: "Turističke staze",
      winter: "Zimska"
    },
    mapView: {
      missingApiKey: "Nedostaje Mapy.com API ključ.",
      mapLoadFailed: "Kartu nije moguće učitati:",
      placeNotFound: "Lokacija nije pronađena.",
      routeFailed: "Rutu nije moguće ponovo izračunati.",
      routeLoading: "Preračunavam rutu",
      searchFailed: "Pretraga nije uspjela.",
      searchingPlace: "Pretražujem lokaciju..."
    },
    routeSummary: {
      ascent: "Uspon",
      collapse: "Klikni za sažimanje",
      descent: "Spust",
      distance: "Udaljenost",
      duration: "Vrijeme",
      elevationUnavailable: "Visinski profil nije dostupan.",
      export: "Izvoz",
      footer: "Napravio Vašek M. za Michal K.",
      imageProfileSummary:
        "Udaljenost {length} · Vrijeme {duration} · Uspon {ascent} · Spust {descent}",
      loadingElevations: "Učitavam visine",
      points: "Tačke",
      profile: "Visinski profil",
      profilePng: "Profil PNG",
      routeOverview: "Pregled rute",
      segments: "Dionice između tačaka",
      segmentsDoc: "Tabela DOC",
      segmentsTitle: "Dionice rute",
      summaryLine: "Udaljenost: {length} · Vrijeme: {duration} · Uspon: {ascent} · Spust: {descent}"
    },
    routeModes: {
      bike: "Bicikl",
      car: "Auto",
      foot: "Pješke",
      route: "Ruta",
      types: {
        bike_mountain: "Brdski bicikl",
        bike_road: "Cestovni bicikl",
        car_fast: "Auto brza",
        car_fast_traffic: "Auto brza s prometom",
        car_short: "Auto kratka",
        foot_fast: "Pješke brzo",
        foot_hiking: "Planinarenje"
      }
    },
    exportDialog: {
      centerDefault: "Zadani je trenutni centar karte.",
      centerMoved: "Pregled i izvoz koriste pomjereni centar.",
      centerTitle: "Centar velike karte",
      close: "Zatvori",
      currentView: "Trenutni prikaz",
      imageAlt: "Pregled izvoza karte",
      imageSize: "Veličina slike",
      largeMap: "Velika karta",
      mapLoadAlert: "Kartu nije moguće spremiti jer još nije učitana.",
      mapScale: "Mjerilo karte",
      moveCenterDown: "Pomjeri centar dolje",
      moveCenterLeft: "Pomjeri centar lijevo",
      moveCenterRight: "Pomjeri centar desno",
      moveCenterUp: "Pomjeri centar gore",
      noPreview: "Pregled nije dostupan",
      previewLoading: "Generišem pregled",
      resetCenter: "Vrati trenutni centar karte",
      routePartiallyOutside:
        "Dio rute će vjerovatno biti izvan završne slike. Pomjeri kartu bliže ruti, izaberi veću sliku ili mjerilo s većim pokrivanjem.",
      routeOutside:
        "Ruta vjerovatno neće biti na završnoj slici. Pomjeri kartu bliže ruti, izaberi veću sliku ili mjerilo s većim pokrivanjem.",
      save: "Spremi sliku",
      saveFailed: "Sliku nije moguće spremiti. Neka karta ili sloj blokira izvoz.",
      saving: "Spremam...",
      scope: "Opseg",
      scaleFallback: "mjerilo podloge",
      scaleHints: {
        100: "ulice i šumski putevi",
        200: "detaljna turistička karta",
        300: "ruta s bliskom okolinom",
        500: "gradovi i krajolik",
        1000: "šire područje",
        2000: "regija",
        5000: "veliki pregled",
        10000: "država i okolina"
      },
      viewDescription: "Spremiće se tačno trenutni prikaz karte.",
      largeDescription:
        "Spremiće se {width} x {height} pri mjerilu {scale}. Konačni PNG će imati približno {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Obriši tačku"
    },
    routeFile: {
      emptyFile: "Datoteka ne sadrži nijednu tačku rute.",
      loadFailed: "Datoteku rute nije moguće učitati.",
      parseFailed: "GPX datoteku nije moguće pročitati."
    },
    tileJson: {
      missingApiKey: "Nedostaje VITE_MAPY_API_KEY u .env",
      missingTiles: "TileJSON ne sadrži polje tiles[]"
    }
  }
} as const

type DeepStringValues<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DeepStringValues<T[K]>
}

export type Translation = DeepStringValues<(typeof baseTranslations)["en"]>

export const translations = {
  ...baseTranslations,
  de: {
    ...baseTranslations.en,
    appName: "Routenplaner",
    common: {
      close: "Schließen",
      export: "Export",
      github: "GitHub",
      loadingMap: "Karte wird geladen"
    },
    header: {
      browse: "Ansehen",
      freeRoute: "Freie Route",
      language: "Sprache",
      roadRoute: "Route auf Wegen"
    },
    placeSearch: {
      label: "Ort suchen",
      loading: "Suche läuft...",
      placeholder: "Ort suchen..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "Aktionen",
      appearance: "Routenstil",
      basicColors: "Grundfarben der Route",
      clearRoute: "Route löschen",
      color: "Routenfarbe:",
      colors: {
        blue: "blau",
        green: "grün",
        orange: "orange",
        purple: "violett",
        red: "rot",
        yellow: "gelb"
      },
      dash: "Routenstrichelung",
      display: "Anzeige",
      file: "Datei",
      hidden: "aus",
      hideMarkers: "Markierungen ausblenden",
      loadRoute: "Route laden",
      opacity: "Routensichtbarkeit",
      route: "Route",
      saveRoute: "Route speichern",
      width: "Routenbreite"
    },
    mapMenu: {
      aerial: "Luftbild",
      base: "Basiskarte",
      basic: "Standard",
      color: "Farbig",
      grayscale: "Schwarzweiß",
      layers: "Ebenen",
      map: "Karte",
      mapTone: "Kartenton",
      outdoor: "Outdoor",
      saveImage: "Bild speichern",
      touristRoutes: "Touristische Routen",
      winter: "Winter"
    },
    mapView: {
      missingApiKey: "Mapy.com API-Schlüssel fehlt.",
      mapLoadFailed: "Die Karte konnte nicht geladen werden:",
      placeNotFound: "Ort wurde nicht gefunden.",
      routeFailed: "Die Route konnte nicht neu berechnet werden.",
      routeLoading: "Route wird neu berechnet",
      searchFailed: "Suche fehlgeschlagen.",
      searchingPlace: "Ort wird gesucht..."
    },
    routeSummary: {
      ascent: "Aufstieg",
      collapse: "Zum Einklappen klicken",
      descent: "Abstieg",
      distance: "Distanz",
      duration: "Zeit",
      elevationUnavailable: "Höhenprofil ist nicht verfügbar.",
      export: "Export",
      footer: "Erstellt von Vašek M. für Michal K.",
      imageProfileSummary:
        "Distanz {length} - Zeit {duration} - Aufstieg {ascent} - Abstieg {descent}",
      loadingElevations: "Höhen werden geladen",
      points: "Punkte",
      profile: "Höhenprofil",
      profilePng: "Profil PNG",
      routeOverview: "Routenübersicht",
      segments: "Abschnitte zwischen Punkten",
      segmentsDoc: "Tabelle DOC",
      segmentsTitle: "Routenabschnitte",
      summaryLine:
        "Distanz: {length} - Zeit: {duration} - Aufstieg: {ascent} - Abstieg: {descent}"
    },
    routeModes: {
      bike: "Fahrrad",
      car: "Auto",
      foot: "Zu Fuß",
      route: "Route",
      types: {
        bike_mountain: "Mountainbike",
        bike_road: "Rennrad",
        car_fast: "Auto schnell",
        car_fast_traffic: "Auto schnell mit Verkehr",
        car_short: "Auto kurz",
        foot_fast: "Zu Fuß schnell",
        foot_hiking: "Wandern"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "Standard ist die aktuelle Kartenmitte.",
      centerMoved: "Vorschau und Export verwenden die verschobene Mitte.",
      centerTitle: "Mitte der großen Karte",
      close: "Schließen",
      currentView: "Aktuelle Ansicht",
      imageAlt: "Vorschau des Kartenexports",
      imageSize: "Bildgröße",
      largeMap: "Große Karte",
      mapLoadAlert: "Die Karte kann nicht gespeichert werden, weil sie noch nicht geladen ist.",
      mapScale: "Kartenmaßstab",
      moveCenterDown: "Mitte nach unten verschieben",
      moveCenterLeft: "Mitte nach links verschieben",
      moveCenterRight: "Mitte nach rechts verschieben",
      moveCenterUp: "Mitte nach oben verschieben",
      noPreview: "Vorschau ist nicht verfügbar",
      previewLoading: "Vorschau wird erzeugt",
      resetCenter: "Auf aktuelle Kartenmitte zurücksetzen",
      routePartiallyOutside:
        "Ein Teil der Route liegt wahrscheinlich außerhalb des endgültigen Bildes. Verschieben Sie die Karte näher zur Route, wählen Sie ein größeres Bild oder einen Maßstab mit größerer Abdeckung.",
      routeOutside:
        "Die Route wird wahrscheinlich nicht im endgültigen Bild sein. Verschieben Sie die Karte näher zur Route, wählen Sie ein größeres Bild oder einen Maßstab mit größerer Abdeckung.",
      save: "Bild speichern",
      saveFailed: "Das Bild konnte nicht gespeichert werden. Eine Karte oder Ebene blockiert den Export.",
      saving: "Speichern...",
      scope: "Bereich",
      scaleFallback: "Maßstab der Basiskarte",
      scaleHints: {
        100: "Straßen und Waldwege",
        200: "detaillierte Touristenkarte",
        300: "Route mit naher Umgebung",
        500: "Orte und Landschaft",
        1000: "größerer Bereich",
        2000: "Region",
        5000: "große Übersicht",
        10000: "Land und Umgebung"
      },
      viewDescription: "Die aktuelle Kartenansicht wird exakt gespeichert.",
      largeDescription:
        "Speichert {width} x {height} im Maßstab {scale}. Das finale PNG ist ungefähr {size} x {size} px groß."
    },
    markerMenu: {
      removePoint: "Punkt löschen"
    },
    routeFile: {
      emptyFile: "Die Datei enthält keine Routenpunkte.",
      loadFailed: "Die Routendatei konnte nicht geladen werden.",
      parseFailed: "Die GPX-Datei konnte nicht gelesen werden."
    },
    tileJson: {
      missingApiKey: "VITE_MAPY_API_KEY fehlt in .env",
      missingTiles: "TileJSON enthält kein Feld tiles[]"
    }
  },
  fr: {
    ...baseTranslations.en,
    appName: "Créateur d'itinéraires",
    common: {
      close: "Fermer",
      export: "Exporter",
      github: "GitHub",
      loadingMap: "Chargement de la carte"
    },
    header: {
      browse: "Parcourir",
      freeRoute: "Itinéraire libre",
      language: "Langue",
      roadRoute: "Itinéraire sur routes"
    },
    placeSearch: {
      label: "Rechercher un lieu",
      loading: "Recherche...",
      placeholder: "Rechercher un lieu..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "Actions",
      appearance: "Style de l'itinéraire",
      basicColors: "Couleurs de base de l'itinéraire",
      clearRoute: "Effacer l'itinéraire",
      color: "Couleur de l'itinéraire:",
      colors: {
        blue: "bleu",
        green: "vert",
        orange: "orange",
        purple: "violet",
        red: "rouge",
        yellow: "jaune"
      },
      dash: "Pointillés de l'itinéraire",
      display: "Affichage",
      file: "Fichier",
      hidden: "désactivé",
      hideMarkers: "Masquer les marqueurs",
      loadRoute: "Charger l'itinéraire",
      opacity: "Visibilité de l'itinéraire",
      route: "Itinéraire",
      saveRoute: "Enregistrer l'itinéraire",
      width: "Largeur de l'itinéraire"
    },
    mapMenu: {
      aerial: "Aérienne",
      base: "Fond de carte",
      basic: "Basique",
      color: "Couleur",
      grayscale: "Noir et blanc",
      layers: "Couches",
      map: "Carte",
      mapTone: "Ton de la carte",
      outdoor: "Outdoor",
      saveImage: "Enregistrer l'image",
      touristRoutes: "Itinéraires touristiques",
      winter: "Hiver"
    },
    mapView: {
      missingApiKey: "Clé API Mapy.com manquante.",
      mapLoadFailed: "Impossible de charger la carte:",
      placeNotFound: "Lieu introuvable.",
      routeFailed: "Impossible de recalculer l'itinéraire.",
      routeLoading: "Recalcul de l'itinéraire",
      searchFailed: "La recherche a échoué.",
      searchingPlace: "Recherche du lieu..."
    },
    routeSummary: {
      ascent: "Montée",
      collapse: "Cliquer pour réduire",
      descent: "Descente",
      distance: "Distance",
      duration: "Temps",
      elevationUnavailable: "Le profil d'altitude n'est pas disponible.",
      export: "Exporter",
      footer: "Créé par Vašek M. pour Michal K.",
      imageProfileSummary:
        "Distance {length} - Temps {duration} - Montée {ascent} - Descente {descent}",
      loadingElevations: "Chargement des altitudes",
      points: "Points",
      profile: "Profil d'altitude",
      profilePng: "Profil PNG",
      routeOverview: "Aperçu de l'itinéraire",
      segments: "Segments entre les points",
      segmentsDoc: "Tableau DOC",
      segmentsTitle: "Segments de l'itinéraire",
      summaryLine:
        "Distance: {length} - Temps: {duration} - Montée: {ascent} - Descente: {descent}"
    },
    routeModes: {
      bike: "Vélo",
      car: "Voiture",
      foot: "À pied",
      route: "Itinéraire",
      types: {
        bike_mountain: "VTT",
        bike_road: "Vélo de route",
        car_fast: "Voiture rapide",
        car_fast_traffic: "Voiture rapide avec trafic",
        car_short: "Voiture court",
        foot_fast: "À pied rapide",
        foot_hiking: "Randonnée"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "Par défaut, le centre actuel de la carte est utilisé.",
      centerMoved: "L'aperçu et l'export utilisent le centre déplacé.",
      centerTitle: "Centre de la grande carte",
      close: "Fermer",
      currentView: "Vue actuelle",
      imageAlt: "Aperçu de l'export de carte",
      imageSize: "Taille de l'image",
      largeMap: "Grande carte",
      mapLoadAlert: "La carte ne peut pas être enregistrée car elle n'est pas encore chargée.",
      mapScale: "Échelle de la carte",
      moveCenterDown: "Déplacer le centre vers le bas",
      moveCenterLeft: "Déplacer le centre vers la gauche",
      moveCenterRight: "Déplacer le centre vers la droite",
      moveCenterUp: "Déplacer le centre vers le haut",
      noPreview: "L'aperçu n'est pas disponible",
      previewLoading: "Génération de l'aperçu",
      resetCenter: "Revenir au centre actuel de la carte",
      routePartiallyOutside:
        "Une partie de l'itinéraire sera probablement hors de l'image finale. Déplacez la carte plus près de l'itinéraire, choisissez une image plus grande ou une échelle couvrant une zone plus large.",
      routeOutside:
        "L'itinéraire ne sera probablement pas dans l'image finale. Déplacez la carte plus près de l'itinéraire, choisissez une image plus grande ou une échelle couvrant une zone plus large.",
      save: "Enregistrer l'image",
      saveFailed: "Impossible d'enregistrer l'image. Une carte ou une couche bloque l'export.",
      saving: "Enregistrement...",
      scope: "Portée",
      scaleFallback: "échelle du fond de carte",
      scaleHints: {
        100: "rues et chemins forestiers",
        200: "carte touristique détaillée",
        300: "itinéraire avec les environs proches",
        500: "villes et paysage",
        1000: "zone plus large",
        2000: "région",
        5000: "grand aperçu",
        10000: "pays et environs"
      },
      viewDescription: "La vue actuelle de la carte sera enregistrée exactement.",
      largeDescription:
        "Enregistre {width} x {height} à l'échelle {scale}. Le PNG final fera environ {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Supprimer le point"
    },
    routeFile: {
      emptyFile: "Le fichier ne contient aucun point d'itinéraire.",
      loadFailed: "Impossible de charger le fichier d'itinéraire.",
      parseFailed: "Impossible de lire le fichier GPX."
    },
    tileJson: {
      missingApiKey: "VITE_MAPY_API_KEY manquant dans .env",
      missingTiles: "TileJSON ne contient pas le champ tiles[]"
    }
  },
  hu: {
    ...baseTranslations.en,
    appName: "Útvonaltervező",
    common: {
      close: "Bezárás",
      export: "Export",
      github: "GitHub",
      loadingMap: "Térkép betöltése"
    },
    header: {
      browse: "Böngészés",
      freeRoute: "Szabad útvonal",
      language: "Nyelv",
      roadRoute: "Útvonal utakon"
    },
    placeSearch: {
      label: "Hely keresése",
      loading: "Keresés...",
      placeholder: "Hely keresése..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "Műveletek",
      appearance: "Útvonal stílusa",
      basicColors: "Alap útvonalszínek",
      clearRoute: "Útvonal törlése",
      color: "Útvonal színe:",
      colors: {
        blue: "kék",
        green: "zöld",
        orange: "narancs",
        purple: "lila",
        red: "piros",
        yellow: "sárga"
      },
      dash: "Útvonal szaggatása",
      display: "Megjelenítés",
      file: "Fájl",
      hidden: "ki",
      hideMarkers: "Jelölők elrejtése",
      loadRoute: "Útvonal betöltése",
      opacity: "Útvonal láthatósága",
      route: "Útvonal",
      saveRoute: "Útvonal mentése",
      width: "Útvonal szélessége"
    },
    mapMenu: {
      aerial: "Légi",
      base: "Alaptérkép",
      basic: "Alap",
      color: "Színes",
      grayscale: "Fekete-fehér",
      layers: "Rétegek",
      map: "Térkép",
      mapTone: "Térkép tónusa",
      outdoor: "Túra",
      saveImage: "Kép mentése",
      touristRoutes: "Turistaútvonalak",
      winter: "Téli"
    },
    mapView: {
      missingApiKey: "Hiányzik a Mapy.com API-kulcs.",
      mapLoadFailed: "A térkép nem tölthető be:",
      placeNotFound: "A hely nem található.",
      routeFailed: "Az útvonal nem számítható újra.",
      routeLoading: "Útvonal újraszámítása",
      searchFailed: "A keresés sikertelen.",
      searchingPlace: "Hely keresése..."
    },
    routeSummary: {
      ascent: "Emelkedés",
      collapse: "Kattintás az összecsukáshoz",
      descent: "Süllyedés",
      distance: "Távolság",
      duration: "Idő",
      elevationUnavailable: "A magassági profil nem érhető el.",
      export: "Export",
      footer: "Készítette Vašek M. Michal K. számára",
      imageProfileSummary:
        "Távolság {length} - Idő {duration} - Emelkedés {ascent} - Süllyedés {descent}",
      loadingElevations: "Magasságok betöltése",
      points: "Pontok",
      profile: "Magassági profil",
      profilePng: "Profil PNG",
      routeOverview: "Útvonal áttekintése",
      segments: "Szakaszok a pontok között",
      segmentsDoc: "Táblázat DOC",
      segmentsTitle: "Útvonalszakaszok",
      summaryLine:
        "Távolság: {length} - Idő: {duration} - Emelkedés: {ascent} - Süllyedés: {descent}"
    },
    routeModes: {
      bike: "Kerékpár",
      car: "Autó",
      foot: "Gyalog",
      route: "Útvonal",
      types: {
        bike_mountain: "Mountain bike",
        bike_road: "Országúti kerékpár",
        car_fast: "Autó gyors",
        car_fast_traffic: "Autó gyors forgalommal",
        car_short: "Autó rövid",
        foot_fast: "Gyalog gyors",
        foot_hiking: "Túrázás"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "Alapértelmezésként a térkép aktuális közepe használatos.",
      centerMoved: "Az előnézet és az export az eltoltatott középpontot használja.",
      centerTitle: "Nagy térkép közepe",
      close: "Bezárás",
      currentView: "Aktuális nézet",
      imageAlt: "Térképexport előnézete",
      imageSize: "Képméret",
      largeMap: "Nagy térkép",
      mapLoadAlert: "A térkép nem menthető, mert még nem töltődött be.",
      mapScale: "Térkép méretaránya",
      moveCenterDown: "Középpont lefelé",
      moveCenterLeft: "Középpont balra",
      moveCenterRight: "Középpont jobbra",
      moveCenterUp: "Középpont felfelé",
      noPreview: "Az előnézet nem érhető el",
      previewLoading: "Előnézet készítése",
      resetCenter: "Vissza az aktuális térképközépre",
      routePartiallyOutside:
        "Az útvonal egy része valószínűleg a végső képen kívül lesz. Húzza közelebb a térképet az útvonalhoz, válasszon nagyobb képet vagy nagyobb lefedésű méretarányt.",
      routeOutside:
        "Az útvonal valószínűleg nem lesz rajta a végső képen. Húzza közelebb a térképet az útvonalhoz, válasszon nagyobb képet vagy nagyobb lefedésű méretarányt.",
      save: "Kép mentése",
      saveFailed: "A képet nem sikerült menteni. Egy térkép vagy réteg blokkolja az exportot.",
      saving: "Mentés...",
      scope: "Tartomány",
      scaleFallback: "alaptérkép méretaránya",
      scaleHints: {
        100: "utcák és erdei utak",
        200: "részletes turistatérkép",
        300: "útvonal közeli környezettel",
        500: "városok és táj",
        1000: "tágabb terület",
        2000: "régió",
        5000: "nagy áttekintés",
        10000: "ország és környéke"
      },
      viewDescription: "Pontosan az aktuális térképnézet lesz mentve.",
      largeDescription:
        "{width} x {height} mentése {scale} méretaránnyal. A végső PNG körülbelül {size} x {size} px lesz."
    },
    markerMenu: {
      removePoint: "Pont törlése"
    },
    routeFile: {
      emptyFile: "A fájl nem tartalmaz útvonalpontokat.",
      loadFailed: "Az útvonalfájl nem tölthető be.",
      parseFailed: "A GPX-fájl nem olvasható."
    },
    tileJson: {
      missingApiKey: "Hiányzik a VITE_MAPY_API_KEY a .env fájlból",
      missingTiles: "A TileJSON nem tartalmaz tiles[] mezőt"
    }
  },
  fi: {
    ...baseTranslations.en,
    appName: "Reittisuunnittelija",
    common: {
      close: "Sulje",
      export: "Vie",
      github: "GitHub",
      loadingMap: "Karttaa ladataan"
    },
    header: {
      browse: "Selaa",
      freeRoute: "Vapaa reitti",
      language: "Kieli",
      roadRoute: "Reitti teitä pitkin"
    },
    placeSearch: {
      label: "Hae paikkaa",
      loading: "Haetaan...",
      placeholder: "Hae paikkaa..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "Toiminnot",
      appearance: "Reitin tyyli",
      basicColors: "Reitin perusvärit",
      clearRoute: "Tyhjennä reitti",
      color: "Reitin väri:",
      colors: {
        blue: "sininen",
        green: "vihreä",
        orange: "oranssi",
        purple: "violetti",
        red: "punainen",
        yellow: "keltainen"
      },
      dash: "Reitin katkoviiva",
      display: "Näyttö",
      file: "Tiedosto",
      hidden: "pois",
      hideMarkers: "Piilota merkit",
      loadRoute: "Lataa reitti",
      opacity: "Reitin näkyvyys",
      route: "Reitti",
      saveRoute: "Tallenna reitti",
      width: "Reitin leveys"
    },
    mapMenu: {
      aerial: "Ilmakuva",
      base: "Pohjakartta",
      basic: "Perus",
      color: "Väri",
      grayscale: "Mustavalkoinen",
      layers: "Tasot",
      map: "Kartta",
      mapTone: "Kartan sävy",
      outdoor: "Ulkoilu",
      saveImage: "Tallenna kuva",
      touristRoutes: "Matkailureitit",
      winter: "Talvi"
    },
    mapView: {
      missingApiKey: "Mapy.com API-avain puuttuu.",
      mapLoadFailed: "Karttaa ei voitu ladata:",
      placeNotFound: "Paikkaa ei löytynyt.",
      routeFailed: "Reittiä ei voitu laskea uudelleen.",
      routeLoading: "Lasketaan reittiä uudelleen",
      searchFailed: "Haku epäonnistui.",
      searchingPlace: "Haetaan paikkaa..."
    },
    routeSummary: {
      ascent: "Nousu",
      collapse: "Kutista napsauttamalla",
      descent: "Lasku",
      distance: "Etäisyys",
      duration: "Aika",
      elevationUnavailable: "Korkeusprofiili ei ole saatavilla.",
      export: "Vie",
      footer: "Tehnyt Vašek M. Michal K.:lle",
      imageProfileSummary: "Etäisyys {length} - Aika {duration} - Nousu {ascent} - Lasku {descent}",
      loadingElevations: "Korkeuksia ladataan",
      points: "Pisteet",
      profile: "Korkeusprofiili",
      profilePng: "Profiili PNG",
      routeOverview: "Reitin yhteenveto",
      segments: "Pisteiden väliset osuudet",
      segmentsDoc: "Taulukko DOC",
      segmentsTitle: "Reittiosuudet",
      summaryLine: "Etäisyys: {length} - Aika: {duration} - Nousu: {ascent} - Lasku: {descent}"
    },
    routeModes: {
      bike: "Pyörä",
      car: "Auto",
      foot: "Kävellen",
      route: "Reitti",
      types: {
        bike_mountain: "Maastopyörä",
        bike_road: "Maantiepyörä",
        car_fast: "Auto nopea",
        car_fast_traffic: "Auto nopea liikenteellä",
        car_short: "Auto lyhyt",
        foot_fast: "Kävellen nopeasti",
        foot_hiking: "Vaellus"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "Oletuksena käytetään kartan nykyistä keskikohtaa.",
      centerMoved: "Esikatselu ja vienti käyttävät siirrettyä keskikohtaa.",
      centerTitle: "Suuren kartan keskikohta",
      close: "Sulje",
      currentView: "Nykyinen näkymä",
      imageAlt: "Karttaviennin esikatselu",
      imageSize: "Kuvan koko",
      largeMap: "Suuri kartta",
      mapLoadAlert: "Karttaa ei voi tallentaa, koska se ei ole vielä latautunut.",
      mapScale: "Kartan mittakaava",
      moveCenterDown: "Siirrä keskikohtaa alas",
      moveCenterLeft: "Siirrä keskikohtaa vasemmalle",
      moveCenterRight: "Siirrä keskikohtaa oikealle",
      moveCenterUp: "Siirrä keskikohtaa ylös",
      noPreview: "Esikatselu ei ole saatavilla",
      previewLoading: "Luodaan esikatselua",
      resetCenter: "Palauta nykyiseen kartan keskikohtaan",
      routePartiallyOutside:
        "Osa reitistä jää todennäköisesti lopullisen kuvan ulkopuolelle. Siirrä karttaa lähemmäs reittiä, valitse suurempi kuva tai laajemman peiton mittakaava.",
      routeOutside:
        "Reitti ei todennäköisesti näy lopullisessa kuvassa. Siirrä karttaa lähemmäs reittiä, valitse suurempi kuva tai laajemman peiton mittakaava.",
      save: "Tallenna kuva",
      saveFailed: "Kuvaa ei voitu tallentaa. Kartta tai taso estää viennin.",
      saving: "Tallennetaan...",
      scope: "Alue",
      scaleFallback: "pohjakartan mittakaava",
      scaleHints: {
        100: "kadut ja metsätiet",
        200: "yksityiskohtainen matkailukartta",
        300: "reitti lähialueineen",
        500: "kaupungit ja maisema",
        1000: "laajempi alue",
        2000: "alue",
        5000: "laaja yleiskuva",
        10000: "maa ja ympäristö"
      },
      viewDescription: "Nykyinen karttanäkymä tallennetaan täsmälleen.",
      largeDescription:
        "Tallentaa {width} x {height} mittakaavassa {scale}. Lopullinen PNG on noin {size} x {size} px."
    },
    markerMenu: {
      removePoint: "Poista piste"
    },
    routeFile: {
      emptyFile: "Tiedosto ei sisällä reittipisteitä.",
      loadFailed: "Reittitiedostoa ei voitu ladata.",
      parseFailed: "GPX-tiedostoa ei voitu lukea."
    },
    tileJson: {
      missingApiKey: "VITE_MAPY_API_KEY puuttuu .env-tiedostosta",
      missingTiles: "TileJSON ei sisällä tiles[]-kenttää"
    }
  },
  vi: {
    ...baseTranslations.en,
    appName: "Tạo tuyến đường",
    common: {
      close: "Đóng",
      export: "Xuất",
      github: "GitHub",
      loadingMap: "Đang tải bản đồ"
    },
    header: {
      browse: "Xem bản đồ",
      freeRoute: "Tuyến tự do",
      language: "Ngôn ngữ",
      roadRoute: "Tuyến theo đường"
    },
    placeSearch: {
      label: "Tìm địa điểm",
      loading: "Đang tìm...",
      placeholder: "Tìm địa điểm..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "Thao tác",
      appearance: "Kiểu tuyến đường",
      basicColors: "Màu tuyến cơ bản",
      clearRoute: "Xóa tuyến",
      color: "Màu tuyến:",
      colors: {
        blue: "xanh dương",
        green: "xanh lá",
        orange: "cam",
        purple: "tím",
        red: "đỏ",
        yellow: "vàng"
      },
      dash: "Nét đứt của tuyến",
      display: "Hiển thị",
      file: "Tệp",
      hidden: "tắt",
      hideMarkers: "Ẩn điểm đánh dấu",
      loadRoute: "Tải tuyến",
      opacity: "Độ hiển thị tuyến",
      route: "Tuyến",
      saveRoute: "Lưu tuyến",
      width: "Độ rộng tuyến"
    },
    mapMenu: {
      aerial: "Vệ tinh",
      base: "Nền bản đồ",
      basic: "Cơ bản",
      color: "Màu",
      grayscale: "Đen trắng",
      layers: "Lớp",
      map: "Bản đồ",
      mapTone: "Tông bản đồ",
      outdoor: "Ngoài trời",
      saveImage: "Lưu ảnh",
      touristRoutes: "Tuyến du lịch",
      winter: "Mùa đông"
    },
    mapView: {
      missingApiKey: "Thiếu khóa API Mapy.com.",
      mapLoadFailed: "Không tải được bản đồ:",
      placeNotFound: "Không tìm thấy địa điểm.",
      routeFailed: "Không tính lại được tuyến.",
      routeLoading: "Đang tính lại tuyến",
      searchFailed: "Tìm kiếm thất bại.",
      searchingPlace: "Đang tìm địa điểm..."
    },
    routeSummary: {
      ascent: "Lên dốc",
      collapse: "Bấm để thu gọn",
      descent: "Xuống dốc",
      distance: "Khoảng cách",
      duration: "Thời gian",
      elevationUnavailable: "Không có biểu đồ độ cao.",
      export: "Xuất",
      footer: "Tạo bởi Vašek M. cho Michal K.",
      imageProfileSummary:
        "Khoảng cách {length} - Thời gian {duration} - Lên {ascent} - Xuống {descent}",
      loadingElevations: "Đang tải độ cao",
      points: "Điểm",
      profile: "Biểu đồ độ cao",
      profilePng: "Biểu đồ PNG",
      routeOverview: "Tổng quan tuyến",
      segments: "Các đoạn giữa điểm",
      segmentsDoc: "Bảng DOC",
      segmentsTitle: "Các đoạn tuyến",
      summaryLine:
        "Khoảng cách: {length} - Thời gian: {duration} - Lên: {ascent} - Xuống: {descent}"
    },
    routeModes: {
      bike: "Xe đạp",
      car: "Ô tô",
      foot: "Đi bộ",
      route: "Tuyến",
      types: {
        bike_mountain: "Xe đạp địa hình",
        bike_road: "Xe đạp đường trường",
        car_fast: "Ô tô nhanh",
        car_fast_traffic: "Ô tô nhanh có giao thông",
        car_short: "Ô tô ngắn",
        foot_fast: "Đi bộ nhanh",
        foot_hiking: "Đi bộ du lịch"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "Mặc định là tâm bản đồ hiện tại.",
      centerMoved: "Xem trước và xuất dùng tâm đã dịch chuyển.",
      centerTitle: "Tâm bản đồ lớn",
      close: "Đóng",
      currentView: "Khung nhìn hiện tại",
      imageAlt: "Xem trước ảnh xuất bản đồ",
      imageSize: "Kích thước ảnh",
      largeMap: "Bản đồ lớn",
      mapLoadAlert: "Không thể lưu bản đồ vì bản đồ chưa tải xong.",
      mapScale: "Tỉ lệ bản đồ",
      moveCenterDown: "Dịch tâm xuống",
      moveCenterLeft: "Dịch tâm sang trái",
      moveCenterRight: "Dịch tâm sang phải",
      moveCenterUp: "Dịch tâm lên",
      noPreview: "Không có bản xem trước",
      previewLoading: "Đang tạo xem trước",
      resetCenter: "Đặt lại về tâm bản đồ hiện tại",
      save: "Lưu ảnh",
      saving: "Đang lưu...",
      scope: "Phạm vi",
      scaleFallback: "tỉ lệ nền bản đồ",
      viewDescription: "Sẽ lưu đúng khung nhìn bản đồ hiện tại."
    },
    markerMenu: {
      removePoint: "Xóa điểm"
    },
    routeFile: {
      emptyFile: "Tệp không chứa điểm tuyến nào.",
      loadFailed: "Không tải được tệp tuyến.",
      parseFailed: "Không đọc được tệp GPX."
    },
    tileJson: {
      missingApiKey: "Thiếu VITE_MAPY_API_KEY trong .env",
      missingTiles: "TileJSON không chứa trường tiles[]"
    }
  },
  ko: {
    ...baseTranslations.en,
    appName: "Route Maker",
    common: {
      close: "닫기",
      export: "내보내기",
      github: "GitHub",
      loadingMap: "지도 로딩 중"
    },
    header: {
      browse: "보기",
      freeRoute: "자유 경로",
      language: "언어",
      roadRoute: "도로 경로"
    },
    placeSearch: {
      label: "장소 검색",
      loading: "검색 중...",
      placeholder: "장소 검색..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "동작",
      appearance: "경로 스타일",
      basicColors: "기본 경로 색상",
      clearRoute: "경로 지우기",
      color: "경로 색상:",
      colors: {
        blue: "파란색",
        green: "초록색",
        orange: "주황색",
        purple: "보라색",
        red: "빨간색",
        yellow: "노란색"
      },
      dash: "경로 점선",
      display: "표시",
      file: "파일",
      hidden: "꺼짐",
      hideMarkers: "마커 숨기기",
      loadRoute: "경로 불러오기",
      opacity: "경로 투명도",
      route: "경로",
      saveRoute: "경로 저장",
      width: "경로 너비"
    },
    mapMenu: {
      aerial: "항공",
      base: "기본 지도",
      basic: "기본",
      color: "컬러",
      grayscale: "흑백",
      layers: "레이어",
      map: "지도",
      mapTone: "지도 톤",
      outdoor: "아웃도어",
      saveImage: "이미지 저장",
      touristRoutes: "관광 경로",
      winter: "겨울"
    },
    mapView: {
      missingApiKey: "Mapy.com API 키가 없습니다.",
      mapLoadFailed: "지도를 불러오지 못했습니다:",
      placeNotFound: "장소를 찾을 수 없습니다.",
      routeFailed: "경로를 다시 계산하지 못했습니다.",
      routeLoading: "경로 다시 계산 중",
      searchFailed: "검색에 실패했습니다.",
      searchingPlace: "장소 검색 중..."
    },
    routeSummary: {
      ascent: "오르막",
      collapse: "클릭하여 접기",
      descent: "내리막",
      distance: "거리",
      duration: "시간",
      elevationUnavailable: "고도 프로필을 사용할 수 없습니다.",
      export: "내보내기",
      footer: "Vašek M.이 Michal K.를 위해 제작",
      imageProfileSummary: "거리 {length} - 시간 {duration} - 오르막 {ascent} - 내리막 {descent}",
      loadingElevations: "고도 로딩 중",
      points: "지점",
      profile: "고도 프로필",
      profilePng: "프로필 PNG",
      routeOverview: "경로 개요",
      segments: "지점 사이 구간",
      segmentsDoc: "표 DOC",
      segmentsTitle: "경로 구간",
      summaryLine: "거리: {length} - 시간: {duration} - 오르막: {ascent} - 내리막: {descent}"
    },
    routeModes: {
      bike: "자전거",
      car: "자동차",
      foot: "도보",
      route: "경로",
      types: {
        bike_mountain: "산악 자전거",
        bike_road: "로드 자전거",
        car_fast: "자동차 빠른 경로",
        car_fast_traffic: "자동차 빠른 경로(교통 반영)",
        car_short: "자동차 짧은 경로",
        foot_fast: "도보 빠른 경로",
        foot_hiking: "하이킹"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "기본값은 현재 지도 중심입니다.",
      centerMoved: "미리보기와 내보내기는 이동된 중심을 사용합니다.",
      centerTitle: "큰 지도 중심",
      close: "닫기",
      currentView: "현재 보기",
      imageAlt: "지도 내보내기 미리보기",
      imageSize: "이미지 크기",
      largeMap: "큰 지도",
      mapLoadAlert: "지도가 아직 로드되지 않아 저장할 수 없습니다.",
      mapScale: "지도 축척",
      moveCenterDown: "중심 아래로 이동",
      moveCenterLeft: "중심 왼쪽으로 이동",
      moveCenterRight: "중심 오른쪽으로 이동",
      moveCenterUp: "중심 위로 이동",
      noPreview: "미리보기를 사용할 수 없습니다",
      previewLoading: "미리보기 생성 중",
      resetCenter: "현재 지도 중심으로 재설정",
      save: "이미지 저장",
      saving: "저장 중...",
      scope: "범위",
      scaleFallback: "기본 지도 축척",
      viewDescription: "현재 지도 보기를 그대로 저장합니다."
    },
    markerMenu: {
      removePoint: "지점 삭제"
    },
    routeFile: {
      emptyFile: "파일에 경로 지점이 없습니다.",
      loadFailed: "경로 파일을 불러오지 못했습니다.",
      parseFailed: "GPX 파일을 읽지 못했습니다."
    },
    tileJson: {
      missingApiKey: ".env에 VITE_MAPY_API_KEY가 없습니다",
      missingTiles: "TileJSON에 tiles[] 필드가 없습니다"
    }
  },
  ja: {
    ...baseTranslations.en,
    appName: "ルートメーカー",
    common: {
      close: "閉じる",
      export: "エクスポート",
      github: "GitHub",
      loadingMap: "地図を読み込み中"
    },
    header: {
      browse: "閲覧",
      freeRoute: "自由ルート",
      language: "言語",
      roadRoute: "道路沿いルート"
    },
    placeSearch: {
      label: "場所を検索",
      loading: "検索中...",
      placeholder: "場所を検索..."
    },
    routeMenu: {
      ...baseTranslations.en.routeMenu,
      actions: "操作",
      appearance: "ルートの見た目",
      basicColors: "基本のルート色",
      clearRoute: "ルートを消去",
      color: "ルート色:",
      colors: {
        blue: "青",
        green: "緑",
        orange: "オレンジ",
        purple: "紫",
        red: "赤",
        yellow: "黄"
      },
      dash: "ルートの破線",
      display: "表示",
      file: "ファイル",
      hidden: "オフ",
      hideMarkers: "マーカーを非表示",
      loadRoute: "ルートを読み込む",
      opacity: "ルートの表示濃度",
      route: "ルート",
      saveRoute: "ルートを保存",
      width: "ルートの幅"
    },
    mapMenu: {
      aerial: "航空写真",
      base: "ベースマップ",
      basic: "基本",
      color: "カラー",
      grayscale: "白黒",
      layers: "レイヤー",
      map: "地図",
      mapTone: "地図の色調",
      outdoor: "アウトドア",
      saveImage: "画像を保存",
      touristRoutes: "観光ルート",
      winter: "冬"
    },
    mapView: {
      missingApiKey: "Mapy.com APIキーがありません。",
      mapLoadFailed: "地図を読み込めませんでした:",
      placeNotFound: "場所が見つかりませんでした。",
      routeFailed: "ルートを再計算できませんでした。",
      routeLoading: "ルートを再計算中",
      searchFailed: "検索に失敗しました。",
      searchingPlace: "場所を検索中..."
    },
    routeSummary: {
      ascent: "上り",
      collapse: "クリックして折りたたむ",
      descent: "下り",
      distance: "距離",
      duration: "時間",
      elevationUnavailable: "標高プロファイルは利用できません。",
      export: "エクスポート",
      footer: "Vašek M. が Michal K. のために作成",
      imageProfileSummary: "距離 {length} - 時間 {duration} - 上り {ascent} - 下り {descent}",
      loadingElevations: "標高を読み込み中",
      points: "地点",
      profile: "標高プロファイル",
      profilePng: "プロファイル PNG",
      routeOverview: "ルート概要",
      segments: "地点間の区間",
      segmentsDoc: "表 DOC",
      segmentsTitle: "ルート区間",
      summaryLine: "距離: {length} - 時間: {duration} - 上り: {ascent} - 下り: {descent}"
    },
    routeModes: {
      bike: "自転車",
      car: "車",
      foot: "徒歩",
      route: "ルート",
      types: {
        bike_mountain: "マウンテンバイク",
        bike_road: "ロードバイク",
        car_fast: "車・高速",
        car_fast_traffic: "車・高速（交通量考慮）",
        car_short: "車・短距離",
        foot_fast: "徒歩・速い",
        foot_hiking: "ハイキング"
      }
    },
    exportDialog: {
      ...baseTranslations.en.exportDialog,
      centerDefault: "既定では現在の地図中心を使います。",
      centerMoved: "プレビューとエクスポートは移動後の中心を使います。",
      centerTitle: "大きい地図の中心",
      close: "閉じる",
      currentView: "現在の表示範囲",
      imageAlt: "地図エクスポートのプレビュー",
      imageSize: "画像サイズ",
      largeMap: "大きい地図",
      mapLoadAlert: "地図がまだ読み込まれていないため保存できません。",
      mapScale: "地図の縮尺",
      moveCenterDown: "中心を下へ移動",
      moveCenterLeft: "中心を左へ移動",
      moveCenterRight: "中心を右へ移動",
      moveCenterUp: "中心を上へ移動",
      noPreview: "プレビューは利用できません",
      previewLoading: "プレビューを生成中",
      resetCenter: "現在の地図中心に戻す",
      routePartiallyOutside:
        "ルートの一部が最終画像の外に出る可能性があります。地図をルートに近づけるか、より大きい画像または広い範囲を含む縮尺を選んでください。",
      routeOutside:
        "ルートが最終画像に入らない可能性があります。地図をルートに近づけるか、より大きい画像または広い範囲を含む縮尺を選んでください。",
      save: "画像を保存",
      saveFailed: "画像を保存できませんでした。地図またはレイヤーがエクスポートをブロックしています。",
      saving: "保存中...",
      scope: "範囲",
      scaleFallback: "ベースマップの縮尺",
      scaleHints: {
        100: "道路と林道",
        200: "詳細な観光地図",
        300: "ルートと周辺",
        500: "街と地形",
        1000: "広い範囲",
        2000: "地域",
        5000: "大きな概要",
        10000: "国と周辺"
      },
      viewDescription: "現在の地図表示をそのまま保存します。",
      largeDescription:
        "{scale} の縮尺で {width} x {height} を保存します。最終PNGは約 {size} x {size} px になります。"
    },
    markerMenu: {
      removePoint: "地点を削除"
    },
    routeFile: {
      emptyFile: "ファイルにルート地点が含まれていません。",
      loadFailed: "ルートファイルを読み込めませんでした。",
      parseFailed: "GPXファイルを読み取れませんでした。"
    },
    tileJson: {
      missingApiKey: ".env に VITE_MAPY_API_KEY がありません",
      missingTiles: "TileJSON に tiles[] フィールドがありません"
    }
  }
} satisfies Record<Language, Translation>

export const routeTypeLabel = (routeType: RouteType, language: Language) =>
  translations[language].routeModes.types[routeType]

export const interpolate = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  )
