let schemas = {}

Object.assign(schemas, require('./apiBase'));

Object.assign(schemas, require('./apiModel'));

Object.assign(schemas, require('./appProject'));

Object.assign(schemas, require('./appBase'));

Object.assign(schemas, require('./apiHis'));

module.exports = schemas