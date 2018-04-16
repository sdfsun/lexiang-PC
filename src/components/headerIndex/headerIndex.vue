<template>
    <el-header height="80px" class="header">
        <el-row>
            <el-col :span="4" :offset="2" class="logo-box">
                <img src="../../assets/logo.png" class="logo-img" alt="logo" />
            </el-col>
            <slot>
            </slot>
        </el-row>
    </el-header>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
@import url('../../common/less/variable.less');
// 顶部栏
.header {
  background-color: #f1f5f8;
}
.el-header div {
  height: 80px;
}
.logo-box {
}
.logo-img {
  width: 100%;
  height: 100%;
  background-size: contain;
}
</style>
