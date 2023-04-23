const fs = require("fs");
const pug = require("pug");

fs.writeFileSync("dist/index.html", pug.renderFile("src/index.pug"));