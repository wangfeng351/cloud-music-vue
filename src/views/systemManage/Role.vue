<template>
<div style="width:100%">
  <p>
    <mu-button color="primary" @click="openSimple=true">新增角色</mu-button>
    <mu-dialog title="新增角色信息" width="360" :open.sync="openSimple">
      <mu-text-field v-model="roleName" placeholder="角色名称"></mu-text-field>
      <mu-text-field v-model="roleDescription" placeholder="角色描述"></mu-text-field>
    <mu-button slot="actions" flat color="primary" @click="insertRole()">确认</mu-button>
    <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button>
  </mu-dialog>
  </p>
  <div class="container1">
    <div class="roles">
      <mu-data-table
        :columns="columns"
        :sort.sync="sort"
        @sort-change="handleSortChange"
        :data="roles"
      >
        <template slot-scope="scope">
          <td>{{scope.row.role_id}}</td>
          <td class="is-center" @click="viewMenus(scope.row)">{{scope.row.role_name}}</td>
          <td class="is-left">{{scope.row.descriiption}}</td>
          <td class="is-left">
            <mu-button color="error" @click="deleteSingle(scope.row.role_id)">删除</mu-button>
          </td>
        </template>
      </mu-data-table>
    </div>
    <span class="role-permissions">
      <p class="r-p-h">
        <span>{{admin}}的权限</span>
        <span>
          <mu-button color="primary" @click="insertRolePermission()">新增权限</mu-button>
        </span>
      </p>
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
              <mu-button color="error" style="height:30px;">删除</mu-button>
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
              <mu-list-item-title style="margin-left:-30px">{{item1.icon}}</mu-list-item-title>
              <mu-list-item-title>{{item1.path}}</mu-list-item-title>
              <mu-list-item-action>
                <mu-button color="error" style="height:30px;">删除</mu-button>
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
                  <mu-button color="error" style="height:30px;">删除</mu-button>
                </mu-list-item-action>
              </mu-list-item>
            </mu-list-item>
          </template>
        </mu-list-item>
      </mu-list>
    </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sort: {
        name: '',
        order: 'asc'
      },
      columns: [
        { title: 'id', width: 40, name: 'role_id' },
        { title: '名称', name: 'role_name', width: 120, align: 'center', sortable: true },
        { title: '描述', name: 'description', width: 200, align: 'left', sortable: true },
        { title: '操作', name: 'operation', align: 'left', sortable: true }
      ],
      roles: [],
      menus: [],
      admin: 'admin',
      openSimple: false,
      roleDescription: '',
      roleName: ''
    }
  },
  created() {
    this.getRoles()
  },

  methods: {
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) => (order === 'asc' ? a[name] - b[name] : b[name] - a[name]))
    },
    getRoles() {
      this.axios({
        method: 'get',
        url: '/sysRole/all'
      }).then((res) => {
        this.roles = res.data.data
        this.menus = this.roles[0].roleMenus
        console.log(this.menus)
      })
    },
    //查询角色权限
    viewMenus(item) {
      this.menus = item.roleMenus
      console.log(item)
    },

    //关闭遮罩层
    closeSimpleDialog(){
       this.openSimple = false
    },
    //新增角色
    insertRole(){
      this.axios({
        method: 'post',
        url: '/sysRole/single',
        data: {
          roleName: this.roleName,
          description: this.roleDescription
        }
      }).then((res) => {
        this.openSimple = false
        if(res.data.code == 1){
          alert("新增成功")
          this.getRoles()
        }
      })
    },
    //删除角色
    deleteSingle(id){
      this.axios({
        method: 'delete',
        url: '/sysRole/single/' + id,
      }).then((res) => {
        if(res.data.code == 1){
          alert("删除成功")
          this.getRoles()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  .roles {
    box-shadow: 2px 2px 2px 2px #ddd;
    height: 300px;
    width: 42%;
    background-color: white;
  }

  .role-permissions {
    width: 50%;
    // border: 1px solid #ddd;
    padding: 0px 10px;
    background-color: white;
    max-height: 600px;
    margin-right: 40px;
    box-shadow: 2px 2px 2px 2px #ddd;
    .r-p-h {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
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
      margin-right: 30px;
      margin-left: -20px;
    }
    .p-s-c-title {
      margin-left: 80px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
