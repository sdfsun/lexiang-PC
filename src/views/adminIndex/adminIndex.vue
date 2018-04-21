<template>
  <div class="admin-index">

    <el-row class="header-tab">
      <el-col :span="5" class="header-item">
        <img src="../../assets/logo.png" @click="navigateIndex" class="logo-img" alt="logo" />
      </el-col>
      <el-col :span="4" :offset="2" :class="['header-item', activeClass === 1? 'active-class': '']" >
        <div @click="navigateMsg">通讯录管理</div>
      </el-col>
      <el-col :span="4" :class="['header-item', activeClass === 2? 'active-class': '']">
        <div @click="navigateIntegral">积分管理</div>
      </el-col>
      <el-col :span="4" :class="['header-item', activeClass === 3? 'active-class': '']">
        <div @click="navigateSetting">设置</div>
      </el-col>
      <el-col :span="3" :offset="1" class="header-item">
        <el-button class="header-btn" @click="navigateLogin">退出登录</el-button>
      </el-col>
    </el-row>

    <el-row class="main" type="flex" align-items="stretch">
      <el-col :span="5" class="main-left">
        <el-row>
          <el-col class="enterprise-name">
            <div>{{pageData.name}}</div>
            <div class="admin-avatar-box">
              <img :src="pageData.img" alt="管理员头像" class="admin-avatar">
            </div>
            <div>{{pageData.short}}</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="enterprise-info">
            <div>
              <div>企业人数：</div>
              <div>{{pageData.num}}</div>
            </div>
            <div>
              <div>部门数：</div>
              <div>{{pageData.departmentNum}}</div>
            </div>
            <div>
              <div>昨日使用人数：</div>
              <div>{{pageData.useNum}}</div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="enterprise-tel">
            <div>客服电话：400-0000-0000</div>
            <div>(工作日：09:00 - 18:00)</div>
          </el-col>
        </el-row>

      </el-col>

      <el-col :span="19" class="main-right">
        <el-row>
          <el-col class="img-top">
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter="10">
          <el-col class="img-bottom">
            <img src="../../assets/2.jpg" alt="">
          </el-col>
          <el-col class="img-bottom">
            <img src="../../assets/3.jpg" alt="">
          </el-col>
          <el-col class="img-bottom">
            <img src="../../assets/4.jpg" alt="">
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
import { request } from 'common/js/request'
export default {
  data() {
    return {
      pageData: {
        name: '',
        short: '',
        num: '',
        departmentNum: '100',
        useNum: '200',
        img: '../../assets/logo.png'
      },
      // nav 控件
      activeClass: 0
    }
  },
  methods: {
    // 点击logo导航到admin首页
    navigateIndex() {
      console.log('跳转到管理员首页')
      this.activeClass = 0
      this.$router.push({ name: 'adminIndex' })
    },
    // 点击通讯 导航到通讯页面
    navigateMsg() {
      console.log('导航奥通讯页面')
      this.activeClass = 1      
      this.$router.push({ name: 'addressBook' })
    },
    // 点击通讯 导航到积分页面
    navigateIntegral() {
      console.log('导航奥积分页面')
      this.activeClass = 2      
      this.$router.push({ name: 'amount' })
    },
    // 点击通讯 导航到设置页面
    navigateSetting() {
      console.log('导航奥设置页面')
      this.activeClass = 3      
      this.$router.push({ name: 'setting' })
    },
    // 点击退出登录 返回登录页面
    navigateLogin() {
      console.log('导航到登录页面')
      
      var url = 'WelPub/logout'
        request(url, {}).then(res => {
      })
      // this.$router.push({ name: 'login' })      
    }
  },
  mounted() {
    var url = 'WelAdmin/portal'
    request(url, {}).then(res => {
      console.log(res)
      this.pageData.name = res.company_name
      this.pageData.short = res.contact
      this.pageData.num = res.staff_num
      this.pageData.departmentNum = res.department
      this.pageData.useNum = res.usenum
      this.pageData.img = res.images
    })
  }
}
</script>


<style lang="less" scoped>
@import url('../../common/less/variable');

.admin-index {
  width: 90%;
  margin: 0 auto;
  position: relative;
}
// 顶部导航
.header-tab {
  height: 80px;
  background-color: @color-text-d;
}
.header-item {
  height: 80px;
  font-size: @font-size-large;
  color: @color-text-l;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-item div {
  line-height: 40px;
  font-weight: bold;
  display: inline-block;
}
.header-item div:hover {
  color: @color-text;
}
.active-class{
  color: #000;
}
.header-btn {
  width: 100%;
}
.logo-img {
  width: 100%;
  height: 100%;
  background-size: contain;
}
// 内容部分
// 左侧
.main {
  padding: 10px;
  // background-color: @color-background;
  background-color: tomato;
}
.main-left {
  text-align: center;
  background-color: cyan;
  margin-right: 10px;
  padding: 10px;
  .enterprise-name {
    font-size: @font-size-medium-x;
    line-height: 30px;
    border-bottom: 1px solid @color-text-d;
    padding-bottom: 10px;
    .admin-avatar-box {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      .admin-avatar {
        width: 100%;
        height: 100%;
        background-size: contain;
      }
    }
  }
  .enterprise-info {
    padding: 30px 10px;
    border-bottom: 1px solid @color-text-d;
    & > div {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
  }
  .enterprise-tel {
    padding-top: 20px;
    & > :last-child {
      font-size: @font-size-medium;
      color: @color-text-l;
      margin-top: 10px;
    }
  }
}
// 右侧部分
.main-right {
  .img-top {
    height: 300px;
    background: url('../../assets/1.jpg') no-repeat;
    background-size: cover;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  .img-bottom {
    margin-top: 10px;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
