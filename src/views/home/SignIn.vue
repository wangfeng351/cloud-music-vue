<template>
  <mu-container style=" padding: 16px 0;">
    <mu-flex direction="column">
      <span>签到详情</span>
      <mu-flex>
        <mu-row justify-content="between">
          <mu-col span="2" v-for="(item, index) in signs" :key="index">
            <mu-avatar size="60">
              <img :src="item.avatar" alt="" style="width:100%;height:100%" class="avatar2" :class="{avatar1:item.status===1}">
            </mu-avatar>
            {{item.name}}
          </mu-col>
        </mu-row>
      </mu-flex>
      <mu-button color="primary" @click="update()" :disabled="status==true">{{msg}}</mu-button>
    </mu-flex>
  </mu-container>
</template>

<script>
export default {
  name: 'SignIn',
  data() {
    return {
      signs: [],
      msg: '签到',
      user: JSON.parse(localStorage.getItem('user')),
      status: false
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
        console.log(111)
        if(res.data.code == 1){
          this.signs = res.data.data
        }
      })
    },
    update(){
      this.axios({
        method: 'put',
        url: '/sign/single',
        data: {
          adminId: "DE35D7CC05AF96A21D7ADFC8651E6614"
        }
      }).then((res) => {
        console.log(res.data)
        if(res.data.code == 1){
          alert("签到成功")
          this.msg = '已签到'
          this.status = true
          this.selectAll()
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
  .avatar2 {
     opacity:0.2;
  }
  .avatar1 {
     opacity:1;
  }
</style>
