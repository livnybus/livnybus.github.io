window.location.hash = ""

dataset = []
countset = []

busList = ''
scheduleList = ''
titleText = ''
nameText = ''
# parseTime = (str) ->
#   _ = str.split ":"
#   return parseInt(_[0]) * 60 + parseInt(_[1])

# Array::upperBound = (value) ->
#   l = -1
#   r = this.length
#   while l + 1 != r
#     m = (l + r) // 2
#     if parseTime(this[m].time) <= value
#       l = m
#     else
#       r = m
#   return r

# class Schedule
#   constructor: (db) ->
#     for bus of db
#       db[bus].times.sort (a, b) -> 
#         return parseTime(a.time) - parseTimwe(b.time)

#     this.db = db
#     this.buses = Object.keys db
#     @buses.sort (a, b) -> parseInt(a) - parseInt(b)

#     this._buses = document.getElementById "buses"
#     this._schedule = document.getElementById "schedule"
#     this._msg = document.getElementById "message"

#     do @listen
#     do @showBuses


#   clear: () ->
#     this._buses.innerHTML = ""
#     this._schedule.innerHTML = ""
#     @._msg.innerHTML = ""
#     @._msg.style.display = "none"

#   showBuses: () ->
#     do @clear

#     res = ""
#     for bus in @buses
#       res += "<a href=##{bus}>#{bus}</a>"

#     @_buses.innerHTML = res

#   showMessage: (text) ->
#     @._msg.innerHTML = text
#     @._msg.style.display = "block"

#   showSchedule: (name) ->
#     do @clear

#     bus = @db[name]

#     @showMessage "<span class='title'>#{name}</span>" + bus.msg
#     res = ""

#     now = new Date()
#     time = now.getUTCHours() * 60 + now.getUTCMinutes()+ 180

#     arr = bus.times
#     index = arr.upperBound(time)

#     if index == arr.length
#       index = 0


#     for el in [index...arr.length]
#       if arr[el].dest == "Перерыв"
#         res += "<td class=\"pause\" colspan=\"2\">Перерыв</td>"
#       else
#         res += "<tr><td class='time'>#{arr[el].time}</td><td class='station'>#{arr[el].dest}</td></tr>"

#     @_schedule.innerHTML = res



#   listen: () ->
#     window.addEventListener "hashchange", () =>
#       url = location.hash[1..]
#       if url == ""
#         do @showBuses
#       else
#         @showSchedule url

  



load = (url, cb) ->
  if "fetch" of window
    fetch(url).then((res) -> res.json()).then((data) -> cb null, data)[String.fromCharCode(99)+"atch"] (err) ->
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

countBuses = () ->
  for bus in dataset
    if (countset[bus.name]?) then countset[bus.name]++
    else countset[bus.name] = 1

drawList = () ->
  console.log "draw list..."
  console.log countset


  out = '<div class="row">'
  last = 'ars'
  cc = 0

  for bus, key in dataset
    name = bus.name
    if name != last
      cc = 0
      out += '</div><div class="row">'
      last = name

    co = countset[name]

    out += "<a href=\"##{key}\" style=\"background: hsl(#{cc*100//co+50}, 70%, 80%)\">#{name}</a>"
    cc++
  out += '</div>'

  titleText.innerHTML = 'Маршруточки'
  busList.innerHTML = out


clear = () ->
  busList.innerHTML = ''
  scheduleList.innerHTML = ''
  titleText.innerHTML = ''
  nameText.innerHTML = ''


printTime = (time) ->
  time = parseInt time
  hours = time // 60
  min = time % 60

  out = hours+':'

  if min < 10
    out += '0' + min
  else
    out += min

  return out

timeTemplate = (time, name) ->
  return "<td class=\"time\">#{printTime time}</td><td class=\"station\">#{name}</td>"

drawBus = (id) ->
  now = dataset[id]
  st = now.stations
  ti = now.times
  na = now.ids

  set = {}

  out = ''

  titleText.innerHTML = 'Назад'
  nameText.innerHTML = now.name

  for index in [0...st.length]
    set[ti[index]] = na[st[index]]

  keys = Object.keys set
  ksize = keys.length

  tdate = new Date
  tmin = (tdate.getUTCHours()+3)*60+tdate.getUTCMinutes()

  pointer = 0
  while (pointer != ksize and parseInt(keys[pointer]) < tmin)
    pointer++

  if pointer == ksize
    for index in [0...ksize] by 1
      out += "<tr class=\"old\">#{timeTemplate keys[index], set[keys[index]]}</tr>"

  else
    if pointer == 0
      for index in [0...ksize] by 1
        out += "<tr>#{timeTemplate keys[index], set[keys[index]]}</tr>"

    else
      for index in [0...pointer-1] by 1
        out += "<tr class=\"old\">#{timeTemplate keys[index], set[keys[index]]}</tr>"

      out += "<tr id=\"focus\" class=\"old\">#{timeTemplate keys[pointer-1], set[keys[pointer-1]]}</tr>"

      for index in [pointer...ksize] by 1
        out += "<tr>#{timeTemplate keys[index], set[keys[index]]}"

  scheduleList.innerHTML = out

  focus = document.getElementById("focus")

  if focus? then window.location.hash = 'focus'
  

route = () ->
  newHash = window.location.hash[1..]
  console.log newHash
  console.log this
  if newHash == "focus"
    return
  do clear
  if isNaN parseInt  newHash
    do drawList
  else 
    drawBus parseInt newHash


init = () ->
  busList = document.getElementById "buses"
  scheduleList = document.getElementById "schedule"
  titleText = document.getElementById "title"
  nameText = document.getElementById "name"

  load "assets/all.json", (err, data) ->
    if err then throw err

    count = 0
    size = data.length

    for file, id in data
      ((num, name) =>
        load "assets/bus/" + name, (err, data) =>
          if (err) then throw new Error err + ' '+ num + ' ' + name
          dataset[num] = data
          count++
          if count == size
            window.onhashchange = route
            do countBuses
            do drawList
      )(id, file)
       

    

window.addEventListener "load", init