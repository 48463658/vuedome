<!--
 * @Author: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditTime: 2020-04-03 14:56:35
 * @LastEditors: Gordon
 * @FilePath: \lanplus\src\components\Home.vue
-->

<template>
  <div class="app">
    <el-container class="g_label" direction="horizontal">
      <el-aside :width="isCollapse ? '64px' : '200px'" class="no-scroll">
        <div class="home-box">
          <div class="home-logo">
            <img :src="logo_login" />
          </div>
          <div v-if="!isCollapse" class="home-logo_title">{{apptitle}}</div>
        </div>

        <!-- 菜单导航 -->
        <div class="home-menu">
          <el-menu
            :collapse-transition="false"
            unique-opened
            style="border-right: 0"
            background-color="#062a4b"
            text-color="#909cc0"
            active-text-color="#fff"
            :default-active="activeIndex"
            :active="activeIndex"
            @select="handleMenuSelect"
            router
            :collapse="isCollapse"
          >
            <NavMenu :navMenus="menuData"></NavMenu>
          </el-menu>
        </div>
      </el-aside>

      <el-container direction="vertical">
        <!-- 头部区域 -->
        <el-header :class="isNoBreadcrumb ? 'el-header-vi' : 'el-header-co'">
          <el-row
            type="flex"
            justify="space-between"
            :gutter="20"
            class="header-topbar"
            style="margin: 15px 0 3px 0; padding: 0"
          >
            <el-col :span="1" style="min-width: 42px; width: 42px" align="left">
              <el-button
                :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                @click="setCollapse"
                :class="isNoBreadcrumb ? 'bigIco-but butNoB' : 'bigIco-but butNoA'"
                style="margin:0 0 10px -30px;"
              ></el-button>
            </el-col>
            <el-col :span="21" align="right" style="margin-top: -3px;">
              <!-- <div class="div_inline div_bas0" style="padding: 6px">
                <i class="el-icon-arrow-down"></i>
              </div>-->
              <div class="div_inline div_bas0 divAvatar">
                <!-- <el-avatar
                  slot="reference"
                  :size="38"
                  :class="isNoBreadcrumb ? 'el-avatarB' : 'el-avatarA'"
                  icon="el-icon-user"
                  fit="cover"
                  :src="faceUrl"
                ></el-avatar>-->
                <el-image
                  v-if="faceUrl"
                  style="width:38px;height:38px;border-radius:20px;"
                  :src="faceUrl"
                  fit="cover"
                ></el-image>
                <el-avatar
                  v-else
                  slot="reference"
                  :size="38"
                  :class="isNoBreadcrumb ? 'el-avatarB' : 'el-avatarA'"
                  icon="el-icon-user"
                ></el-avatar>
              </div>
              <div class="div_inline div_bas0">
                <span class="topbar-name">{{isName}}</span>
                <span class="topbar-role" v-if="isCompanyName">({{isCompanyName}})</span>
                <span class="topbar-role" v-if="isAuths">
                  <el-tag
                    v-for="(auth,index) in isAuths"
                    :key="index"
                    :class="tagClass"
                    size="mini"
                    type="danger"
                    style="padding:0 4px; margin-right:1px;"
                  >{{auth.authority_description}}</el-tag>
                </span>
              </div>
              <div class="div_inline div_bas0" style="padding: 6px">
                <el-button
                  size="mini"
                  icon="el-icon-setting"
                  circle
                  class="bigIco-but"
                  :loading="diaLoading"
                  @click="toEdituser()"
                  style="width:24px;height:24px;font-size:22px; padding: 0"
                ></el-button>
              </div>
            </el-col>
            <el-col :span="1" style="min-width: 78px; width: 78px; padding: 0; margin: 2px 0 0 0">
              <el-button
                type="danger"
                @click="logout"
                class="b_logout"
                icon="el-icon-circle-close"
                :loading="diaLoading"
              >退 出</el-button>
            </el-col>
          </el-row>

          <!-- 面包屑导航 -->
          <div v-if="!isNoBreadcrumb" class="home_breadcrumb">
            <Mbreadcrumb></Mbreadcrumb>
          </div>
        </el-header>
        <el-main :class="isNoBreadcrumb ? 'el-main-vi' : 'el-main-co'">
          <router-view></router-view>
        </el-main>

        <!-- 版权区域 -->
        <el-footer :class="isNoBreadcrumb ? 'el-footer-vi' : 'el-footer-co'" height="40px">
          <div class="div_inline">
            <span class="copyright_font">{{this.configGd.copyright}}</span>
          </div>
          <div class="div_inline div_right">
            <span class="font_version">v {{this.configGd.version}}</span>
          </div>
        </el-footer>
      </el-container>
    </el-container>

    <!-- 资料/密码 修改对话框： -->
    <el-dialog
      :close-on-click-modal="false"
      title="密码修改"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="420px"
    >
      <el-form
        v-loading="diaLoading"
        :validate-on-rule-change="false"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row style="margin-bottom: -15px">
          <el-col :span="24">
            <el-form-item label="用户ID" prop="user_id" autocomplete="off" v-show="false">
              <el-input v-model="ruleForm.user_id"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password" class="passFormItem">
              <input
                name="a"
                type="password"
                placeholder="新密码"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                show-password
                size="small"
                placeholder="请输入新密码"
                v-model="ruleForm.password"
                :maxlength="24"
                autocomplete="new-passowrd"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="check_password" class="passFormItem">
              <input
                name="a"
                type="check_password"
                placeholder="确认密码"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                show-password
                size="small"
                placeholder="请输入确认密码"
                v-model="ruleForm.check_password"
                :maxlength="24"
                autocomplete="new-passowrd"
                style="width:200px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <el-form-item style="padding-left: 5px; margin: -10px 0 5px 0">
          <el-button
            ref="submitBut"
            type="primary"
            @click="insert('ruleForm')"
            size="small"
            icon="el-icon-circle-check"
            :loading="diaLoading"
          >保存修改</el-button>
          <el-button @click="resetForm('ruleForm')" size="small" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import menu from './menu.json'
