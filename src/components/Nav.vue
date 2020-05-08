<template>
  <div>
    //顶部导航
    <mu-appbar color="primary" class="nav">
      <mu-row justify-content="between" align-items="center">
        <mu-col span="6">
          <mu-flex align-items="center">
            <mu-button icon slot="left" @click.native="changeSide()">
              <mu-icon value="menu"></mu-icon>
            </mu-button>
              <mu-icon class="toggle-icon" size="36" value="cloud"></mu-icon>
              <h3 class="md-title" style="flex: 1">Cloud Music 管理系统</h3>
          </mu-flex>
        </mu-col>
        <mu-col span="6">
          <mu-flex justify-content="end" align-items="center">
            <input type="file" ref="file" class="file" @change="uploadAvatar($event)">
            <router-link to="signIn"  v-if="signStatus"><mu-button color="error" >去签到</mu-button></router-link>
            <mu-tooltip :content="msg">
            <mu-badge :content="msgCount" circle color="secondary" class="demo-icon-badge">
              <mu-button icon>
                <mu-icon value="notifications"></mu-icon>
              </mu-button>
            </mu-badge>
            </mu-tooltip>
            <mu-avatar size="50" @click="changeAvatar()">
              <img :src="user.avatar" style="width:100%;height:100%;" >
            </mu-avatar>
            <!-- <mu-icon value="more_vert"></mu-icon> -->
            <v-btn text small color="primary" @click="logout()">注销</v-btn>
          </mu-flex>
        </mu-col>
      </mu-row>
    </mu-appbar>
  </div>
</template>

<script>
import Bus from '../js/bus'
export default {
 name: 'Nav',
  data() {
    return {
      open: '',
      user: JSON.parse(localStorage.getItem('user')),
      drawer: true,
      roleId: '',
      avatar: '',
      active1: true,
      webSocket: '',
      msgCount: 0,
      msg: '',
      signStatus: false,
      content: ''
    }
  },
  components: {},
  created() {
      this.initWebSocket()
  },
  mounted() {},
  methods: {
      changeSide(){
          this.drawer = !this.drawer
          Bus.$emit('drawer', this.drawer)
      },
      logout() {
      alert('logout')
      localStorage.removeItem('token')
      this.$store.commit('setUser', null)
      this.$router.push('/login')
      localStorage.removeItem('menuList')
      localStorage.removeItem('user')
    },
    changeAvatar() {
      this.$refs.file.click()
    },
    //上传头像
    uploadAvatar(event) {
      const OSS = require('ali-oss')
      let client = new OSS({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI4FpzLFy8uA2PWAXH8cwQ',
        accessKeySecret: 'XLTomRADcglUJ5IgRrHxWKJMjPqg8b',
        bucket: 'blog-manage'
      })
      let timestamp = Date.parse(new Date())
      let imgUrl = 'img/' + timestamp
      var file = event.target.files[0] //获取文件流
      var url = ''
      var _this = this
      client.multipartUpload(imgUrl, file).then(function(result) {
        _this.avatar = result.res.requestUrls[0]
        _this.updateAdminAvatar(_this.avatar)
      })
    },
    //更换头像
    updateAdminAvatar(url) {
      console.log('头像地址：' + url)
      this.axios({
        method: 'put',
        url: 'http://localhost:8080/sysAdmin/info',
        data: {
          id: this.user.userId,
          name: this.user.name,
          avatar: url,
          status: this.user.status
        }
      }).then((res) => {
        if (res.data.code == 1) {
          this.user.avatar = url
          this.$store.commit('setUser', this.user)
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      })
    },
    initWebSocket() {
      this.webSocket = null
      //判断浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        //初始化webSocket(必须)
        let clientID = Math.ceil(Math.random() * 100)
        //创建 WebSocket 对象,注意请求路径！！！！
        this.webSocket = new WebSocket('ws://127.0.0.1:8080/testWebSocket/' + clientID)
        this.webSocket.onopen = this.webSocketonopen()
        this.webSocket.onmessage = this.webSocketonmessage
        this.webSocket.onclose = function() { 
		 				console.error("连接已经关闭.....")
		 			};
      }
    },
    webSocketonopen() {
      console.log('webSocket与客户端建立成功!')
    },
    webSocketonmessage(e) {
      console.log("客户端接收到的消息是：" + e.data)
      if(e.data == "signIn"){
        this.msg = e.data
        this.msgCount += 1
        this.signStatus = true
        console.log(this.msg.length)
        this.timer = setInterval(this.closeWebSocket, 10000)
      }
    },
    closeWebSocket(){
      this.webSocket.close()
      this.signStatus = false
      console.log("关闭webSocket")
      clearInterval(this.timer)
      this.$router.push('/dashboard')
      alert('签到结束')
    },
  },
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
