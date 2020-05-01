<template>
  <div class="container">
    <mu-form ref="form" :model="validateForm" class="mu-demo-form">
      <mu-form-item label="用户名" help-text="帮助文字" prop="username" :rules="usernameRules">
        <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="密码" prop="password" :rules="passwordRules">
        <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
      </mu-form-item>
      <div>
        <mu-auto-complete label="提示输入内容" v-model="verifyCode"></mu-auto-complete>
        <img ref="image" alt @click="getVerify()" />
      </div>
      <mu-form-item prop="isAgree" :rules="argeeRules">
        <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
      </mu-form-item>
      <mu-form-item>
        <mu-button color="primary" @click="submit">提交</mu-button>
        <mu-button @click="clear">重置</mu-button>
      </mu-form-item>
    </mu-form>
    <mu-dialog title="Dialog" width="360" :open.sync="roles.length > 1">
      <div>
        <span>请选择你的角色</span>
        <p v-for="(item, index) in roles" :key="index" @click="goIndex(item)">
          <span>{{item.roleName}}</span>
        </p>
      </div>
      <mu-button slot="actions" flat color="primary">Close</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      usernameRules: [
        { validate: (val) => !!val, message: '必须填写用户名' },
        { validate: (val) => val.length >= 3, message: '用户名长度大于3' }
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码' },
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10' }
      ],
      argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议' }],
      validateForm: {
        username: '',
        password: '',
        isAgree: false
      },
      verifyCode: '',
      vailiable: true,
      openSimple: false,
      roles: [],
      currentTime: '',
      user: {}
    }
  },
  created() {
    this.getVerify()
  },

  watch: {
    //    password: function(){
    //    if(this.password.length >=6 && this.validateForm.username != null){
    //      this.getVerify()
    //    }
    //  }
  },

  methods: {
    //获取验证码
    getVerify() {
      //获取当前时间毫秒数作为验证码的key
      this.currentTime = new Date().getTime()
      this.axios({
        method: 'get',
        url:'http://localhost:8080/captcha',
        // 将请求数据转换为form-data格式
        params: {
          name: this.currentTime
        },
        // 设置请求头Content-Type
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //后端采用流
        responseType: 'blob'
      }).then((res) => {
        //使用$refs获取网页标签
        let img = this.$refs.image
        //const blob = new Blob([res.data], {type: 'image/jpeg'})
        //将接收到的数据转成地址
        let url = window.URL.createObjectURL(res.data)
        //console.log(blob)
        //赋值给图片标签的src
        img.src = url
      })
    },
    //提交登录信息
    submit() {
      console.log(this.currentTime)
      this.$refs.form.validate().then((result) => {
        //模拟后端接口数据
        this.axios({
          method: 'post',
          url: 'http://localhost:8080/sysAdmin/login',
          data: {
            name: this.validateForm.username,
            password: this.validateForm.password,
            verifyCode: this.verifyCode
          },
          headers: {
            Verify: this.currentTime
          }
        }).then((res) => {
          if (res.data.code == 1) {
            let data = res.data.data
            //登录成功，将返回的token存入localStorage，并且也存入Vuex中
            localStorage.setItem('token', data.token)
            //获取用户角色
            this.roles = data.roles
            //获取用户信息并存入Vuex和localStorage
            localStorage.setItem('user', JSON.stringify(data.user))
            console.log(localStorage.getItem('user'))
            this.$store.commit('setUser', data.user)
            this.$store.commit('setToken', data.token)
            //再进入主页之前调用查询用户角色的方法，看是否存在多个用户
          } else {
            alert(res.data.msg)
          }
        })
        // localStorage.setItem('user', JSON.stringify(user))
        // localStorage.setItem('menuList', JSON.stringify(this.menuList))

        // this.$store.commit('setUser', user)
        // this.$store.commit('setMenuList', this.menuList)
      })
    },

    //进入主页
    goIndex(item) {
      localStorage.setItem('roleId', item.roleId)
      this.$router.push({
        name: 'layout',
        query: {
          roleId: item.roleId
        }
      })
    },

    clear() {
      this.$refs.form.clear()
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      }
    }
  }
}
</script>
<style>
.mu-demo-form {
  max-width: 600px;
  padding: 20px 20px;
  background-color: white;
  box-shadow: 1px 1px 5px 2px #eee;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>