import NavMenu from './NavMenu.vue'
import Mbreadcrumb from './Mbreadcrumb.vue'

import store from '../store/store.js'

// var data = menu
export default {
  components: {
    NavMenu: NavMenu,
    Mbreadcrumb: Mbreadcrumb
  },
  data() {
    return {
      activeIndex: '设备管理',
      menuData: [],
      isCollapse: false, // 导航菜单折叠
      breads: [],
      isName: '',
      user_id: 0,
      isRouteName: '',
      isAuths: '',
      isCompanyName: '',
      isNoBreadcrumb: false,
      faceUrl: '', // 头像

      dialogVisible: false, // 资料/密码 修改对话框
      diaLoading: false,
      // 添加或修改的用户输入数据：
      ruleForm: {
        user_id: 0,
        password: '',
        check_password: ''
      },
      // 用户提交数据检验：
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' }
        ],
        check_password: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          {
            min: 6,
            max: 24,
            message: '长度在 6 到 24 个字符',
            trigger: 'blur'
          },
          {
            required: true,
            trigger: 'blur',
            validator: this.checkPassword
          }
        ]
      }
    }
  },
  computed: {
    tagClass() {
      if (this.isNoBreadcrumb) {
        return 'tagClassB'
      }
      return 'tagClassA'
    },
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
    if (this.configGd.enterCheck(this)) {
      this.isName = this.$Storage.localGet('username')
      let userInfo = this.$Storage.localGet('userInfo')
      this.user_id = userInfo.user_id
      this.isCompanyName = userInfo.company_name
      this.faceUrl = userInfo.base64_img
      this.ruleForm.user_id = this.user_id
      this.isAuths = this.$Storage.localGet('auths')
    }
  },
  mounted() {
    // this.menuData = menu
    this.menuData = JSON.parse(JSON.stringify(menu))
    this.menuList(this.menuData)

    if (this.configGd.isLoginInt && !this.configGd.isAdmin) {
      this.$router.push(
        '/vidpvideopreview',
        () => {},
        e => {
          console.log('输出报错', e)
        }
      )
    }
    this.configGd.isLoginInt = false
    this.$Storage.localSet('isLoginInt', false)

    this.isRouteName = this.$route.path
    this.changeTabActive()
  },
  destroyed() {
    // this.isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'))
    // this.userMessage = JSON.parse(sessionStorage.getItem('userMessage'))
  },
  methods: {
    // 检索菜单项
    menuList(_menuList) {
      if (!this.configGd.isAdmin) {
        for (let i = 0; i < _menuList.length; i++) {
          if (_menuList[i].entity.isAdmin) {
            _menuList.splice(i, 1)
            i--
          } else {
            if (!this.configGd.Auth.write && _menuList[i].entity.isWrite) {
              _menuList[i].entity.disabled = true
            } else if (_menuList[i].childs) {
              this.menuList(_menuList[i].childs)
            }
          }
        }
      }
    },

    logout() {
      this.udShowStyle(true)
      this.$http
        .get('/api' + '/user/signOut')
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '您已成功退出！',
              type: 'success'
            })
            this.udShowStyle(false)
          } else {
            this.urResponseErr('退出失败：' + res.data.message)
          }
          this.configGd.clearLogin(this)
          this.$router.push(
            '/login',
            () => {},
            e => {
              console.log('输出报错', e)
            }
          )
        })
        .catch(err => {
          this.urResponseErr('退出失败：' + err)
          this.configGd.clearLogin(this)
        })
    },
    isapi() {
      this.$router.push('/api')
    },

    triggermain(url) {
      this.$router.push(url)
      // 点击切换的时候跳转.自动刷新
      // this.$router.go(0)
    },
    enter() {
      this.isMoust = true
    },
    leave() {
      this.isMoust = false
    },
    handleMenuSelect(index, indexPath) {
      this.breads = indexPath
      this.activeIndex = index
    },
    // 监听路由切换：
    changeTabActive() {
      this.isRouteName = this.$route.path
      this.isNoBreadcrumb = this.$route.path === '/vidpvideopreview'
      var myRouteTitle = ''
      if (this.$route.meta) {
        myRouteTitle = this.$route.meta[this.$route.meta.length - 1].name
      }
      if (myRouteTitle && this.activeIndex !== myRouteTitle) {
        this.activeIndex = myRouteTitle
      }
    },

    // 提交返回失败的处理：
    urResponseErr(_errmsg) {
      this.udShowStyle(false)
      this.$message.error(_errmsg)
    },
    // 提交开始或结束
    udShowStyle(_start) {
      this.diaLoading = _start
    },

    // 菜单折叠与展开：
    setCollapse() {
      this.isCollapse = !this.isCollapse
    },

    // 打开修改密码对话框：
    toEdituser(scope) {
      this.ruleForm.password = ''
      this.ruleForm.check_password = ''
      this.dialogVisible = true
    },
    // 重置表单：
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.password = ''
      this.ruleForm.check_password = ''
    },
    // 提交保存 资料/密码 修改
    insert(formName) {
      // var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          const formData = new FormData()
          formData.append('user_id', this.ruleForm.user_id)
          formData.append('password', this.ruleForm.password)
          this.udShowStyle(true)
          this.$http
            .post('/api' + '/user/update', formData, config)
            .then(res => {
              if (res) {
                if (res.data.code === 0) {
                  this.dialogVisible = false
                  this.$message({
                    message: '修改密码成功！',
                    type: 'success'
                  })
                  this.udShowStyle(false)
                } else {
                  this.urResponseErr('修改密码失败：' + res.data.message)
                }
              } else {
                this.urResponseErr('修改密码失败！')
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
              this.urResponseErr('修改密码失败:' + err)
            })
        } else {
          return false
        }
      })
    },

    checkPassword(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入新密码'))
      }
      if (this.ruleForm.password !== this.ruleForm.check_password) {
        // 重点重点，下面就是填写提示的文字
        callback(new Error('确认密码 与 新密码 不一致'))
      } else {
        callback()
      }
    }
  },
  watch: {
    $route: 'changeTabActive'
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  width: 200px; //0.45rem
  background: #062a4b; // #0d3962
}
.el-main {
  min-width: 0;
  background-color: #eaedf2;
}
.el-main-co {
  background-color: #eaedf2;
  padding: 5px 20px 2px 20px;
  min-height: calc(100vh - 138px); //138px
}
.el-main-vi {
  background-color: #01101e;
  padding: 0;
  min-height: calc(100vh - 105px); //105px
}

