<template>
    <el-col class="amount">
        <el-row class="amount-header" type="flex" justify="space-around">
            <el-col :span="4" class="header-item">
                <el-col class="header-title">当前可用</el-col>
                <el-col class="header-num">888888
                    <span>积分</span>
                </el-col>
                <el-button type="info" size="medium" class="header-operate" @click="btn1">积分充值</el-button>
            </el-col>
            <el-col :span="4" class="header-item">
                <el-col class="header-title">累计发放</el-col>
                <el-col class="header-num">666666
                    <span>积分</span>
                </el-col>
                <el-button type="info" size="medium" class="header-operate" @click="btn2">积分发放</el-button>
            </el-col>
        </el-row>
        <!-- 主体内容 -->
        <el-row class="amount-main">
            <!-- 切换栏 -->
            <el-row class="main-header" type="flex" justify="space-around" @click.native="isActiveStyle">
                <el-col :span="4" :class="{active: tab.isActive1}">企业收支明细</el-col>
                <el-col :span="4" :class="{active: tab.isActive2}">消费积分明细</el-col>
            </el-row>
            <el-row class="main-data">
                <el-col :span="22" :offset="1" class="main-data-box">
                    <el-date-picker v-model="data" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeData" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-button type="info" class="main-data-search" @click="btn3">查看</el-button>
                </el-col>
            </el-row>
            <!-- 切换内容 -->
            <el-row>
                <!-- 企业收支明细 -->
                <el-col class="main-item" v-show="isShow" :span="22" :offset="1">
                    <el-table :data="bpTable" style="width: 100%" height="480">
                        <el-table-column prop="date" label="日期" width="274" sortable>
                        </el-table-column>
                        <el-table-column prop="integral" label="积分" width="274" sortable>
                        </el-table-column>
                        <el-table-column prop="bp" label="收支" width="274" :filters="[{ text: '收入', value: '收入' }, { text: '支出', value: '支出' }]" :filter-method="filterHandler">
                        </el-table-column>
                        <el-table-column prop="note" label="备注" width="200">
                        </el-table-column>
                    </el-table>
                </el-col>
                <!-- 积分消费明细 -->
                <el-col class="main-item" v-show="!isShow" :span="22" :offset="1">
                    <el-table :data="consumeTable" style="width: 100%" height="480">
                        <el-table-column prop="date" label="日期" width="200" sortable>
                        </el-table-column>
                        <el-table-column prop="name" label="员工姓名" width="200">
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号" width="200">
                        </el-table-column>
                        <el-table-column prop="order" label="订单号" width="220">
                        </el-table-column>
                        <el-table-column prop="integral" label="积分" width="200" sortable>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!-- 底部 分页 -->
            <el-row>
                <el-col :span="16" :offset="4" class="footer">
                    <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
            <!-- 积分充值 弹出框 -->
            <el-row>
                <el-dialog title="积分充值" :visible.sync="dialogFormVisible" width="45%">
                    <el-form :model="topUpForm" ref="topUpForm" status-icon label-width="100px">
                        <el-form-item label="联系人：">
                            <el-input v-model="topUpForm.name" class="footer-form-input" @blur="nameBlur"></el-input>
                            <span v-show="promptForm.name0" class="prompt">联系人不能为空</span>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            <el-input v-model.number="topUpForm.mobile" placeholder="请填写您的手机号" class="footer-form-input" @blur="mobileBlur"></el-input>
                            <span v-show="promptForm.m0" class="prompt">手机号不能为空</span>
                            <span v-show="promptForm.m1" class="prompt">请输入正确手机号</span>
                        </el-form-item>
                        <el-form-item label="充值积分：">
                            <el-input v-model="topUpForm.topUp" placeholder="请填写您想要充值的积分" class="footer-form-input" @blur="topUpBlur"></el-input>
                            <span v-show="promptForm.topUp0" class="prompt">充值积分不能为空</span>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="是不是忘记点什么-_-" v-model="topUpForm.note" class="footer-form-input">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="8" :offset="1">
                                <el-button @click="dialogFormVisible = false" class="form-foot-btn">取 消</el-button>
                            </el-col>
                            <el-col :span="8" :offset="1">
                                <el-button type="primary" @click="submitForm(topUpForm)" class="form-foot-btn">提 交</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>

                </el-dialog>

            </el-row>
        </el-row>
        <router-view></router-view>
    </el-col>
</template>

