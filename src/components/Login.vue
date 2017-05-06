<template>
  <div class="login" id="login-page">
    <el-card class="box-card">
      <div class="card-title" slot="header">
        <i class="el-icon-d-arrow-right"></i>
        <span>用户登录</span>
      </div>
      <el-form :model="model" label-width="80px" class="login-form">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style>
.login-form .el-form-item__content {
  margin-left: 90px !important;
}
</style>

<style lang="scss" scoped>
.login {
  padding-top: 80px;
  display:flex;
  justify-content: center;
}

.box-card {
  width: 440px;
}
.login-form {
  margin-bottom: -22px;
  padding-right: 10px;
}
</style>
