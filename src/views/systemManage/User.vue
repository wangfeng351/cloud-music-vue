<template>
<div class="con">
<span class="operation" v-for="(item, index) in permission" :Key="index">
  <mu-button color="info" v-if="item == 'add'">新增</mu-button>
  <mu-button color="error" v-if="item == 'edit'">编辑</mu-button>
  <mu-button color="secondary" v-if="item == 'delete'">删除</mu-button>
</span>
  <div class="table">
      <div class="adminRole">
      <p>角色：</p>
      <mu-list>
      <mu-list-item v-for="(item, index) in roles" :key="index" button :ripple="false">
      <mu-list-item-title>{{item.roleName}}</mu-list-item-title>
      </mu-list-item>
      </mu-list>
      </div>
    <!-- <mu-flex justify-content="center">
    <mu-pagination raised circle :total="1000" :current.sync="current"></mu-pagination>
    </mu-flex> -->
    <!-- 角色信息 -->
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">用户信息</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="根据姓名搜索" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="头像" md-sort-by="avatar" md-numeric>
          <mu-avatar color="indigo">
            <img :src="item.avatar" alt="">
          </mu-avatar>
        </md-table-cell>
        <md-table-cell md-label="姓名" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="角色">
          <span v-for="item1 in item.roles" :key="item1">
              {{item1.role_name}}
          </span>
        </md-table-cell>
        <md-table-cell md-label="状态" md-sort-by="status">
          <mu-switch v-model="item.status"></mu-switch>
        </md-table-cell>
        <md-table-cell md-label="创建时间" md-sort-by="create_time">{{ item.create_time.slice(0,11) }}</md-table-cell>
      </md-table-row>
    </md-table>
    </div>
  </div>
</template>

<script>
const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }

    return items
  }
export default {
 name: 'User',
  data() {
    return {
      search: null,
      searched: [],
      permission: [],
      current: 1,
      admins: [], 
      roles: []
    }
  },
  components: {},
  created() {
    this.getAdmin()
    this.permission = this.$store.state.menuList1[1].subMenus[0].permissions
    
  },
  mounted() {},
  methods: {
    newUser () {
        window.alert('Noop')
      },
      searchOnTable () {
        this.searched = searchByName(this.admins, this.search)
      },
    getAdmin(){
      this.axios({
        method: 'get',
        url: '/sysAdmin/list',
      }).then((res) => {
        this.admins = res.data.data.admin
        this.roles = res.data.data.roles
        console.log(this.admins)
        this.searched = this.admins
        console.log(console.log())

      })
    }

  },
  computed: {}
}
</script>

<style scoped lang="scss">
  .con {
    width: 100%;
  }

  .md-field {
    max-width: 300px;
  }

  .table {
    display: flex;
    // justify-content: space-between;
    width: 100%;
    padding: 20px 20px;
    .adminRole {
      width: 200px;
      background-color: #eee;
      // margin-right: 20px;
    }
  }

  .md-table {
    max-height: 600px;
    width: 65%;
    background-color: white;
  }

  .operation {
    display: inline-block;
    margin: 20px 20px;
    .mu-button {
       margin-right: 10px;
    }
  }
</style>
