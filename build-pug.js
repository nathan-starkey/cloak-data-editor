const fs = require("fs");
const pug = require("pug");

fs.writeFileSync("build/index.html", pug.renderFile("src/index.pug"));