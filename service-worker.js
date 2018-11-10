var CACHE = 'v2';

self.addEventListener('install', function(event){
  // console.log("The service worker is being installed.");

  // caching resources
  event.waitUntil(precache());
});

self.addEventListener("activate", function(event) {
  console.log("Activating serviceWorker", CACHE);

  //getting all keys from caches
  event.waitUntil(caches.keys().then(function(cacheNames) {

    // for elements in this array 
    return Promise.all(cacheNames.map(function(cacheName) {

      // check old caches
      if (CACHE !== cacheName) {
        console.log('Deleting out of date cache:', cacheName);
        
        // and remove
        return caches.delete(cacheName);
      }
    }));
  }));
});

// self.addEventListener('fetch', function(e){
//   console.log("ServiceWorker: Fetching...");
//   e.respondWith(fetch(e.request).then(function(res){
//     //copy response to cache
//     const resClone = res.clone();
//     caches.open(CACHE).then(function(cache){
//       cache.put(e.request, resClone);
//     });
//     return res;
//   }).catch(function(err) {
//     return caches.match(e.request).then(function (res) {
//       return res;
//     });
//   }));
// });


self.addEventListener("fetch", function(event){
  // console.log('The service worker is serving the asset.');

  // send response from cache
  event.respondWith(fromCache(event.request));

  // update cache
  event.waitUntil(update(event.request));
});

function precache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      "./index.html",
      "./main.js",
      "./style.css",
      "./buses.json"
    ]);
  });
}

function fromCache(request) {

  //open cache CACHE and ...
  return caches.open(CACHE).then(function(cache){
    
    // search request
    return cache.match(request).then(function(matching) {
      
      // return response from cache
      return matching || Promise.reject("no-match");
    });
  })
}

function update(request) {

  // open CACHE
  return caches.open(CACHE).then(function(cache){
    
    // download from request
    return fetch(request).then(function(response){
      
      // and save response
      return cache.put(request, response);
    });
  });
}

