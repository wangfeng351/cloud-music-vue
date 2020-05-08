<template>
  <div>
    <!-- 侧边栏 -->
        <v-navigation-drawer app v-model="drawer1" clipped class="side-bar" elevation="5" color="#00b3da">
        <v-list style="background-color: rgba(0,0,0,0)" dense>
          <v-list-group v-for="(menu, parent) in menus" :key="parent" no-action>
            <template v-slot:activator v-ripple>
            <v-list-item link :to="{path: menu.path}" style="text-decoration: none"  v-if="menu.subMenus.length === 0">
              <v-list-item-icon>
                <mu-icon class="toggle-icon" size="24" :value="menu.icon"></mu-icon>
              </v-list-item-icon>
                  <v-list-item-title class="link">{{ menu.title }}</v-list-item-title>
              </v-list-item>
              <v-list-item v-else>
                <v-list-item-icon>
                <mu-icon class="toggle-icon" size="24" :value="menu.icon"></mu-icon>
                </v-list-item-icon>
                <v-list-item-title class="link" >{{ menu.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              class="sub-menu"
              v-for="(subMenu, current) in menu.subMenus"
              :key="current"
              v-ripple
              link
              :to="subMenu.path"
              style="text-decoration: none"
            >
              <v-list-item-icon class="ms-2">
                <mu-icon class="toggle-icon" size="24" :value="subMenu.icon"></mu-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title class="link">{{ subMenu.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        </v-navigation-drawer>
  </div>
</template>

<script>
import Bus from '../js/bus'
export default {
 name: 'SideBar',
  data() {
    return {
      drawer1: true
    }
  },
  props:['menus'],
  components: {},
  created() {
    console.log(this.menus)
  },
  mounted() {
    var _this = this
    Bus.$on('drawer', function(drawer){
      _this.drawer1 = drawer
    })
  },
  methods: {
    change(){
    }
  },
  computed: {
    
  }
}
</script>

<style scoped lang="scss">
  a {
    text-decoration: none;
  }
 
  .router-link-active {
    text-decoration: none;
  }

  .removeLink {
      text-decoration: none;
  }

  .link {
      margin-left: 5px;
  }
</style>
