const join_path = require('path').join
const resolve_path = require('path').resolve
const path_sep = require('path').sep

const baseFolders = [ undefined /* tries the normal undefined at first */ ]
const aliases = new Map()
let warn = undefined
let debug = undefined

global.include = function(path) {
  path = resolveAlias(path)
  let lastError

  if(path[0] === path_sep) {
    return require(path)
  }

  debug && debug("All the base folders are: ", baseFolders)
  for(let i=0; i<baseFolders.length; i++) {
    const baseFolder = baseFolders[i]
    let resolved_path = path
    if(baseFolder) { resolved_path = join_path(baseFolder, path) }

    try {
      return require(resolved_path)
    } catch(e) {
      if(e.code !== 'MODULE_NOT_FOUND') { throw e }
      lastError = e
      // warn("Unable to find file " + resolved_path)
    }
  }

  if(lastError) {
    throw lastError
  }
}

function resolveAlias(path) {
  const matchAlias = path.match(/^@([\w\-\.]+)(.*)$/)
  if(matchAlias) {
    const alias = matchAlias[1]
    const remainingPath = matchAlias[2]
    if(!aliases.has(alias)) {
      debug && debug("All the available aliaes are: ", aliases)
      throw new Error("Unable to find alias " + alias)
    }
    const resolvedAlias = aliases.get(alias)
    return resolvedAlias + remainingPath
  } else {
    return path
  }
}

const addPath = (path) => {
  if(path[0] !== path_sep) {
    path = resolve_path(__dirname, path)
  }

  baseFolders.push(path)

  debug && debug("Added a path. Base folders are now ", baseFolders)

  return module.exports
}

const addAlias = (alias, path) => {
  if(alias[0] === `@`) { alias = alias.substring(1) }

  aliases.set(alias, path)

  debug && debug("Added an alias. All aliases are now ", baseFolders)

  return module.exports
}

module.exports = {
  add: addPath,
  alias: addAlias,
  warn: f => { warn = f; return module.exports },
  debug: f => { debug = f; return module.exports }
}
