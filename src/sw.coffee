CACHE = "v2"


precache = () ->
  caches.open(CACHE).then (c) ->
    fetch("./assets/all.json")
    .then (r) ->
      return r.json()
    .then (d) ->
      res.map (e) -> './assets/bus/' + e


    c.addAll res.concat ["./index.html",
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
    fetch(request).then (res) ->
      cache.put req, res

self.addEventListener "install", (e) ->
  e.waitUntil do precache

self.addEventListener "activate", (e) ->
  e.waitUntil caches.keys().then (names) ->
    Promise.all names.map (name) ->
      if CACHE != name
        caches.delete name

self.addEventListener "fetch", (e) ->
  e.respondWith fromCache e.request
  e.waitUntil update e.request