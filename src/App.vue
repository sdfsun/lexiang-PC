<template>
  <div id="app">
    <!-- <login></login> -->
    <router-view></router-view>
  </div>
</template>

<script>
import login from 'views/login/login'
export default {
  name: 'App',
  components:{
    login
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
