<template>
  <v-app>
    <Nav :user="user"></Nav>
    <Tab></Tab>
  </v-app>
</template>

<script>
import Nav from '../components/github/Nav'
import Tab from '../components/github/Tab'
export default {
 name: 'Index',
  data() {
    return {
        user: {}
    }
  },
  components: {
      Nav,
      Tab
  },
  created() {
    this.axios({
      method: 'get',
      url: "allInfo",
    }).then(res => {
      localStorage.setItem("data", JSON.stringify(res.data))
      this.user = res.data.user
    })
  },
  mounted() {},
  methods: {},
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
