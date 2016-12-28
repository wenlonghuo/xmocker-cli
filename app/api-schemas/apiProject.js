

module.exports.getAppProject = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}

module.exports.addAppProject = {
  name: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  member: {
    type: 'object',
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
    type: 'object',
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



