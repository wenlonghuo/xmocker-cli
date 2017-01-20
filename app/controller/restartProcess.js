'use strict'
const db = require('../db');
const apiBase = db.apiBase;
const apiModel = db.apiModel;
const appProject = db.appProject;

const util = require('../util');

const processControl = require('./processControl')
const procList = processControl.processList;

let restartTeam = [];
module.exports = {
  pushRestartList: pushRestartList,
}

async function pushRestartList(option = {}){
  
  if(option.project) {
    let item = restartTeam.find(function(p){
      return p.id === option.project;
    })
    let proj = {id: option.project};
    if(!item)restartTeam.push(proj);
  } else if(option.apiBase){
    apiBase.cfindOne({_id: option.apiBase}).exec().then(function(doc){
      if(doc && doc.project){
        let item = restartTeam.find(function(p){
          return p.id === doc.project;
        })
        if(!item)restartTeam.push({id: doc.project})
      }
    });
  } else if(option.apiModel) {
    apiModel.cfindOne({_id: option.apiModel}).exec().then(function(model){
      if(model && model.baseid){
        apiBase.cfindOne({_id: model.baseid}).exec().then( function(doc){
          let item = restartTeam.find(function(p){
            return p.id === doc.project;
          })
          if(!item)restartTeam.push({id: doc.project})
        });
      }
    });
  }

  checkoutList();
}

let handler, isRunning;
function checkoutList(){
  clearTimeout(handler)
  handler = setTimeout(function(){
    if(!isRunning)restartProj()
  }, 2000);
}

function restartProj(){
  if(!restartTeam.length){
    isRunning = false;
    return;
  }
  isRunning = true;
  let id = restartTeam.shift().id;
  appProject.cfindOne({_id: id}).exec().then(function(doc){
    if(doc){
      if(procList.find(function(p){ return p.id === doc._id && p.status})){
        processControl.restartProcess(doc);
      }
      restartProj();
    }
  })
}