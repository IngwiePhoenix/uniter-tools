#!/usr/bin/env node
var phpToAst = require("phptoast");
var phpToJs = require("phptojs");
var JSBeautify = require("js-beautify");
var yargs = require("yargs");
var fs = require("fs");
var path = require("path");

var argv = yargs
    .usage("Usage: uniter2js <file.php>")
    .help("h").alias("h","help")
    .demand(1)
    .example("uniter2js ./foo.php > foo.js")
    .option("mode", {
        description: "Choose the mode in which the code should be transpiled.",
        choices: ["sync", "async", false],
        default: false
    })
    .option("generator", {
        description: "Overtake some transpile steps. Supply valid JS script."
    })
    .epilog([
        "Uniter: https://github.com/uniter by @asmblah",
        "Tooling by Ingwie Phoenix"
    ].join("\n"))
    .version(function() {
        return require('../package').version;
    })
    .argv;

// Make an AST of the input
var parser = phpToAst.create();
var script = fs.readFileSync(argv._[0], "utf8");
var ast = parser.parse(script);

// Generate transpiler options
var transpilerOpts = {};
if(typeof argv.mode != "boolean") {
    if(argv.mode == "sync") {
        transpilerOpts.sync = true;
    } else if(argv.mode == "async") {
        transpilerOpts.sync = false;
    }
}

// Do we use a transpiler enhancer?
if(argv.generator) {
    transpilerOpts.nodes = require(path.join(process.cwd(), argv.generator));
}

// Transpile.
var js = phpToJs.transpile(ast, null, transpilerOpts);
var prettyJs = JSBeautify(js);

console.log(prettyJs);
