<template>
  <div class="container1">
    <!-- 头部导航 -->
    <div class="nav">
      <md-toolbar class="md-primary" md-elevation="1">
        <mu-icon class="toggle-icon" size="36" value="cloud"></mu-icon>
        <h3 class="md-title" style="flex: 1">Cloud Music 管理系统</h3>
        <input ref="file" class="file" type="file" @change="uploadAvatar($event)" />
        <mu-tooltip content="全屏" style="margin-right: 20px">
          <mu-icon class="toggle-icon" size="28" value="zoom_out_map"></mu-icon>
        </mu-tooltip>
        <!-- 头像 -->
        <mu-menu placement="top-start" open-on-hover>
          <md-avatar class="md-avatar-icon md-large">
            <img :src="user.avatar" @click="changeAvatar()" alt />
          </md-avatar>
          <!-- 修改用户信息 -->
          <mu-list slot="content">
            <mu-list-item button @click="openSimple=true">
              <mu-list-item-title>修改个人信息</mu-list-item-title>
            </mu-list-item>
            <mu-dialog title="个人信息" width="500" :open.sync="openSimple">
              <mu-card width="490">
                <mu-card-media style="height: 160px; width: 100%">
                  <img :src="user.avatar" style="height: 160px; width: 100%" />
                </mu-card-media>
                <p>
                  用户名:
                  <mu-text-field v-model="user.name" class="info-input" :disabled="userful"></mu-text-field>
                </p>
                <p>
                  <span>ID:</span>
                  <mu-text-field v-model="user.userId" class="info-input" :disabled="userful"></mu-text-field>
                  <br />
                </p>
                <mu-button color="success" @click="updateAdminInfo()">{{message}}</mu-button>
              </mu-card>
              <mu-button slot="actions" flat color="primary" @click="openSimple=false">Close</mu-button>
            </mu-dialog>
            <!-- 修改密码 -->
            <mu-list-item button @click="openSimple1=true">
              <mu-list-item-title>修改密码</mu-list-item-title>
            </mu-list-item>
            <mu-dialog title="个人信息" width="500" :open.sync="openSimple1">
              <p>
                输入新密码:
                <mu-text-field v-model="password" class="info-input"></mu-text-field>
              </p>
              <p>
                确认密码:
                <mu-text-field v-model="password1" class="info-input"></mu-text-field>
                <br />
              </p>
              <mu-button color="success" @click="updateAdminPassword()">确认修改</mu-button>
              <mu-button slot="actions" flat color="primary" @click="openSimple1=false">Close</mu-button>
            </mu-dialog>

            <!-- 退出 -->
            <mu-list-item button @click="logout">
              <mu-list-item-title>退出</mu-list-item-title>
            </mu-list-item>
          </mu-list>
        </mu-menu>
      </md-toolbar>
    </div>
    <div style="height:100%; width:100%; display:flex">
      <!-- 侧边栏 -->
      <div class="menu">
        <mu-list toggle-nested>
          <mu-list-item
            v-for="(item, index) in menus"
            :key="index"
            button
            :ripple="false"
            nested
            :open="open === 'stared'"
            @toggle-nested="open = arguments[0] ? item.title : ''"
          >
            <template v-if="item.subMenus.length == 0">
              <mu-list-item-action>
                <mu-icon :value="item.icon"></mu-icon>
              </mu-list-item-action>
              <router-link :to="item.path">
                <mu-list-item-title>{{item.title}}</mu-list-item-title>
              </router-link>
            </template>
            <template v-else>
              <mu-list-item-action>
                <mu-icon class="toggle-icon" size="24" :value="item.icon"></mu-icon>
              </mu-list-item-action>
              <mu-list-item-title>{{item.title}}</mu-list-item-title>
              <mu-list-item-action>
                <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
              </mu-list-item-action>
              <mu-list-item
                v-for="(item1, index1) in item.subMenus"
                :key="index1"
                button
                :ripple="false"
                slot="nested"
              >
                <mu-list-item-action>
                  <mu-icon class="toggle-icon" size="24" :value="item1.icon"></mu-icon>
                </mu-list-item-action>
                <router-link :to="item1.path">
                  <mu-list-item-title>{{item1.title}}</mu-list-item-title>
                </router-link>
              </mu-list-item>
            </template>
          </mu-list-item>
        </mu-list>
      </div>
      <router-view></router-view>
    </div>
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
      password1: ''
    }
  },
  created() {
    this.getAdminMenu()
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

.menu {
  width: 220px;
  background-color: white;
  box-shadow: -3px 5px 1px 5px white;
  height: 600px;
  margin: 20px 20px;
}

.md-toolbar + .md-toolbar {
  margin-top: 16px;
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

* {
  list-style: none;
  text-decoration: none;
}
</style>
