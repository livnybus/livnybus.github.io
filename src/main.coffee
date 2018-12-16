window.location.hash = ""
parseTime = (str) ->
  _ = str.split ":"
  return parseInt(_[0]) * 60 + parseInt(_[1])

Array::upperBound = (value) ->
  l = -1
  r = this.length
  while l + 1 != r
    m = (l + r) // 2
    if parseTime(this[m].time) <= value
      l = m
    else
      r = m
  return r

class Schedule
  constructor: (db) ->
    for bus of db
      db[bus].times.sort (a, b) -> 
        return parseTime(a.time) - parseTime(b.time)

    this.db = db
    this.buses = Object.keys db
    @buses.sort (a, b) -> parseInt(a) - parseInt(b)

    this._buses = document.getElementById "buses"
    this._schedule = document.getElementById "schedule"
    this._msg = document.getElementById "message"

    do @listen
    do @showBuses


  clear: () ->
    this._buses.innerHTML = ""
    this._schedule.innerHTML = ""
    @._msg.innerHTML = ""
    @._msg.style.display = "none"

  showBuses: () ->
    do @clear

    res = ""
    for bus in @buses
      res += "<a href=##{bus}>#{bus}</a>"

    @_buses.innerHTML = res

  showMessage: (text) ->
    @._msg.innerHTML = text
    @._msg.style.display = "block"

  showSchedule: (name) ->
    do @clear

    bus = @db[name]

    @showMessage "<span class='title'>#{name}</span>" + bus.msg
    res = ""

    now = new Date()
    time = now.getUTCHours() * 60 + now.getUTCMinutes()+ 180

    arr = bus.times
    index = arr.upperBound(time)

    if index == arr.length
      index = 0


    for el in [index...arr.length]
      if arr[el].dest == "Перерыв"
        res += "<td class=\"pause\" colspan=\"2\">Перерыв</td>"
      else
        res += "<tr><td class='time'>#{arr[el].time}</td><td class='station'>#{arr[el].dest}</td></tr>"

    @_schedule.innerHTML = res



  listen: () ->
    window.addEventListener "hashchange", () =>
      url = location.hash[1..]
      if url == ""
        do @showBuses
      else
        @showSchedule url

  



load = (url, cb) ->
  if "fetch" of window
    fetch url
    .then (res) ->
      res.json()
    .then (data) ->
      cb null, data
    .catch (err) ->
      cb err

  else
    xhr = new XMLHttpRequest()
    xhr.open "GET", url, true
    xhr.onreadystatechange = () ->
      if this.readyState != 4 then return

      if this.status != 200
        cb new Error this.status, this.statusText
      
      cb null, JSON.parse ''+this.responseText
    do xhr.send

init = () ->
  load "buses.json", (err, data) ->
    if err then throw err

    window.app = new Schedule data

window.addEventListener "load", init