const fs = require("fs");
const pug = require("pug");

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

fs.writeFileSync("dist/index.html", pug.renderFile("src/index.pug"));