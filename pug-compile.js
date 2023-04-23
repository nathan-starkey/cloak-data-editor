const fs = require("fs");
const pug = require("pug");
const toDiffableHtml = require("diffable-html");

const notice = "<!-- Auto-generated: DO NOT EDIT -->\n";

fs.writeFileSync("dist/index.html", notice + toDiffableHtml( pug.renderFile("src/index.pug")).trim());