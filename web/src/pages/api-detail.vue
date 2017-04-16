<template>
  <detailApi :info="info"></detailApi>
</template>
<script>
import detailApi from '../components/detail/detail-api.vue'
import { getApiDetail } from '@/api/api.js'
export default {
  name: 'api-detail',
  data () {
    return {
      info: {

      },
    }
  },
  components: {
    detailApi,
  },
  watch: {

  },
  mounted () {
    let query = this.$route.query
    if (query.id) {
      this.getApiDetail({id: query.id})
    }
  },
  methods: {
    getApiDetail (data) {
      return getApiDetail(data).then((data) => {
        if (!data.code) {
          this.info = data.data.result
        }
      })
    },
  },
}
</script>
<style scoped>

</style>
