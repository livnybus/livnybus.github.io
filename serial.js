var fs = require("fs"),
    path = "buses/"; // folder

function parse(filePath) {
  var result = {};
  var data = (''+fs.readFileSync(filePath)).split('\n');

  // save key

  for (var i = 0; i < data.length; i++) {
    data[i] = data[i].split(' ');
    key = data[i][0].split("_").join(" ");
    result[key] = [];
    for (var j = 1; j < data[i].length; j++) {
      result[key].push(data[i][j]);
    }
  }

  return result
}

var result = {};
var list = fs.readdirSync(path);
list.sort(function(a, b){return parseInt(a) - parseInt(b)});
console.log(list);

var f = fs.createWriteStream("buses.json");
f.write("{");

for (var i = 0; i < list.length; i++) {
  f.write("\""+list[i]+"\":"+JSON.stringify(parse("buses/" + list[i])));
  if (i != list.length - 1) f.write(",")
}
f.write("}");