<template>
  <div class="container1">
    <mu-appbar color="primary">
      <mu-row justify-content="between">
        <mu-col span="6">
          <mu-flex align-items="center">
            <mu-button icon slot="left" @click="active1=!active1">
              <mu-icon value="menu"></mu-icon>
            </mu-button>
            <mu-button icon slot="left" @click="active1=!active1">
              <mu-icon class="toggle-icon" size="36" value="cloud"></mu-icon>
            </mu-button>
            <h3 class="md-title" style="flex: 1">Cloud Music 管理系统</h3>
          </mu-flex>
        </mu-col>
        <mu-col span="6">
          <mu-flex justify-content="end" align-items="center">
            <router-link to="signIn"  v-if="signStatus"><mu-button color="error" >去签到</mu-button></router-link>
            <mu-tooltip :content="msg">
            <mu-badge :content="msgCount" v-if="signStatus" circle color="secondary" class="demo-icon-badge">
              <mu-button icon>
                <mu-icon value="notifications"></mu-icon>
              </mu-button>
            </mu-badge>
            </mu-tooltip>
            <mu-avatar size="50">
              <img  @click="goIndex()" :src="user.avatar" alt style="width:100%;height:100%;" >
            </mu-avatar>
          </mu-flex>
        </mu-col>
      </mu-row>
    </mu-appbar>

    <!-- 侧边栏 -->
    <mu-row style="height:100%">
      <mu-col span="2" v-if="active1" class="list">
        <v-list style="background-color: rgba(0,0,0,0)">
          <v-list-group v-for="(menu, parent) in menus" :key="parent" no-action>
            <template v-slot:activator v-ripple>
              <v-list-item-icon>
                <mu-icon class="toggle-icon" size="24" :value="menu.icon"></mu-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="menu.subMenus.length === 0">
                <router-link
                  :to="menu.path"
                  v-if="menu.subMenus.length === 0"
                  style="text-decoration: none; color:black"
                >
                  <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                </router-link>
              </v-list-item-content>
              <v-list-item-content v-else>
                <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              class="sub-menu"
              v-for="(subMenu, current) in menu.subMenus"
              :key="current"
              v-ripple
              link
            >
              <v-list-item-icon>
                <mu-icon class="toggle-icon" size="24" :value="subMenu.icon"></mu-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <router-link :to="subMenu.path" style="text-decoration: none;color:black  ">
                  <v-list-item-title class="link">{{ subMenu.title }}</v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </mu-col>
      <mu-col span="10" fill>
        <router-view></router-view>
      </mu-col>
    </mu-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: '',
      user: JSON.parse(localStorage.getItem('user')),
      drawer: true,
      menus: [],
      roleId: '',
      avatar: '',
      openSimple: false,
      openSimple1: false,
      userful: true,
      message: '编辑',
      password: '',
      password1: '',
      active1: true,
      webSocket: '',
      msgCount: 0,
      msg: '',
      signStatus: false
    }
  },
  created() {
    this.getAdminMenu()
    this.initWebSocket()
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6Ilt7XCJyb2xlSWRcIjoxLFwicm9sZU5hbWVcIjpcImFkbWluXCJ9LHtcInJvbGVJZFwiOjIsXCJyb2xlTmFtZVwiOlwiZWRpdG9yXCJ9XSIsImlzcyI6ImF1dGgwIiwiZXhwIjoxNTg4NTAzOTE1LCJ1c2VySWQiOiJFMTBBREMzOTQ5QkE1OUFCQkU1NkUwNTdGMjBGODgzRSJ9.nwkZcp9Hl4ZHW4_NKx54jekiCQyKooPyDzFoINFfn_Y'
    )
  },
  methods: {
    logout() {
      alert('logout')
      localStorage.removeItem('token')
      this.$store.commit('setUser', null)
      this.$router.push('/login')
    },

    getAdminMenu() {
      this.roleId = this.$route.query.roleId
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/sysRole/list',
        params: {
          roleId: 1
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          adminId: this.user.userId
        }
      }).then((res) => {
        // this.user = res.data.data.user
        // this.menus = res.data.data.permissions
        console.log(res)
        if (res.data.code == 1) {
          let data = res.data.data
          localStorage.setItem('menuList', JSON.stringify(data.permissions))
          this.menus = JSON.parse(localStorage.getItem('menuList'))
          console.log(this.menus)
          this.$store.commit('setMenuList', this.menus)
        }
      })
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
        console.log(result)
        console.log('链接地址：' + _this.avatar)
        // _this.updateAdminAvatar(_this.avatar)
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
          localStorage.setItem('user', this.user)
        }
      })
    },
    //修改用户信息
    updateAdminInfo() {
      if (this.message == '编辑') {
        this.userful = false
        this.message = '确认修改'
      } else {
        this.axios({
          method: 'put',
          url: 'http://localhost:8080/sysAdmin/info',
          data: {
            id: this.user.userId,
            name: this.user.name,
            avatar: this.user.avatar,
            status: this.user.status
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.$store.commit('setUser', this.user)
            localStorage.removeItem('user')
            localStorage.setItem('user', this.user)
            this.userful = true
            this.message = '编辑'
          }
        })
      }
    },
    //修改密码
    updateAdminPassword() {
      if (this.password == this.password1) {
        this.axios({
          method: 'put',
          url: 'http://localhost:8080/sysAdmin/single',
          data: {
            id: this.user.userId,
            name: this.user.name,
            password: this.password
          }
        }).then((res) => {
          if (res.data.code === 1) {
            alert('修改成功')
            this.password = ''
            this.password1 = ''
            this.openSimple1 = false
          } else {
            alert(res.data.data)
          }
        })
      } else {
        alert('两次密码不正确')
      }
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
  }
}
</script>
<style scope lang="scss">
.demo-list-wrap {
  width: 100%;
  max-width: 360px;
  overflow: hidden;
}

.md-toolbar + .md-toolbar {
  margin-top: 16px;
}

.list {
  background-image: linear-gradient(#7f7fd5, #91eae4);
  height: 100%;
}

.container1 {
  height: 100%;
}

a {
  color: #fff;
  text-decoration: none;
}

.mu-list-item {
  width: 60px;
}

.file {
  display: none;
}
.mu-card {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  p {
    margin: 0;
    width: 100%;
    .info-input {
      width: 100%;
      height: 30px;
    }
  }
}

.sub-menu {
  margin-left: 30px;
}

.demo-icon-badge {
  margin-top: 20px;
  margin-right: 16px;
}
</style>
