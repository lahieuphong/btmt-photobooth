const STATIC_CACHE = 'btmt-photobooth-static-v2'

const PRECACHE_ASSETS = [
  'images/backgrounds/optimized/bg_removal.svg',
  'images/illustrations/camera.svg',
  'images/layouts/optimized/photo-grid-2x2.svg',
  'images/layouts/optimized/photo-stack-4.svg',
  'images/layouts/optimized/photo-grid-2x3.svg',
  'images/logos/logo.svg',
]

function getScopedAssetUrl(path) {
  return new URL(path, self.registration.scope).toString()
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_ASSETS.map((path) => cache.add(getScopedAssetUrl(path))),
        ),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== STATIC_CACHE)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return
  }

  const isStaticImageAsset =
    /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i.test(url.pathname)

  if (!isStaticImageAsset) {
    return
  }

  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cachedResponse = await cache.match(request, { ignoreSearch: true })

      if (cachedResponse) {
        return cachedResponse
      }

      const networkResponse = await fetch(request)

      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }

      return networkResponse
    }),
  )
})
