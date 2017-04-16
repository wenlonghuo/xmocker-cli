'use strict'

function getMatchName (str) {
  let key = str[0] === ':' && str.slice(1)
  if (!key) return
  return /\?$/.test(key) ? {key: key.slice(0, key.length - 1)} : {key: key, need: true}
}

function removeLastSlash (url) {
  return url.replace(/\/$/, '')
}

module.exports = function extractURLParams (testURL = '', url = '') {
  if (typeof testURL !== 'string' || typeof url !== 'string') return
  testURL = removeLastSlash(testURL)
  url = removeLastSlash(url)
  let testArr = testURL.split('/').slice(1)
  let urlArr = url.split('/').slice(1)

  if (urlArr.length > testArr.length) return
  let params = {}
  for (let i = 0; i < testArr.length; i++) {
    let t = testArr[i]
    let u = urlArr[i]
    let stat = getMatchName(t)
    // not match
    if (!stat && t !== u) return
    if (stat) {
      if (stat.need && u === undefined) return
      if (u !== undefined) params[stat.key] = u
    }
  }
  return params
}
