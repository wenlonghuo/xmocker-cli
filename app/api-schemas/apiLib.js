

module.exports.getMockLib = {
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

module.exports.addMockLib = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  condition: {
    type: 'string',
  },
  data: {
    type: 'string',
    required: true,
  },
}

module.exports.editMockLib = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
  condition: {
    type: 'string',
  },
  data: {
    type: 'string',
    required: true,
  },
}

module.exports.deleteMockLib = {
  id: {
    type: 'string',
    required: true,
    noEmpty: true
  },
}



