'use strict'
const fs = require('fs')
const path = require('path')
let db = require('../../database')
const uid = require('../util/common').uid()

module.exports = {
  upgradeFromV0,
}

async function upgradeFromV0 () {
  let fileExist = fs.existsSync(path.join(__dirname, '../../../db/app/project'))
  if (!fileExist) {
    throw new Error('v0版本的数据不存在，请检查文件是否存在')
  }
  const db0 = require('../../database/v0')
  try {
    let projList = await db0.appProject.cfind({}).exec()
    for (let i = 0; i < projList.length; i++) {
      let proj = projList[i]

      let fPid = proj._id
      if (!proj._uid) proj._uid = uid()
      proj._mt = +new Date()

      delete proj._id
      delete proj.state
      delete proj.error
      delete proj.repeatTime
      delete proj.webpack

      let query = {name: proj.name, shortcut: proj.shortcut, path: proj.path, port: proj.port}

      let nProj = await db.project.update(query, {$set: proj}, {returnUpdatedDocs: true, upsert: true})
      nProj = nProj[1]._id
      await upgradeApiFromV0({id: fPid, db: db0.apiBase}, {id: nProj, db: db.apiBase}, db0)
    }
  } catch (e) {
    throw e
  }
}

async function upgradeApiFromV0 (f = {}, t = {}, db0) {
  let fid = f.id
  let fdb = f.db
  let tid = t.id
  let tdb = t.db
  if (!fid || !fdb || !tid || !tdb) throw new Error('id or db does not exist')
  let fBase = await fdb.cfind({project: fid}).exec()
  for (let i = 0; i < fBase.length; i++) {
    let base = fBase[i]

    let fBaseId = base._id
    if (!base._uid) base._uid = uid()
    delete base._id
    base.project = tid
    base._mt = +new Date()
    if (base.path) base.pathEqual = base.name
    base.method = base.method.toUpperCase()

    let query = {path: base.path, pathEqual: base.pathEqual, url: base.url, method: base.method, project: base.project}
    let apiId = await tdb.update(query, {$set: base}, {returnUpdatedDocs: true, upsert: true})
    apiId = apiId[1]._id
    await upgradeApiModelFromV0({id: fBaseId, db: db0.apiModel}, {id: apiId, db: db.apiModel})
  }
}

async function upgradeApiModelFromV0 (f = {}, t = {}) {
  let fid = f.id
  let fdb = f.db
  let tid = t.id
  let tdb = t.db
  if (!fid || !fdb || !tid || !tdb) throw new Error('id or db does not exist')
  let fModel = await fdb.cfind({baseid: fid}).exec()
  for (let i = 0; i < fModel.length; i++) {
    let model = fModel[i]

    if (!model._uid) model._uid = uid()
    delete model._id
    model.baseid = tid
    model._mt = +new Date()
    if (Array.isArray(model.data)) model.data = model.data[0]

    let query = {baseid: model.baseid, name: model.name, condition: model.condition}
    await tdb.update(query, {$set: model}, {returnUpdatedDocs: true, upsert: true})
  }
}
