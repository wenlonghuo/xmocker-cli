function setBread (info) {
  this.$store.commit('SET_BREADLIST', info)
}

export default {
  beforeCreate () {
    // Add a marker to know if it uses metaInfo
    if (typeof this.$options.breadList !== 'undefined') {
      this._hasBreadList = true
    }
    // coerce function-style metaInfo to a computed prop so we can observe
    // it on creation
    if (typeof this.$options.breadList === 'function') {
      if (typeof this.$options.computed === 'undefined') {
        this.$options.computed = {}
      }
      this.$options.computed.$breadList = this.$options.breadList
    }
  },
  created () {
    if (this.$breadList) {
      this.$watch('$breadList', () => {
        let info = this.$breadList
        if (info) setBread.call(this, info)
      })
    }
  },
  beforeMount () {
    if (this._hasBreadList) {
      let info = this.$options.breadList
      if (typeof info === 'function') {
        info = info.call(this)
      }
      if (info) setBread.call(this, info)
    }
  }
}
