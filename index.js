'use strict'
var Transform = require('stream').Transform
var inherits = require('inherits')

function HashBase () {
  Transform.call(this)
}

inherits(HashBase, Transform)

HashBase.DEFAULT_ENCODING = 'buffer'

HashBase.prototype.update = function (data, encoding) {
  if (!Buffer.isBuffer(data)) {
    if (encoding === undefined) encoding = HashBase.DEFAULT_ENCODING
    if (encoding === 'buffer') encoding = 'binary'
    data = new Buffer(data, encoding)
  }

  this._update(data)
}

HashBase.prototype.digest = function (encoding) {
  var digest = this._digest()
  if (encoding === undefined) encoding = HashBase.DEFAULT_ENCODING
  if (encoding !== 'buffer') digest = digest.toString(encoding)
  return digest
}

HashBase.prototype._update = function (data) {
  throw new Error('_update is not implemented')
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    if (encoding !== 'buffer') chunk = new Buffer(chunk, encoding)
    this._update(chunk)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this._digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

module.exports = HashBase
