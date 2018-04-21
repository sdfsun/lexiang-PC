<template>
  <el-row class="give-out">
    <el-row class="give-out-main" v-show="parentShow">
      <el-col>
        <el-row>
          <el-col class="header-title">员工积分发放</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="14" class="main-left">
            <el-row>
              <el-col class="main-left-header">待选列表</el-col>
            </el-row>
            <el-row>
              <el-col class="main-left-content">
                <el-row>
                  <el-col class="left-content-left" :span="7">
                    <el-tree :data="tree" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
                    </el-tree>
                  </el-col>
                  <el-col class="left-content-right" :span="17">
                    <el-input v-model="ygSearch" placeholder="请输入员工关键词" clearable prefix-icon="el-icon-search"></el-input>
                    <div v-for="(item, index) in department" class="source-list" type="department" @click="sourceClick(1, index,item.id)">
                      <span>{{item.label}}</span>
                      <span>部门</span>
                    </div>
                    <div v-for="(item, index) in employees" class="source-list" v-show="showNode(ygSearch, item.name)" type="employees" @click="sourceClick(2, index,item.id)">
                      <span>{{item.name}}</span>
                      <span>员工</span>
                    </div>
                    <el-col class="left-content-right-footer" @click.native="allAdd">全部添加
                      <i class="el-icon-d-arrow-right"></i>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10" class="main-right">
            <el-row>
              <el-col class="main-right-header">已选列表</el-col>
            </el-row>
            <el-row>
              <el-col class="main-right-content">
                <div v-for="(item, index) in targetDepartment" class="source-list" @click="targetClick(1, index,item.id)">
                  <span>{{item.label}}</span>
                  <span>部门</span>
                </div>
                <div v-for="(item, index) in targetEmployees" class="source-list" @click="targetClick(2, index,item.id)">
                  <span>{{item.name}}</span>
                  <span>员工</span>
                </div>
              </el-col>
              <el-col class="right-content-footer">
                <div class="right-content-footer-item" @click="checkDetail">
                  <i class='el-icon-tickets'></i> 查看明细</div>
                <div class="right-content-footer-item" @click="allDelete">
                  <i class='el-icon-d-arrow-left'></i> 全部移除</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

    <el-row class="footer" v-show="parentShow">
      <el-col class="footer-top">
        <el-row>
          <el-col :span="2">发放积分：</el-col>
          <el-col :span="3">
            <el-input v-model.number="ffInput" size="mini">
              <i slot="suffix" class="">积分/人</i>
            </el-input>
          </el-col>
          <el-col :span="8" class="footer-top-last">共计 0 积分，当前可用 100 积分</el-col>
          <el-col class="ff-prompt">{{ffPrompt}}</el-col> 
        </el-row>
        <el-row>
          <el-col :span="2">备注信息：</el-col>
          <el-col :span="12">
            <el-input v-model.number="bzInput" size="mini" :maxlength="20" placeholder="填写备注会让支出更明确(选填)">
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="footer-bottom" @click.native="issue">
            <el-button type="info" size="small">发放</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <router-view @isHide='isHide' @isShow='isShow' :list="childrenList"></router-view>
  </el-row>
</template>

