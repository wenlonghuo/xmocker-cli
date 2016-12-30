

module.exports.getAppProject = {
  
}

module.exports.addAppProject = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  member: {
    type: 'string',
  },
  path: {
    type: 'string',
  },
  port: {
    type: 'number',
  },
  state: {
    type: 'string',
  },
  gulp: {
    type: 'object',
  },
  webpack: {
    type: 'object',
  },
}

module.exports.editAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  member: {
    type: 'string',
  },
  path: {
    type: 'string',
  },
  port: {
    type: 'number',
  },
  gulp: {
    type: 'object',
  },
  webpack: {
    type: 'object',
  },
}

module.exports.deleteAppProject = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}



