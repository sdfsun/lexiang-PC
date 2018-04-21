<template>
  <!-- 企业注册 登录框 -->
  <el-main class="verify-phone">
    <el-row>
      <el-col :offset="7" :span="10" class="verify-phone-content">
        <el-row>
          <el-col class="company-login">
            <div>企业申请</div>
            <div>第一步：验证手机号</div>
          </el-col>
        </el-row>
        <el-row class="input-login">
          <el-input placeholder="手机号" @change="mobilePhone" v-model.number="phone" clearable/>
          <div class="prompt">{{phonePrompt}}</div>
        </el-row>
        <el-row class="input-login">
          <el-input placeholder="请输入验证码" v-model.number="verify" clearable>
            <el-button slot="append" @click="dialogVisibleTrue" :disabled="time.isDisabled">{{time.buttonName}}</el-button>
          </el-input>
          <div class="prompt">{{verifyPrompt}}</div>
        </el-row>
        <el-row class="btn-box">
          <button class="el-button--info next-btn" @click="enterpriseLogin">下一步</button>
        </el-row>
        <el-row class="verify-phone-footer" type="flex" justify="space-around">
          <el-col :span="5">
            <div>01</div>
            <div>验证手机号</div>
          </el-col>
          <el-col :span="4" class="iconfont icon-next_icon iconfont-font-size"></el-col>
          <el-col :span="5">
            <div>02</div>
            <div>填写企业信息</div>
          </el-col>
          <el-col :span="4" class="iconfont icon-next_icon iconfont-font-size"></el-col>
          <el-col :span="5">
            <div>03</div>
            <div>开通完成</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 弹出框 输入验证码 -->
    <el-dialog title="验证" :visible.sync="dialogVisible" width="45%">
      <div class="dialog-box">
        <el-input placeholder="请输入内容" v-model="validation.userInput" class="input-with-select">
          <el-button slot="append" icon="el-icon-refresh" @click.native="refreshValidation"></el-button>
        </el-input>
        <div class="verification-code-img-box">
          <img :src="validation.validationImgPath" class="verification-code-img" alt="验证码">
        </div>
        <div class="prompt" v-html="validation.prompt"></div>
      </div>
      <el-button type="primary" @click="verificationCode">确定</el-button>
      <el-button type="info" @click="resetUserInput">重置</el-button>
    </el-dialog>
    <!-- 验证成功的 弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogTrue" width="45%">
      <div class="true-dialog-success">验证成功，短信验证已发送至您的手机</div>
      <div class="true-dialog-countdown">
        {{succeedCode}}秒后自动关闭
      </div>
    </el-dialog>
  </el-main>

</template>

<script>
// 引入 请求函数
import { request } from 'common/js/request'

