var CACHE = 'v1';

self.addEventListener('install', function(evt){
  console.log("SW installed!");
});

self.addEventListener('fetch', function(e){
  console.log("ServiceWorker: Fetching...");
  e.respondWith(fetch(e.request).then(function(res){
    //copy response to cache
    const resClone = res.clone();
    caches.open(CACHE).then(function(cache){
      cache.put(e.request, resClone);
    });
    return res;
  }).catch(function(err) {
    return caches.match(e.request).then(function (res) {
      return res;
    });
  }));
});
