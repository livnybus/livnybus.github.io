CACHE = "v1"


precache = () ->
  caches.open(CACHE).then (c) ->
    fetch("./assets/all.json")
    .then (r) ->
      return r.json()
    .then (d) ->
      return c.addAll d.map((e) -> './assets/bus/' + e).concat [
        "./index.html",
        "./main.js",
        "./style.css",
        "./sw.js",
        "./assets/all.json"
      ]

fromCache = (req) ->
  caches.open(CACHE).then (c) ->
    c.match(req).then (matching) ->
      matching || Promise.reject "no-match"

update = (req) ->
  caches.open(CACHE).then (c) ->
    fetch(req).then (res) ->
      c.put req, res

self.addEventListener "install", (e) ->
  e.waitUntil do precache

self.addEventListener "activate", (e) ->
  e.waitUntil caches.keys().then (names) ->
    Promise.all names.map (name) ->
      if CACHE != name
        caches.delete name

self.addEventListener "fetch", (e) ->
  e.respondWith fromCache(e.request)
  e.waitUntil update e.request