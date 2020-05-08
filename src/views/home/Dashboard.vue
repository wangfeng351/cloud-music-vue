<template>
  <div>
    <v-row class="container1">
    <v-col>
      <v-sheet height="500">
        <span class="title">本月签到情况</span>
        <v-calendar
          :now="today"
          :value="today"
          color="primary"
        >
          <template v-slot:day="{ present, past, date }">
            <v-row
              class="fill-height"
            >
              <template v-if="past || tracked[date]">
                <v-sheet
                  v-for="(percent, i) in tracked[date]"
                  :key="i"
                  :color="colors[i]"
                  width="100%"
                  height="100%"
                ></v-sheet>
              </template>
            </v-row>
          </template>
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
       today: '',
      tracked: {},
      colors: ['#1867c0', '#fb8c00', '#000000'],
    }
  },
  components: {},
  created() {
    this.getSignInfo()
  },
  mounted() {
  },
  methods: {
    getSignInfo(){
    let date = new Date()
    this.today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
    console.log("日期为：" + this.today)
      this.axios({
      method: 'get',
      url: '/sign/single',
      params: {
        adminId: 'DE35D7CC05AF96A21D7ADFC8651E6614'
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(res =>{
      this.tracked = res.data.data
    })
    },
    
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.container1 {
  padding: 10px 10px;
}

.title {
  width: 100%;
  display: inline-block;
  text-align: center;
  margin: 10px 10px;
  font-size: 20px;
  font-weight: 600;
}
</style>
