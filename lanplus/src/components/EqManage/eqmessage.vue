<template>
  <div>
    <el-card class="g_label" v-loading="diaLoading">
      <el-row justify="space-between" type="flex" :gutter="20" class="oneRow">
        <el-col :span="24">
          <div v-if="this.configGd.isAdmin" class="div_inline">
            所属企业:
            <el-select
              v-model="companyName"
              clearable
              size="small"
              @change="getList"
              @clear="getList"
              style="width:200px; margin-left: 10px;"
              placeholder="请选择所属企业"
            >
              <el-option
                v-for="item in comlistdata"
                :key="item.company_name"
                :label="item.company_name"
                :value="item.company_name"
              ></el-option>
            </el-select>
          </div>
          <div class="div_inline">
            设备IP/域名:
            <el-input
              clearable
              size="small"
              class="el-input_co"
              style="width:160px"
              placeholder="请输入设备IP/域名"
              v-model="seekIP"
              @keyup.enter.native="getList"
              @clear="getList"
            />
          </div>
          <div class="div_inline">
            <el-button @click="getList" class="el-button_co" type="primary" icon="el-icon-search" :loading="diaLoading">搜索</el-button>
          </div>
          <div class="div_inline div_right">
            <div class="div_inline">在线设备: {{pageTotal}}</div>
            <div class="div_inline">设备总数: {{pageTotal}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row justify="space-between" type="flex" :gutter="20" class="twoRow">
        <el-col :span="24">
          <el-button-group>
            <!-- 添加按钮 -->
            <el-button
              @click="toAddData"
              class="el-button_co"
              type="primary"
              icon="el-icon-circle-plus-outline"
              :disabled="!configGd.Auth.write"
            >添加</el-button>
            <!-- 删除 -->
            <el-button
              @click="doDel"
              class="el-button_co"
              type="danger"
              icon="el-icon-remove-outline"
              :disabled="!configGd.Auth.del"
            >删除</el-button>
            <!-- 分配权限 -->
            <!-- 导入 -->
            <!-- <el-button class="el-button_co" type="primary" icon="el-icon-upload2">导入</el-button> -->
            <!-- 导出 -->
            <el-popconfirm
              title="是否要导出全部信息？如果否，请选择或输入筛选条件（注：筛选必须要点击“搜索”按钮后才会生效）。"
              confirmButtonText='导出全部'
              cancelButtonText='我要筛选'
              @onConfirm="doExport"
              width="350"
              :disabled="!isExportAll"
            >
              <el-button
                slot="reference"
                class="el-button_co"
                type="primary"
                icon="el-icon-download"
                :loading="ExportLoading"
                style="border-radius: 0 4px 4px 0;"
                @click="doExport(true)"
              >导出</el-button>
            </el-popconfirm>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row>
        <!-- 表格 -->
        <el-table
          style="width: 100%"
          :header-cell-style="{background:'#eee',color:'#000'}"
          :data="listdata"
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="device_id" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-if="this.configGd.isAdmin" prop="company_name" label="所属企业" align="center"></el-table-column>
          <el-table-column prop="device_name" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="device_address" label="位置" align="center"></el-table-column>
          <el-table-column prop="device_ip" label="IP" align="center"></el-table-column>
          <el-table-column prop="serial" label="序列号" align="center"></el-table-column>
          <el-table-column prop="device_enabled" label="在线状态" align="center" width="100px">
            <template slot-scope="scope">
              <i v-if="scope.row.device_enabled==1">
                <img src="../../assets/img/on_off02.png" />
              </i>
              <i v-else-if="scope.row.device_enabled==0">
                <img src="../../assets/img/on_off01.png" />
              </i>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" align="center">
            <template scope="scope">
              {{ scope.row.device_time.substr(0, 16) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-edit" @click="toEditData(scope)" :disabled="!configGd.Auth.write"></el-button>
                <el-button size="mini" icon="el-icon-delete" @click="doDel(scope)" :disabled="!configGd.Auth.del"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-row>
        <div class="page_div">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="pageTotal"
          ></el-pagination>
        </div>
      </el-row>
    </el-card>

    <!-- 添加对话框： -->
    <el-dialog
      :close-on-click-modal="false"
      :title="adTitle"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="680px"
    >
      <el-form
        v-loading="diaLoading"
        :validate-on-rule-change="false"
        :model="ruleForm"
        :rules="rules()"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row style="margin-bottom: -15px">
          <el-col :span="12">
            <el-form-item label="设备ID" prop="device_id" autocomplete="off" v-show="false">
              <el-input v-model="ruleForm.device_id"></el-input>
            </el-form-item>
            <el-form-item v-if="this.configGd.isAdmin" label="所属企业" prop="company_name">
              <el-select
                v-model="ruleForm.company_name"
                clearable
                size="small"
                style="width:180px;"
                placeholder="请选择所属企业"
              >
                <el-option
                  v-for="item in comlistdata"
                  :key="item.company_name"
                  :label="item.company_name"
                  :value="item.company_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-select
                v-model="ruleForm.deviceType"
                clearable
                size="small"
                style="width:180px;"
                placeholder="请选择设备类型"
              >
                <el-option label="面板机" value="facePlate"></el-option>
                <el-option label="摄像头" value="camera"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备IP/域名" prop="device_ip" autocomplete="off">
              <el-input
                clearable
                size="small"
                placeholder="请输入设备IP/域名"
                v-model="ruleForm.device_ip"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:180px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="协议类型" prop="protocolType">
              <el-select
                v-model="ruleForm.protocolType"
                clearable
                size="small"
                style="width:180px;"
                placeholder="请选择协议类型"
              >
                <el-option label="私有协议" value="private"></el-option>
                <el-option label="rtsp协议" value="rtsp"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备位置" prop="device_address" autocomplete="off">
              <el-input
                clearable
                size="small"
                placeholder="请输入设备位置"
                v-model="ruleForm.device_address"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:180px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备序列号" prop="serial" autocomplete="off">
              <input
                name="us"
                type="text"
                placeholder="设备账号"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                size="small"
                placeholder="请输入设备序列号"
                v-model="ruleForm.serial"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:180px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备账号" prop="device_name" autocomplete="off">
              <input
                name="u"
                type="text"
                placeholder="设备账号"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                size="small"
                placeholder="请输入设备账号"
                v-model="ruleForm.device_name"
                :maxlength="12"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:180px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备密码" prop="device_password" autocomplete="off">
              <input
                name="a"
                type="password"
                placeholder="密码"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                show-password
                size="small"
                placeholder="请输入设备密码"
                v-model="ruleForm.device_password"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:180px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <el-form-item style="padding-left: 130px; margin: -10px 0 5px 0">
          <el-button
            ref="submitBut"
            type="primary"
            @click="insert('ruleForm')"
            size="small"
            icon="el-icon-circle-check"
            :loading="diaLoading"
          >{{butTitleSubmit}}</el-button>
          <el-button @click="resetForm('ruleForm')" size="small" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 设备表单数据
      listdata: [],
      dialogVisible: false,
      diaLoading: false,
      ExportLoading: false, // 正在导出
      // 添加或修改的设备输入数据：
      ruleForm: {
        device_id: 0,
        company_name: '',
        deviceType: '',
        device_address: '',
        device_enabled: 0,
        device_ip: '',
        device_name: '',
        device_password: '',
        device_port: 0,
        device_time: '',
        protocolType: '',
        serial: ''
      },
      // 要修改的设备信息：
      editDeviceData: {
        device_id: 0,
        company_name: '',
        deviceType: '',
        device_address: '',
        device_enabled: 0,
        device_ip: '',
        device_name: '',
        device_password: '',
        device_port: 0,
        device_time: '',
        protocolType: '',
        serial: ''
      },
      // 设备提交数据检验：
      rulesBas: {
        device_name: [
          // validator是自定义校验固定写法,我们只需填他的值(checkName)就好了， callback 必须被调用。
          {
            required: true,
            trigger: 'blur',
            validator: this.checkName
          }
        ],
        device_password: [
          { required: true, message: '请输入设备密码', trigger: 'blur' },
          { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' }
        ],
        device_address: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        serial: [
          { required: true, message: '请输入设备序列号', trigger: 'blur' }
        ],
        company_name: [
          { required: true, message: '请选择所属企业', trigger: 'change' }
        ]
      },
      readOnlyFlag: true,
      butTitleSubmit: '立即添加',
      delId: [],
      delNames: [],
      adTitle: '添加设备信息', // 将要操作的内容(标题)
      /** 当前状态：1添加，2修改，3删除 */
      isATyle: 0,

      // 企业列表数据
      comlistdata: [],
      // 企业总数
      comTotal: 0,
      // 筛选ip
      seekIP: '',
      // seekSerialNo: '',
      // 按企业筛选
      companyName: '',
      currentPage: 1,
      pageSize: 13,
      pageTotal: 0
    }
  },
  computed: {
    isExportAll() {
      return (!this.companyName && !this.seekIP)
    }
  },
  created() {
    this.getList()
    this.getComList()
  },
  methods: {
    rules() {
      var myReRules = JSON.parse(JSON.stringify(this.rulesBas))
      // console.log(myReRules)
      myReRules.device_name[0].validator = this.checkName
      // if (this.isATyle === 1) {
      // } else if (this.isATyle === 2) {
      //   myReRules.device_name[0].required = false
      // }
      return myReRules
    },
    // 初始化提交数据：
    intSimData() {
      this.ruleForm = {
        device_id: 0,
        company_name: '',
        deviceType: '',
        device_address: '',
        device_enabled: 0,
        device_ip: '',
        device_name: '',
        device_password: '',
        device_port: 0,
        device_time: '',
        protocolType: '',
        serial: ''
      }
      if (this.isATyle === 2) {
        for (var I in this.editDeviceData) {
          this.ruleForm[I] = this.editDeviceData[I]
        }
      }
    },
    // 提交开始或结束
    udShowStyle(_start, _noInt) {
      this.diaLoading = _start
      if (_start) {
      } else {
        if (_noInt) {
        } else {
          this.intSimData()
        }
      }
    },
    // 重置表单：
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.intSimData()
    },
    // 提交和：
    insert(formName) {
      // var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.apiSaveUser()
          this.udShowStyle(true)
        } else {
          return false
        }
      })
    },
    // 提交返回失败的处理：
    urResponseErr(_errmsg) {
      if (this.isATyle !== 3) {
        // this.$refs.upload.abort()
        // this.$refs.upload.clearFiles()
        // this.removeFile()
      }
      this.udShowStyle(false, true)
      this.$message.error(_errmsg)
    },

    // 按钮触发-添加设备信息：
    toAddData() {
      this.isATyle = 1
      this.adTitle = '添加设备信息'
      this.intSimData()
      this.udShowStyle(false)
      this.butTitleSubmit = '立即添加'
      this.dialogVisible = true
    },

    // 按钮触发-编辑修改设备
    toEditData(scope) {
      this.isATyle = 2
      this.adTitle = '修改设备信息'
      this.intSimData()
      for (var I in scope.row) {
        this.editDeviceData[I] = scope.row[I]
      }
      this.udShowStyle(false)
      this.butTitleSubmit = '保存修改'
      this.dialogVisible = true
    },
    // 删除设备按钮
    async doDel(scope) {
      this.isATyle = 3
      if (scope && scope.row) {
      } else if (!this.delId.length) {
        this.$message({ message: '请您选择您需要删除的设备!', type: 'warning' })
        return false
      }
      var myDelIDs = []
      var myNames = ''
      if (scope && scope.row) {
        // this.delId.push(scope.row.device_id)
        // this.delNames.push(scope.row.serial)
        // this.appDelList(scope.row)
        myNames = scope.row.serial
        myDelIDs.push(scope.row.device_id)
      } else {
        for (var i = 0; i < this.delNames.length; i++) {
          if (i < 3) {
            myNames += this.delNames[i] + ','
            if (i >= 2 && this.delNames.length > 3) {
              myNames += '...'
            }
          }
          myDelIDs.push(this.delId[i])
        }
        if (myNames.charAt(myNames.length - 1) === ',') {
          myNames = myNames.substr(0, myNames.length - 1)
        }
      }
      var myNumsTip = ''
      if (myDelIDs.length > 1) {
        myNumsTip = ' 等 ' + myDelIDs.length + ' 台设备'
      }
      const confirmResult = await this.$confirm(
        '您确定要删除 [' + myNames + ']' + myNumsTip + ' 吗?',
        '删除设备信息',
        {
          cancelButtonText: '取消',
          confirmButtonText: '删除',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        // if (scope && scope.row) {
        //   this.delId.splice(this.delId.contains(scope.row.device_id), 1)
        //   this.delNames.splice(this.delNames.contains(scope.row.serial), 1)
        // }
        return this.$message.info('已取消删除')
      }
      this.udShowStyle(true)
      this.$http
        .post('/api' + '/device/del', myDelIDs)
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.dialogVisible = false
            this.$message({
              message: '删除设备信息成功！',
              type: 'success'
            })
            this.udShowStyle(false, true)
            this.getList()
          } else {
            this.urResponseErr('删除设备信息失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('删除设备信息失败：' + err)
        })
    },
    // 提交用户信息
    apiSaveUser() {
      var myBirthday = this.ruleForm.birthday
      var sData = new Date(myBirthday)
      if (!sData || (sData && isNaN(sData.getFullYear()))) {
        myBirthday = ''
      }
      if (!this.ruleForm.company_name || this.ruleForm.company_name.length === 0) {
        this.ruleForm.company_name = this.$Storage.localGet('companyName')
      }
      this.udShowStyle(true)
      this.$http
        .post(this.uploadUrl(), this.ruleForm)
        .then(res => {
          if (res) {
            console.log('apiSaveUser res:', res, res.data)
            if (res.data.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: this.adTitle + '成功！',
                type: 'success'
              })
              this.getList()
            } else {
              this.urResponseErr(this.adTitle + '失败：' + res.data.message)
            }
          } else {
            this.urResponseErr(this.adTitle + '失败！')
          }
          // this.udShowStyle(false, true)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          console.log('err:', err)
          this.urResponseErr(this.adTitle + '失败:' + err)
          // this.udShowStyle(false, true)
        })
      // eslint-disable-next-line no-unreachable
      this.udShowStyle(false, true)
    },
    // 上传api地址
    uploadUrl: function() {
      if (this.isATyle === 1) {
        return '/api' + '/device/add'
      } else if (this.isATyle === 2) {
        return '/api' + '/device/update'
      }
    },
    // 批量删除前面的复选框
    handleSelectionChange(val) {
      this.delId = []
      this.delNames = []
      val.forEach((ele, indx) => {
        this.delId.push(ele.device_id)
        this.delNames.push(ele.serial)
      })
    },
    checkName(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入设备帐号'))
      }
      var len = 0
      for (var i = 0; i < value.length; i++) {
        var c = value.charCodeAt(i)
        // 单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++
        } else {
          len += 2
        }
      }
      if ((len < 4 && len > 0) || len > 12) {
        // 重点重点，下面就是填写提示的文字
        callback(new Error('帐号长度为4-12个字符，一个中文字等于2个字符。'))
      } else {
        callback()
      }
    },

    getList() {
      var apiUrl =
        '/api' +
        '/device/find/list' +
        '?page=' +
        this.currentPage +
        '&pageSize=' +
        this.pageSize +
        '&r=' + ('' + this.getRan(1000, 9999))
      if (this.seekIP) {
        apiUrl += '&deviceIp=' + this.seekIP
      }
      // if (this.seekSerialNo) {
      //   apiUrl += '&serialNo=' + this.seekSerialNo
      // }
      if (this.companyName) {
        apiUrl += '&companyName=' + this.companyName
      }
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            this.listdata = res.data.data.list
            this.pageTotal = res.data.data.total
            if ((!this.listdata || this.listdata.length === 0) && this.pageTotal > 0 && this.currentPage > 1) {
              this.currentPage = Math.ceil(this.pageTotal / this.pageSize)
              this.getList()
              return
            }
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取设备信息失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取设备信息失败：' + err)
        })
    },
    // 获取公司列表：
    getComList() {
      var apiUrl =
        '/api' + '/company/find/list' + '?page=' + 1 + '&pageSize=' + 10
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            this.comlistdata = res.data.data.list
            this.comTotal = res.data.data.total
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取公司列表失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取公司列表失败：' + err)
        })
    },
    // 获取网址随机数
    getRan(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getList(this.currentPage)
    },
    // 导出：
    doExport(_noAll) {
      if (_noAll && !this.companyName && !this.seekIP) {
        return
      }
      var apiUrl = '/api' + '/export/device/info'
      let myparams = {
        // page: this.currentPage,
        // pageSize: this.pageSize
      }
      if (this.companyName) {
        myparams.companyName = this.companyName
      }
      if (this.seekIP) {
        myparams.deviceIp = this.seekIP
      }
      this.ExportLoading = true
      this.$http
        .get(apiUrl, {
          params: myparams,
          responseType: 'blob'
        })
        .then(res => {
          let myfilename = '_' + new Date().format('yyMMddhhmmss')
          if (this.seekIP) {
            myfilename = '_' + this.seekIP + myfilename
          }
          if (this.companyName) {
            myfilename = '_' + this.companyName + myfilename
          }
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '设备信息' + myfilename + '.xlsx')
          document.body.appendChild(link)
          link.click()
          this.ExportLoading = false
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.ExportLoading = false
          this.$message.error('导出设备信息失败：' + err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.titleMessage {
  color: black;
  padding-bottom: 0.2rem;
  font-weight: 700;
  text-align: left;
  span {
    font-weight: 500;
    font-size: 0.1rem;
  }
}
.basicMessage {
  color: #3c4e86;
  b {
    display: inline-block;
    width: 1rem;
    text-align: right;
    height: 0.5rem;
    font-size: 0.2rem;
    padding-right: 0.1rem;
  }
  // input {
  //   height: 0.3rem;
  //   width: 3.5rem;
  // }
  em {
    width: 4rem;
    display: inline-block;
  }
  // .el-input {
  //   display: inline;
  // }
}
// 上传照片
.upPicture {
  position: relative;
  .uploadPicture {
    position: absolute;
    left: 1.17rem;
    top: 0.21rem;
    button {
      position: relative;
      width: 1rem;
      height: 0.45rem;

      span {
        position: absolute;
        left: 0.16rem;
        top: 0.13rem;
        font-size: 0.16rem;
      }
    }
  }
}
</style>
