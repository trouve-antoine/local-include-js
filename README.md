# local-include-js

Replaces `require` in ordee to allow to `include` files from any root folder in node.js.
Also supports aliasing.

Breaking change in version 2.0.0: aliases do not always start with '@' anymore.

## Usage

Basic usage:

```
require('local-include-js')
  .add('../relative/folder')
  .add('/absolute/folder')
  .alias('some-alias', 'some/folder') // can also write '@some-alias'

include('file-in-path')
include('@some-alias/file-in-alias')
```

- adds `../relative/folder` in the search path (relative to the current file)
- adds `/absolute/folder` in the search path
- adds an alias  with name `some-alias` that points to `some/folder`

Files can now be required using the function `include` (instead of `require`).
Files are first passed to `require` as it, then searched within the path in the specified order.

Aliases are resolved before searching the path.
The resolution boils down to string replacement, that is, alias can be relative to the path.

For example `@some-alias/file-in-alias` is searched as follows:

- `@some-alias/file-in-alias` is transformed into `some/folder/file-in-alias`
- the library calls `require('some/folder/file-in-alias')`
- the library searches in `../relative/folder` and `/absolute/folder`

## Other facts

When a file is not found, the thrown error is with respect to the last folder in the path.

It is possible to ask the library to show some debug information by specifying warning and debug printers:

```
require('local-include-js')
  .add('../relative/folder')
  .add('/absolute/folder')
  .warn(console.warn) // to print the error messages
  .debug((msg) => console.info("[DEBUG] " + msg) ) // to print some debug information
```
