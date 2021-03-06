const chai = require('chai')

const assert = chai.assert
const local_include_js = require('.')
  .add('.')
  .alias('the-root', '.')
  .alias('@test-folder', './test')
  .warn((msg) => { })
  .debug((msg) => { })

describe('basic usage', function() {
  it('existing file', function() {
    assert.doesNotThrow(() => include('index.js'))
  })

  it('non-existing file', function() {
    assert.throws(() => include('wtf.toto'), Error, /^Cannot find module/)
  })

  it('existing file with errors', function() {
    assert.throws(() => include('test/file-with-error'), Error, "nothing is not defined")
  })

  it('existing file with alias', function() {
    assert.doesNotThrow(() => include('the-root/index.js'))
  })

  it('wrong alias', function() {
    assert.throws(() => include('@wtf/index.js'), Error, /^Cannot find module/)
  })

  it('existing file in alias, with errors', function() {
    assert.throws(() => include('test-folder/file-with-error'), Error, /^Cannot find module/)
  })

  it('non-existing file in alias', function() {
    assert.throws(() => include('test-folder/wtf.toto'), Error, /^Cannot find module/)
  })
})

describe('override require', function() {
  local_include_js.overrideRequire()
  
  it('existing file', function() {
    assert.doesNotThrow(() => require('index.js'))
  })
  
  it('existing file with alias', function() {
    assert.doesNotThrow(() => require('the-root/index.js'))
  })
  
})