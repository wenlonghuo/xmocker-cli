import { deleteProject, startProject, stopProject } from '@/api/api.js'

export default {
  data () {
    return {
      projInfo: {}
    }
  },
  methods: {
    btnEdit () {
      this.$router.push({name: '项目编辑', query: { id: this.projInfo.id }})
    },
    btnView () {
      this.$router.push({name: '项目详情', query: { id: this.projInfo.id }})
    },
    btnDelete () {
      this.$Modal.confirm({
        title: '是否删除该项目？',
        content: '<p>删除后将相关的API均会删除且无法恢复</p>',
        onOk: () => {
          deleteProject({id: this.projInfo.id}).then(this.afterEdit)
        },
      })
    },
    btnPlay () {
      startProject({id: this.projInfo.id, force: false}).then(this.afterEdit)
    },
    btnRefresh () {
      startProject({id: this.projInfo.id, force: true}).then(this.afterEdit)
    },
    btnStop () {
      stopProject({id: this.projInfo.id}).then(this.afterEdit)
    },
    afterEdit (data) {
      if (!data.code) {
        this.$Message.success(data.data.tip)
        this.freshProject()
      }
    }
  },
}
