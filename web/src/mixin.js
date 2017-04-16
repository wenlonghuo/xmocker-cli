import { getProject } from './api/api.js'
export default {
  methods: {
    getProjectList () {
      return getProject({pageSize: 5000}).then((data) => {
        if (!data.code) {
          data.data.list.sort((a, b) => { return a.status ? 0 : b.status ? 1 : 0 })
          this.$store.commit('project/SET_PROJECT_LIST', data.data.list)
        }
      })
    },
    checkProjectList () {
      var projectList = this.$store.state.project.list
      if (!projectList.length) return this.freshProject()
      return Promise.resolve()
    },
    freshProject () {
      return this.$store.dispatch('project/CHECK_PROJECT_LIST', this)
    },
    btnAction (func) {
      if (typeof this[func] === 'function') {
        this[func]()
      }
    },
    copyToObj (from, source, extraKeys) {
      Object.keys(from).forEach((key) => {
        if (source[key] !== undefined) from[key] = source[key]
      })
      if (extraKeys) {
        extraKeys.forEach((obj) => {
          if (typeof obj === 'string') {
            if (source[obj] !== undefined) from[obj] = source[obj]
          } else {
            if (source[obj[1]] !== undefined) from[obj[0]] = source[obj[1]]
          }
        })
      }
    },
  },
}
