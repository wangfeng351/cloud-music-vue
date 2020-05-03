<template>
  <div class="container1">
    <mu-appbar color="primary">
      <mu-button icon slot="left" @click="active1=!active1">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <mu-button icon slot="left" @click="active1=!active1">
        <mu-icon class="toggle-icon" size="36" value="cloud"></mu-icon>
      </mu-button>
      <h3 class="md-title" style="flex: 1">Cloud Music 管理系统</h3>
    </mu-appbar>
    <mu-row style="height:100%">
      <!-- 侧边栏 -->
      <mu-col span="2" v-if="active1" class="list">
         <v-list style="background-color: rgba(0,0,0,0)">
              <v-list-group v-for="(menu, parent) in menus" :key="parent" no-action>
                <template v-slot:activator v-ripple>
                  <v-list-item-icon>
                    <mu-icon class="toggle-icon" size="24" :value="menu.icon"></mu-icon>
                  </v-list-item-icon>
                  <v-list-item-content v-if="menu.subMenus.length === 0">
                    <router-link :to="menu.path" v-if="menu.subMenus.length === 0" style="text-decoration: none; color:black">
                      <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                    </router-link>
                  </v-list-item-content>
                  <v-list-item-content v-else>
                    <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item class="sub-menu" v-for="(subMenu, current) in menu.subMenus" :key="current" v-ripple link>
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
      active1: true
    }
  },
  created() {
    this.getAdminMenu()
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6Ilt7XCJyb2xlSWRcIjoxLFwicm9sZU5hbWVcIjpcImFkbWluXCJ9LHtcInJvbGVJZFwiOjIsXCJyb2xlTmFtZVwiOlwiZWRpdG9yXCJ9XSIsImlzcyI6ImF1dGgwIiwiZXhwIjoxNTg4NTAzOTE1LCJ1c2VySWQiOiJFMTBBREMzOTQ5QkE1OUFCQkU1NkUwNTdGMjBGODgzRSJ9.nwkZcp9Hl4ZHW4_NKx54jekiCQyKooPyDzFoINFfn_Y")
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
    }
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
  background-image: linear-gradient( #7f7fd5, #91eae4);
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
</style>
