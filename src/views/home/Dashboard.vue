<template>
  <div>
     <router-link to="signIn">
       <h2>Dashboard</h2>
     </router-link>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      webSocket: '',
      timer: ''
    }
  },
  components: {},
  created() {
    this.selectAll()
  },
  mounted() {},
  methods: {
    selectAll(){
      this.axios({
        method: 'get',
        url: '/sign/list'
      }).then((res) => {
        console.log(res)
        if(res.data.code == 1){
          this.signs = res.data.data
        }
      })
    },
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
