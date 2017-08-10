'use strict';

var router = require('./index.js');
var controller = router.controller.project;
var formatParam = router.formatParam;

router.get('/project', formatParam, controller.getProject);

router.get('/state/project', formatParam, controller.getRunningProject);

router.post('/project', formatParam, controller.addProject);

router.put('/project', formatParam, controller.editProject);

router.delete('/project', formatParam, controller.deleteProject);

router.put('/startProject', formatParam, controller.startProject);

router.put('/stopProject', formatParam, controller.stopProject);

router.put('/setDefaultApiParam', formatParam, controller.setDefaultApiParam);