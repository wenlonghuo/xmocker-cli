

module.exports.getApiBase = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.addApiBase = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  project: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  createdBy: {
    type: 'string',
  },
  method: {
    type: 'string',
    required: true,
  },
  functionInfo: {
    type: 'object',
    required: true,
  },
  keywords: {
    type: 'string',
  },
  description: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  inputParam: {
    type: 'object'
  },
  outputParam: {
    type: 'object'
  },
}

module.exports.editApiBase = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  name: {
    type: 'string',
    noEmpty: true
  },
  project: {
    type: 'string',
    noEmpty: true
  },
  modifiedBy: {
    type: 'string',
  },
  method: {
    type: 'string',
  },
  functionInfo: {
    type: 'object',
  },
  keywords: {
    type: 'string',
  },
  description: {
    type: 'string',
    noEmpty: true
  },
  inputParam: {
    type: 'object'
  },
  outputParam: {
    type: 'object'
  },
}

module.exports.deleteApiBase = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}



