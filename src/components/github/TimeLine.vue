<template>
  <div>
    <v-timeline :dense="$vuetify.breakpoint.smAndDown">
    <v-timeline-item
      :color="colors[index]"
      fill-dot
      v-for="(item, index) in repositry" :key="index" 
      :right="index%2===0"
      :small="index%2===1"
      :left="index%2===1"
    >
      <v-card min-width="500px" v-if="index % 2 === 0 ">
        <v-card-title :style="{backgroundColor:colors[index]}">
          <v-icon
            dark
            size="42"
            class="mr-4"
          >
            mdi-magnify
          </v-icon>
          <h2 class="display-1 white--text font-weight-light">{{item.name}}</h2>
        </v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12" md="10">
                <p><span class="mr-1">项目地址：</span>{{item.url}}</p>
                <p><span class="mr-1">克隆地址:</span>{{item.clone_url}}</p>
                <p><span class="mr-1">git地址:</span> {{item.git_url}}</p>
                <p>
                    <span class="mr-12">创建时间: {{item.created_at.slice(0,10)}}</span>
                    <span>更新时间: {{item.updated_at.slice(0,10)}}</span> 
                </p>
            </v-col>
            <v-col
              class="hidden-sm-and-down text-right"
              cols="12"
              md="2"
            >
              <v-icon size="64">mdi-calendar-text</v-icon>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card min-width="500px" v-if="index % 2 === 1 ">
        <v-card-title class="lighten-1 justify-end" :style="{backgroundColor:colors[index]}">
          <h2 class="display-1 mr-4 white--text font-weight-light">{{item.name}}</h2>
          <v-icon
            dark
            size="42"
          >mdi-home-outline</v-icon>
        </v-card-title>
        <v-container>
          <v-row class="pl-4">
                <p><span class="mr-1">项目地址：</span>{{item.url}}</p>
                <p><span class="mr-1">克隆地址:</span>{{item.clone_url}}</p>
                <p><span class="mr-1">git地址:</span> {{item.git_url}}</p>
                <p>
                    <span class="mr-12">创建时间: {{item.created_at.slice(0,10)}}</span>
                    <span>更新时间: {{item.updated_at.slice(0,10)}}</span> 
                </p>
          </v-row>
        </v-container>
      </v-card>
    </v-timeline-item>

    
  </v-timeline>
  </div>
</template>

<script>
export default {
 name: 'TimeLine',
  data() {
    return {
        colors: ['#F44336', '#E91E63', '#9C27B0', '#2196F3', '#009688', 
        '#673AB7', '#03A9F4', '#FFC107', '#FF9800', '#FF5722', '#607D8B', 
        '#9E9E9E','#F44336', '#E91E63', '#9C27B0', '#2196F3', '#009688', 
        '#673AB7', '#03A9F4', '#FFC107', '#FF9800', '#FF5722', '#607D8B',
        '#9E9E9E','#F44336', '#E91E63', '#9C27B0', '#2196F3', '#009688',
        '#F44336', '#E91E63', '#9C27B0', '#2196F3', '#009688' ],
    }
  },
  components: {},
  created() {},
  props: ['repositry'],
  mounted() {},
  methods: {},
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
