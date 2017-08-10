'use strict';

var Datastore = require('../promiseNeDb');
var path = require('path');

var apiBase = new Datastore({ filename: path.join(__dirname, '../../../db/api/base'), autoload: true });

var apiModel = new Datastore({ filename: path.join(__dirname, '../../../db/api/model'), autoload: true });

var appBase = new Datastore({ filename: path.join(__dirname, '../../../db/app/base'), autoload: true });

var appProject = new Datastore({ filename: path.join(__dirname, '../../../db/app/project'), autoload: true });

module.exports = {
  apiBase: apiBase,
  apiModel: apiModel,
  appBase: appBase,
  appProject: appProject
};