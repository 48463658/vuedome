<!--
 * @Description: 设备配置
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-09 14:37:17
 -->

<template>
  <div>
    <el-card class="g_label" v-loading="diaLoading">
      <div style="padding: 0 15px 0 15px">
        <el-tabs v-model="activeName" style="min-height:380px; height:380px;">
          <el-tab-pane label="体温阀值配置" name="first" class="g-tab-pane">
            <div class="div_content div_top" style="margin-top: 10px">
              <span class="span_left">最低温:</span>
              <el-input-number
                size="small"
                v-model="lt"
                :precision="1"
                :step="0.1"
                :max="36"
                :min="30"
                :disabled="!configGd.Auth.write"
              ></el-input-number>
            </div>
            <div class="div_content div_button">
              <span class="span_left">最高温:</span>
              <el-input-number
                size="small"
                v-model="gt"
                :precision="1"
                :step="0.1"
                :max="40"
                :min="36"
                :disabled="!configGd.Auth.write"
              ></el-input-number>
            </div>
          </el-tab-pane>
          <el-tab-pane label="酒精检测阀值配置" name="alcoho" class="g-tab-pane">
            <div class="div_content div_top" style="margin-top: 10px">
              <span class="span_left">饮酒含量:</span>
              <el-input-number
                size="small"
                v-model="alcoho_gt"
                :precision="1"
                :step="1"
                :max="900"
                :min="0"
                :disabled="!configGd.Auth.write"
                style="margin-right: 5px;"
              ></el-input-number> mg/100ML
            </div>
            <div class="div_content div_button" style="margin-top: 10px">
              <span class="span_left">醉酒含量:</span>
              <el-input-number
                size="small"
                v-model="alcoho_lt"
                :precision="1"
                :step="1"
                :max="900"
                :min="0"
                :disabled="!configGd.Auth.write"
                style="margin-right: 5px;"
              ></el-input-number> mg/100ML
            </div>
          </el-tab-pane>
          <el-tab-pane label="警告提醒配置" name="second" class="g-tab-pane">
            <el-row
              v-for="(oitem,index) in OPsecondAlerm"
              :key="index"
              type="flex"
              :gutter="20"
              class="oneRow"
            >
              <el-col
                :span="1"
                class="card-title-s"
                style="min-width: 140px;"
                align="right"
              >{{OPsecondAlermLable[index].label}}</el-col>
              <el-col :span="1" class="card-title-s" style="min-width: 100px;" align="left">
                <el-switch
                  v-model="oitem.type"
                  :active-value="true"
                  :inactive-value="false"
                  :disabled="!configGd.Auth.write"
                ></el-switch>
              </el-col>
              <el-col :span="20" class="card-title-s" style="min-width: 100px;" align="left">
                <el-checkbox v-model="oitem.email">邮件</el-checkbox>
                <el-checkbox v-model="oitem.sms">手机短信</el-checkbox>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" class="oneRow" style="margin-top: 30px">
              <el-col
                :span="1"
                class="card-title-s"
                style="min-width: 140px;"
                align="right"
              >接收报警手机号码</el-col>
              <el-col :span="20" align="left">
                <el-tag
                  v-for="(phone,index) in OPsecondTel"
                  :key="index"
                  :closable="configGd.Auth.write"
                  size="small"
                  @close="delPhone(phone,index)"
                  style="margin: -0 3px 0 0; color: #666666;"
                  :disabled="!configGd.Auth.write"
                >{{phone}}</el-tag>
                <el-row type="flex" :gutter="20" class="oneRow" style="margin-top: 0px">
                  <el-col :span="10" align="left" style="min-width: 205px; width: 205px">
                    <el-input
                      placeholder="请输入手机号码"
                      v-model="OPsecondInputTel"
                      size="small"
                      @input="inputPhone"
                      @change="changePhone"
                      maxlength="11"
                      show-word-limit
                      clearable
                      prefix-icon="el-icon-mobile-phone"
                      style="min-width: 200px;"
                      :disabled="!configGd.Auth.write"
                    ></el-input>
                    <el-alert
                      ref="alert"
                      :closable="false"
                      :title="inputPhoneMsg"
                      type="error"
                      v-show="inputPhoneMsg"
                      style="padding: 3px 3px 0px 0; background: #FFFFFF !important; margin-bottom: -22px"
                    ></el-alert>
                  </el-col>
                  <el-col :span="20" align="left">
                    <el-button
                      @click="addPhoneHar"
                      type="primary"
                      size="small"
                      plain
                      icon="el-icon-circle-plus-outline"
                      :disabled="!configGd.Auth.write"
                    >添加</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" class="oneRow" style="margin-top: 2px">
              <el-col
                :span="1"
                class="card-title-s"
                style="min-width: 140px;"
                align="right"
              >接收报警邮箱地址</el-col>
              <el-col :span="20" align="left">
                <el-tag
                  v-for="(email,index) in OPsecondEmail"
                  :key="index"
                  :closable="configGd.Auth.write"
                  size="small"
                  @close="delEmail(email,index)"
                  style="margin: -0 3px 0 0; color: #666666;"
                  :disabled="!configGd.Auth.write"
                >{{email}}</el-tag>
                <el-row type="flex" :gutter="20" class="oneRow" style="margin-top: 0px">
                  <el-col :span="10" align="left" style="min-width: 205px; width: 205px">
                    <el-input
                      placeholder="请输入邮箱地址"
                      v-model="OPsecondInputEmail"
                      size="small"
                      @input="inputEmail"
                      @change="changeEmail"
                      clearable
                      prefix-icon="el-icon-message"
                      style="min-width: 200px;"
                      :disabled="!configGd.Auth.write"
                    ></el-input>
                    <el-alert
                      ref="alert"
                      :closable="false"
                      :title="inputEmailMsg"
                      type="error"
                      v-show="inputEmailMsg"
                      style="padding: 3px 3px 0px 0; background: #FFFFFF !important; margin-bottom: -22px"
                    ></el-alert>
                  </el-col>
                  <el-col :span="20" align="left">
                    <el-button
                      @click="addEmailHar"
                      type="primary"
                      size="small"
                      plain
                      icon="el-icon-circle-plus-outline"
                      :disabled="!configGd.Auth.write"
                    >添加</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-row justify="space-between" type="flex" :gutter="20" class="twoRow">
        <el-col :span="24">
          <el-divider></el-divider>
          <div class="div_content div-bottom-button div_right">
            <!-- 保存按钮 -->
            <el-button
              @click="setLimit"
              class="el-button_co"
              type="primary"
              icon="el-icon-circle-check"
              :loading="diaLoading"
              :disabled="!configGd.Auth.write"
              style="width:98px;"
            >保存配置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      diaLoading: false,
      activeName: 'first',

      OPsecondTel: ['13988572581', '18666666666', '1987525874'],
      OPsecondEmail: ['afeaef@163.com', 'awefaf@qq.com', 'qweras@live.com'],
      OPsecondInputTel: '',
      OPsecondInputEmail: '',
      inputPhoneMsg: '',
      inputEmailMsg: '',

      warnId: 0,
      companyName: '蓝普金睛', // 当前配置公司名
      OPsecondAlermLable: [
        {
          name: 'unusual',
          label: '体温异常'
        },
        {
          name: 'noMask',
          label: '未戴口罩'
        },
        {
          name: 'stranger',
          label: '陌生人'
        }
      ],
      OPsecondAlerm: [
        {
          email: false,
          sms: true,
          type: true
        },
        {
          email: false,
          sms: true,
          type: false
        },
        {
          email: false,
          sms: true,
          type: true
        }
      ],

      gt: 0, // 最高温(double)
      lt: 0, // 最低温(double)
      alcoho_gt: 10, // 酒精检测阀值 20
      alcoho_lt: 70 // 酒精检测阀值 80
    }
  },
  created() {
    // console.log(new Date().format("yyyy-MM-dd hh:mm:ss"))
    // console.log(this.seekTime)
    this.getLimit()
    // this.getAuth()
  },
  computed: {},
  methods: {
    // 获取体温阀值配置：
    getLimit() {
      this.udShowStyle(true)
      this.$http
        .get('/api' + '/device/find/limit')
        .then(res => {
          if (res.data && res.data.code === 0 && res.data.data) {
            this.configGd.limit = [res.data.data.lt, res.data.data.gt]
            this.lt = res.data.data.lt
            this.gt = res.data.data.gt
            this.udShowStyle(false)
            this.getAlcohol()
          } else {
            this.urResponseErr('获取体温报警阀值失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取体温报警阀值失败：' + err)
        })
    },
    /** 获取酒精报警阀值配置 */
    getAlcohol() {
      this.udShowStyle(true)
      this.$http
        .get('/api' + '/device/find/alcohol/limit')
        .then(res => {
          if (res.data && res.data.code === 0 && res.data.data) {
            this.configGd.limit = [res.data.data.lt, res.data.data.gt]
            this.alcoho_gt = res.data.data.gt
            this.alcoho_lt = res.data.data.lt
            this.udShowStyle(false)
            this.getAuth()
          } else {
            this.urResponseErr('获取酒精报警阀值失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取酒精报警阀值失败：' + err)
        })
    },

    // 获取警告提醒配置：
    getAuth() {
      this.udShowStyle(true)
      this.$http
        .get('/api' + '/device/get/config')
        .then(res => {
          if (res.data && res.data.code === 0) {
            if (res.data.data && res.data.data.data) {
              this.warnId = res.data.data.warnId
              this.companyName = res.data.data.companyName
              this.OPsecondAlerm = res.data.data.data.alarm
              console.log('this.warnId:', this.warnId, this.companyName)
              console.log('res.data.data.data:', res.data.data.data)
              console.log('this.OPsecondAlerm:', this.OPsecondAlerm)
              this.OPsecondTel = res.data.data.data.tel
              this.OPsecondEmail = res.data.data.data.email
            } else {
              this.warnId = 0
              this.companyName = this.$Storage.localGet('companyName')
            }
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取警告提醒配置失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取警告提醒配置失败：' + err)
        })
    },

    // 体温阀值配置修改提交：
    setLimit() {
      this.udShowStyle(true)
      this.$http
        .get('/api' + '/device/set/limit' + '?lt=' + this.lt + '&gt=' + this.gt)
        .then(res => {
          console.log('res.data:', res.data)
          if (res.data && res.data.code === 0) {
            this.$message({
              message: '保存体温报警阀值成功',
              type: 'success'
            })
            this.udShowStyle(false)
            this.setAlcohol()
          } else {
            this.urResponseErr('保存体温报警阀值失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('保存体温报警阀值失败：' + err)
        })
    },

    /** 酒精阀值配置修改提交 */
    setAlcohol() {
      this.udShowStyle(true)
      this.$http
        .get('/api' + '/device/set/alcohol/limit' + '?lt=' + this.alcoho_lt + '&gt=' + this.alcoho_gt)
        .then(res => {
          console.log('res.data:', res.data)
          if (res.data && res.data.code === 0) {
            this.$message({
              message: '保存酒精报警阀值成功',
              type: 'success'
            })
            this.udShowStyle(false)
            this.setAuth()
          } else {
            this.urResponseErr('保存酒精报警阀值失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('保存酒精报警阀值失败：' + err)
        })
    },

    // 警告提醒配置修改提交：
    setAuth() {
      this.udShowStyle(true)
      let myData = {
        companyName: this.companyName,
        data: {
          alarm: this.OPsecondAlerm,
          tel: this.OPsecondTel,
          email: this.OPsecondEmail
        }
      }
      if (this.warnId > 0) {
        myData.warnId = this.warnId
      }
      // if (this.warnId > 0) {
      this.$http
        .post('/api' + '/device/set/config', myData)
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: '保存警告提醒配置成功',
              type: 'success'
            })
            this.udShowStyle(false)
            this.getLimit()
          } else {
            this.urResponseErr('保存警告提醒配置失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('保存警告提醒配置失败：' + err)
        })
      // }
    },

    // 添加报警手机号码-按钮点击
    addPhoneHar() {
      if (this.inputPhoneMsg) {
        return
      }
      if (
        this.OPsecondInputTel &&
        this.OPsecondTel.indexOf(this.OPsecondInputTel) === -1
      ) {
        this.OPsecondTel.push(this.OPsecondInputTel)
        this.OPsecondInputTel = ''
      }
    },
    // 添加报警手机号码-按钮点击
    addEmailHar() {
      if (this.inputEmailMsg) {
        return
      }
      if (
        this.OPsecondInputEmail &&
        this.OPsecondEmail.indexOf(this.OPsecondInputEmail) === -1
      ) {
        this.OPsecondEmail.push(this.OPsecondInputEmail)
        this.OPsecondInputEmail = ''
      }
    },

    // // 选项卡切换
    // handleClick(tab, event) {
    //   console.log('handleClick:', tab, event)
    // },

    // 移除报警手机号码
    delPhone(phone, index) {
      console.log('delPhone:', phone, index)
      this.OPsecondTel.splice(this.OPsecondTel.indexOf(phone), 1)
    },
    // 移除报警手机号码
    delEmail(email, index) {
      console.log('delEmail:', email, index)
      this.OPsecondEmail.splice(this.OPsecondEmail.indexOf(email), 1)
    },

    // 手机号码输入检验
    inputPhone(value) {
      console.log('inputPhone value:', value)
      if (value) {
        this.OPsecondInputTel = '' + parseInt(this.OPsecondInputTel)
      }
      if (this.OPsecondInputTel === 'NaN') {
        this.OPsecondInputTel = ''
      }
      this.inputPhoneMsg = ''
    },
    // 手机号码输入验证
    changePhone(value) {
      if (value) {
        var partten = /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i
        if (partten.test(value)) {
        } else {
          this.inputPhoneMsg = '请输入正确的手机号码'
        }
      } else {
        this.inputPhoneMsg = ''
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

    // 手机号码输入检验
    inputEmail(value) {
      console.log('inputEmail value:', value)
    },
    // 手机号码输入验证
    changeEmail(value) {
      if (value) {
        // eslint-disable-next-line no-useless-escape
        var partten = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if (partten.test(value)) {
        } else {
          this.inputEmailMsg = '请输入有效的电子邮箱'
        }
      } else {
        this.inputEmailMsg = ''
      }
    }
  }
}
</script>
<style lang="less">
.g-tab-pane {
  padding: 10px 0 10px 0;
}
</style>
