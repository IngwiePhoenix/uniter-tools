# Tools for poking Uniter.
These are general-purpose tools that can be used with [Uniter](https://github.com/uniter) to test and examine it's outputs.

## Tools of the trade
- `uniter2ast`: Dump a JSON representation of a PHP script's AST to STDOUT. Use this to get an image of what the tokens are named, how they are structured, and alike. Especially the token names are interesting, read further to understand.
- `uniter2js`: Directly transpile a PHp file to JS and dump the (beautified) output to STDOUT. In theory, you could actually "almost" run these. But, you shouldn't. Use [`uniter-node`](https://github.com/uniter/uniter-node) instead.

## What they do, in detail?
### Uniter to AST
This tool lets you see the AST that Uniter generates during it's processing as a prettified JSON. If you are planning to write a static analyzer or want to find a possible bug in the compilation, this is where to look at.

### Uniter to JS
This tool does a few things. First, it's foremost job is to transpile any PHP script to their JS representation. But it also allows you to use a neat little feature: custom transpiles.

If you think you understand Uniter a little, then you can use the `--generator` option. Pass it a JavaScript file that exports an object of `{N_SOMETHING: function(...){}}`.

#### Function signature and Parameters
```javascript
function(node, interpret, context, original) {
    // ...
}
```
- `node`: The node within the AST.
- `interpret`: Drop a piece of AST into this, and it interprets it. Returns valid code. You can use this to generate new code entirely.
- `context`: An overview of the context this is happening in.
- `original`: The original function for transpiling this node.

#### Example
```javascript
module.exports = {
    N_FUNCTION_CALL: function(node, interpret, ctx, orig) {
        // If: foo(...)
        if(node.func.string == "foo") {
            // Then change to: bar(...)
            node.func.string = "bar";
        }

        // Render the modified AST node.
        return orig(node);
    }
}
```

This custom node would change calls like `foo("Fooception")` into `bar("Fooception")`. As you can see, this is _really_ powerful. You can transpile things like `require` or `include` too - or `use`.
