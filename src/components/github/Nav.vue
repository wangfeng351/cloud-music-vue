<template>
        <div>
        <v-app-bar
      color="deep-purple accent-4 elevation-8"
      dark
      app
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>欢迎: {{user.login}}</v-toolbar-title>

      <v-spacer></v-spacer>

      
        <v-btn icon>
          <v-list-item :to="user.url">
        <v-icon>mdi-heart</v-icon>
        </v-list-item>
        </v-btn>

      <v-avatar>
      <img
        :src="user.avatar_url"
        alt="John"
      >
    </v-avatar>
      <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="n in 5"
            :key="n"
            @click="() => {}"
          >
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    </div>
</template>

<script>
export default {
 name: 'Nav',
  data() {
    return {

    }
  },
  props: ['user'],
  components: {},
  created() {},
  mounted() {},
  methods: {},
  computed: {}
}
</script>

<style scoped lang="scss">

</style>
