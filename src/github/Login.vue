<template>
    <v-app class="">
    <v-row class="d-flex justify-center align-center">
     <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
      class="bg elevation-6  pa-3"
    >
      <v-text-field
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-select
        v-model="select"
        :items="items"
        :rules="[v => !!v || 'Item is required']"
        label="Item"
        required
      ></v-select>

      <v-checkbox
        v-model="checkbox"
        :rules="[v => !!v || 'You must agree to continue!']"
        label="Do you agree?"
        required
      ></v-checkbox>

      <v-btn
        color="success"
        class="mr-4"
        @click="validate"
      >
      success
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        Reset Form
      </v-btn>

      <v-btn
        color="warning"
        @click="login()"
      >
        home
      </v-btn>
    </v-form>
    </v-row>
      </v-app>
</template>

<script>
export default {
 name: 'Login',
  data() {
    return {
        valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,
      lazy: false,
    }
  },
  components: {},
  created() {},
  mounted() {},
   methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
      login(){
          window.location.href = 'https://github.com/login/oauth/authorize?client_id=c2f8b53b0c224ec46643&redirect_uri=http://localhost:8080/callback&state=1'
      }
    },
  computed: {}
}
</script>

<style scoped lang="scss">
  .bg {
      background-image: linear-gradient( #74ebd5, #acb6e5);
  }
</style>
