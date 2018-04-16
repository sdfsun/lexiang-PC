<template>
  <el-col class="detail">
    <!-- 头部 -->
    <el-row class="header">
      <el-col :span="3">已选人员明细：</el-col>
      <el-col :span="2" :offset="11">关键字</el-col>
      <el-col :span="4">
        <el-input v-model="input1" size="small" placeholder="姓名 / 手机 / 邮箱"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="info" size="small">搜索</el-button>
      </el-col>
      <el-col :span="1" @click.native="shutDown">
        <i class="el-icon-close"></i>
      </el-col>
    </el-row>
    <!-- main -->
    <el-row class="main">
      <el-col :span="22" :offset="1">
        <el-table :data="list" style="width: 100%" height="541">
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
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="4">
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
export default {
  props:['list'],
  data() {
    return {
      // 搜索框
      input1: '',
      // 分页 -> 当前页
      currentPage: 1,
      // 明细表格
      mingxiTable: []
    }
  },
  methods: {
    // 点击xx关闭页面 返回上一级页面
    shutDown() {
      console.log('点击了X')
      this.$router.go(-1)
    },
    // 改变 页
    handleCurrentChange() {},
    // 确定按钮
    submit() {
      console.log(this)
    },
    // 表格列表 删除事件
    deleteClick(row) {
      console.log('删除按钮')
    },
    // 选中删除
    selectDelete() {
      console.log('选中删除')
    }
  },
  // 加载时 需要告知父组件,可以隐藏了
  created() {
    this.$emit('isHide', false)
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


