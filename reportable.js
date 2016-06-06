import difference from 'lodash/difference'
import noop from 'lodash/noop'
import fromPairs from 'lodash/fromPairs'

const fromKeys = (keys, fn) =>
  fromPairs(keys.map(key => [key, fn(key)]))

export function factory(names) {
  const reportConsumers = []
  return {
    reportConsumers,

    report: fromKeys(names, name => (...args) => {
      reportConsumers.forEach(w => w[name](...args))
    }),

    consumeReports: (spec) => {
      const unknown = difference(Object.keys(spec), names)
      if (unknown.length) {
        throw new Error(`Unexpected report names ${unknown.join(', ')}`)
      }

      const watcher = fromKeys(names, name => spec[name] || noop)
      reportConsumers.push(watcher)
    },
  }
}

export const mixin = (obj, names) =>
  Object.assign(obj, factory(names))

export default mixin
