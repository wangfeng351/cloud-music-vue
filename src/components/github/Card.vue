<template>
  <div>
    <v-row justify="center" flat="true">
      <v-expansion-panels popout >
        <v-expansion-panel
          v-for="(item, index) in followers"
          :key="index"
          hide-actions
        >
          <v-expansion-panel-header>
            <v-row
              align="center"
              class="spacer"
              no-gutters
            >
              <v-col
                cols="4"
                sm="2"
                md="1"
              >
                <v-avatar
                  size="50px"
                >
                  <img
                    :src="item.avatar_url"
                  >
                </v-avatar>
              </v-col>

              <v-col
                class="hidden-xs-only"
                sm="5"
                md="3"
              >
                <span
                >
                <v-icon mid color="orange" class="mr-2">info</v-icon>
                  {{ item.login }}
                </span>
              </v-col>

              <v-col
                class=" text-truncate hidden-sm-and-down"
              >
                <v-icon large class="mr-2" color="red">home</v-icon>
                {{ item.url }}
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text v-text="lorem"></v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
export default {
 name: 'Card',
  data() {
    return {
    }
  },
  components: {},
  created() {
    
  },
  props: ['followers'],
  mounted() {},
  methods: {},
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
