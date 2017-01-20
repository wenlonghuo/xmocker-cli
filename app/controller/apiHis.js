'use strict'
const db = require('../db');
const MockHis = db.mockHis;

const util = require('../util');


module.exports = {
  getMockHis: getMockHis,
}


async function getMockHis(ctx, next){

  let finalParams = ctx.finalParams;

  let data;
  try{
    data = await MockHis.cfind(finalParams).exec()
  }catch(e){

  }

  ctx.body = {
    code: 0,
    data: {
      list: data
    }
  };
  return next();
}

