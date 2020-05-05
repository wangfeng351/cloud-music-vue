<script>
export default {
 name: 'Jump',
  data() {
    return {
      user:{}
    }
  },
  components: {},
  created() {
    this.getGithubInfo()
  },
  mounted() {},
  methods: {
    getGithubInfo() {
      this.user = JSON.parse(this.$route.query.user)
      console.log(this.user.roles)
      localStorage.setItem('user', JSON.stringify(this.user.user))
      this.$store.commit('setUser', this.user.user)
      this.$store.commit('setToken', this.user.token)
      let roleId = this.user.roles[0].roleId
      localStorage.setItem('roleId', roleId)
      this.$router.push({
        name: 'layout',
        query: {
          roleId: roleId
        }
      })
    },
  },
  computed: {}
}
</script>
