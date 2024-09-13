import $ from 'https://v2.blissfuljs.com/src/$.js'
import $$ from 'https://v2.blissfuljs.com/src/$$.js'
import create from 'https://v2.blissfuljs.com/src/dom/create.js'
import bind from 'https://v2.blissfuljs.com/src/events/bind.js'
import load from 'https://v2.blissfuljs.com/src/async/load.js'

Object.assign($, { create, bind, load })
export { $, $$, create, bind, load }

/**
 * Utility for regexp construction
 * @param {*} s
 * @returns
 */
const escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
const _regexp = (flags, strings, ...values) => {
  const pattern = strings[0] + values.map((v, i) => escape(v) + strings[i + 1]).join('')
  return RegExp(pattern, flags)
}
const cache = {}

export const regexp = new Proxy(_regexp.bind(this, ''), {
  get: (t, property) => {
    return t[property] || cache[property] ||
				(cache[property] = _regexp.bind(this, property))
  }
})

export function loadLanguages (ids, PrismLive) {
  // NOOP: I will load my own languages
}
