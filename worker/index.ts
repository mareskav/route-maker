export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    const match = url.pathname.match(/^\/api\/touristOverlay\/(\d+)\/(\d+)\/(\d+)$/)
    if (!match) {
      return new Response("Not found", { status: 404 })
    }

    const [, z, x, y] = match

    if (!/^\d+$/.test(z) || !/^\d+$/.test(x) || !/^\d+$/.test(y)) {
      return new Response("Invalid tile coordinates", { status: 400 })
    }

    const cache = caches.default
    const cacheKey = new Request(url.toString(), request)

    const cached = await cache.match(cacheKey)
    if (cached) {
      const headers = new Headers(cached.headers)
      headers.set("X-RouteMaker-Cache", "HIT")
      return new Response(cached.body, {
        status: cached.status,
        headers
      })
    }

    const upstreamUrl = `https://mapserver.mapy.cz/hybrid-turist-m/${z}-${x}-${y}`

    const upstream = await fetch(upstreamUrl, {
      headers: {
        Origin: "https://mapy.com",
        Referer: "https://mapy.com/",
        "User-Agent": "Mozilla/5.0"
      },
      cf: {
        cacheEverything: true,
        cacheTtl: 60 * 60 * 24 * 7,
        cacheTtlByStatus: {
          "200-299": 60 * 60 * 24 * 7,
          "404": 60,
          "500-599": 0
        }
      }
    })

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, {
        status: upstream.status
      })
    }

    const headers = new Headers(upstream.headers)
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800, immutable")
    headers.set("X-RouteMaker-Cache", "MISS")

    const response = new Response(upstream.body, {
      status: upstream.status,
      headers
    })

    ctx.waitUntil(cache.put(cacheKey, response.clone()))

    return response
  }
}
