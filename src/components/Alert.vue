<template>
  <div>
  <div :style="{backgroundColor:color, minWidth:width + 'px', minHeight: height + 'px', lineHeight: height + 'px'}" 
        class="df-cen"
        v-if="show1">
       <v-icon class="mr-2" color="red">{{icon}}</v-icon>
       <span :class="'alert-' + size">{{message}}</span>
       <slot name="pre-icon"></slot>
  </div>
  </div>
</template>

<script>
export default {
 name: 'Alert',
  data() {
    return {
        timer: '',
        show1: false
    }
  },
  props: {
      size: {
          validator(value){
              return ['small', 'small-d', 'md', 'md-d', 'large', 'large-d'].indexOf(value) !== -1
          },
          default: 'small'
      },
      color: {
          type: String,
          default: '#000000' 
      },
      message: {
          type: String,
          default: 'hello'
      },
      icon: {
          type: String,
          default: 'info'
      },
      width: {
          type: Number,
          default: 120
      },
      height: {
          type: Number, 
          default: 40
      },
      show: {
          type: Boolean,
          default: false
      }
  },
  components: {},
  created() {
  },
  mounted() {},
  watch: {
      show: function(newVal, oldVal){
          if(newVal){
          this.show1 = this.show

              this.timer = setInterval(() => {this.closeAlert()}, 3000)
          }else {
              this.show1 = this.show
          }

      }
  },
  methods: {
      closeAlert(){
          this.$emit('handleClick', false)
          clearInterval(this.timer)
      }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
    .alert-small {
        font-size: 14px;
        color: white;
    }

    .alert-small-d {
        font-size: 14px;
        color: black;
    }

    .alert-md {
        font-size: 16px;
        color: white;
    }

    .alert-md-d {
        font-size: 16px;
        color: black;
    }

    .alert-large {
        font-size: 18px;
        color: white;
    } 
    .alert-large-d {
        font-size: 18px;
        color: black;
    }
    .df-cen {
        position: fixed;
        top: 0;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
    }     
</style>
