<template>
  <div class="container1">
    <!-- 头部导航 -->
    <div class="nav">
      <md-toolbar class="md-primary" md-elevation="1">
      <mu-icon class="toggle-icon" size="36" value="cloud"></mu-icon>
      <h3 class="md-title" style="flex: 1">Cloud Music 管理系统</h3>
      <mu-tooltip content="全屏" style="margin-right: 20px">
      <mu-icon class="toggle-icon" size="28" value="zoom_out_map"></mu-icon>
      </mu-tooltip>
      <!-- 头像 -->
      <mu-menu placement="top-start" open-on-hover>
      <md-avatar class="md-avatar-icon md-large ">
         <img :src="user.avatar" alt="">
      </md-avatar>
      <mu-list slot="content">
      <mu-list-item button>
        <mu-list-item-title>
        设置
        </mu-list-item-title>
      </mu-list-item>
      <mu-list-item button @click="logout">
        <mu-list-item-title>
        退出
        </mu-list-item-title>
      </mu-list-item>
    </mu-list>
      </mu-menu>
    </md-toolbar>
    </div>
    <div style="height:100%; width:100%; display:flex">
    <!-- 侧边栏 -->
    <div class="menu">

     <mu-list toggle-nested>
       <mu-list-item v-for="(item, index) in menus" :key="index" button :ripple="false" nested :open="open === 'stared'" @toggle-nested="open = arguments[0] ? item.title : ''">
      <template v-if="item.subMenus.length == 0">
       <mu-list-item-action>
        <mu-icon :value="item.icon"></mu-icon>
      </mu-list-item-action>
      <router-link :to="item.path"><mu-list-item-title>{{item.title}}</mu-list-item-title></router-link>
      </template>
      <template v-else> 
          <mu-list-item-action>
        <mu-icon class="toggle-icon" size="24" :value="item.icon"></mu-icon>
      </mu-list-item-action>
      <mu-list-item-title>{{item.title}}</mu-list-item-title>
      <mu-list-item-action>
        <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
      </mu-list-item-action>
      <mu-list-item v-for="(item1, index1) in item.subMenus" :key="index1" button :ripple="false" slot="nested">
        <mu-list-item-action>
        <mu-icon class="toggle-icon" size="24" :value="item1.icon"></mu-icon>
      </mu-list-item-action>
        <router-link :to="item1.path"><mu-list-item-title>{{item1.title}}</mu-list-item-title></router-link>
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
  data () {
    return {
      open: '',
      user:JSON.parse(localStorage.getItem('user')),
      drawer: true,
      menus: [],
      roleId: ''
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
    
    getAdminMenu(){
      this.roleId = this.$route.query.roleId
      this.axios({
        method: 'get',
        url: '/sysRole/list',
        params: {
          roleId: 1
        },
        headers:{ 
           'Content-Type':'application/x-www-form-urlencoded',
         },
      }).then(res => {
        // this.user = res.data.data.user
        // this.menus = res.data.data.permissions
        let data = res.data.data
        
        localStorage.setItem('menuList', JSON.stringify(data.permissions))
        this.menus = JSON.parse(localStorage.getItem('menuList'))
        console.log(this.menus)
        this.$store.commit('setMenuList', this.menus)
      })

    }
  }
}
</script>
<style scope>
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
</style>
