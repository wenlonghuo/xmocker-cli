let schemas = {}

Object.assign(schemas, require('./apiManage'));

Object.assign(schemas, require('./apiLib'));

Object.assign(schemas, require('./apiProject'));

Object.assign(schemas, require('./appBase'));

Object.assign(schemas, require('./apiHis'));

module.exports = schemas