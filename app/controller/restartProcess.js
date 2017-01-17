const db = require('../db');
const apiBase = db.apiBase;
const apiModel = db.apiModel;
const appProject = db.appProject;

const util = require('../util');
const nodeUtil = require('util');

const processControl = require('../processControl')

let toRestartList = [];
module.exports = {
  pushRestartList: pushRestartList,
}

async function pushRestartList(option = {}){
  
  if(option.project) {
    let item = toRestartList.find(function(p){
      return p.id = option.project;
    })
    let proj = {id: option.project};
    if(!item)toRestartList.push(proj);
  } else if(option.apiBase){
    apiBase.cfindOne({_id: option.apiBase}).exec().then(function(doc){
      if(doc && doc.project){
        let item = toRestartList.find(function(p){
          return p.id = doc.project;
        })
        if(!item)toRestartList.push({id: doc.project})
      }
    });
  } else if(option.apiModel) {
    apiModel.cfindOne({_id: option.apiModel}).exec().then(function(model){
      if(model && model.baseid){
        apiBase.cfindOne({_id: model.baseid}).exec().then( function(doc){
          let item = toRestartList.find(function(p){
            return p.id = doc.project;
          })
          if(!item)toRestartList.push({id: doc.project})
        });
      }
    });
  }

  checkoutList()
}

let handler;
function checkoutList(){
  // console.log(toRestartList.length);
  clearTimeout(handler)
  handler = setTimeout(function(){
    if(!toRestartList.length)return;
    let ids = toRestartList.map(function(proc){return proc.id})
    appProject.cfind({_id: {$in: ids}}).exec().then(function(docs){
        if(docs && docs.length){
          docs.forEach(function(doc){
            processControl.restartProcess(doc)
          });
        }
        toRestartList = [];
    })

  }, 2000);
}
