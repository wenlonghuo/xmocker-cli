const fs = require('fs')
const path = require('path')

module.exports = function loadFileList (dir, prefix, func) {
  let files = fs.readdirSync(dir)
  let result = {}

  files.forEach((file) => {
    if (path.extname(file) === '.js') {
      let name = path.basename(file)
      let ctrlName = name.split('.')[1]
      if (ctrlName) {
        try {
          if (func) {
            result[ctrlName] = func(path.join(dir, file))
          } else {
            result[ctrlName] = require(path.join(dir, file))
          }
        } catch (e) {
          console.log(e)
          console.error(`加载页面出错：${dir}/${file}, ${e.message}`)
        }
      }
    }
  })
  return result
}
