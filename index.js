var getParameterNames = require('get-parameter-names')

function DI() {
  this._registers = {}
}

DI.prototype.register = function (name, fn) {
  this._registers[name] = fn
}

DI.prototype.getParameterNames = getParameterNames

DI.prototype.inject = function (fn, additionalDependencies) {
  var params = getParameterNames(fn)

  if (additionalDependencies) {
    Object.keys(additionalDependencies).forEach(function (dependency) {
      this.register(dependency, additionalDependencies[dependency])
    }.bind(this))
  }

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
