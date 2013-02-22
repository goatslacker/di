var getParameterNames = require('getParameterNames')

function DI() {
  this._registers = {}
}

DI.prototype.register = function (name, fn) {
  this._registers[name] = fn
}

DI.prototype.inject = function (fn) {
  var params = getParameterNames(fn)
  var dependencies = params.map(function (param) {
    if (this._registers.hasOwnProperty(param)) {
      return this._registers[param]
    }

    throw new ReferenceError(
      '`' + param + '` was defined but ' +
      'not registered with ni'
    )
  }.bind(this))

  return function () {
    return fn.apply(fn, dependencies)
  }
}

module.exports = DI
