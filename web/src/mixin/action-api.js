import { deleteApi } from '@/api/api.js'

export default {
  data () {
    return {
      apiInfo: {}
    }
  },
  methods: {
    btnView () {
      this.$router.push({name: 'API详情', query: { id: this.apiInfo.id, project: this.apiInfo.project }})
    },
    btnProject () {
      this.$router.push({name: '项目详情', query: { id: this.apiInfo.project }})
    },
    btnEdit () {
      this.$router.push({name: 'API编辑', query: { id: this.apiInfo.id, project: this.apiInfo.project }})
    },
    btnDelete () {
      this.$Modal.confirm({
        title: '是否删除该API？',
        content: '<p>删除后将相关的分支均会删除且无法恢复</p>',
        onOk: () => {
          deleteApi({id: this.apiInfo.id}).then(this.afterEdit)
        },
      })
    },
    afterEdit (data) {
      if (!data.code) {
        this.$Message.success(data.message)
        this.$emit('delete')
      }
    }
  },
}
