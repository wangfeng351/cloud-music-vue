<template>
  <v-app>
    <v-card class="mt-12 pa-6">
    <v-tabs
      background-color="white"
      color="deep-purple accent-4"
      right
    >
      <v-tab>粉丝</v-tab>
      <v-tab>关注的人</v-tab>
      <v-tab>项目</v-tab>

      <v-tab-item
      >
        <v-container fluid>
          <v-row class="d-flex justify-center">
            <button @click="handleClick()">click</button>
              <Alert size="md" :show="show" @handleClick="closeAlert" icon="home"></Alert>
              <Card :followers="followers"></Card>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item
      >
        <v-container fluid>
          <v-row class="d-flex justify-center">
              <!-- <Card :followers="following"></Card> -->
              <Alert size="md" :show="show" @handleClick="closeAlert" icon="home"></Alert>
              <button @click="handleClick()">click</button>
          </v-row>
        </v-container>
      </v-tab-item>
      
      <v-tab-item
      >
        <v-container fluid>
          <v-row class="d-flex flex-column align-center">
              <span class="font-weight-black mb-4">项目列表</span>
              <TimeLine :repositry="repositry"></TimeLine>
          </v-row>
        </v-container>
      </v-tab-item>

    </v-tabs>
  </v-card>
  </v-app>
</template>

<script>
import Card from './Card'
import TimeLine from './TimeLine'
//import Alert from '../Alert'
export default {
 name: 'Tab',
  data() {
    return {
      followers: [],
      following: [],
      repositry:[],
      show: false
    }
  },
  components: {
      Card,
      TimeLine,
  },
  created() {
    this.followers = JSON.parse(localStorage.getItem('data')).data.followers
    this.following = JSON.parse(localStorage.getItem('data')).data.following
    this.repositry = JSON.parse(localStorage.getItem('data')).data.repositry
  },
  mounted() {},
  methods: {
    handleClick(){
      this.show = true
    },
    closeAlert(value){
      this.show = value
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