export default {
  data() {
    return {
      // 手机号
      phone: '',
      // 手机号通过验证没
      phoneTrue: false,
      // 手机验证码
      verify: '',
      // 对手机号的提示
      phonePrompt: '',
      // 对验证码的提示
      verifyPrompt: '',
      // 控制对话框(蒙层)的显示与隐藏
      dialogVisible: false,
      dialogTrue: false,
      // 验证相关
      validation: {
        // 验证码图片的path
        validationImgPath: '',
        // 用户输入的验证码
        userInput: '',
        // 给用户的提示
        prompt: ''
      },
      // 时间相关
      time: {
        // 时间间隔
        interval: 60,
        // 按钮名
        buttonName: '获取验证码',
        // 按钮状态
        isDisabled: false
      },
      // 输入验证码成功倒计时3秒
      succeedCode: 3
    }
  },
  methods: {
    // 手机号验证
    mobilePhone(event) {
      console.log('手机号验证')
      console.log(event)
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (this.phone === '') {
        this.phonePrompt = '手机号不能为空'
        this.phoneTrue = false
        return
      }
      if (reg.test(event)) {
        this.phoneTrue = true
        this.phonePrompt = ''
      } else {
        this.phonePrompt = '请输入正确手机号'
        this.phoneTrue = false
        return
      }

      var url = 'WelPub/verify_phone'
      var data = {
        mobile: this.phone
      }
      request(url, data, true).then(res => {
        console.log(res)
        if (res.phone_exist === true) {
          this.phonePrompt = '手机号已注册'
          this.verifyPrompt = ''
          this.phoneTrue = false
        } else {
          this.phonePrompt = ''
          this.phoneTrue = true
          console.log(this.phoneTrue)
        }
      })
    },
    // 点击主页登录 验证手机验证码
    enterpriseLogin() {
      console.log('点击主页登录')
      if (this.phone === '') {
        this.phonePrompt = '手机号不能为空'
        return
      } else if (this.phoneTrue !== true) {
        this.phonePrompt = '请输入正确手机号'
        return
      }
      if (this.verify === '') {
        this.verifyPrompt = '验证码不能为空'
        return
      }
      // 验证手机验证码
      // 发送请求
      var url = 'WelPub/verify_register'
      var data = {
        mobile: this.phone,
        verify: this.verify
      }
      request(url, data)
        .then(res => {
          console.log(res)
          console.log('登陆成功')
          this.$router.push({ name: 'enterpriseInfo' })
        })
        .catch(err => {
          console.log('登录错误')
          console.log(err)
          if (err === 'USER_ERR') {
            this.phonePrompt = '请输入正确手机号'
            this.verifyPrompt = ''
          } else if (err === 'CODE_ERR') {
            this.phonePrompt = ''
            this.verifyPrompt = '验证码错误'
          }
        })
    },
    // 点击员工登录
    staffLogin() {},
    // 点击获取验证码 弹出模态框
    dialogVisibleTrue() {
      console.log('获取验证码')
      console.log(this)
      if (this.phone === '') {
        this.phonePrompt = '手机号不能为空'
        return
      } else if (this.phoneTrue !== true) {
        this.phonePrompt = '请输入正确手机号'
        return
      }

      var url = 'WelPub/send_login_sms'
      var data = {
        mobile: this.phone
      }
      request(url, data).then(res => {
        console.log(res)
        this.validation.validationImgPath = res.data.img + '?' + Math.random()
      })

      this.dialogVisible = true
    },
    //  点击模态框确定 验证验证码
    verificationCode(event) {
      console.log(this)
      console.log(event)
      console.log('验证码验证事件')
      var that = this
      var value = this.validation.userInput

      if (value === '') return (this.validation.prompt = '验证码不能为空')

      var url = 'WelPub/verify'
      var data = {
        mobile: this.phone,
        verify: this.validation.userInput
      }
      console.log(data)
      request(url, data)
        .then(res => {
          console.log(res)
          console.log('验证码正确')
          this.validation.prompt = ''
          that.dialogVisible = false
          that.dialogTrue = true
          // 倒计时
          var interval = setInterval(function() {
            console.log(that.succeedCode)
            --that.succeedCode
            if (that.succeedCode <= 0) {
              clearInterval(interval)
              that.dialogTrue = false
              that.sendMsg()
            }
          }, 1000)
          that.succeedCode = 3
        })
        .catch(err => {
          console.log(err)
          this.validation.prompt = '验证码错误'
        })
    },
    // 重置 用户输入
    resetUserInput() {
      this.validation.userInput = ''
      this.validation.prompt = ''
    },
    // 刷新验证码图片
    refreshValidation() {
      console.log('验证图片刷新事件')
      var url = 'WelPub/send_login_sms'
      var data = {
        mobile: this.phone
      }
      request(url, data).then(res => {
        console.log(res)
        this.validation.validationImgPath = res.data.img + '?' + Math.random()
      })
    },
    // 发送信息后的间隔时间 事件
    sendMsg() {
      let that = this
      that.time.isDisabled = true
      let interval = setInterval(function() {
        that.time.buttonName = '（' + that.time.interval + '秒）后重新发送'
        --that.time.interval
        if (that.time.interval < 0) {
          that.time.buttonName = '重新发送'
          that.time.interval = 60
          that.time.isDisabled = false
          clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scope>
@import url('../../common/less/variable.less');
// 企业登录
.verify-phone-content {
  background-color: #fff;
  margin-top: 60px;
  margin-bottom: 80px;
}
.company-login {
  text-align: center;
  border-bottom: 1px solid @color-text-d;
}
.company-login > :first-child {
  font-size: @font-size-medium-x;
  line-height: 40px;
  padding-top: 20px;
}
.company-login > :last-child {
  font-size: @font-size-small;
  color: @color-text-l;
  line-height: 30px;
}
.input-login {
  margin: 20px 40px;
}
.input-login:nth-child(even) {
  padding-top: 20px;
}

.btn-box {
  padding-bottom: 20px;
  border-bottom: 1px solid @color-text-d;
}
.next-btn {
  width: 86%;
  height: 40px;
  outline: none;
  border: none;
  border-radius: 6px;
  display: inline-block;
  margin-left: 7%;
}

.verify-phone-footer {
  font-size: @font-size-medium;
  color: @color-text-l;
  line-height: 25px;
  margin: 20px 20px;
  text-align: center;
}
.verify-phone-footer > div {
  height: 50px;
}
// iconfont 图标大小
.iconfont-font-size {
  font-size: 26px;
  line-height: 50px;
}

// 对话框 / 蒙层

.dialog-box {
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  .verification-code-img-box {
    width: 100px;
    height: 40px;
    position: absolute;
    right: 56px;
    top: 0;
    .verification-code-img {
      width: 100%;
      height: 100%;
    }
  }
}
// 提示
.prompt {
  font-size: @font-size-small;
  color: red;
  margin-top: 10px;
}
// 成功输入验证码 的模态框
.true-dialog-success {
  font-size: @font-size-medium-x;
  text-align: center;
}
.true-dialog-countdown {
  font-size: @font-size-medium;
  color: @color-text-l;
  text-align: center;
}
</style>
