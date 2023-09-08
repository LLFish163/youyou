const version = 1;
const cacheName = `font-cache-v${version}`;
const fetch_later = ['.html', 'github.svg'];
const black_list = ['/repos/LLFish163/youyou_comments/issues'];

self.addEventListener('install', function (event) {

});

self.addEventListener('fetch', function (event) {
  const request = event.request;
  const url = new URL(event.request.url);
  console.log(url.pathname);
  const getCachedResponse = async request => {
    let cache = await caches.open(cacheName)
    return cache.match(request)
  }
  const cacheResponse = async (request, response) => {
    let cache = await caches.open(cacheName)
    await cache.put(request, response)
  }
  const fetchAndCache = async request => {
    let response = await fetch(request.clone())
    if (!response.ok) { return }
    cacheResponse(request, response.clone()).catch(() => { })
    return response
  }

  const cacheFirst = async () => {
    let response
    try {
      response = await getCachedResponse(request)
    } catch (e) { }
    if (response == null) {
      response = await fetchAndCache(request)
    } else if (needFetchLater(url)) {
      fetchAndCache(request);
    }
    return response
  }

  function inBlackList(url) {
    if (url.protocol === 'chrome-extension:') return true;
    const pathname = url.pathname;
    for (let d of black_list) {
      if (pathname.includes(d)) return true;
    }
    return false;
  }

  function needFetchLater(url) {
    for (let d of fetch_later) {
      if (d.endsWith(url.pathname)) return true;
    }
    return false;
  }

  if (!inBlackList(url)) {
    event.respondWith(cacheFirst());
  }
});
