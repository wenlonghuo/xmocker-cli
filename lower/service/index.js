'use strict';

var path = require('path');
var loadFileList = require('../util/loadFileList');

module.exports = loadFileList(path.join(__dirname, './'));