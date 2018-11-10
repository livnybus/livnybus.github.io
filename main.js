'use strict';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js", {scope : "./"}).then(function(registration) {
    console.log('Service worker зарегистрирован:', registration);
  }).catch(function(error) {
    console.log('Ошибка при регистрации service worker-а:', error)
  });
}

function loadFile(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  
  if (xhr.status !== 200) alert(xhr.status + ': ' + xhr.statusText);
  return xhr.responseText;
}

var buses = [], d = new Date(), now = (d.getUTCHours()+3) * 60 + d.getUTCMinutes();

function parseSchedule(text) {
  var res = {};
  text = text.split("\n");
  
  res.name = text[0];
  res.point = [];
  for (var i = 1; i < text.length; i++) {
    var dest = text[i].split(" "),
        obj = {
          name: dest[0].split("_").join(" "),
          time: []
        };
    for (var j = 1; j < dest.length; j++) {
      obj.time.push(parseInt(dest[j]));
    }
    res.point.push(obj);
  }
  return res;
}

function init() {
  var schedule = JSON.parse(loadFile('bus/all.json'));
  
  for (var i = 0; i < schedule.length; i++) {
    buses.push(parseSchedule(loadFile(schedule[i])));
  } 
  
  buses.sort( function(a, b) {
    return parseInt(a.name) - parseInt(b.name);
  });
}


function binarySearch(arr, time) {
  var l = -1, r = arr.length - 1, m;
  while(r - l > 1) {
    m = Math.round((r + l) / 2);
    if (time < arr[m] ) r = m;
    else l = m;
  }
  if (time > arr[r]) return 0;
  else return r;
}

function update() {
  clearScreen();
  for (var i = 0; i < buses.length; i++) {
    var currentState = [];
    for (var j = 0; j < buses[i].point.length; j++) {
      var path = buses[i].point[j],
          pos = binarySearch(path.time, now);
      currentState.push({
        time: path.time[pos],
        name: path.name
      });
    }
    
    currentState.sort(function(a, b) {
      return a.time - b.time;
    });

    for (var j = 0; j < currentState.length; j++) {
      draw(buses[i].name, currentState[j].name, currentState[j].time);
    }
  }
  
}

var list = document.getElementById("schedule");
function clearScreen() {
  //list.innerHTML = "<tr><th>Маршрут</th><th>Место</th><th>Время</th></tr>";
}

function draw(name, dest, time) {
  var text = '<tr><td><span>' + name.trim() + '</span></td><td>' + dest.trim() + '</td><td><time>' + Math.floor(time/60) + ':';
  if (time % 60 / 10 < 1) text += '0';
  text += time % 60 + '</time></td></tr>';
  list.innerHTML += text;
}

init();
update();