<script>
import { request } from 'common/js/request'
export default {
  data() {
    return {
      // 积分充值弹出框 显示隐藏控件
      dialogFormVisible: false,
      // 积分充值 表单
      topUpForm: {
        name: '',
        mobile: '',
        topUp: '',
        note: ''
      },
      // 表单验证 控件
      promptForm: {
        name0: false,
        m0: false,
        m1: false,
        topUp0: false
      },
      // tab切换 样式控件
      tab: {
        isActive1: true,
        isActive2: false
      },
      // tab 内容切换控件
      isShow: true,
      // 查询时间
      data: [],
      // 企业收支明细 表格
      bpTable: [
        {
          date: '2016-05-02',
          integral: '1',
          bp: '收入',
          note: '不要辣椒'
        },
        {
          date: '2016-05-04',
          integral: '10',
          bp: '支出',
          note: '不要酒'
        },
        {
          date: '2016-05-01',
          integral: '100',
          bp: '收入',
          note: '不要烟'
        },
        {
          date: '2016-05-03',
          integral: '1000',
          bp: '支出',
          note: '不要糖'
        }
      ],
      // 消费积分 表格
      consumeTable: [
        {
          date: '2016-06-13',
          name: '唐马儒',
          mobile: '133888883333',
          order: '20180418102459',
          integral: '888'
        },
        {
          date: '2016-06-13',
          name: '唐马儒',
          mobile: '133888883333',
          order: '20180418102459',
          integral: '888'
        },
        {
          date: '2016-06-13',
          name: '唐马儒',
          mobile: '133888883333',
          order: '20180418102459',
          integral: '888'
        },
        {
          date: '2016-06-13',
          name: '唐马儒',
          mobile: '133888883333',
          order: '20180418102459',
          integral: '888'
        },
      ],
      // 表格 总数
      total: 111,
      // 当前页 每页显示条数
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    // 三个btn 积分充值 - 积分发放 - 查看
    btn1() {
      console.log('btn1 - 积分充值')
      this.dialogFormVisible = true
    },
    btn2() {
      console.log('btn2 - 积分发放')
      this.$router.push({name: 'giveOut'})
    },
    btn3() {
      console.log('btn3 - 查看')
      if( this.isShow === true){
        var data = { data: this.data}
        this.requestDetails(data)
      }else{
        var data = { data: this.data}
        this.requestDetails(data)
      }
    },
    // tab切换 样式控制函数
    isActiveStyle(e) {
      console.log('tab切换')
      console.log(e)
      console.log(this)
      var child = e.target.innerHTML
      if (child === '企业收支明细') {
        this.tab.isActive1 = true
        this.tab.isActive2 = false
        this.isShow = true
        this.data = []
      } else if (child === '消费积分明细') {
        this.tab.isActive1 = false
        this.tab.isActive2 = true
        this.isShow = false
        this.data = []        
        // 请求 积分消费明细
        this.requestConsumption()
      }
    },
    // 改变时间事件
    changeData(e) {
      console.log('改变时间')
      console.log(e)
      this.data = e
    },
    // 企业收支明细表格过滤
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 改变页数 触发
    handleCurrentChange(e) {
      console.log('改变页数')
      console.log(e)
      this.page = e
    },
    // 提交表单(充值积分)
    submitForm(topUpForm) {
      console.log('提交-充值积分')
      console.log(topUpForm)
      var promptForm = this.promptForm
      if (
        !(
          promptForm.name0 === false &&
          promptForm.m0 === false &&
          promptForm.m1 === false &&
          promptForm.topUp0 === false
        )
      ) {
        alert('请填写正确表单')
      } else if (
        topUpForm.name == '' ||
        topUpForm.mobile == '' ||
        topUpForm.topUp == ''
      ) {
        alert('请填写正确表单')
      } else {
        console.log('成功提交表单')

        var url = 'WelAdmin/pay_point'
        var data = { 
          phone: topUpForm.mobile,
          name: topUpForm.name,
          note: topUpForm.note,
          topUp: topUpForm.topUp
        }
        request(url, data).then( res => {
          console.log(res)
        })
        this.dialogFormVisible = false
        // 还需要刷新页面
      }
    },
    // 表单验证 事件组
    nameBlur(e) {
      if (this.topUpForm.name === '') {
        this.promptForm.name0 = true
      } else {
        this.promptForm.name0 = false
      }
    },
    mobileBlur(e) {
      var isMob = /^1[3|4|5|7|8][0-9]{9}$/
      var userMobile = this.topUpForm.mobile
      if (userMobile === '') {
        this.promptForm.m0 = true
        this.promptForm.m1 = false
      } else if (!isMob.test(userMobile)) {
        this.promptForm.m0 = false
        this.promptForm.m1 = true
      } else {
        this.promptForm.m0 = false
        this.promptForm.m1 = false
      }
    },
    topUpBlur(e) {
      if (this.topUpForm.topUp === '') {
        this.promptForm.topUp0 = true
      } else {
        this.promptForm.topUp0 = false
      }
    },
    // 请求 企业收支明细 
    requestDetails(data){
      var url = 'WelAdmin/points_record'
      var data = data || {}
      request(url, data).then( res => {
        console.log(res)
      })
    },
    // 请求 积分消费明细 
    requestConsumption(data){
      var url = 'WelAdmin/record_detail'
      var data = data || {}
      request(url, data).then( res => {
        console.log(res)
      })
    }
  },
  mounted(){
    this.requestDetails()
  }
}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable');

.amount {
  background-color: @color-background-d;
  padding: 10px;
  margin-bottom: 25px;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}
// 头部
.amount-header {
  background-color: #fff;
}
.header-item {
  text-align: center;
  padding: 10px;

  & .header-title {
    font-size: @font-size-medium-x;
  }
  & .header-num {
    height: 40px;
    font-size: @font-size-large-x;
    font-weight: bold;
    line-height: 40px;
    margin: 10px 0;
    display: inline-block;
    & > span {
      height: 100%;
      font-size: @font-size-small;
      background-color: @color-background-d;
      padding: 0 10px;
      vertical-align: bottom;
      display: inline-block;
    }
  }
  & > .header-operate {
    width: 80%;
  }
}
// 主题内容
.amount-main {
  background-color: #fff;
  margin-top: 10px;
}
.main-header {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: @color-dialog-background;
}
.active {
  font-weight: bold;
  color: @color-text;
}
.main-data-search {
  width: 10%;
  margin-left: 20px;
}

.main-data-box {
  padding-bottom: 10px;
  border-bottom: 1px solid @color-background-d;
}

// 底部 分页
.footer {
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.footer-form-input {
  width: 90%;
}
// 表单底部 btn
.form-foot-btn{
    width: 100%;
}

// 表单提示信息
.prompt {
  font-size: @font-size-small-s;
  color: @color-sub-theme;
  line-height: 20px;
  display: block;
}
</style>

