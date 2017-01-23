# local-include-js

Allows to include("toto/tata") local files from the project's root in nodejs, instead of require("../toto/tata"). Aliases and multiple root folders are supported.

## Usage

```
require('local-include-js')
  .add('../relative/folder')
  .add('/absolute/folder')
  .alias('alias-name', 'some/folder')
  .warn(aFunctionToDisplayWarning) /* console.warn by defaullt */

include('file-in-path')
include('@alias/file-in-alias')
```
