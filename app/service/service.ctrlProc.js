'use strict'
const db = require('../database')

const serviceProc = require('./service.proc.js')
const getProcById = serviceProc.getProcById
const procList = serviceProc.state.proc

// 生成项目处理的序列
class ExecQuene {
  constructor (func) {
    this.exector = func
    this.state = 0
    this.team = Promise.resolve()
    this.add = this.add.bind(this)
  }
  add () {
    this.team.then(async () => {
      await this.exector.apply(this, arguments)
    })
  }
}

const reload = new ExecQuene(async function (option) {
  let type = option.type
  let info = await getProject(option)
  if (!info) {
    return
  }
  let proc = getProcById(info._id)
  if (!proc) return
  proc.reloadApis([type])
})

const restart = new ExecQuene(async function (option) {
  try {
    let info = await getProject(option)
    if (info) serviceProc.addToRestart(info, option).catch(e => console.log(info, option, e))
  } catch (e) {
    console.log(e)
  }
})

async function getProject (option) {
  let quene = [
    {name: 'apiModel', key: 'baseid'},
    {name: 'apiBase', key: 'project'},
    {name: 'project', key: '_id'},
  ]
  let index = quene.findIndex(q => q.name === option.type)
  let doc
  let id = option.id

  try {
    while (index < quene.length && index >= 0 && id) {
      let info = quene[index]
      doc = await getDocById(info.name, id).catch(e => { throw e })
      if (!doc) throw new Error(`cannot find doc by id : ${id}, type: ${info.name}`)
      id = doc[quene[index].key]
      index++
    }
  } catch (e) {
    console.log(e)
  }

  if (procList.find(proc => doc && proc.id === doc._id)) return doc
}

async function getDocById (collection, id) {
  return await db[collection].cfindOne({_id: id}).exec()
}

module.exports = {
  reload,
  restart,
}
