<template>
  <div>
    
  </div>
</template>

<script>
export default {
 name: 'Jump',
  data() {
    return {

    }
  },
  components: {},
  created() {
      this.axios({
          method: 'get',
          url: 'value'
      }).then(res =>{
          console.log(res.data)
          localStorage.setItem("data", JSON.stringify(res.data))
          this.$router.push("/index")
      })
  },
  mounted() {},
  methods: {},
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