<script>
import { request, requestGet } from 'common/js/request'
export default {
  data() {
    return {
      // 父级页面显示隐藏(本页面显示隐藏)
      parentShow: true,
      // 树形结构 数据
      tree: [],
      // s树形结构 绑定的属性(可以自由调节,方便前端不依赖后端)
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 穿梭框 数据 (部门department/员工employees)
      department: [],
      employees: [],
      // 右边穿梭框数据
      targetDepartment: [],
      targetEmployees: [],
      // 员工搜索输入
      ygSearch: '',
      // 点击 查看详情 返回数组(子组件显示)
      childrenList: [],
      // 发放积分
      ffInput: '',
      // 备注信息
      bzInput: '',
      // 发放积分提示
      ffPrompt: '',
      // 底部 分页 总条数
      total: 0,
      // 当前页 每页显示条数
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    // 树状图 选择
    handleNodeClick(data) {
      console.log('树状图选择')
      console.log(data)
      var url = 'WelAdmin/points_dist'
      var data = { depart_id: data.id }
      requestGet(url, data).then(res => {
        console.log(res)
        // var arr = res.depart
        // for(var i = 0, len = arr.length; i < len; i++){
        //   for(var j = 0, l = this.department.length; j < l; j++){
        //     if( arr[i].id === this.department[j].id ){
        //       arr.splice(i,1)
        //     }
        //   }
        // }
        // this.department = this.department.concat(arr)

        // var arr1 = [].concat(res.staff)
        // for(var k = 0, leng = arr1.length; k < leng; k++){
        //   for(var n = 0, le = this.employees.length; n < le; n++){
        //     if( arr1[k].id === this.employees[n].id ){
        //       arr1.splice(k,1)
        //     }
        //   }
        // }
        // this.employees = this.employees.concat(arr1)
        this.department = this.department.concat(res.depart)
        this.employees = this.employees.concat(res.staff)
        console.log('左侧完成')
      })
    },
    // 左侧 穿梭框 点击
    sourceClick(type, index, id) {
      console.log('左侧穿梭列表点击')
      console.log(type) // type == 1是部门, type == 2 是员工
      console.log(index)
      console.log(id)
      if (type === 1) {
        var data = this.department.splice(index, 1)
        for (var i = 0, len = this.targetDepartment.length; i < len; i++) {
          // 如果 右边有这个,就直接结束函数不执行下面的了
          if (this.targetDepartment[i].id === data[0].id) return
        }
        this.targetDepartment.push(data[0])
      } else {
        var data = this.employees.splice(index, 1)  
        for (var i = 0, len = this.targetEmployees.length; i < len; i++) {
          if (this.targetEmployees[i].id === data[0].id) return
        }
        this.targetEmployees.push(data[0])
      }
    },
    // 右侧 穿梭框 点击
    targetClick(type, index, id) {
      console.log('右侧穿梭列表点击')
      console.log(type)
      console.log(index)
      console.log(id)
      // 1: 部门.  2: 员工
      if (type === 1) {
        var data = this.targetDepartment.splice(index, 1)
        this.department.push(data[0])
      } else {
        var data = this.targetEmployees.splice(index, 1)
        this.employees.push(data[0])
      }
    },
    // 全部添加
    allAdd() {
      console.log('全部添加')
      // 部门 添加
      for (var k = 0, le = this.targetDepartment.length; k < le; k++) {
        for(var n = 0, leng = this.employees.length; n < leng; n++){
          if (this.targetDepartment[k].id === this.department[n].id) {
            this.department.splice(n,1)
            n = n - 1
          }
        }
      }
      this.targetDepartment = this.targetDepartment.concat(this.department)
      this.department = []
      // 员工 添加
      for (var i = 0, len = this.targetEmployees.length; i < len; i++) {
        for(var j = 0, l = this.employees.length; j < l; j++){
          if (this.targetEmployees[i].id === this.employees[j].id) {
            this.employees.splice(j,1)
            j = j - 1
          }
        }
      }
      this.targetEmployees = this.targetEmployees.concat(this.employees)
      this.employees = []
    },
    // 查看明细 跳转checkDetail页面
    checkDetail() {
      console.log('查看明细')
      var departmentIdArr = []
      var employeesIdArr = []
      for (var i = 0, len = this.targetDepartment.length; i < len; i++) {
        departmentIdArr.push(this.targetDepartment[i].id)
      }
      for (var i = 0, len = this.targetEmployees.length; i < len; i++) {
        employeesIdArr.push(this.targetEmployees[i].id)
      }
      var url = 'WelAdmin/details'
      var data = {
        depart: departmentIdArr,
        employees: employeesIdArr
      }
      request(url, data).then(res => {
        this.childrenList = res
        // 父级页面隐藏,跳转子页面
        this.parentShow = false
        this.$router.push({ name: 'checkDetail' })
      })
    },
    // 全部移除
    allDelete() {
      console.log('全部移除')
      this.department = this.department.concat(this.targetDepartment)
      this.targetDepartment = []
      this.employees = this.employees.concat(this.targetEmployees)
      this.targetEmployees = []
    },
    // 发放
    issue() {
      console.log('发放')
      if(this.ffInput <= 0) return this.ffPrompt = "请填入正确发放积分"
      this.ffPrompt = "" //取消 发放积分提示
      // 把 部门和员工id 取成数组,用data发送到后台
      var departIdArr = [] 
      for(var i = 0, len = this.targetDepartment.length; i < len; i++){
        departIdArr.push(this.targetDepartment[i].id)
      }
      var empIdArr = [] 
      for(var j = 0, l = this.targetEmployees.length; j < l; j++){
        empIdArr.push(this.targetEmployees[j].id)
      }
      var data = { 
        // 放放积分和备注
        issue: this.ffInput,
        note: this.bzInput,
        depart_id: departIdArr,
        emp_id: empIdArr
      }
      console.log(data)
      var url = 'WelAdmin/points_dist'
      request(url, data).then( res => {
        console.log(res)
      })
    },
    // 接收 子组件传过来的值 让自己显示
    isShow(data) {
      console.log('接收 子组件传过来的值')
      console.log(this)
      this.parentShow = data
    },
    // 接收 子组件传过来的值 让自己隐藏
    isHide(data) {
      console.log('接收 子组件传过来的值')
      console.log(this)
      this.parentShow = data
    },
    // 请求左侧 部门树 列表
    departmentTree() {
      // 请求 部门tree
      var url = 'WelAdmin/depart_list'
      request(url, {}).then(res => {
        this.tree = res
        console.log(res)
      })
    },
    // 搜索员工显示隐藏
    showNode(val, name){
      console.log(val)
      console.log(name)
      if(!val) return true
      return name.indexOf(val) !== -1
    }
  },
  mounted() {
    this.departmentTree()
  }
}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable');
// 整体定位
.give-out {
  background-color: @color-background-d;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.give-out-main {
  padding: 10px 20px;
  background-color: #fff;
}
.header-title {
  height: 50px;
  font-size: @font-size-medium-x;
  color: @color-highlight-background;
  line-height: 50px;
}
// 左边
.main-left {
  & .main-left-header {
    height: 50px;
    line-height: 50px;
    background-color: @color-highlight-background;
    padding-left: 20px;
  }
  & .main-left-content {
    border: 1px solid @color-background-d;
    position: relative;
  }
}
.left-content-left {
  & > div {
    height: 600px;
    background-color: @color-background-d;
  }
}
.left-content-right {
  height: 550px;
  overflow-y: auto;
  & .source-list:hover {
    background-color: @color-background-d;
    cursor: pointer;
  }
}
.left-content-right-footer {
  width: 71%;
  height: 49px;
  line-height: 49px;
  text-align: center;
  border-top: 1px solid @color-background-d;
  position: absolute;
  bottom: 0;
  left: 180px;
  right: 0;
  &:hover {
    color: @color-theme;
    background-color: @color-background-d;
    cursor: pointer;
  }
}
// 右边
.main-right {
  & .main-right-header {
    height: 50px;
    line-height: 50px;
    background-color: @color-highlight-background;
    padding-left: 20px;
  }
  & .main-right-content {
    height: 550px;
    overflow-y: auto;
    border: 1px solid @color-background-d;
    & .source-list:hover {
      background-color: @color-background-d;
      // cursor: pointer;
    }
  }
}
.right-content-footer {
  border: 1px solid @color-background-d;
  display: flex;
  justify-content: center;
  align-items: center;
  & div:first-child {
    border-right: 1px solid @color-background-d;
  }
  & .right-content-footer-item {
    height: 50px;
    width: 49.9%;
    line-height: 50px;
    text-align: center;
    &:hover {
      color: @color-theme;
      background-color: @color-background-d;
      cursor: pointer;
    }
  }
}
// 穿梭框
.source-list {
  padding: 0 10px;
  border-bottom: 1px solid @color-highlight-background;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    height: 40px;
    font-size: @font-size-medium;
    line-height: 40px;
    display: block;
  }
  & span:last-child {
    height: 20px;
    font-size: @font-size-small-s;
    line-height: 20px;
    color: @color-background;
    background-color: @color-dialog-background;
    padding: 2px 20px;
    border-radius: 4px;
  }
}
// 底部
.footer {
  background-color: #fff;
  padding: 0 20px 10px 20px;
}
.footer-top {
  font-size: @font-size-small;
  line-height: 50px;
  & .footer-top-last {
    font-size: @font-size-small;
    color: @color-dialog-background;
    padding-left: 20px;
  }
}
.footer-bottom {
  & button {
    width: 100%;
  }
}
.ff-prompt{
  font-size: @font-size-small-s;
  line-height: 14px;
  color: red;
}
</style>

