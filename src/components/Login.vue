<template>
  <div class="login" id="login-page">
    <el-card class="box-card">
      <div class="card-title" slot="header">
        <i class="el-icon-d-arrow-right"></i>
        <span>用户登录</span>
      </div>
      <el-form :model="model" label-width="80px" class="login-form"
          @keydown.enter.native.prevent="login()">
        <el-form-item label="用户名">
          <el-input v-model="model.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input type="text" v-model="model.captcha" auto-complete="off">
            <img slot="append" :src="captchaSrc" @click="reloadCaptcha">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button ref="btnLogin" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { fetchApi } from '@/api'
import { apiUrl } from '@/../config'

export default {
  data () {
    return {
      captchaKey: Date.now(),
      model: {
        account: 'admin',
        password: 'admin',
        captcha: ''
      }
    }
  },

  created () {
    this.checkLogin()
  },

  mounted () {
    // 页面加载时 自动focus登录按钮 用户可直接enter登录
    this.$refs.btnLogin.$el.focus()
  },

  computed: {
    captchaSrc () {
      return `${apiUrl}/captcha?key=${this.captchaKey}`
    }
  },

  methods: {
    reloadCaptcha () {
      this.captchaKey = Date.now()
      this.model.captcha = ''
    },
    checkLogin () {
      // 如果用户已登录 则跳转进入管理面板
      fetchApi('/ap/session')
        .then(({ user }) => {
          if (user) {
            this.$router.push({ name: 'Home' })
          }
        })
    },

    login () {
      let { captchaKey } = this
      fetchApi('/ap/login', {
        method: 'POST',
        body: JSON.stringify({
          ...this.model, captchaKey
        })
      })
      .then(() => {
        this.$router.push({ name: 'Home' })
      })
      .catch(err => {
        this.$notify({
          title: '登录失败',
          message: `${err}`,
          type: 'error'
        })
        this.reloadCaptcha()
      })
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
  img {
    display: block;
    cursor: pointer;
    height: 36px;
    margin: -2px -10px;
  }
}
</style>
