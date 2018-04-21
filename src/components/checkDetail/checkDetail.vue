<template>
  <el-col class="detail">
    <!-- 头部 -->
    <el-row class="header">
      <el-col :span="3">已选人员明细：</el-col>
      <el-col :span="2" :offset="11">关键字</el-col>
      <el-col :span="4">
        <el-input v-model="input1" size="small" @keydown.13.native="searcheEmp" placeholder="姓名 / 手机 / 邮箱"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="info" size="small" @click.native="searcheEmp">搜索</el-button>
      </el-col>
      <el-col :span="1" @click.native="shutDown">
        <i class="el-icon-close"></i>
      </el-col>
    </el-row>
    <!-- main -->
    <el-row class="main">
      <el-col :span="22" :offset="1">
        <el-table :data="mingxiTable" style="width: 100%" height="541" @selection-change="changeSelect">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100">
          </el-table-column>
          <el-table-column sortable prop="sex" label="性别" width="80">
          </el-table-column>
          <el-table-column sortable prop="birthday" label="生日" width="120">
          </el-table-column>
          <el-table-column prop="depart" label="部门" width="170">
          </el-table-column>
          <el-table-column prop="e_mail" label="邮箱" width="200">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="120">
          </el-table-column>
          <el-table-column sortable prop="point" label="积分" width="80">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="22" :offset="1" class="delete-btn-box" @click.native="selectDelete">
        <el-button type="text">选中删除</el-button>
      </el-col>
    </el-row>
    <!-- footer 分页-->
    <el-row class="footer">
      <el-col class="pagination">
        <div>
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="5" :offset="18" class="btn-box">
        <el-button size="small">导出</el-button>
        <el-button type='info' size="small" @click="submit">确定</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { request } from 'common/js/request'
export default {
  props:['list'],
  data() {
    return {
      // 搜索框
      input1: '',
      // 显示的明细表格
      mingxiTable: [],
      // 搜索得到的数组
      searchArr: [],
      // type 判断现在用的是list(父组件传过来的全部数组,打印this查看)还是searchArr(主要分页的时候得分开)
      type: 0, //0是正常的list分页,1是searchArr分页
      // 总表格(因为这里是前端实现分页,不是后端分页)
      allTable: [],
      // 底部 分页 控件
      pageSize: 10,
      // 分页 -> 当前页
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    // 点击xx关闭页面 返回上一级页面
    shutDown() {
      console.log('点击了X')
      this.$router.go(-1)
    },
    // 改变 页
    handleCurrentChange(page) {
      console.log("当前页")
      console.log(page)
      this.mingxiTable = []
      // type = 0说明没有搜索,是按照list(全部数组)来的,如果=1,则是显示搜做结果,是按照searchArr来的 
      if( this.type === 0){
        this.mingxiTable = this.mingxiTable.concat(this.list.slice(10 * (page - 1), 10 + (10 * (page - 1) )))
      }else{
        this.mingxiTable = this.mingxiTable.concat(this.searchArr.slice(10 * (page - 1), 10 + (10 * (page - 1) )))
      }
    },
    // 搜索事件(姓名/手机/邮箱)
    searcheEmp(){
      console.log("搜索事件") 
      console.log(this.list)
      // 搜索前先清空,否则用concat会出错
      this.searchArr = []
      // 如果input是空,就要返回全部数组     
      if( this.input1 === ''){
        this.type = 0
        this.total = this.list.length        
        this.mingxiTable = this.list.slice(0,10)
        return  
      }
      var searchList = []
      console.log(this.list)
      for(var i = 0, len = this.list.length; i < len; i++){
        if( this.list[i].e_mail.indexOf(this.input1) !== -1 || this.list[i].phone.indexOf(this.input1) !== -1 
        || this.list[i].name.indexOf(this.input1) !== -1){
          searchList.push(this.list.slice(i, i + 1)[0])
        }
      }
      this.type = 1
      this.searchArr = this.searchArr.concat(searchList)
      this.total = this.searchArr.length
      this.mingxiTable = this.searchArr.slice(0,10)
    },
    // 选择表格事件
    changeSelect(data){
      console.log('选择表格')
      console.log(data)
      var arr = []
      for(var i = 0, len = data.length; i < len; i++){
        arr.push(data[i].id)
      }
      this.selectTabel = arr
      console.log(this.selectTabel)
    },
    // 确定按钮
    submit() {
      console.log('确定按钮')
      this.$router.go(-1)
    },
    // 表格列表 删除事件
    deleteClick(row) {
      console.log('删除按钮')
      console.log(row)
      var data = { id: [row.id]}
      this.delRequest(data)
    },
    // 选中删除
    selectDelete() {
      console.log('选中删除')
      var data = {id: this.selectTabel}
      this.delRequest(data)
    },
    // 删除 函数
    delRequest(data){
      var url = 'WelAdmin/del_point_staff'
      request(url, data).then( res => {
        console.log(res)
      })
    }
  },
  // 加载时 需要告知父组件,可以隐藏了
  mounted() {
    this.$emit('isHide', false)
    console.log(this.list)
    this.mingxiTable = this.list.slice(0,10)
    this.total = this.list.length
  },
  // 销毁前 需要告知父组件,可以显示了
  beforeDestroy() {
    this.$emit('isShow', true)
  }
}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable');
.detail {
  width: 100%;
  background-color: #fff;
  border: 1px solid @color-background-d;
  margin-bottom: 100px;
  position: absolute;
  top: 8px;
  //   bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
// 头部
.header {
  font-size: @font-size-medium-x;
  line-height: 50px;
  border-bottom: 2px solid @color-text-d;
  & > div:first-child {
    margin-left: 20px;
    color: @color-dialog-background;
  }
  & > div:nth-child(2) {
    font-size: @font-size-small;
    color: @color-dialog-background;
    text-indent: 3em;
  }
  & > div:nth-child(4) {
    padding-left: 20px;
  }
  & > div:nth-child(5) {
    text-align: right;
    & > i {
      font-size: 30px;
      line-height: 50px;
      color: #666;
      &:hover {
        color: #000;
      }
    }
  }
}
// main
.main {
  background-color: #fff;
  border-bottom: 2px solid @color-text-d;
}
.delete-btn-box {
  text-align: right;
  margin-top: 10px;
  margin-bottom: 10px;
  & button {
    margin-right: 31px;
  }
}
// footer
.footer {
}
.pagination {
  border-bottom: 1px solid @color-background-d;
  & > div {
    margin: 15px auto;
    display: flex;
    justify-content: center;
  }
}
.btn-box {
  margin-top: 15px;
  margin-bottom: 15px;
  & button {
    width: 40%;
  }
}
</style>


