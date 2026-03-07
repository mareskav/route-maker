interface Env {}

export default {
  async fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 })
    }

    const url = new URL(request.url)

    const match = url.pathname.match(/^\/api\/touristOverlay\/(\d+)\/(\d+)\/(\d+)$/)
    if (!match) {
      return new Response("Not found", { status: 404 })
    }

    const [, z, x, y] = match

    const cacheUrl = new URL(request.url)
    cacheUrl.search = ""

    const workerCaches = caches as typeof caches & { default: Cache }
    const cache = workerCaches.default
    const cacheKey = new Request(cacheUrl.toString(), { method: "GET" })

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

    const headers = new Headers()
    headers.set("Content-Type", upstream.headers.get("Content-Type") ?? "image/png")
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800, immutable")
    headers.set("Access-Control-Allow-Origin", "*")
    headers.set("X-RouteMaker-Cache", "MISS")

    const response = new Response(upstream.body, {
      status: upstream.status,
      headers
    })

    ctx.waitUntil(cache.put(cacheKey, response.clone()))

    return response
  }
}
