
const queryType = {
  project: {
    type: 'regexp',
  },
  api: {
    type: 'regexp',
  },
  apiModel: {
    type: 'regexp',
  },
  ip: {
    type: 'regexp',
  },
  client: {
    type: 'object',
    children: {
      browser: {
        type: 'object',
        children: {
          name: {
            type: 'regexp',
          },
          version: {
            type: 'regexp',
          },
        },
      },
      device: {
        type: 'object',
        children: {
          model: {
            type: 'regexp',
          },
          type: {
            type: 'regexp',
          },
          major: {
            type: 'regexp',
          },
        },
      },
      os: {
        type: 'object',
        children: {
          name: {
            type: 'regexp',
          },
          version: {
            type: 'regexp',
          },
        },
      },
    },
  },
}

function setQuery (schema, data) {
  let query = {}
  Object.keys(schema).forEach(key => {
    let val = data[key]
    let sval = schema[key]
    if (val) {
      if (sval.type === 'regexp') {
        // 普通正则
        query[key] = { $regex: new RegExp(val, 'i') }
      } else if (sval.type === 'object') {
        // 含有子对象
        if (typeof val === 'string' && val) {
          query[key] = setListOrQuery(sval.children, val)
        } else if (typeof val === 'object') {
          // 取子对象的键值
          let childQuery = setQuery(sval.children, val)
          if (childQuery && Object.keys(childQuery).length) query[key] = childQuery
        }
      }
    }
  })
  return query
}

function setListOrQuery (schema, str) {
  let query = {$or: []}
  Object.keys(schema).forEach(key => {
    let sval = schema[key]
    let obj = {}
    if (sval.type === 'regexp') {
      obj[key] = { $regex: new RegExp(str, 'i') }
      query.$or.push(obj)
    } else if (sval.type === 'object') {
      obj[key] = setListOrQuery(sval.children, str)
      if (obj[key]) query.$or.push(obj)
    }
  })
  if (query.$or.length) return query
}

function convertObject2Dot (obj = {}) {
  let normal = {}
  let multi = []
  Object.keys(obj).forEach((key) => {
    let val = obj[key]
    if (val.$regex) {
      normal[key] = val
    } else {
      let chains = getKeyChain(val, key)
      chains.forEach(chain => {
        if (chain.key) {
          normal[chain.key] = chain.val
        } else if (chain.$or) {
          multi.push(...chain.$or)
        }
      })
    }
  })
  if (!multi.length) return normal
  multi.forEach(m => {
    Object.assign(m, normal)
  })
  return {$or: multi}
}

function getKeyChain (obj = {}, startName) {
  let arr = []
  Object.keys(obj).forEach((key) => {
    let val = obj[key]
    let nowName = startName ? (startName + '.' + key) : key
    if (val.$regex) {
      arr.push({ key: nowName, val })
    } else if (val.$or) {
      val.$or.forEach(item => {
        let data = getKeyChain(item, nowName)
        let orArr = []
        data.forEach(subItem => {
          orArr.push({[subItem.key]: subItem.val})
        })
        if (orArr.length) arr.push({ $or: orArr })
      })
    } else {
      let data = getKeyChain(val, nowName)
      arr.push(...data)
    }
  })
  return arr
}

module.exports = setQuery
module.exports.schema = queryType
module.exports.getKeyChain = getKeyChain
module.exports.getQuery = function (data) {
  let obj = setQuery(queryType, data)
  return convertObject2Dot(obj)
}
