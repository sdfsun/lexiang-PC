<template>
  <el-col class="set">
    <el-row class="set-header">
      <el-col :span="3" :offset="1" :class="[isShow ? 'active' : '']" @click.native="tabSwitch(1)">企业资料</el-col>
      <el-col :span="3" :offset="3" :class="[isShow ? '' : 'active']" @click.native="tabSwitch(2)">管理员列表</el-col>
    </el-row>
    <!-- 企业资料 -->
    <el-row class="info" v-show="isShow">
      <el-col :span="5" class="info-left">
        <div><img src="../../assets/头像.jpg" alt="企业头像" /></div>
        <el-button type="text" @click.native="updataAvatar">上传头像</el-button>
      </el-col>
      <el-col :span="19" class="info-right">
        <el-form :model="formInfo" ref="formInfo" label-width="100px" class="demo-ruleForm">

          <div class="info-name">{{name}}</div>

          <el-form-item class="form-item" label="所属行业：" prop="industry">
            <el-select v-model="formInfo.industry" class="select-item" placeholder="请选择">
              <el-option v-for="item in selectInfo.industry" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item" label="联系电话：" prop="position">
            <el-input :maxlength="11" v-model="formInfo.mobile"></el-input>
          </el-form-item>

          <el-form-item class="form-item" label="员工数量：" prop="number">
            <el-select v-model="formInfo.number" class="select-item" placeholder="请选择">
              <el-option v-for="item in selectInfo.number" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item" label="联系人：" prop="contact">
            <el-input :maxlength="5" v-model="formInfo.contact"></el-input>
          </el-form-item>

          <el-form-item class="form-item" label="公司地址：" prop="address">
            <el-cascader :options="selectInfo.address" class="select-item" :change-on-select="true" v-model="formInfo.address" @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-item" label-width="详细地址" prop="detailedAddress">
            <el-input :maxlength="30" v-model="formInfo.detailedAddress"></el-input>
          </el-form-item>

          <el-form-item class="form-item" label="邮箱：" prop="email">
            <el-input v-model="formInfo.email"></el-input>
          </el-form-item>

          <el-form-item class="form-item" label="公司编码：" prop="email">
            <el-input v-model="formInfo.code" disabled></el-input>
          </el-form-item>

          <el-form-item class="form-item">
            <el-button class="form-btn" size="small" @click="cancelForm()">取消</el-button>
            <el-button class="form-btn" size="small" type="info" @click="submitForm(formInfo)">修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 管理员列表 -->
    <el-row class="admin-list" v-show="!isShow" type="flex" justify="stretch">
      <el-col :span="5" class="admin-list-left">
        <div @click="addAdmin">
          <i class="el-icon-plus"></i> 添加管理员
        </div>
      </el-col>
      <el-col :span="19" class="admin-list-right">
        <div class="zero-list" v-show="!adminList.length">暂无管理员</div>
        <el-table :data="adminList" style="width: 100%" height="442" v-show="adminList.length">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="id" width="70" v-if="false">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="70">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="70">
          </el-table-column>
          <el-table-column prop="birthday" label="生日" width="100">
          </el-table-column>
          <el-table-column prop="department" label="部门" width="140">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" class="operation">
            <template slot-scope="scope">
              <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 添加管理员 表单 -->
    <el-row>
      <el-col>
        <el-dialog title="添加管理员" :visible.sync="dialogFormVisible" width="60%">
          <el-form :model="adminData" label-position="right">
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="员工姓名：" :label-width="formLabelWidth" :rules="[{ required: true, message: '姓名不能为空'}]">
                  <el-select v-model="adminData.selectEmp" placeholder="请选择" @change="changeEmp">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="手机号：" :label-width="formLabelWidth" :rules="[{ required: true, message: '手机号不能为空'}]">
                  <el-input v-model.number="adminData.mobile" class="form-input" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmSubmit(adminData)">添 加</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
