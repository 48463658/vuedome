<template>
  <div class="login_container">
    <div class="login_bar">
      <div class="login_logo">
        <img :src="logo_login" />
      </div>
      <div class="login_title">{{apptitle}}</div>
      <div class="login_form">
        <div class="login_form_div login_form_header">请登录</div>
        <div class="login_form_div login_form_username">
          <el-input
            clearable
            v-model="loginForm.username"
            :prefix-icon="loginForm.username ? 'gdiconyonghu':'gdiconyonghu-xianxing'"
            placeholder="请输入用户名"
            @keyup.enter.native="login"
            size="small"
          ></el-input>
        </div>
        <div class="login_form_div login_form_password">
          <el-input
            clearable
            v-model="loginForm.password"
            :prefix-icon="loginForm.password ? 'gdiconlock_fill' :'gdiconlock'"
            @keyup.enter.native="login"
            placeholder="请输入密码"
            type="password"
            size="small"
            show-password
          ></el-input>
        </div>
        <div class="login_form_button_div">
          <el-button
            type="primary"
            round
            class="login_form_button"
            @click="login"
            :loading="diaLoading"
          >{{butTitle}}</el-button>
        </div>
      </div>
      <div class="copyright">
        {{this.configGd.copyright}}
        <p class="font_version">v {{this.configGd.version}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store/store.js'

export default {
  data() {
    return {
      butTitle: '登 录',
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      diaLoading: false, // 是否正在登录
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      screenHeight: document.body.clientTop
    }
  },
  computed: {
    logo_login() {
      if (store.state.comVI.logo) {
        return store.state.comVI.logo
      } else {
        return this.configGd.logo_login
      }
    },
    apptitle() {
      if (store.state.comVI.title) {
        return store.state.comVI.title
      } else {
        return this.configGd.apptitle
      }
    }
  },
  created() {
    this.configGd.enterCheck(this)
    let id = this.$route.query.id
    if (id) {
      this.getComVI(true, id)
    }
  },
  mounted() {},
  methods: {
    login() {
      this.$Storage.localRemove('loginData')
      if (!this.loginForm.username || this.loginForm.username.length === 0) {
        this.$message({
          message: '请输入用户名',
          type: 'warning'
        })
        return
      }
      if (!this.loginForm.password || this.loginForm.password.length === 0) {
        this.$message({
          message: '请输入密码',
          type: 'warning'
        })
        return
      }
      this.udShowStyle(true)
      this.$http
        .post('/api' + '/user/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            this.configGd.saveLogin(this, res.data.data)
            this.udShowStyle(false)
            if (!this.configGd.Auth.read) {
              this.urResponseErr('很抱歉！您没有进入系统的权限或已被冻结，请联系管理员。')
            } else {
              this.getComVI()
              // this.$router.push('/home')
            }
          } else {
            this.urResponseErr('登录失败：' + res.data.message)
          }
        })
        .catch(err => {
          this.urResponseErr('登录失败：' + err)
        })
    },
    // 获取所属企业资料
    getComVI(_noEnter, _comName) {
      let comName = this.configGd.companyName
      if (_comName) {
        comName = _comName
      }
      var apiUrl =
        '/api' +
        '/company/find/list' +
        '?page=1&pageSize=1' +
        '&company_name=' + comName
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data && res.data.data.list) {
            let comVI = {
              company_id: res.data.data.list[0].company_id,
              company_name: res.data.data.list[0].company_name,
              ico: res.data.data.list[0].ico,
              logo: res.data.data.list[0].logo,
              title: res.data.data.list[0].title
            }
            this.configGd.saveComVI(this, comVI)
            if (!_noEnter) {
              this.udShowStyle(false)
              this.$router.push('/home')
            }
          } else {
            this.urResponseErr('获取企业信息失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取企业列表失败：' + err)
        })
    },
    // 提交返回失败的处理：
    urResponseErr(_errmsg) {
      this.udShowStyle(false)
      this.$message.error(_errmsg)
    },
    // 提交开始或结束
    udShowStyle(_start) {
      this.diaLoading = _start
      if (_start) {
        this.butTitle = ''
      } else {
        this.butTitle = '登 录'
      }
    }
  },
  watch: {
    screenHeight(val) {
      this.screenHeight = val
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: url('../assets/img/background.jpg') no-repeat center center;
}
.login_bar {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 702px;
  height: 502px;
  background-image: url('../assets/img/login_bar.png');
  .login_logo {
    width: 100%;
    height: 100px;
    text-align: center;
    margin-top: 33px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .login_title {
    color: #fff;
    text-align: center;
    font-size: 25px;
    margin-top: 15px;
  }
  .login_form {
    position: absolute;
    left: 50%;
    top: 56.5%;
    transform: translate(-50%, -50%);
    width: 264px;
    height: 260px;
    .login_form_header {
      font-size: 17px;
      font-weight: 600;
      color: #c8cfe5;
      text-align: center;
      padding-top: 63px;
    }
    .login_form_div {
      width: 95%;
      margin: 0 auto;
    }
    .login_form_username {
      padding-top: 30px;
    }
    .login_form_password {
      padding-top: 20px;
    }
    .login_form_button_div {
      margin: 0 auto;
      width: 100%;
      padding-top: 30px;
    }
    .login_form_button {
      width: 100%;
      font-size: 17px;
      font-weight: 600;
      line-height: 19px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.28), 0 0 6px rgba(0, 0, 0, 0.06);
    }
  }
  .copyright {
    width: 100%;
    text-align: center;
    color: #909cc3;
    height: 40px;
    font-size: 13px;
    margin-top: 300px;
  }
  .font_version {
    color: #596aa6;
    font-size: 11px;
  }
}
/* 更改element-UI按钮样式 */
.el-button--primary {
  color: #dddddd;
  background-color: #0048ff;
  border-color: #0048ff;
}
.el-button--primary:hover {
  color: #ffffff;
  background-color: #2a68ff;
  border-color: #2a68ff;
}
.el-button--primary:focus {
  color: #ffffff;
  background-color: #2a68ff;
  border-color: #2a68ff;
}
</style>
