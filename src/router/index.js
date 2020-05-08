import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Login1 from '../github/Login.vue'
import GithubLogin from '../views/login/GithubLogin.vue'
import layout from '../views/layout.vue'
import Dashboard from '../views/home/Dashboard.vue'
import Jump from '../github/Jump.vue'
import Index from '../github/Index.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'signIn',
        name: 'SignIn',
        component: () => import('../views/home/SignIn.vue')
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import('../views/musicManage/Music.vue')
      },
      {
        path: 'album',
        name: 'Album',
        component: () => import('../views/musicManage/Album.vue')
      },
      {
        path: 'musiclist',
        name: 'MusicList',
        component: () => import('../views/musicManage/MusicList.vue')
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('../views/systemManage/Permission.vue')
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/systemManage/Role.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/systemManage/User.vue')
      },
      {
        path: 'color',
        name: 'Color',
        component: () => import('../views/othersManage/Color.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/githubLogin',
    name: 'GithubLogin',
    component: GithubLogin
  },
  //github练习（follower,following）
  {
    path: '/login1',
    name: 'Login1',
    component: Login1
  },
  {
    path: '/jump',
    name: 'Jump',
    component: Jump
  },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },

  // {
  //   path: '*',
  //   name: '404',
  //   component: () => import('../views/404/Error.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