// 城市信息
import { request, requestGet } from 'common/js/request.js'
import { CityInfo } from 'common/cityInfo/cityInfo.js'

export default {
  data() {
    return {
      // tab 切换
      isShow: true,
      // 企业信息 除了表单之外的(企业名,头像)
      name: '',
      avatar: '',
      id: '',
      // 下拉表单 info (公司页)
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
      // 表单 信息(公司)
      formInfo: {
        industry: [], // 选择行业
        number: [], // 选择人数
        address: [], // 选择地址
        detailedAddress: '', // 详细地址
        contact: '', // 联系人
        email: '', // 邮箱
        // 本表单独有
        mobile: '',
        code: ''
      },
      // 添加管理员 表单距离左边的距离
      formLabelWidth: '100px',
      // 弹出框 显示隐藏 (管理员)
      dialogFormVisible: false,
      // 管理员 员工姓名下拉列表数据
      options: [],
      // 管理员列表
      adminList: [],
      // 添加管理者数据
      adminData: {
        // 添加管理员 选择的员工
        selectEmp: '请选择',
        // 选择员工的电话
        mobile: 0,
        // 选择员工的id
        id: 0
      }
    }
  },
  methods: {
    // tab 切换
    tabSwitch(e) {
      console.log(e)
      if (e === 1) {
        this.isShow = true
      } else {
        this.isShow = false
        this.requestAdminList()
      }
    },
    // 上传头像按钮
    updataAvatar() {
      console.log('上传头像')
    },
    // 取消按钮
    cancelForm() {
      console.log('取消修改')
    },
    // 修改表单
    submitForm(data) {
      console.log('修改表单')
      console.log(data)
      var that = this

      var data = {
        trade: data.industry,
        staff_num: data.number,
        address: data.address,
        addr: data.detailedAddress,
        contact: data.contact,
        e_mail: data.email,
        phone: data.mobile,
        company_code: data.code,
        id: this.id
      }
      this.loadingInfo(data, prompt)
      function prompt() {
        that.$message({
          message: '修改成功',
          type: 'success'
        })
      }
    },
    // 三级联动 改变(公司信息页)
    handleChange(event) {
      console.log(event)
      console.log('三级联动 改变')
    },
    // 表格 删除 按钮
    deleteClick(row) {
      console.log('表格 删除按钮')
      console.log(row)
      var url = 'WelAdmin/del_contact'
      var data = {
        id: row.id
      }
      request(url, data).then( res => {
        console.log('删除成功')
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.requestAdminList()
      })
    },
    // 添加管理员
    addAdmin() {
      console.log('添加管理员')
      this.dialogFormVisible = true

      var data = {}
      this.addAdminDialog(data)
    },
    // 添加管理员 表单提交
    confirmSubmit(form) {
      console.log('添加管理员表单提交')
      console.log(form)
      if(form.selectEmp === '请选择') return
      var data = {
        id: this.adminData.id
      }
      var url = 'WelAdmin/add_contact'
      console.log(data)
      request(url, data).then(res => {
        console.log(res)
        console.log('添加/编辑员工信息成功')
        // 重新获取管理员列表
        this.requestAdminList()
      })
      this.dialogFormVisible = false
    },
    // 获取 企业 信息(修改和加载页面时候都需要)
    loadingInfo(data, prompt) {
      var url = 'WelAdmin/company_edit'
      request(url, data).then(res => {
        // 企业名和头像不在表单里,单独提取出来
        this.name = res.company_name
        this.avatar = res.head_img
        this.id = res.id
        // 表单
        var data = {
          industry: res.trade,
          number: res.staff_num,
          address: [res.province - 0, res.city - 0, res.area - 0],
          detailedAddress: res.addr,
          contact: res.contact,
          email: res.e_mail,
          mobile: res.phone,
          code: res.company_code
        }
        this.formInfo = data
      })
      // 成功提示 回调函数,只有修改时候有,进入页面时没有
      if (prompt) prompt()
    },
    // 添加管理员 (弹出对话框)
    addAdminDialog(data) {
      console.log('添加管理员')
      var url = 'WelAdmin/add_contact'
      request(url, data).then(res => {
        console.log('res')
        console.log(res)
        var list = []
        for (var i = 0, len = res.length; i < len; i++) {
          var data = {
            label: res[i].name,
            value: res[i].phone,
            key: res[i].id
          }
          list.push(data)
        }
        console.log(list)
        this.options = list
      })
    },
    // 更改 添加管理员 选中员工
    changeEmp(value){
      console.log('选择员工')
      console.log(value)
      this.adminData.mobile = value
      let obj = {};
      obj = this.options.find((item)=>{
          return item.value === value;
      });
      this.adminData.id = obj.key
      console.log(this)
    },
    // 获取管理员列表
    requestAdminList(){
      var url = 'WelAdmin/contact_list'
        request(url, {}).then(res => {
          console.log(res)
          var table = []
          for (var i = 0, len = res.length; i < len; i++) {
            var data = {}
            data.name = res[i].name
            data.gender = res[i].sex
            data.birthday = res[i].birthday
            data.department = res[i].department_id
            data.email = res[i].e_mail
            data.mobile = res[i].phone
            data.id = res[i].id
            table.push(data)
          }
          this.adminList = table
        })
    }
  },
  mounted() {
    // 获取企业信息
    this.loadingInfo({})
    // 获取管理员列表
    // this.
  },
  watch:{
    dialogFormVisible(val){
      if(val === false){
        // 清空选择框内容
        this.adminData.selectEmp = '请选择'
      }
    }
  }
}
</script>


