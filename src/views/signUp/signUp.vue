<template>
    <div class="sign-up">
        <header-index></header-index>
        <!-- 企业注册 手机验证 -->
        <login-index></login-index>
        <!-- 企业信息填写 -->
        <!-- <enterprise-info></enterprise-info> -->

        <router-view></router-view>

    </div>
</template>

<script>
import headerIndex from 'components/headerIndex/headerIndex'
import loginIndex from 'components/loginIndex/loginIndex'

export default {
  components: {
    headerIndex,
    loginIndex
  },
  data(){
    return{

    }
  },
  methods:{

  },
  mounted(){
    
  }
}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable');
.sign-up {
  background-color: @color-text-d;
}
</style>


