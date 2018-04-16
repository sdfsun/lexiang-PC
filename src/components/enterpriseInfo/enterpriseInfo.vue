<template>
  <el-main class="info">
    <el-row>
      <el-col :offset="3" :span="18" class="info-content">
        <el-row>
          <el-col class="company-login">
            <div>企业申请</div>
            <div>第二步：完善企业信息</div>
          </el-col>
        </el-row>

        <el-form :model="formInfo" :rules="rules" ref="formInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item class="form-item" label="企业名称" prop="name">
            <el-input :maxlength="15" v-model="formInfo.name" auto-complete="on" @change.native="nameValidation"></el-input>
          </el-form-item>
          <el-form-item class="form-item" label="企业简称" prop="short">
            <el-input :maxlength="15" v-model="formInfo.short" auto-complete="on" @change.native="shortValidation"></el-input>
          </el-form-item>

          <el-form-item class="form-item" label="所属行业" prop="industry">
            <el-select v-model="formInfo.industry" class="select-item" placeholder="请选择">
              <el-option v-for="item in selectInfo.industry" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item" label="员工数量" prop="number">
            <el-select v-model="formInfo.number" class="select-item" placeholder="请选择">
              <el-option v-for="item in selectInfo.number" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item" label="公司地址" prop="address">
            <el-cascader :options="selectInfo.address" class="select-item" :change-on-select='true' v-model="formInfo.address" @change="handleChange">
            </el-cascader>
          </el-form-item>

          <el-form-item class="form-item" label="详细地址" prop="detailedAddress">
            <el-input :maxlength="30" v-model="formInfo.detailedAddress" auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item class="form-item" label="联系人" prop="contact">
            <el-input :maxlength="5" v-model="formInfo.contact" auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item class="form-item" label="职位" prop="position">
            <el-input :maxlength="10" v-model="formInfo.position" auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item class="form-item" label="邮箱" prop="email">
            <el-input v-model="formInfo.email" auto-complete="on"></el-input>
          </el-form-item>

          <el-form-item class="form-item">
            <el-button class="next-btn" type="info" @click="submitForm(formInfo)">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import { request } from 'common/js/request.js'
import { CityInfo } from 'common/cityInfo/cityInfo.js'
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写企业名称'))
      } else {
        var url = 'WelPub/ver_company'
        var data = {
          company_name: this.formInfo.name
        }
        request(url, data).then(res => {
          console.log(res)
          if(res.company_exist == true){
            callback(new Error('企业名称重复'))
          }
          callback()
        })
      }
    }
    var validateShort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写企业简称'))
      } else {
        var url = 'WelPub/ver_short'
        var data = {
          short_name: this.formInfo.short
        }
        request(url, data).then(res => {
          console.log(res)
          if(res.company_exist == true){
            callback(new Error('企业简称重复'))
          }
          callback()
        })
      }
    }

    return {
      validation: {
        name: false,
        short: false
      },
      formInfo: {
        name: '',
        short: '',
        industry: [], // 选择行业
        number: [], // 选择人数
        address: [], // 选择地址
        detailedAddress: '', // 详细地址
        contact: '', // 联系人
        position: '', // 职位
        email: '' // 邮箱
      },
      selectInfo: {
        // 选择行业
        industry: [
          '互联网',
          '房地产/建筑业',
          '通信行业',
          '运营商',
          '金融行业',
          '医疗行业',
          '教育行业',
          '生产/加工/制造',
          '物流仓储',
          '能源行业',
          '政府机构/公益组织',
          '休闲娱乐',
          '文化传媒',
          '餐饮行业',
          '农林牧渔',
          '旅游行业',
          '环保行业',
          '其他'
        ],
        number: [
          '50人以下',
          '50-100人',
          '100-200人',
          '200-500人',
          '500-1000人',
          '1000-5000人',
          '5000人及以上'
        ], // 选择人数
        address: CityInfo // 选择地址
      },
      rules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        short: [{ validator: validateShort, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 验证 名字
    nameValidation() {
      console.log('验证名字')
      console.log(this.formInfo.name)
      var url = 'WelPub/ver_company'
      var data = {
        company_name: this.formInfo.name,
        short_name: this.formInfo.short
      }
      // request(url, data).then( res => {

      // })
    },
    // 验证 简称
    shortValidation() {
      console.log('验证简称')
      console.log(this.formInfo.short)
    },
    // 下一步 提交表单
    submitForm(data) {
      console.log(this)
      console.log(data)
      // if (!(this.validation.name && this.validation.short)) return
      var data = {
        company_name: this.formInfo.name,
        short_name: this.formInfo.short,
        trade: this.formInfo.industry,
        staff_num: this.formInfo.number,
        address: this.formInfo.address,
        addr: this.formInfo.detailedAddress,
        contact: this.formInfo.contact,
        postition: this.formInfo.position,
        e_mail: this.formInfo.email
      }
      console.log(data)
      var url = 'WelPub/register'
      var data = Object.assign({}, data)
      request(url, data).then(res => {
        this.$router.push({ name: 'adminIndex' })
      })
    },
    // 改变3级菜单
    handleChange(event) {
      console.log(event)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable');

.info {
  background-color: #b2b2b2;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}
.info-content {
  background-color: #fff;
  margin-top: 60px;
  margin-bottom: 80px;
}
.company-login {
  text-align: center;
  border-bottom: 1px solid @color-text-d;
  padding: 20px 0;
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

//
.form-item {
  width: 60%;
  margin-left: 20%;
}
.form-item:first-child {
  padding-top: 30px;
}
.select-item {
  width: 100%;
}
.next-btn {
  width: 100%;
  margin: 20px 0;
}
</style>