<style lang="less" scoped>
@import url('../../common/less/variable');
.set {
  background-color: @color-background-d;
  padding: 20px 30px;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}
// 头部
.set-header {
  font-size: @font-size-medium-x;
  color: @color-text-l;
  line-height: 50px;
  text-align: center;
  background-color: #fff;
  border-radius: 5px;
  & div:hover {
    color: @color-text;
    cursor: pointer;
  }
}
.active {
  color: @color-text;
}

// 企业资料
.info {
  background-color: #fff;
  margin-top: 20px;
}
.info-left {
  padding: 10px;
  & > div {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  & > button {
    margin-left: 80px;
    display: inline-block;
  }
}
.info-right {
  padding: 10px;
  & .form-item {
    display: inline-block;
    &:nth-child(-n + 9) {
      width: 40%;
    }
    &:nth-child(2),
    &:nth-child(4) {
      margin-right: 20px;
    }
    &:nth-child(7) {
      width: 42%;
    }
    &:nth-child(8),
    &:nth-child(9),
    &:nth-child(10) {
      display: block;
    }
    &:nth-child(10) {
      padding-right: 60px;
      display: flex;
      justify-content: flex-end;
    }
    & .select-item {
      width: 100%;
    }
  }
}
.info-name {
  line-height: 50px;
}
.form-btn {
  width: 100px;
}

// 管理员列表
.admin-list {
  background-color: #fff;
  margin-top: 20px;
}
.admin-list-left {
  font-size: @font-size-medium-x;
  color: @color-text-l;
  text-align: center;
  line-height: 50px;
  border-right: 1px solid @color-background-d;
  & div {
    border-bottom: 1px solid @color-background-d;
  }
  & div:hover {
    color: @color-theme;
    background-color: @color-background-d;
    cursor: pointer;
  }
}
.operation {
  &::before {
    content: '';
    background-color: #fff;
  }
}
//    右侧
.admin-list-right {
  & .zero-list {
    width: 100%;
    height: 442px;
    line-height: 442px;
    font-size: @font-size-large;
    color: @color-dialog-background;
    text-align: center;
  }
}
// 部门信息 表单
.preDepartment {
  width: 100%;
}
</style>