<!--
 * @Author: Gordon
 * @Date: 2020-03-11 10:26:01
 * @LastEditTime: 2020-04-10 17:47:33
 * @LastEditors: Gordon
-->
<script>
import store from '../store/store.js'

const version = '0.1.28.052901'
const wshost = 'ws://localhost:8086'

const apptitle = '人脸测温云系统'
const favicon = 'favicon.ico'
// eslint-disable-next-line camelcase
const logo_login = './logo_login.png'
// eslint-disable-next-line camelcase
// var logo_home = './logo_home.png'
const copyright = '蓝普金睛(北京)科技有限公司'

var isLoginInt = false // 是否刚刚登录成功
var companyName = '' // 所属公司名称
var isAdmin = false // 是否是内部管理员
var Auth = { read: true, write: false, del: false }
var limit = [35, 37.3] // 体温异常阈值

var passKey = 'drinking' // 通过判断主体：'drinking' or 'pass'
var noMask = false // 是否显示口罩佩戴情况
var drinking = true // 是否酒检情况
var drinkingUnit = 'mg/ml' // 酒检单位

function toLogin(_this) {
  _this.$router.push('/api')
}
// 进入页面验证
function enterCheck(_this) {
  _this.configGd.setComVI(_this, _this.$Storage.localGet('comVI'))
  if (_this.$Storage.localGet('token') && _this.$Storage.localGet('username')) {
    _this.configGd.isAdmin = _this.$Storage.localGet('isAdmin')
    _this.configGd.Auth = _this.$Storage.localGet('Auth')
    _this.configGd.isLoginInt = _this.$Storage.localGet('isLoginInt')
    _this.configGd.companyName = _this.$Storage.localGet('companyName')
    console.log('enterCheck _this.configGd.Auth:', _this.configGd.Auth)
    return true
  } else {
    clearLogin(_this)
    return false
  }
}
// 登录写入缓存
function saveLogin(_this, _data) {
  _this.configGd.clearLogin(_this, true)

  _this.configGd.isLoginInt = true
  _this.$Storage.localSet('isLoginInt', true)
  _this.$Storage.localSet('loginData', _data)
  _this.$Storage.localSet('username', _this.loginForm.username)
  _this.$Storage.localSet('auths', _data.auths)
  _this.$Storage.localSet('userInfo', _data.userInfo)
  _this.$Storage.localSet('companyName', _data.userInfo.company_name)

  _this.configGd.companyName = _data.userInfo.company_name

  // _this.$Storage.localSet('auth_id', 0)
  // _this.$Storage.localSet('authority_name', '')
  // _this.$Storage.localSet('authority_description', '')
  _this.configGd.Auth = { read: false, write: false, del: false }
  _this.configGd.isAdmin = false
  if (_data.auths) {
    for (let i = 0; i < _data.auths.length; i++) {
      if (_data.auths[i].authority_name === 'ROLE_ADMIN') {
        _this.configGd.Auth = { read: true, write: true, del: true }
        _this.configGd.isAdmin = true
      } else if (_data.auths[i].authority_name === 'ROLE_READ') {
        _this.configGd.Auth.read = true
      } else if (_data.auths[i].authority_name === 'ROLE_WRITE') {
        _this.configGd.Auth.write = true
      } else if (_data.auths[i].authority_name === 'ROLE_DEL') {
        _this.configGd.Auth.del = true
      }
    }
    if (!_this.configGd.isAdmin) {
      if (!_this.configGd.Auth.read) {
        _this.configGd.Auth.write = false
      }
    }
    _this.$Storage.localSet('Auth', _this.configGd.Auth)
    _this.$Storage.localSet('isAdmin', _this.configGd.isAdmin)
    console.log('saveLogin _this.configGd.Auth:', _this.configGd.Auth)
  }
}
// 写入企业定制数据
function saveComVI(_this, _data) {
  if (_data) {
    _this.$Storage.localSet('comVI', _data)
    _this.configGd.setComVI(_this, _data)
  }
}
// 网站LOGO与标题
function setComVI(_this, _data) {
  if (!_data) {
    return
  }
  if (_data) {
    store.commit('setComVI', _data)
  }
  var myfavicon = _data.ico
  if (!myfavicon) {
    myfavicon = _this.configGd.favicon
  }
  if (myfavicon) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = myfavicon
    document.getElementsByTagName('head')[0].appendChild(link)
  }
}
function getApptitle(_this) {
  return _this.configGd.apptitle
}
// 注销清除缓存
function clearLogin(_this, _notoken) {
  if (!_notoken) {
    _this.$Storage.localRemove('token')
  }
  _this.$Storage.localRemove('username')
  _this.$Storage.localRemove('companyName')
  // _this.$Storage.localRemove('auth_id')
  // _this.$Storage.localRemove('authority_description')
  // _this.$Storage.localRemove('authority_name')
  _this.$Storage.localRemove('auths')
  _this.$Storage.localRemove('userInfo')
  _this.$Storage.localRemove('loginData')
  _this.$Storage.localRemove('selId')
  _this.$Storage.localRemove('selNames')
  _this.$Storage.localRemove('page')
  _this.$Storage.localRemove('Scope')
}

export default {
  apptitle,
  favicon,
  logo_login,
  // logo_home,
  copyright,
  limit,
  passKey,
  noMask,
  drinking,
  drinkingUnit,
  version,
  wshost,
  toLogin,
  enterCheck,
  saveLogin,
  saveComVI,
  clearLogin,
  isAdmin,
  companyName,
  Auth,
  setComVI,
  isLoginInt,
  getApptitle
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// eslint-disable-next-line no-extend-native
Array.prototype.contains = function(obj) {
  var i = this.length
  while (i--) {
    if (this[i] === obj) {
      return i // 返回的这个 i 就是元素的索引下标，
    }
  }
  return false
}
</script>