.divAvatar {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-avatar > img {
  display: block;
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.el-header {
  min-width: 0;
  height: 98px;
}
.el-header-co {
  height: 98px !important;
  background-image: url('../assets/img/topbarbg_co.png');
}
.el-header-vi {
  height: 65px !important;
  background-image: url('../assets/img/topbarbg_vi.png');
}

.el-footer {
  min-width: 0;
  background-color: #fff;
  height: 40px;
  font-size: 13px;
  padding: 8px 0px 0px 16px;
}
.el-footer-co {
  background-color: #fff;
}
.el-footer-vi {
  background-color: #031c35;
}

.b_logout {
  width: 76px;
  height: 32px;
  float: right;
  margin: -2px 0 0 0;
  padding: 0px 1px 0px 0px;
}
.home-box {
  width: 100%; //0.45rem
  height: 98px; //0.45rem
  background-image: url('../assets/img/logobg.png');
  .home-logo {
    // width: 200px;
    height: 48px;
    text-align: center;
    padding-top: 11px;
    img {
      width: 48px;
      height: 48px;
    }
  }
  .home-logo_title {
    // width: 200px; //0.45rem
    color: #fff;
    font-size: 18px;
    font-weight: 900px;
    text-align: center;
    padding-top: 4px;
  }
}
.home-menu {
  width: 200px;
}

.header-topbar {
  height: 60px;
  margin-left: 0px;
  margin-top: 17px;
  .topbar-face {
    margin-bottom: 10px;
  }
  .topbar-name {
    color: #3c4e86;
    margin-left: 6px;
    font-size: 17px;
    font-weight: 600;
  }
  .topbar-role {
    color: #3c4e86;
    margin-left: 5px;
    font-size: 14px;
  }
}
// 面包屑导航
.home_breadcrumb {
  height: 38px;
  margin-left: 0px; //2.25rem
  margin-top: -4px;
}

.el-avatar {
  font-size: 20px;
}
.el-avatarA {
  color: #e0eff8;
  background: #8a9fbd;
}
.el-avatarB {
  color: #648eae;
  background: #0a2f50;
}

.tagClassA {
  color: #f56c6c;
  background-color: #fef0f0;
  border-color: #f4dbdc;
}
.tagClassB {
  color: #52636d;
  background-color: #041f37;
  border-color: #053256;
}

.el-menu {
  border-right: 0 !important;
}
</style>
