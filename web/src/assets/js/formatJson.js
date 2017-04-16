// 以下代码取自 https://github.com/zaach/jsonlint/blob/master/lib/formatter.js
export default (function () {
  function repeat (s, count) {
    return new Array(count + 1).join(s)
  }

  function formatJson (json, indentChars) {
    var i = 0
    var il = 0
    var tab = (typeof indentChars !== 'undefined') ? indentChars : '  '
    var newJson = ''
    var indentLevel = 0
    var inString = false
    var inSingleString = false
    var currentChar = null
    var isComment = false

    for (i = 0, il = json.length; i < il; i += 1) {
      currentChar = json.charAt(i)

      switch (currentChar) {
        case '{':
        case '[':
          if (isComment) break
          if (!inString) {
            newJson += currentChar + '\n' + repeat(tab, indentLevel + 1)
            indentLevel += 1
          } else {
            newJson += currentChar
          }
          break
        case '}':
        case ']':
          if (isComment) break
          if (!inString) {
            indentLevel -= 1
            newJson += '\n' + repeat(tab, indentLevel) + currentChar
          } else {
            newJson += currentChar
          }
          break
        case ',':
          if (isComment) break
          if (!inString) {
            newJson += ',\n' + repeat(tab, indentLevel)
          } else {
            newJson += currentChar
          }
          break
        case ':':
          if (isComment) break
          if (!inString) {
            newJson += ': '
            if (!/": $/.test(newJson)) {
              if (/': $/.test(newJson)) {
                newJson = newJson.replace(/'([^\s']*)': $/, '"$1": ')
                console.log(newJson.replace(/'([^\s']*)': $/, '"$1": '))
              } else {
                newJson = newJson.replace(/\s([^\s]*): $/, '"$1": ')
              }
            }
          } else {
            newJson += currentChar
          }
          break
        case ' ':
        case '\n':
          if (inString) {
            newJson += currentChar
          } else {
            isComment = false
          }
          break
        case '\r':
        case '\t':
          if (inString) {
            newJson += currentChar
          }
          break
        case '"':
          if (isComment) break
          if (i > 0 && json.charAt(i - 1) !== '\\') {
            inString = !inString
          }
          newJson += currentChar
          break
        case "'":
          if (isComment) break
          if (i > 0 && !inString && json.charAt(i - 1) !== '\\') {
            inSingleString = !inSingleString
          }
          if (inString) {
            newJson += currentChar
          } else {
            newJson += '"'
          }
          break
        case '/':
          if (isComment) break
          if (i > 0 && !inString && json.charAt(i - 1) === '/') {
            isComment = true
          }
          newJson += currentChar
          break
        default:
          if (!inString && !inSingleString && !isComment && /[\uFF00-\uFFFF\u4E00-\u9FA5]/.test(currentChar)) {
            throw new Error('JSON中不允许中文或全角字符出现在引号外， 位置： ' + i)
          }
          if (isComment) break
          newJson += currentChar
          break
      }
    }

    return newJson
  }

  return {
    'formatJson': formatJson,
  }
}())
