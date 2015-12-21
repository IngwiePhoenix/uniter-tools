#!/usr/bin/env node
var phpToAst = require("phptoast");
var yargs = require("yargs");
var fs = require("fs");
var JSONPrint = require("json-print");

var argv = yargs
    .usage("Usage: uniter2ast <file.php>")
    .help("h").alias("h","help")
    .demand(1)
    .example("uniter2js ./foo.php > foo.php.ast")
    .epilog([
        "Uniter: https://github.com/uniter by @asmblah",
        "Tooling by Ingwie Phoenix"
    ].join("\n"))
    .version(function() {
        return require('../package').version;
    })
    .argv;

var parser = phpToAst.create();
var script = fs.readFileSync(argv._[0], "utf8");
var ast = parser.parse(script);
// Print the whole thing.
console.log(JSONPrint(
    JSON.stringify(ast)
));
