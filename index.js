const join_path = require('path').join
const resolve_path = require('path').resolve
const path_sep = require('path').sep

const baseFolders = [ undefined /* tries the normal undefined at first */ ]
const aliases = new Map()
let warn = undefined
let debug = undefined

const Module = require('module');
const originalRequire = Module.prototype.require;

global.include = function(path) {
  path = resolveAlias(path)
  let lastError

  if(path[0] === path_sep) {
    debug && debug('The path is absolute: does not look into the base folders (' + path +' )')
    return originalRequire(path)
  }

  debug && debug("Searches into the base folders: ", baseFolders)
  for(let i=0; i<baseFolders.length; i++) {
    const baseFolder = baseFolders[i]
    let resolved_path = path
    if(baseFolder) { resolved_path = join_path(baseFolder, path) }

    debug && debug("Look for " + resolved_path + " (the base folder was " + (baseFolder || 'the default location') + ")")

    try {
      return originalRequire(resolved_path)
    } catch(e) {
      if(e.code !== 'MODULE_NOT_FOUND') { throw e }
      lastError = e
      warn && warn("Unable to find file " + resolved_path)
    }
  }

  if(lastError) {
    throw lastError
  }
}

function resolveAlias(path) {
  const matchingAliases = [...aliases.keys()].filter(alias => path.indexOf(alias) === 0)

  if(matchingAliases.length === 0) { return path }

  let alias;

  if(matchingAliases.length > 1) {
    debug('More than one match for path: use the longest one')
    alias = matchingAliases.sort()[matchingAliases.length-1]
  } else {
    alias = matchingAliases[0]
  }

  const aliasValue = aliases.get(alias)

  const solvedPath = aliasValue + path.substring(alias.length)

  return solvedPath
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
  aliases.set(alias, path)

  debug && debug("Added an alias. All aliases are now ", baseFolders)

  return module.exports
}

const overrideRequire = () => {
  Module.prototype.require = global.include
}

module.exports = {
  add: addPath,
  alias: addAlias,
  overrideRequire,
  warn: f => { warn = f; return module.exports },
  debug: f => { debug = f; return module.exports },
}
