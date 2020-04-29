<template>
  <div class="w">
    <div style="width: 55%">
      <p>
        <mu-button color="primary" @click="insertMenu()">新增</mu-button>
      </p>
      <div class="role-permissions">
        <p class="role-permissions-head">
          <span>id</span>
          <span>名称</span>
          <span>图标</span>
          <span>path</span>
          <span>操作</span>
        </p>
        <mu-list toggle-nested>
          <mu-list-item
            v-for="(item, index) in menus"
            :key="index"
            button
            :ripple="false"
            nested
            :open="open === 'stared'"
            @toggle-nested="open = arguments[0] ? item.title : ''"
            style="border-bottom:1px solid black;"
          >
            <template>
              <mu-list-item-title>{{item.menu_id}}</mu-list-item-title>
              <mu-list-item-title class="permission-title">
                <mu-icon
                  class="toggle-icon"
                  size="24"
                  value="keyboard_arrow_down"
                  v-if="item.subMenus.length > 1"
                ></mu-icon>
                <span>{{item.title}}</span>
              </mu-list-item-title>
              <mu-list-item-title>{{item.icon}}</mu-list-item-title>
              <mu-list-item-title>{{item.path}}</mu-list-item-title>
              <mu-list-item-action>
                <mu-button color="error" style="height:30px;" @click="deleteSingle(item.menu_id)">删除</mu-button>
              </mu-list-item-action>
              <mu-list-item
                v-for="(item1, index1) in item.subMenus"
                :key="index1"
                button
                :ripple="false"
                slot="nested"
                nested
                :open="open === 'stared'"
                @toggle-nested="open = arguments[0] ? item1.title : ''"
                style="border-top:1px solid black"
              >
                <mu-list-item-title style="margin-left:-10px">{{item.menu_id}}-{{index1+1}}</mu-list-item-title>
                <mu-list-item-title class="p-f-c-title">
                  <mu-icon
                    class="toggle-icon"
                    size="24"
                    value="keyboard_arrow_down"
                    v-if="item1.subMenus.length > 1"
                  ></mu-icon>
                  <span>{{item1.title}}</span>
                </mu-list-item-title>
                <mu-list-item-title style="margin-left:20px">{{item1.icon}}</mu-list-item-title>
                <mu-list-item-title>{{item1.path}}</mu-list-item-title>
                <mu-list-item-action>
                  <mu-button color="error" style="height:30px;" @click="deleteSingle(item1.menu_id)">删除</mu-button>
                </mu-list-item-action>
                <!-- <mu-list-item-action>
              <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down" v-if="item1.subMenus.length > 1"></mu-icon>
                </mu-list-item-action>-->
                <mu-list-item
                  v-for="(item2, index2) in item1.subMenus"
                  :key="index2"
                  button
                  :ripple="false"
                  slot="nested"
                  style="border-top:1px solid black"
                >
                  <mu-list-item-title
                    style="margin-left:-20px"
                  >{{item.menu_id}}-{{index1+1}}-{{index2+1}}</mu-list-item-title>
                  <mu-list-item-title class="p-s-c-title">
                    <mu-icon
                      class="toggle-icon"
                      size="24"
                      value="keyboard_arrow_down"
                      v-if="item2.subMenus.length > 1"
                    ></mu-icon>
                    <span>{{item2.title}}</span>
                  </mu-list-item-title>
                  <mu-list-item-title style="margin-left: 80px">{{item2.icon}}</mu-list-item-title>
                  <mu-list-item-title></mu-list-item-title>
                  <mu-list-item-title></mu-list-item-title>
                  <mu-list-item-action>
                    <mu-button color="error" style="height:30px;" @click="deleteSingle(item2.menu_id)">删除</mu-button>
                  </mu-list-item-action>
                </mu-list-item>
              </mu-list-item>
            </template>
          </mu-list-item>
        </mu-list>
      </div>
    </div>
    <div class="view-menu">
      <div style="text-align:center; font-size:20px;font-weight:600">权限编辑栏</div>
      <p>
        <mu-select label="父类权限" class="input-width" v-model="permission.permissionParent">
        <mu-option v-for="(option,index) in options" :key="index" :label="option.title" :value="option.menuId"></mu-option>
        </mu-select>
        <mu-text-field v-model="permission.permissionName" class="input-width" placeholder="权限名称"></mu-text-field><br/>
      </p>
      <p>
        <mu-text-field v-model="permission.permissionIcon" class="input-width" placeholder="图标"></mu-text-field><br/>
        <mu-text-field v-model="permission.permissionPath" class="input-width" placeholder="path"></mu-text-field><br/>
      </p>
      <mu-select label="菜单类型" class="input-width" v-model="permission.permissionType" full-width>
        <mu-option v-for="(type,index) in types" :key="index" :label="type.name" :value="type.value"></mu-option>
      </mu-select>
      <p>
        <mu-button color="primary" @click="insertMenu1()" v-if="btnShow">确认</mu-button>
        <mu-button color="error" v-if="btnShow">取消</mu-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Permission',
  data() {
    return {
      menus: [],
      options: [
      ],
      openSimple: false,
      permission: {
        permissionParent: '',
        permissionName: '',
        permissionIcon: '',
        permissionPath: '',
        permissionType:'',
      },
      types:[
        {name:'目录权限', value: '1'},
        {name:'菜单权限', value: '2'},
        {name:'按钮', value: '3'},
      ],
      btnShow: false
    }
  },
  components: {},
  created() {
    this.getPermission()
  },
  mounted() {},
  methods: {
    getPermission() {
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/sysMenu/list'
      }).then((res) => {
        this.menus = res.data.data.menus
        this.options = res.data.data.all
        this.start(this.menus[0])
      })
    },
    deleteSingle(id){
      this.axios({
        method: 'delete',
        url: this.GLOBAL.baseUrl + '/sysMenu/single/' + id
      }).then((res) => {
        if(res.data.code == 1){
          alert("删除成功")
        }
      })
    },
    //初始化编辑区
    start(item){
      if(item.parent_id == 0){
        this.permission.permissionParent = "顶级菜单"
      }else {
        this.permission.permissionParent = item.parent_id
      }
      this.permission.permissionName = item.title
      this.permission.permissionIcon = item.icon
      this.permission.permissionPath = item.path
      if(item.type == 1){
        this.permission.permissionType = "目录权限"
      }
      if(item.type == 2){
        this.permission.permissionType = "菜单权限"
      }
      if(item.type == 3){
        this.permission.permissionType = "按钮权限"
      }
    },

    //新增权限
    insertMenu(){
      this.btnShow = true
      this.permission.permissionParent = ''
      this.permission.permissionName = ''
      this.permission.permissionIcon = ''
      this.permission.permissionPath = ''
      this.permission.permissionType = ''
    },
    insertMenu1(){
      alert(this.permission.permissionParent)
      this.axios({
        method: 'post',
        url: this.GLOBAL.baseUrl + '/sysMenu/single',
        data: {
          parentId: this.permission.permissionParent,
          type: this.permission.permissionType,
          title: this.permission.permissionName,
          path: this.permission.permissionPath,
          icon: this.permission.permissionIcon
        }
      }).then((res) => {
        if(res.data.code == 1){
          alert("新增成功")
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.w {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px; 
  .role-permissions {
    // border: 1px solid #ddd;
    padding: 10px 10px;
    background-color: white;
    max-height: 600px;
    margin-right: 40px;
    margin-top: 20px;
    box-shadow: 2px 2px 2px 2px #ddd;
    &-head {
      display: flex;
      justify-content: space-between;
      padding: 0px 20px;
    }
    .permission-title {
      margin-right: 40px;
      display: flex;
      align-items: center;
    }
    .p-f-c-title {
      display: flex;
      align-items: center;
      margin-right: 0px;
      margin-left: 10px;
    }
    .p-s-c-title {
      margin-left: 90px;
      display: flex;
      align-items: center;
    }
  }
  
  .view-menu {
    width: 40%;
    padding: 20px 20px;
    background-color: white;
    box-shadow: 2px 2px 2px 2px #ddd;
    height: 400px;
    p {
      display: flex;
      justify-content: space-between;
    }
    .input-width {
      width: 40%;
    }
  }
}
</style>
