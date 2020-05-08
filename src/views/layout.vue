<template>
  <div class="container1">
    <Nav></Nav>
    <!-- 侧边栏 -->
    <mu-row style="margin-top: 50px;height:100%;">
      <mu-col span="2" style="height:100%">
        <SideBar :menus="menus"></SideBar>
      </mu-col>
      <mu-col span="10" fill>
        <router-view class="content-right"></router-view>
      </mu-col>
    </mu-row>
    <mu-row class="footer">
     <mu-bottom-nav shift class="footer" color="black">
       @soft1851-王锋
     </mu-bottom-nav>
     </mu-row>
  </div>
</template>

<script>
import SideBar from '../components/SideBar'
import Nav from '../components/Nav'
export default {
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
  components: {
    SideBar,
    Nav
  },
  computed: {
    menus: function(){
      return this.$store.state.menuList
    }
  },
  created() {
    this.getAdminMenu()
  },
  methods: {
    getAdminMenu() {
      this.roleId = this.$route.query.roleId
      localStorage.setItem('roleId', this.roleId)
      this.$store.commit('roleId', this.roleId)
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/sysRole/list',
        params: {
          roleId: localStorage.getItem('roleId')
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
          this.$store.commit('setMenuList', data.permissions)
        }
      })
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
  min-height: 100%;
  width: 100%;
  background-color: #4e54c8;
}

.side-bar {
  margin-top: 60px;
  box-shadow: 10px 1px 10px 1px #7849cd;
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

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 100;
}

.nav {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100;
}

.content-right {
  padding: 10px;
  padding-bottom: 60px;
}
</style>
