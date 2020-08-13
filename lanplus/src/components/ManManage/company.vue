<template>
  <div>
    <el-card v-loading="diaLoading">
      <el-row justify="space-between" type="flex" :gutter="20" class="oneRow">
        <el-col :span="24">
          <div class="g_label">
            <div v-if="this.configGd.isAdmin" class="div_inline">
              企业:
              <el-input
                size="small"
                clearable
                class="el-input_co"
                style="width:150px"
                placeholder="请输入企业名称"
                v-model="seekCompanyName"
                @keyup.enter.native="getList"
                @clear="getList"
              />
            </div>
            <div class="g_label div_inline">
              <!-- 筛选按钮 -->
              <el-button
                @click="getList"
                class="el-button_co"
                type="primary"
                icon="el-icon-search"
                :loading="diaLoading"
              >搜索</el-button>
            </div>
            <div class="g_label div_inline div_right">企业总数: {{pageTotal}}</div>
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
            >添加</el-button>
            <!-- 删除 -->
            <el-button
              @click="doDel"
              class="el-button_co"
              type="danger"
              icon="el-icon-remove-outline"
            >删除</el-button>
            <!-- 分配权限 -->
            <!-- 导入 -->
            <!-- <el-button class="el-button_co" type="primary" icon="el-icon-upload2">导入</el-button> -->
            <!-- 导出 -->
              <el-button
                class="el-button_co"
                type="primary"
                icon="el-icon-download"
                :loading="ExportLoading"
                @click="doExport"
              >导出</el-button>
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
          :cell-style="tableRowStyle"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="company_id" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="company_name" label="企业名称" align="center"></el-table-column>
          <el-table-column prop="company_address" label="企业地址" align="center"></el-table-column>
          <el-table-column prop="company_tel" label="企业电话" align="center"></el-table-column>
          <el-table-column prop="logo" label="LOGO" align="center" width="80px">
            <template slot-scope="scope">
              <div class="baseImage">
                <img :src="getimgurl(scope.row.logo)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" align="center">
            <template scope="scope">{{ scope.row.company_time.substr(0, 16) }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-edit" @click="toEditData(scope)"></el-button>
                <el-button size="mini" icon="el-icon-delete" @click="doDel(scope)"></el-button>
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
      width="590px"
      class="no-scroll"
      style="margin-top:-45px;"
    >
      <el-form
        v-loading="diaLoading"
        :validate-on-rule-change="false"
        :model="ruleForm"
        :rules="rules()"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="margin-top:-10px;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业ID" prop="company_id" autocomplete="off" v-show="false">
              <el-input v-model="ruleForm.company_id"></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="company_name" autocomplete="off">
              <input
                name="us"
                type="text"
                placeholder="企业名称"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                size="small"
                placeholder="请输入企业序列号"
                v-model="ruleForm.company_name"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:220px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="企业电话" prop="company_tel" autocomplete="off">
              <el-input
                clearable
                size="small"
                placeholder="请输入企业电话"
                v-model="ruleForm.company_tel"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:220px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="企业地址" prop="company_address" autocomplete="off">
              <el-input
                clearable
                size="small"
                placeholder="请输入企业地址"
                v-model="ruleForm.company_address"
                :maxlength="20"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:420px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 图标、LOGO与标题 -->
        <el-collapse
          v-if="isATyle===2"
          v-model="activeNames"
          @change="handleChange"
          style="margin-bottom:25px;"
        >
          <el-collapse-item>
            <template slot="title">
              <i class="el-icon-set-up" style="margin:0 8px;font-size:19px;padding-bottom:3px"></i>设置LOGO与标题
            </template>
            <el-row
              justify="space-between"
              type="flex"
              :gutter="20"
              class="oneRow"
              style="min-height:85px;height:85px;padding-left:16px;"
            >
              <el-col :span="1" style="min-width:200px;width:200px;padding-top:8px;" align="left">
                <span class="card-title-s">网站标题图标favicon</span>(.ico)
                <br />
                <span
                  style="color:#aaaaaa;font-size:12px;"
                >16/64x16/64px, &lt;12KB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </el-col>
              <el-col :span="1" style="width:318px;padding:0;" align="left">
                <div class="div_content div_top upPicture" style="margin: 0;">
                  <el-upload
                    class="avatar-uploader-s"
                    ref="upload"
                    :with-credentials="true"
                    :limit="2"
                    :file-list="fileList"
                    action=" 123"
                    accept="image/x-icon"
                    :on-change="addFile"
                    :auto-upload="false"
                    style="margin-top: 2px;"
                    :show-file-list="false"
                    :disabled="!configGd.Auth.write"
                  >
                    <el-button
                      icon="el-icon-plus"
                      size="mini"
                      type="primary"
                      circle
                      plain
                      :disabled="!configGd.Auth.write"
                      style="font-size:14px;width:26px;height:26px;padding:0;margin-right:10px;"
                    ></el-button>
                    <img :src="imageUrl" style="width:16px;height:16px;margin:-4px 0 0 6px;" />
                    <img :src="imageUrl" style="width:64px;height:64px;margin:-4px 0 0 10px;" />
                  </el-upload>
                </div>
              </el-col>
              <el-col :span="22" style="padding:20px 0 0 0;" align="left">
                <el-alert
                  ref="alert"
                  :closable="false"
                  :title="upMsg"
                  type="error"
                  v-show="upMsg"
                  style="padding: 3px 3px 3px 0; background: #FFFFFF !important;"
                ></el-alert>
              </el-col>
            </el-row>
            <el-row
              justify="space-between"
              type="flex"
              :gutter="20"
              class="oneRow"
              style="min-height:120px;height:120px;padding-left:16px;"
            >
              <el-col :span="1" style="min-width:200px;width:200px;padding-top:24px;" align="left">
                <span class="card-title-s">页面LOGO</span>(.jpg/.png)
                <br />
                <span
                  style="color:#aaaaaa;font-size:12px;"
                >登录页：100x100px, &lt;20KB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br />
                <span
                  style="color:#aaaaaa;font-size:12px;"
                >主页：48x48px, &lt;20KB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </el-col>
              <el-col
                :span="1"
                style="width:680px;height:314px;padding:5px 5px 10px 5px;"
                align="left"
              >
                <div class="div_content div_top upPicture" style="margin: 0;">
                  <el-upload
                    class="avatar-uploader-s"
                    ref="upload2"
                    :with-credentials="true"
                    :limit="2"
                    :file-list="fileList2"
                    action=" 123"
                    accept="image/jpeg, image/png"
                    :on-change="addFile2"
                    :auto-upload="false"
                    style="margin-top: 2px;"
                    :show-file-list="false"
                    :disabled="!configGd.Auth.write"
                  >
                    <el-button
                      icon="el-icon-plus"
                      size="mini"
                      type="primary"
                      circle
                      plain
                      :disabled="!configGd.Auth.write"
                      style="font-size:14px;width:26px;height:26px;padding:0;margin-left:-5px;margin-right:10px;"
                    ></el-button>
                    <img
                      :src="imageUrl2"
                      style="width:100px;height:100px;margin:-4px 0 0 6px;background:#0c3f92;"
                    />
                    <img
                      :src="imageUrl2"
                      style="width:48px;height:48px;background:#0d3962;margin-left:10px;"
                    />
                  </el-upload>
                </div>
              </el-col>
              <el-col :span="21" style="padding:42px 0 0 0;" align="left">
                <el-alert
                  ref="alert"
                  :closable="false"
                  :title="upMsg2"
                  type="error"
                  v-show="upMsg2"
                  style="padding: 3px 3px 3px 0; background: #FFFFFF !important;"
                ></el-alert>
              </el-col>
            </el-row>
            <el-row
              justify="space-between"
              type="flex"
              :gutter="20"
              class="oneRow"
              style="min-height:120px;height:40px;margin-top:15px;padding-left:16px;margin-bottom: -55px"
            >
              <el-col :span="1" style="min-width:200px;width:200px;padding-top:1px;" align="left">
                <span class="card-title-s">系统网站标题</span>
                <br />
                <span
                  style="color:#aaaaaa;font-size:12px;"
                >4&lt;字符数&lt;20 (1汉字=2字符)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <br />
              </el-col>
              <el-col
                :span="1"
                style="width:314px;height:314px;padding:5px 5px 10px 5px;"
                align="left"
              >
                <el-input
                  clearable
                  size="small"
                  placeholder="请输入系统网站标题"
                  v-model="sysTitle"
                  :maxlength="20"
                  autocomplete="new-accounts"
                  style="width:200px;"
                  :disabled="!configGd.Auth.write"
                ></el-input>
              </el-col>
              <el-col :span="21" style="padding:10px 0 0 0;" align="left">
                <el-alert
                  ref="alert"
                  :closable="false"
                  :title="upMsg3"
                  type="error"
                  v-show="upMsg3"
                  style="padding: 3px 3px 3px 0; background: #FFFFFF !important;"
                ></el-alert>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-divider v-if="isATyle===1"></el-divider>
        <el-form-item style="padding-left: 90px; margin: -10px 0 5px 0">
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
      activeNames: ['1'],

      fileList: [], // 上传的照片文件
      imageUrl: './favicon.ico',
      fileSizeIsSatisfy: true,
      uImgWidth: '32px',
      uImgHeight: '32px',
      delicoVisible: false,
      upMsg: '',
      sysTitle: '人脸测温云系统',

      fileList2: [], // 上传的照片文件
      imageUrl2: './logo_login.png',
      fileSizeIsSatisfy2: true,
      uImgWidth2: '100px',
      uImgHeight2: '100px',
      delicoVisible2: false,
      upMsg2: '',
      upMsg3: '',

      upLogo: false,
      ExportLoading: false, // 正在导出

      dialogVisible: false,
      diaLoading: false,
      // 添加或修改的企业输入数据：
      ruleForm: {
        company_id: 0,
        company_name: '',
        company_address: '',
        company_tel: ''
      },
      // 要修改的企业信息：
      editCompanyData: {
        company_id: 0,
        company_name: '',
        company_address: '',
        company_tel: ''
      },
      // 要修改的企业字段：
      editKeyList: ['company_name', 'company_address', 'company_tel'],
      // 企业提交数据检验：
      rulesBas: {
        company_name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        company_tel: [
          {
            required: true,
            trigger: 'blur',
            validator: this.checkPhone
          }
        ]
      },
      readOnlyFlag: true,
      butTitleSubmit: '立即添加',
      delId: [],
      delNames: [],
      adTitle: '添加企业信息', // 将要操作的内容(标题)
      /** 当前状态：1添加，2修改，3删除 */
      isATyle: 0,

      listdata: [],
      // 筛选企业
      seekCompanyName: '',
      currentPage: 1,
      pageSize: 13,
      pageTotal: 0
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    rules() {
      var myReRules = JSON.parse(JSON.stringify(this.rulesBas))
      myReRules.company_tel[0].validator = this.checkPhone
      return myReRules
    },
    // 初始化提交数据：
    intSimData() {
      this.ruleForm = {
        company_id: 0,
        company_name: '',
        company_address: '',
        company_tel: ''
      }
      if (this.isATyle === 2) {
        for (var I in this.editCompanyData) {
          this.ruleForm[I] = this.editCompanyData[I]
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
          if (this.activeNames.length > 1) {
            if (!this.fileSizeIsSatisfy) {
              console.log('this.fileSizeIsSatisfy', this.fileSizeIsSatisfy)
              return false
            }
            if (!this.fileSizeIsSatisfy2) {
              console.log('this.fileSizeIsSatisfy2', this.fileSizeIsSatisfy2)
              return false
            }
          }
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

    // 按钮触发-添加企业信息：
    toAddData() {
      this.removeFile()
      this.isATyle = 1
      this.adTitle = '添加企业信息'
      this.intSimData()
      this.udShowStyle(false)
      this.butTitleSubmit = '立即添加'
      this.dialogVisible = true
    },

    // 按钮触发-编辑修改企业
    toEditData(scope) {
      this.removeFile()
      this.isATyle = 2
      this.adTitle = '修改企业信息'
      this.intSimData()
      for (var I in scope.row) {
        this.editCompanyData[I] = scope.row[I]
      }
      if (this.editCompanyData.ico) {
        this.imageUrl = this.editCompanyData.ico
      } else {
        this.imageUrl = this.configGd.favicon
      }
      if (this.editCompanyData.logo) {
        this.imageUrl2 = this.editCompanyData.logo
      } else {
        this.imageUrl2 = this.configGd.logo_login
      }
      if (this.editCompanyData.title) {
        this.sysTitle = this.editCompanyData.title
      }
      this.udShowStyle(false)
      this.butTitleSubmit = '保存修改'
      this.dialogVisible = true
    },
    // 删除企业按钮
    async doDel(scope) {
      this.isATyle = 3
      if (scope && scope.row) {
      } else if (!this.delId.length) {
        this.$message({ message: '请您选择您需要删除的企业!', type: 'warning' })
        return false
      }
      var myDelIDs = []
      var myNames = ''
      if (scope && scope.row) {
        // this.delId.push(scope.row.company_id)
        // this.delNames.push(scope.row.company_name)
        // this.appDelList(scope.row)
        myNames = scope.row.company_name
        myDelIDs.push(scope.row.company_id)
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
        myNumsTip = ' 等 ' + myDelIDs.length + ' 家企业'
      }
      const confirmResult = await this.$confirm(
        '您确定要删除 [' + myNames + ']' + myNumsTip + ' 吗?',
        '删除企业信息',
        {
          cancelButtonText: '取消',
          confirmButtonText: '删除',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.udShowStyle(true)
      this.$http
        .post('/api' + '/company/del', myDelIDs)
        .then(res => {
          if (res.data.code === 0) {
            this.dialogVisible = false
            this.$message({
              message: '删除企业信息成功！',
              type: 'success'
            })
            this.udShowStyle(false, true)
            this.getList()
          } else {
            this.urResponseErr('删除企业信息失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('删除企业信息失败：' + err)
        })
    },
    // 提交公司信息
    apiSaveUser() {
      this.udShowStyle(true)
      var config = null
      var formData = null
      if (this.isATyle === 1) {
        formData = this.ruleForm
      } else if (this.isATyle === 2) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        formData = new FormData()
        formData.append('company_id', this.ruleForm.company_id)
        for (let i = 0; i < this.editKeyList.length; i++) {
          if (this.ruleForm[this.editKeyList[i]]) {
            formData.append(
              this.editKeyList[i],
              this.ruleForm[this.editKeyList[i]]
            )
          }
        }
        this.upLogo = false
        if (this.activeNames.length > 1) {
          this.upLogo = true
          formData.append('title', this.sysTitle)

          if (this.fileList && this.fileList.length > 0) {
            formData.append('files', this.fileList[0].raw)
          } else {
            formData.append('files', null)
          }
          if (this.fileList2 && this.fileList2.length > 0) {
            formData.append('files', this.fileList2[0].raw)
          } else {
            formData.append('files', null)
          }
        }
      }
      this.$http
        // .post(this.uploadUrl(), this.ruleForm)
        .post(this.uploadUrl(), formData, config)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: this.adTitle + '成功！',
                type: 'success'
              })
              this.removeFile()
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
          this.urResponseErr(this.adTitle + '失败:' + err)
          // this.udShowStyle(false, true)
        })
      // eslint-disable-next-line no-unreachable
      this.udShowStyle(false, true)
    },
    // 上传api地址
    uploadUrl: function() {
      if (this.isATyle === 1) {
        return '/api' + '/company/add'
      } else if (this.isATyle === 2) {
        return '/api' + '/company/update'
      }
    },
    // 批量删除前面的复选框
    handleSelectionChange(val) {
      this.delId = []
      this.delNames = []
      val.forEach((ele, indx) => {
        this.delId.push(ele.company_id)
        this.delNames.push(ele.company_name)
      })
    },
    checkPhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入企业电话'))
      }
      // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      const phoneReg2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
      if (phoneReg.test(value) || phoneReg2.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的电话号码'))
      }
    },

    // 获取企业列表数据
    getList() {
      var apiUrl =
        '/api' +
        '/company/find/list' +
        '?page=' +
        this.currentPage +
        '&pageSize=' +
        this.pageSize
      if (this.seekCompanyName) {
        apiUrl += '&company_name=' + this.seekCompanyName
      }
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            this.listdata = res.data.data.list
            this.pageTotal = res.data.data.total
            if (
              (!this.listdata || this.listdata.length === 0) &&
              this.pageTotal > 0 &&
              this.currentPage > 1
            ) {
              this.currentPage = Math.ceil(this.pageTotal / this.pageSize)
              this.getList()
              return
            }
            if (this.upLogo) {
              for (var i = 0; i < this.listdata.length; i++) {
                if (
                  this.listdata[i].company_name === this.configGd.companyName
                ) {
                  let comVI = {
                    company_id: this.listdata[i].company_id,
                    company_name: this.listdata[i].company_name,
                    ico: this.listdata[i].ico,
                    logo: this.listdata[i].logo,
                    title: this.listdata[i].title
                  }
                  this.configGd.saveComVI(this, comVI)
                  break
                }
              }
            }
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取企业列表失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取企业列表失败：' + err)
        })
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getList(this.currentPage)
    },
    handleChange(val) {
      // console.log('activeNames:', this.activeNames)
    },

    // 加载本地图片：
    addFile(file, fileList) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'ico'
      if (!extension) {
        this.$message({
          message: '上传文件只能是 ico 格式!',
          type: 'warning'
        })
        // this.$refs.upload.clearFiles()
        this.$refs.upload.handleRemove(fileList[fileList.length - 1])
        return
      }

      if (fileList.length > 1) {
        this.$refs.upload.handleRemove(fileList[0])
      }
      this.fileList = []
      this.fileList = fileList
      // 限制上传文件为5M
      // var sizeIsSatisfy = file.size < 5 * 1024 * 1024 ? true : false
      var mySize = file.size / 1024
      var sizeIsSatisfy = mySize < 12 // 12

      var _this = this
      var eventR = event || window.event
      if (!eventR || !eventR.target || !eventR.target.files) {
        return
      }
      var fileR = eventR.target.files[0]
      var reader = new FileReader() // 转base64
      reader.onload = function(e) {
        _this.imageUrl = e.target.result // 将图片路径赋值给src
        _this.imgAutoZoom(e.target.result, 1)
      }
      reader.readAsDataURL(fileR)
      this.fileSizeIsSatisfy = true
      this.setUpMsg(1, '')
      if (sizeIsSatisfy) {
        return true
      } else {
        this.fileSizeIsSatisfy = false
        this.setUpMsg(
          1,
          '图标文件大小不得超过12KB！( 当前:' + Math.round(mySize) + 'KB )'
        )
        return false
      }
    },
    addFile2(file, fileList) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'jpg'
      const extension2 = testmsg === 'png'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 jpg、png 格式!',
          type: 'warning'
        })
        // this.$refs.upload.clearFiles()
        this.$refs.upload2.handleRemove(fileList[fileList.length - 1])
        return
      }

      if (fileList.length > 1) {
        this.$refs.upload2.handleRemove(fileList[0])
      }
      this.fileList2 = []
      this.fileList2 = fileList
      // 限制上传文件为5M
      // var sizeIsSatisfy = file.size < 5 * 1024 * 1024 ? true : false
      var mySize = file.size / 1024
      var sizeIsSatisfy = mySize < 30

      var _this = this
      var eventR = event || window.event
      if (!eventR || !eventR.target || !eventR.target.files) {
        return
      }
      var fileR = eventR.target.files[0]
      var reader = new FileReader() // 转base64
      reader.onload = function(e) {
        _this.imageUrl2 = e.target.result // 将图片路径赋值给src
        _this.imgAutoZoom(e.target.result, 2)
      }
      reader.readAsDataURL(fileR)
      this.fileSizeIsSatisfy2 = true
      this.setUpMsg(2, '')
      if (sizeIsSatisfy) {
        return true
      } else {
        this.fileSizeIsSatisfy2 = false
        this.setUpMsg(
          2,
          'LOGO文件大小不得超过30KB！( 当前:' + Math.round(mySize) + 'KB )'
        )
        return false
      }
    },
    // 照片显示自适应：
    imgAutoZoom(_imgURL, _id) {
      // this.imageUrl = _imgURL // 将图片路径赋值给src
      var image = new Image()
      image.src = _imgURL
      var _this = this
      image.onload = function() {
        if (this.width !== this.height) {
          if (_id === 1) {
            _this.fileSizeIsSatisfy = false
          } else if (_id === 2) {
            _this.fileSizeIsSatisfy2 = false
          }
          _this.setUpMsg(
            _id,
            '图片宽度和高度必须相等！( 当前:' +
              this.width +
              '/' +
              this.height +
              ' )'
          )
        }
      }
    },
    setUpMsg(_id, _upMsg) {
      if (_id === 0 || _id === 1) {
        this.upMsg = _upMsg
      }
      if (_id === 0 || _id === 2) {
        this.upMsg2 = _upMsg
      }
      if (_id === 0 || _id === 3) {
        this.upMsg3 = _upMsg
      }
    },
    checkSysTitle() {
      this.setUpMsg(3, '')
      if (!this.sysTitle) {
        this.setUpMsg(3, '请输入系统网站标题')
        return false
      }
      var len = 0
      for (var i = 0; i < this.sysTitle.length; i++) {
        var c = this.sysTitle.charCodeAt(i)
        // 单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++
        } else {
          len += 2
        }
      }
      if ((len < 4 && len > 0) || len > 20) {
        // 重点重点，下面就是填写提示的文字
        this.setUpMsg(3, '系统网站标题长度为4-20个字符，一个中文字等于2个字符')
        return false
      }
      return true
    },
    // 清除上传和显示的图片：
    removeFile() {
      if (this.fileList && this.fileList.length > 0) {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
        this.fileList = []
        this.fileSizeIsSatisfy = true
        this.setUpMsg(1, '')
      }
      if (this.fileList2 && this.fileList2.length > 0) {
        if (this.$refs.upload2) {
          this.$refs.upload2.clearFiles()
        }
        this.fileList2 = []
        this.fileSizeIsSatisfy2 = true
        this.setUpMsg(2, '')
      }
    },
    // 获取照片地址:
    getimgurl(_url) {
      if (!_url) {
        return this.configGd.logo_login
      }
      if (_url.length === 0 || _url.substr(0, 4) === 'http') {
        return _url
      } else {
        return 'data:image/jpg;base64,' + _url
      }
    },
    // 表格行样式
    tableRowStyle({ row, rowIndex }) {
      // return 'background-color:pink;font-size:15px;'
      // {padding:'0';min-height:'80'}
      return 'padding:0;min-height:54px;height:54px;'
    },
    // 导出：
    doExport() {
      // scope.row
      var apiUrl = '/api' + '/export/company/info'
      let myparams = {
        // page: this.currentPage,
        // pageSize: this.pageSize
      }
      // if (this.seekCompanyName) {
      //   myparams.company_name = this.seekCompanyName
      // }
      this.ExportLoading = true
      this.$http
        .get(apiUrl, {
          params: myparams,
          responseType: 'blob'
        })
        .then(res => {
          let myfilename = new Date().format('yyMMddhhmmss')
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '企业信息' + myfilename + '.xlsx')
          document.body.appendChild(link)
          link.click()
          this.ExportLoading = false
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.ExportLoading = false
          this.$message.error('导出企业信息失败：' + err)
        })
    }
  }
}
</script>
<style lang="less">
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

.baseImage {
  img {
    height: 46px;
  }
}
</style>
