<template>
  <div>
    <mu-card class="card">
      <mu-card-media style="height: 160px; width: 100%">
        <img :src="user.avatar" class="avatar" />
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
    </mu-dialog>
  </div>
</template>

<script>
export default {
  name: 'Color',
  data() {
    return {
      message: '编辑',
      password: '',
      password1: '',
      userful: true,
    }
  },
  components: {},
  created() {
    console.log(this.avatar)
  },
  mounted() {},
  methods: {
    //修改用户信息
    updateAdminInfo() {
      if (this.message == '编辑') {
        this.userful = false
        this.message = '确认修改'
      } else {
        this.axios({
          method: 'put',
          url: '/sysAdmin/info',
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
            localStorage.setItem('user', JSON.stringify(this.user))
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
          url: '/sysAdmin/single',
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
  },
  computed: {
    user: function(){
      return this.$store.state.user
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  width: 340px;
  padding: 10px 10px;
  margin-left: 30px;
}

.avatar {
  height: 160px;
  width: 100%;
  border-radius: 5px;
}
</style>
