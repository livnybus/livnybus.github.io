var fs = require("fs"),
    path = process.argv[2];

var data = (''+fs.readFileSync(path)).split('\n');

var result = data[0]+'\n';
for (var i = 1; i < data.length; i++) {
  data[i] = data[i].split(' ');
  result += data[i][0];
  for (var j = 1; j < data[i].length; j++) {
    result += ' ' + (parseInt(data[i][j].split(":")[0]) * 60 + parseInt(data[i][j].split(":")[1]));
  }
  result += '\n'
}

console.log(result);
var f = fs.createWriteStream(process.argv[3]);
f.write(result);