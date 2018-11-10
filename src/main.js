'use strict';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw-min.js", {
    scope : "./"
  }).then(function(registration) {
    console.log('Service worker зарегистрирован:', registration);
  }).catch(function(error) {
    console.log('Ошибка при регистрации service worker-а:', error)
  });

  navigator.serviceWorker.addEventListener("message", function(event){
    alert(event.data.msg);
  });
}


var buses = [], listNames = [];

function init() {
  load('dist/buses.json', function(err, data) {
    if (err) throw err;
    buses = data;

    // sorting file names
    listNames =
      (function(d){var a = []; for (var i in d){a.push(i)} return a;})(data)
      .sort(function(a, b){return parseInt(a)- parseInt(b)});
    render();
  });
}

// Load JSON function
function load(url, cb) { // cb(err, json)
  if ("fetch" in window) { // for serviceWorker
    fetch(url)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      cb(null, data);
    })
    .catch(function(error){
      cb(error);
    });
  } else {
    //for old browsers: opera mini 
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    
    if (xhr.status !== 200) cb(new Error(xhr.status + ': ' + xhr.statusText));
    cb(null, JSON.parse(''+xhr.responseText));
  }
}

function convert(str) {
  var arr = str.split(":");
  return parseInt(arr[0]) * 60 + parseInt(arr[1]);
}

function search(arr, now) {
  var l = -1, r = arr.length - 1, m;

  while(r - l > 1) {
    m = Math.round((r + l) / 2);
    if (now < convert(arr[m])) r = m;
    else l = m;
  }

  if (now > convert(arr[r])) return 0;
  else return r;
}

function render() {
  for (var el = 0; el < listNames.length; el++) {
    var stations = [], d = new Date(), now = (d.getUTCHours()+3) * 60 + d.getUTCMinutes();

    // for station get closest time
    for (var name in buses[listNames[el]]) {
      stations.push({
        name: name,
        time: buses[listNames[el]][name][search(buses[listNames[el]][name], now)]
      });
    }

    // sorting times
    stations.sort(function(a, b){
      return convert(a.time) - convert(b.time);
    });

    //draw that
    for (var i = 0; i < stations.length; i++) {
      draw(listNames[el], stations[i].name, stations[i].time);
    }
  }
}

var layout = document.getElementById("schedule");
function draw(name, dest, time) {
  var text = '<tr><td><span>' + name.trim() + '</span></td><td>' + dest.trim() + '</td><td><time>' + time.trim()
  text += '</time></td></tr>';
  layout.innerHTML += text;
}

setInterval(render, 10000);

init();