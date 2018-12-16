fs = require "fs"
path = require "path"

res = {}


files = fs.readdirSync "./buses"
.filter (e) ->
  return path.extname(e) == ".csv"

console.log files

for file in files
  data = "" + fs.readFileSync "./buses/" + file
  data = data.split "\n"
  data  = data.map (e) -> e.split ","
  busName = path.basename(file, path.extname(file))
  res[busName] = 
    times: [],
    msg:   ""

  for station in data
    if station[0] == "msg"
      res[busName]["msg"] = station[1]
    else

      for time in station[1..]
        res[busName]["times"].push
          "time": time,
          "dest": station[0] 

fs.writeFile "./docs/buses.json", JSON.stringify(res), (err) ->
  if err then throw err