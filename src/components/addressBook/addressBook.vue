<template>
  <el-col class="address-book-box">
    <el-row class="address-book" type="flex" align-items="stretch">
      <el-col :span="5" class="main-left">
        <el-row class="search-bm">
          <el-input placeholder="搜索部门" v-model="search1" prefix-icon="el-icon-search" size="small">
          </el-input>
        </el-row>

        <el-row class="bm-list">
          <el-col class="left-title" style="margin: 10px;" v-show="!tree.length">
            公司简称
          </el-col>
          <el-col class="nav">
            <el-tree class="filter-tree" :data="tree" :props="defaultProps" highlight-current :filter-node-method="filterNode" ref="tree" @node-click="nodeClick">
            </el-tree>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="19" class="main-right">
        <el-row class="right-header">
          <el-col :span="13" class="header-left">
            <div v-show="!CurrentDepartmentLevel.length" class="null">null</div>
            <div class="header-left-box" v-show="CurrentDepartmentLevel.length">
              <div class="department-list" v-for="(item, index) in CurrentDepartmentLevel">
                {{item}}
                <!-- <span v-if="index == CurrentDepartmentLevel.length - 1">(12)</span> -->
                <i @click="editor(index)" :class="[index == CurrentDepartmentLevel.length - 1 ? 'el-icon-edit-outline icon-big' : 'el-icon-arrow-right icon-next-big']"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="11" class="header-right">
            <el-input prefix-icon="el-icon-search" class="inline-input input2" size="small" v-model="search2" placeholder="搜索员工" @blur="handleSelect" @keydown.13.native="handleSelect">
            </el-input>
            <el-button @click="addSon" size="small" type="info" class="header-btn">添加子部门</el-button>
            <el-button @click='bulkImport' size="small" type="info" class="header-btn">批量导入</el-button>
            <el-button @click='addEmp' size="small" type="info" class="header-btn">添加员工</el-button>
          </el-col>
        </el-row>

        <el-row class="right-main">
          <el-col>
            <el-table :data="tableData" style="width: 100%" height="544">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="id" label="id" width="0" v-if="false">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="70">
              </el-table-column>
              <el-table-column prop="gender" label="性别" width="70">
              </el-table-column>
              <el-table-column prop="birthday" label="生日" width="100">
              </el-table-column>
              <el-table-column prop="department" label="部门" width="150">
              </el-table-column>
              <el-table-column prop="email" label="邮箱" width="200">
              </el-table-column>
              <el-table-column prop="mobile" label="手机号" width="120">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="redactInfo(scope.row)" type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 停用 / 导出 -->
            <el-row type="flex" justify="space-between" class="stop-export">
              <el-col :span="3" :offset='1'>
                <el-button size="small" type="info" @click="stopBtn">选中停用</el-button>
              </el-col>
              <el-col :span="3">
                <el-button size="small" type="info" @click="exportBtn">全部导出</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 底部 分页 -->
    <el-row class="footer-page">
      <el-col :span="19" :offset="5">
        <el-row>
          <el-col :span="16" :offset="4" class="footer-page-box">
            <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" @current-change="handleCurrentChange">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 弹出框  编辑信息 表单-->
    <el-row>
      <el-col>
        <el-dialog :title="employeesTitle" :visible.sync="dialogFormVisible" width="60%">
          <el-form :model="form" label-position="right">
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="员工姓名：" :label-width="formLabelWidth" :rules="[{ required: true, message: '姓名不能为空'}]">
                  <el-input v-model="form.name" class="form-input" :disabled="employeesDisabled.disabled1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="手机号：" :label-width="formLabelWidth" :rules="[{ required: true, message: '手机号不能为空'}]">
                  <el-input v-model.number="form.mobile" class="form-input" :disabled="employeesDisabled.disabled2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="员工邮箱：" :label-width="formLabelWidth">
                  <el-input v-model="form.email" class="form-input" :disabled="employeesDisabled.disabled3"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="员工性别：" :label-width="formLabelWidth">
                  <el-select v-model="form.gender" placeholder="请选择性别" :disabled="employeesDisabled.disabled4">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="生日日期：" :label-width="formLabelWidth">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" value-format="yyyy-MM-dd" :disabled="employeesDisabled.disabled5" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="入职日期：" :label-width="formLabelWidth">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.entryDate" value-format="yyyy-MM-dd" :disabled="employeesDisabled.disabled6" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="账号：" :label-width="formLabelWidth">
                  <el-input v-model.number="form.mobile" class="form-input" :disabled="employeesDisabled.disabled7"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="员工职位：" :label-width="formLabelWidth">
                  <el-input v-model="form.position" class="form-input" :disabled="employeesDisabled.disabled8"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="22" :offset="1">
                <el-form-item label="所属部门：" :label-width="formLabelWidth">
                  <el-cascader :options="options" v-model="selectedOptions" @change="handleChange" :disabled="employeesDisabled.disabled9" class="preDepartment">
                  </el-cascader>
                  <!-- <el-cascader :options="options" v-model="selectedOptions" @change="handleChange" class="preDepartment">
                  </el-cascader> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmSubmit(form)" :disabled="employeesDisabled.disabled10">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 弹出框  部门信息 表单-->
    <el-row>
      <el-col>
        <el-dialog title="编辑信息" :visible.sync="dialogFormVisible1" width="50%">
          <el-form :model="formDepartment" label-position="right">
            <el-row>
              <el-col :span="22">
                <el-form-item label="部门名称：" prop="departmentName" :label-width="formLabelWidth">
                  <el-input v-model="formDepartment.name" class="form-input1" @blur="changeDepartmentName"></el-input>
                  <div style="font-size: 12px; line-height: 12px; margin-top: 10px; color: red;" v-show="!this.formDepartmentErr.type">{{formDepartmentErr.prompt}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item label="上级部门：" prop="preDepartment" :label-width="formLabelWidth">
                  <el-cascader :options="options" v-model="selectedOptions" @change="handleChange" class="preDepartment">
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmSubmit1(formDepartment)">保 存</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { request, requestGet } from 'common/js/request'
export default {
  data() {
    return {
      // input 输入1,2
      search1: '',
      search2: '',
      // 当前选择的部门 id, 0:当前部门id  1:父级部门id
      currentDepartmentId: [],
      // 表单选择的部门 id -> 2个都在这
      formDepartmentId: '',
      formEmployeesId: '',
      // 部门级别 当前为3级的时候,不能添加子部门(点击添加子部门没用)
      level: 0,
      // 判断 发送的表单是 编辑还是添加 0是添加 1是更改 || 部门/员工2个
      addDepartment: 0,
      addEmployees: 0,
      // 选择部门后,右侧左上显示内容
      CurrentDepartmentLevel: [],
      // 树状图 数据
      tree: [],
      // s树形结构 绑定的属性(可以自由调节,方便前端不依赖后端)
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 弹出框表单 显示隐藏 控件 1.编辑信息 2.部门信息
      dialogFormVisible: false,
      dialogFormVisible1: false,
      // 两个表单级联选择器的内容(所属部门),有值就是默认显示的值
      selectedOptions: [],
      // 两个表单级联选择器的内容(所属部门),有值就是默认显示的值
      options: [],
      // employeesTitle 员工表单 标题 分为 查看/编辑/添加
      employeesTitle: '',
      //   表单 信息 / 编辑信息
      form: {
        name: '',
        gender: '',
        birthday: '',
        email: '',
        mobile: '',
        entryDate: '',
        // account: '', // 账号,现在不用,手机号和他用一个了
        position: ''
      },
      //   表单 信息 / 部门信息
      formDepartment: {
        name: ''
      },
      // 控制 员工表单 input 能不能输入
      employeesDisabled: {
        disabled1: false,
        disabled2: false,
        disabled3: false,
        disabled4: false,
        disabled5: false,
        disabled6: false,
        disabled7: false,
        disabled8: false,
        disabled9: false,
        disabled10: false
      },
      employeesMobileDisabled: false,
      employeesAccountDisabled: false,
      // 部门表单错误信息
      formDepartmentErr: {
        prompt: '',
        type: false
      },
      // 表单距离左边的距离
      formLabelWidth: '100px',
      // 表格 数据
      tableData: [],
      // 表格 总数
      total: 0,
      // 当前页 每页显示条数
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    // 编辑/添加 部门表单下拉框事件
    handleChange(e) {
      console.log(e)
      // 父级部门 id
      this.formDepartmentId = e[0]
    },
    //      用户操作
    // 选择部门tree
    nodeClick(obj, node, all) {
      console.log('选择部门树')
      console.log(obj)
      console.log(node)
      console.log(all)
      // 选择部门之后 需要把 当前选择部门id 存储,添加和编辑部门信息时候用(0:当前部门id,1:父级部门id)
      console.log(node.data.id, node.parent.data.id)
      this.currentDepartmentId = [
        [node.data.id, node.data.label],
        [node.parent.data.id]
      ]
      // 当前部门级别 现在是最多3级,所以3级不能添加子部门
      this.level = node.level
      // 获取 选中节点的所有父节点和选中节点本身
      var list = []
      list.push(node.label)
      for (var i = 0, len = node.level - 1; i < len; i++) {
        var parentNode = node.parent
        list.unshift(parentNode.label)
      }
      this.CurrentDepartmentLevel = list
      console.log(list)

      // 获取点击部门下员工列表 --> 右侧表格显示
      console.log(node)
      var data = {
        depart: node.data.id
      }
      this.changeData(data)
    },
    // 搜索部门
    filterNode(value, data, node) {
      console.log('搜索部门')
      console.log('用户搜索的值:' + value)
      console.log('找到的节点所对应的对象:' + data)
      console.log('找到的节点对应的 Node:' + node)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 编辑 部门
    editor(index) {
      console.log('编辑部门')
      console.log(index)
      // 如果点击的不是最后一个 图标 就返回
      if (index !== this.CurrentDepartmentLevel.length - 1) return
      // 编辑部门 下拉列表默认显示左侧点击部门的父级部门,也就是当前选择的部门 id
      this.selectedOptions = this.currentDepartmentId[1]
      // 编辑部门时,部门名也要默认原来一样
      this.formDepartment.name = this.currentDepartmentId[0][1]
      var data = { id: this.currentDepartmentId[0][0] }
      this.departmentInfo(data)
    },
    // 搜索员工
    handleSelect(e) {
      console.log('搜索员工')
      console.log(this.search2)
      var url = 'WelAdmin/employee_list'
      var data = { name: this.search2 }
      requestGet(url, data).then(res => {
        this.tableData = res.info
        this.total = res.total
      })
    },
    // 添加子部门
    addSon(event) {
      console.log('添加子部门')
      // r如果当前 部门级别为3 则返回 最大部门3级,3级添加不了子部门
      if (this.level === 3) return
      console.log(this.level)
      this.dialogFormVisible1 = true
      // 添加子部门 下拉列表默认显示左侧点击的部门,也就是当前选择的部门 id
      this.selectedOptions = this.currentDepartmentId[0]
      this.departmentInfo({})
    },
    // 批量导入
    bulkImport() {
      console.log('批量导入')
    },
    // 添加员工
    addEmp() {
      console.log('添加员工')
      this.dialogFormVisible = true
      // 表单标题变为 添加员工
      this.employeesTitle = '添加员工'
      // 表单里的 账号 bu可以编辑
      this.employeesDisabled.disabled7 = true
      // 点击 添加员工 this.addEmployees应该是1,0是编辑
      this.addEmployees = 1
      var data = {}
      this.employeesInfo(data)
    },
    // 搜索时自动返回的提示
    querySearch(queryString, cb) {
      console.log(queryString)
      console.log(cb)
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 查看 table 列表
    handleClick(row) {
      console.log(row)
      // 表单标题变为 查看员工信息
      this.employeesTitle = '查看员工信息'
      this.dialogFormVisible = true
      // 展示row的内容
      this.employeesDisabled = {
        disabled1: true,
        disabled2: true,
        disabled3: true,
        disabled4: true,
        disabled5: true,
        disabled6: true,
        disabled7: true,
        disabled8: true,
        disabled9: true,
        disabled10: true
      }
      var url = 'WelAdmin/employee_info'
      var data = { id: row.id }
      request(url, data).then(res => {
        this.form.name = res.info.name,
        this.form.birthday = res.info.birthday,
        this.form.email = res.info.e_mail,
        this.form.entryDate = res.info.entry_time,
        this.form.mobile = res.info.phone,
        this.form.position = res.info.postition,
        this.form.gender = res.info.sex
      })
    },
    // 点击 表格 编辑
    redactInfo(row) {
      console.log(row)
      this.dialogFormVisible = true
      // 表单标题变为 编辑员工信息
      this.employeesTitle = '编辑员工信息'
      // 表单里的 手机号/账号 都bu可以编辑
      this.employeesDisabled.disabled2 = true
      this.employeesDisabled.disabled7 = true
      // 点击编辑 之后的提交表单 addEmployees为0,添加是1
      this.addEmployees = 0
      var data = {
        id: row.id
      }
      this.employeesInfo(data, row)
    },
    // 停用 / 导出按钮
    stopBtn(e) {
      console.log('选中停用')
    },
    exportBtn(e) {
      console.log('全部导出')
    },
    // 列表数据的第几页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log('改变页数')
      this.page = val
      var data = {
        page: this.page - 1
      }
      this.changeData(data)
    },
    // 弹出框表单提交 编辑信息
    confirmSubmit(form) {
      console.log('弹出框确认 编辑信息')
      console.log(form)
      // 判断 员工表单提交是 添加 还是 编辑,1是添加,0是编辑
      if (this.addEmployees == 1) {
        var data = {}
      } else {
        var data = {}
      }
      this.employeesInfoSubmit(form)
    },
    // 弹出框表单提交 部门信息
    confirmSubmit1(form) {
      console.log(form)
      console.log(this.formDepartmentId)
      console.log('弹出框确认 部门信息')
      // 判断是 添加1 还是更改0
      if (this.addDepartment == 1) {
        console.log(this.currentDepartmentId || '1')
        if (this.formDepartmentId) {
          var p_id = this.formDepartmentId
        } else if (this.currentDepartmentId.length !== 0) {
          var p_id = this.currentDepartmentId[0][0]
        } else {
          var p_id = ''
        }
        var data = {
          // 如果是添加子部门,则如果自己下拉列表选择,则是自己选的,否则,父级部门填左侧tree选中的 id
          // 判断放在上面了,要用length判断,否则会报错,恶心
          p_id: p_id,
          name: form.name
        }
      } else {
        var data = {
          id: this.currentDepartmentId[0][0],
          // 如果是更改部门,则如果自己下拉列表选择,则是自己选的,否则,父级部门填左侧tree选中的部门的父级部门
          p_id: this.formDepartmentId || this.currentDepartmentId[1][0],
          name: form.name
        }
      }
      this.departmentInfoSubmit(data)
    },
    // 部门信息 表单验证
    changeDepartmentName(value) {
      console.log('部门名称验证')
      console.log(this.formDepartment.name)
      if (this.formDepartment.name === '') {
        this.formDepartmentErr.type = false
        this.formDepartmentErr.prompt = '部门名称不能为空'
      } else {
        this.formDepartmentErr.type = true
        this.formDepartmentErr.prompt = ''
      }
    },
    //  抽出 重复 函数
    // 添加/编辑 部门信息 (弹出对话框) 应该是一样的,参数不同
    departmentInfo(data) {
      console.log('弹出部门弹窗')
      this.dialogFormVisible1 = true
      var url = 'WelAdmin/depart_info'
      request(url, data).then(res => {
        console.log(res)
        // 判断是编辑还是添加 保存了,提交的时候好分开
        this.addDepartment = res.info.id ? 0 : 1
        var list = []
        for (var i = 0, len = res.depart.length; i < len; i++) {
          // 转换获取列表
          var data = {
            label: res.depart[i].name,
            value: res.depart[i].id
          }
          list.push(data)
          // 找到默认信息(上级部门,就是当前左侧tree选择的部门)(记得清空this.selectedOptions)
          console.log(this.addDepartment)
          if (res.depart[i].id == this.currentDepartmentId) {
            console.log('进去')
            this.selectedOptions.push(res.depart[i].id)
            console.log(this.selectedOptions)
          }
        }
        console.log(list)
        // 选择框的选项列表
        this.options = list
      })
    },
    // 添加/编辑 部门信息 (弹出对话框确定)
    departmentInfoSubmit(data) {
      var url = 'WelAdmin/depart_edit'

      request(url, data).then(res => {
        console.log(res)
        console.log('添加/编辑部门信息成功')
        this.departmentTree()
      })
      this.dialogFormVisible1 = false
    },
    // 添加/编辑 员工信息 (弹出对话框)
    employeesInfo(data, row) {
      var url = 'WelAdmin/employee_info'
      request(url, data).then(res => {
        console.log('res')
        console.log(res)
        var list = []
        for (var i = 0, len = res.depart.length; i < len; i++) {
          var data = {
            label: res.depart[i].name,
            value: res.depart[i].id
          }
          list.push(data)
        }
        console.log(list)
        this.options = list || []
      })
      var row = row || {}
      this.form = row
    },
    // 添加/编辑 员工信息 (弹出对话框 确定)
    employeesInfoSubmit(data) {
      var data = {
        birthday: data.birthday,
        e_mail: data.email,
        entry_time: data.entryDate,
        sex: data.gender,
        phone: data.mobile,
        name: data.name,
        postition: data.position,
        department_id: this.selectedOptions[0] || '',
        id: data.id || ''
      }
      var url = 'WelAdmin/employee_edit'
      request(url, data).then(res => {
        console.log(res)
        console.log('添加/编辑员工信息成功')
        // 重新请求 表单列表
        var data = { page: this.page }
        this.changeData(data)
      })
      this.dialogFormVisible = false
    },
    // 请求左侧 部门树 列表
    departmentTree() {
      // 请求 部门tree
      var url = 'WelAdmin/depart_list'
      request(url, {}).then(res => {
        this.tree = res
      })
    },
    // 请求右侧 表格 列表  参数: page页this.page
    changeData(data) {

      var url = 'WelAdmin/employee_list'
      requestGet(url, data).then(res => {
        console.log(res)
        var list = res.info
        this.total = res.total
        var table = []
        for (var i = 0, len = list.length; i < len; i++) {
          var data = {}
          data.id = list[i].id
          data.name = list[i].name
          data.gender = list[i].sex
          data.birthday = list[i].birthday
          data.department = list[i].depart
          data.email = list[i].e_mail
          data.mobile = list[i].phone
          table.push(data)
        }
        this.tableData = table
      })
    }
  },
  mounted() {
    console.log('mounted')
    // 请求 表单
    var data = { 
      page: this.page - 1,
      name: '',
      depart: ''
    }
    this.changeData(data)
    // 请求 部门tree
    this.departmentTree()
  },
  watch: {
    // 当用户改变搜索部门时,触发
    search1(val) {
      this.$refs.tree.filter(val)
    },
    // 当  部门表单 隐藏的时候,清空表单信息,还要把两个表单级联选择器的内容(所属部门)清空
    dialogFormVisible1(val) {
      if (val === false) {
        this.formDepartment.name = ''
        this.options = []
        this.selectedOptions = []
      }
    },
    // 当  员工表单 隐藏的时候,清空表单信息,还要把两个表单级联选择器的内容(所属部门)清空
    // 也要把 每个input 的 disabled 改成true,让他们都可以编辑,因为编辑/查看/添加用一个表单
    dialogFormVisible(val) {
      if (val === false) {
        // 清空表单
        this.formDepartment.name = ''
        this.options = []
        // 清空默认
        this.selectedOptions = []
        // 清空disabled
        this.employeesDisabled = {
          disabled1: false,
          disabled2: false,
          disabled3: false,
          disabled4: false,
          disabled5: false,
          disabled6: false,
          disabled7: false,
          disabled8: false,
          disabled9: false,
          disabled10: false
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable');
.address-book {
  background-color: #f2f2f2;
  padding: 10px;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}
.main-left {
  background-color: #fff;
  padding: 10px;
  margin-right: 10px;
  box-sizing: border-box;
  .bm-list {
    font-size: @font-size-small;
    margin-top: 10px;
    height: 632px;
  }
}
.nav {
  max-height: 597px;
  overflow-x: hidden;
  overflow-y: auto;
}
// 右边
.main-right {
  background-color: #fff;
  .right-header {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
}
.header-left {
  font-size: @font-size-medium;
  line-height: 32px;
  padding-left: 24px;
}
.input2 {
  width: 28%;
}
.department-list {
  font-size: @font-size-medium-x;
  line-height: 40px;
  display: inline-block;
  .icon-next-big {
    font-size: 28px;
    vertical-align: sub;
  }
  .icon-big {
    font-size: 28px;
    vertical-align: sub;
    &:hover {
      color: @color-theme;
      cursor: pointer;
    }
  }
}

.null {
  opacity: 0;
}

// 停用 导出
.stop-export {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid @color-background-d;
  margin-bottom: 60px;
}
// 底部分页
.footer-page {
  width: 100%;
  margin-bottom: 20px;
  position: absolute;
  top: 755px;
}
.footer-page-box {
  display: flex;
  justify-content: center;
}
// 弹出框表单 编辑信息
.form-input {
  width: 250px;
}

.form-input:last-child {
  width: 100%;
}
.created-tag {
  width: 100%;
}
// 部门信息 表单
.preDepartment {
  width: 100%;
}
</style>


