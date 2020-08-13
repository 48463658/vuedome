<template>
  <div>
    <el-card class="g_label" v-loading="diaLoading">
      <el-row justify="space-between" type="flex" :gutter="20" class="oneRow">
        <el-col :span="24">
          <div>
            <div v-if="this.configGd.isAdmin" class="div_inline">
              所属企业:
              <el-select
                v-model="seekCompany"
                clearable
                size="small"
                @change="getUserList"
                @clear="getUserList"
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
              用户名:
              <el-input
                size="small"
                clearable
                class="el-input_co"
                style="width:150px"
                placeholder="请输入用户名"
                v-model="seekName"
                @keyup.enter.native="getUserList"
                @clear="getUserList"
              />
            </div>
            <div class="div_inline">
              <!-- 筛选按钮 -->
              <el-button
                @click="getUserList"
                class="el-button_co"
                type="primary"
                icon="el-icon-search"
                :loading="diaLoading"
              >搜索</el-button>
            </div>
            <div class="div_inline div_right">总人数: {{pageTotal}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row justify="space-between" type="flex" :gutter="20" class="twoRow">
        <el-col :span="24">
          <el-button-group>
            <!-- 添加按钮 -->
            <el-button
              @click="toAdduser"
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
            <!-- <el-button
              @click="doAuthorized"
              class="el-button_co el-button_coco"
              type="primary"
              icon="el-icon-s-custom"
            >分配权限</el-button>-->
            <!-- 导入 -->
            <el-button class="el-button_co" type="primary" icon="el-icon-upload2">导入</el-button>
            <!--批量下发-->
            <el-button class="el-button_co" type="primary" icon="el-icon-download">批量下发</el-button>
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
          ref="fileTable"
          row-key="user_id"
        >
          <el-table-column type="selection" fixed="left" reserve-selection width="55px"></el-table-column>
          <el-table-column prop="user_id" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column
            v-if="this.configGd.isAdmin"
            prop="company_name"
            label="所属企业"
            align="center"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" align="center" width="50px"></el-table-column>
          <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
          <el-table-column label="添加时间" align="center">
            <template scope="scope">{{ scope.row.user_time.substr(0, 16) }}</template>
          </el-table-column>
          <el-table-column prop label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-document" @click="doShowInfo(scope)"></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  @click="toEdituser(scope)"
                  :disabled="!configGd.Auth.write"
                ></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="doDel(scope)"
                  :disabled="!configGd.Auth.del"
                ></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-s-custom"
                  @click="doAuthorized(scope)"
                  :disabled="!configGd.Auth.write"
                ></el-button>
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
          <el-col :span="15">
            <el-form-item label="用户ID" prop="user_id" autocomplete="off" v-show="false">
              <el-input v-model="ruleForm.user_id"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username" autocomplete="off">
              <input
                name="u"
                type="text"
                placeholder="用户名"
                autocomplete="new-accounts"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                size="small"
                placeholder="请输入用户名"
                v-model="ruleForm.username"
                :maxlength="12"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-accounts"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <!-- <input name="a" type="password" placeholder="密码" style="position:fixed;bottom:-9999px" /> -->
              <input
                name="a"
                type="password"
                placeholder="密码"
                autocomplete="new-passowrd"
                style="position:absolute;left: -9999999px;"
              />
              <el-input
                clearable
                show-password
                size="small"
                :placeholder="placeholder_pass"
                v-model="ruleForm.password"
                :maxlength="24"
                :readonly="readOnlyFlag"
                @focus="readOnlyFlag = false;"
                autocomplete="new-passowrd"
                style="width:200px;"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="this.configGd.isAdmin" label="所属企业" prop="company_name">
              <el-select
                v-model="ruleForm.company_name"
                clearable
                size="small"
                style="width:200px;"
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
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="ruleForm.sex">
                <el-radio label="男" value="男"></el-radio>
                <el-radio label="女" value="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日" required>
              <el-date-picker
                type="date"
                size="small"
                placeholder="选择日期"
                v-model="ruleForm.birthday"
                value-format="yyyy-MM-dd"
                style="width: 200px;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <div class="upPicture" style="margin: -30px 0 0 0px;">
              <span style="color: #ff0000; margin-right: 3px;">*</span>
              <span>照片:</span>
              <!-- <el-upload
                class="avatar-uploader"
                ref="upload"
                :with-credentials="true"
                :limit="1"
                :file-list="fileList"
                :data="upData()"
                :action="uploadUrl()"
                accept="image/jpeg"
                :headers="myHeader"
                :on-change="addFile"
                :on-remove="handleRemove"
                :on-success="upHandSuccess"
                :before-upload="beforeUpload"
                :on-error="upHandError"
                :on-progress="upHandProgress"
                :auto-upload="false"
                style="margin-top: 10px;"
              >-->
              <el-upload
                class="avatar-uploader"
                ref="upload"
                :with-credentials="true"
                :limit="1"
                :file-list="fileList"
                :data="upData()"
                action=" 123"
                accept="image/jpeg"
                :on-change="addFile"
                :auto-upload="false"
                style="margin-top: 2px;"
              >
                <div
                  class="avatar-uploader-icon div-bgphoto"
                  :style="{backgroundImage:'url(' + imageUrl + ')',width:uImgWidth,height:uImgHeight}"
                  @mouseover="selectStyle(true)"
                  @mouseout="selectStyle(false)"
                  @click="removeFile"
                >
                  <i
                    v-if="!imageUrl"
                    class="el-icon-plus avatar-uploader-icon"
                    :style="{width:uImgWidth,height:uImgHeight}"
                  ></i>
                  <i v-else :class="delicoClass" :style="{width:uImgWidth,height:uImgHeight}"></i>
                </div>
              </el-upload>
              <el-alert
                ref="alert"
                :closable="false"
                :title="upMsg"
                type="error"
                v-show="upMsg"
                style="padding: 3px 3px 3px 0; background: #FFFFFF !important;"
              ></el-alert>
            </div>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <el-form-item style="padding-left: 135px; margin: -10px 0 5px 0">
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

    <!-- 用户详细信息对话框： -->
    <el-dialog
      title="人员详细信息"
      :visible.sync="InfoDialogVisible"
      :destroy-on-close="true"
      width="680px"
    >
      <el-row style="margin-top: -30px">
        <el-col :span="9" style="margin-top: -6px">
          <el-row class="g_labelBox">
            <el-col :span="7" align="right" class="g_label2">用户名:</el-col>
            <el-col
              :span="17"
              style="padding-left: 15px; font-size:15px; font-weight: bold;"
            >{{userInfo.username}}</el-col>
          </el-row>
          <el-row class="g_labelBox">
            <el-col :span="7" align="right" class="g_label2">用户序号:</el-col>
            <el-col :span="17" style="padding-left: 15px">{{userInfo.user_id}}</el-col>
          </el-row>
          <el-row class="g_labelBox">
            <el-col :span="7" align="right" class="g_label2">所属企业:</el-col>
            <el-col :span="17" style="padding-left: 15px">{{userInfo.company_name}}</el-col>
          </el-row>
          <el-row class="g_labelBox">
            <el-col :span="7" align="right" class="g_label2">性别:</el-col>
            <el-col :span="17" style="padding-left: 15px">{{userInfo.sex}}</el-col>
          </el-row>
          <el-row class="g_labelBox">
            <el-col :span="7" align="right" class="g_label2">生日:</el-col>
            <el-col :span="17" style="padding-left: 15px">{{userInfo.birthday}}</el-col>
          </el-row>
          <el-row class="g_labelBox">
            <el-col :span="7" align="right" class="g_label2">添加时间:</el-col>
            <el-col :span="17" style="padding-left: 15px">{{userInfo.user_time}}</el-col>
          </el-row>
          <el-row class="g_labelBox" style="margin-top: 20px">
            <el-col :span="7" align="right" class="g_label2" style="color:#ee6600">权限:</el-col>
            <el-col :span="17" style="padding-left: 15px" :loading="isAuthLoading">
              <i v-if="isAuthLoading" class="el-icon-loading"></i>
              <div v-else v-for="(auth,index) in authList" :key="index">
                <el-tag
                  size="mini"
                  type="danger"
                  style="padding:0 4px; font-size:12px; margin-bottom:1px"
                >{{auth.authority_description}}</el-tag>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="15" class="g_labelBox">
          <!-- <span class="g_label2">照片:</span> -->
          <div class="upPicture" style="margin: 0;">
            <el-image style="width: 380px; height: 380px" :src="userInfo.base64_img" fit="contain"></el-image>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      readOnlyFlag: true,
      saveing: false, // 是否正在保存
      // 列表信息
      listdata: [],
      // 企业列表数据
      comlistdata: [],
      // 企业总数
      comTotal: 0,
      // 筛选功能表单数据
      seekCompany: '',
      seekName: '',

      selId: [],
      selNames: [],
      currentPage: 1,
      pageSize: 11,
      pageTotal: 0,
      adTitle: '添加人员信息', // 将要操作的内容(标题)

      ExportLoading: false, // 正在导出

      /** 当前状态：1添加，2修改，3删除 */
      isATyle: 0,
      diaLoading: false,
      fileList: [], // 上传的照片文件
      fileListB: [], // 上传的照片文件备份
      dialogVisible: false, // 添加人员和编辑用户对话框
      InfoDialogVisible: false, // 用户详细信息对话框
      UploadUrl: 'http://localhost:8080/',
      delicoVisible: false,
      imageUrl: '',
      butTitleSubmit: '立即添加',
      placeholder_pass: '请输入登录密码',
      fileSizeIsSatisfy: true,
      uImgWidth: '200px',
      uImgHeight: '200px',
      authList: [], // 当前用户权限列表
      isAuthLoading: false, // 用户权限是否正在加载
      upMsg: '', // 上传照片提示信息 照片大小不能超过20KB
      // 添加或修改的用户输入数据：
      ruleForm: {
        user_id: 0,
        username: '',
        password: '',
        company_name: '',
        sex: '',
        birthday: ''
      },
      // 要修改的用户信息：
      editUserData: {
        user_id: 0,
        username: '',
        password: '',
        company_name: '',
        sex: '',
        birthday: '',
        base64_img: '' // 照片地址
      },
      // 要查看的用户信息：
      userInfo: {
        user_id: 0,
        username: '',
        password: '',
        company_name: '',
        sex: '',
        birthday: '',
        base64_img: '' // 照片地址
      },
      // 用户提交数据检验：
      rulesBas: {
        username: [
          // validator是自定义校验固定写法,我们只需填他的值(checkName)就好了， callback 必须被调用。
          {
            required: true,
            trigger: 'blur',
            validator: this.checkName
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' }
        ],
        company_name: [
          { required: true, message: '请选择所属企业', trigger: 'change' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        birthday: [
          {
            type: 'date',
            required: false,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    // myHeader() {
    //   return {
    //     // authToken: window.sessionStorage.getItem('authToken')
    //     token: this.$Storage.localGet('token')
    //   }
    // },
    delicoClass() {
      if (this.delicoVisible) {
        return 'el-icon-delete avatar-uploader-icon upimg-del-ico-show'
      } else {
        return 'el-icon-delete avatar-uploader-icon upimg-del-ico-hide'
      }
    },
    isExportAll() {
      return (!this.seekCompany && !this.seekName)
    }
  },
  created() {
    // this.audio = new Audio()
    // this.audio.src = './audio/unusual.mp3'
    // let playPromise
    // playPromise = this.audio.play()
    // if (playPromise) {
    //   playPromise
    //     .then(() => {
    //       // 音频加载成功
    //       // 音频的播放需要耗时
    //       console.log('音频加载成功')
    //     })
    //     .catch(e => {
    //       // 音频加载失败
    //       console.error(e)
    //     })
    // }

    var myPage = this.$Storage.localGet('page')
    if (myPage) {
      if (myPage.name === 'manmessage') {
        this.currentPage = myPage.page
        // if (this.$Storage.localGet('Scope')) {
        // } else {
        //   if (this.$Storage.localGet('selId')) {
        //     this.selId = this.$Storage.localGet('selId')
        //   }
        //   if (this.$Storage.localGet('selNames')) {
        //     this.selNames = this.$Storage.localGet('selNames')
        //   }
        // }
      }
      this.$Storage.localRemove('page')
      this.$Storage.localRemove('selId')
      this.$Storage.localRemove('selNames')
      this.$Storage.localRemove('Scope')
    }

    this.getUserList()
    this.getComList()
    // // 返回 web 主机的域名，如：http://127.0.0.1:8080/testdemo/test.html?id=1&name=test
    // var url = window.location.href
    // // 返回当前页面的路径和文件名，如：/testdemo/test.html
    // var pathname = window.location.pathname
    // // 返回 web 主机的端口，如：8080
    // var port = window.location.port
    // // 返回所使用的 web 协议，如：http:
    // var protocol = window.location.protocol
    // // 获取参数，如：?id=1&name=test
    // var search = window.location.search
    // // 获取指定参数值
    // console.log(url)
  },
  mounted() {
    this.setUpMsg('')
  },
  methods: {
    checkName(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入用户名'))
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
        callback(new Error('名称长度为4-12个字符，一个中文字等于2个字符。'))
      } else {
        callback()
      }
    },

    // 获取人员信息
    getUserList() {
      var apiUrl =
        '/api' +
        '/user/find/list' +
        '?page=' +
        this.currentPage +
        '&pageSize=' +
        this.pageSize +
        '&type=2'
      if (this.seekCompany) {
        apiUrl += '&company_name=' + this.seekCompany
      }
      if (this.seekName) {
        apiUrl += '&username=' + this.seekName
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
              this.getUserList()
              return
            }
            if (this.selId) {
              var mySelIDs = this.selId.slice()
              for (let i = 0; i < this.listdata.length; i++) {
                if (mySelIDs.indexOf(this.listdata[i].user_id) >= 0) {
                  this.$refs.fileTable.toggleRowSelection(this.listdata[i])
                }
              }
            }
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取人员信息失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取人员信息失败：' + err)
        })
    },
    // 获取公司列表：
    getComList() {
      var apiUrl =
        '/api' + '/company/find/list' + '?page=' + 1 + '&pageSize=' + 10
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            this.comlistdata = res.data.data.list
            this.comTotal = res.data.data.total
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

    // 获取指定用户所拥有的权限
    getUserAuthList(_userID, _callback, _scope) {
      this.isAuthLoading = true
      this.authList = []
      var apiUrl = '/api' + '/user/find/auth?' + 'userId=' + _userID
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              if (_callback) {
                // console.log('res.data.data:', res.data.data)
                _callback(_scope, res.data.data)
              } else {
                this.authList = res.data.data
              }
            } else {
              this.$message.error('拉取用户权限失败：' + res.data.message)
              if (_callback) {
                _callback(_scope, 'err')
              }
            }
          } else {
            this.$message.error('拉取用户权限失败！')
          }
          this.isAuthLoading = false
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.isAuthLoading = false
          this.$message.error('拉取用户权限失败：' + err)
          if (_callback) {
            _callback(_scope, 'err')
          }
        })
    },

    // 提交用户信息
    apiSaveUser() {
      var myBirthday = this.ruleForm.birthday
      var sData = new Date(myBirthday)
      if (!sData || (sData && isNaN(sData.getFullYear()))) {
        myBirthday = ''
      }
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      if (
        !this.ruleForm.company_name ||
        this.ruleForm.company_name.length === 0
      ) {
        this.ruleForm.company_name = this.$Storage.localGet('companyName')
      }
      const formData = new FormData()
      for (var I in this.ruleForm) {
        formData.append(I, this.ruleForm[I])
      }
      if (this.fileList && this.fileList.length > 0) {
        formData.append('file', this.fileList[0].raw)
        this.fileListB = JSON.parse(JSON.stringify(this.fileList))
      } else if (
        this.imageUrl &&
        this.imageUrl.length > 0 &&
        this.fileListB &&
        this.fileListB.length > 0
      ) {
        formData.append('file', this.fileListB[0].raw)
      }
      this.udShowStyle(true)
      this.$http
        .post(this.uploadUrl(), formData, config)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: this.adTitle + '成功！',
                type: 'success'
              })
              this.getUserList()
              this.udShowStyle(false)
            } else {
              this.urResponseErr(this.adTitle + '失败：' + res.data.message)
            }
          } else {
            this.urResponseErr(this.adTitle + '失败！')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr(this.adTitle + '失败:' + err)
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

    // 按钮触发-添加人员信息：
    toAdduser() {
      this.isATyle = 1
      this.adTitle = '添加人员信息'
      this.intSimData()
      this.udShowStyle(false)
      this.butTitleSubmit = '立即添加'
      this.placeholder_pass = '请输入登录密码'
      this.dialogVisible = true
    },

    // 按钮触发-编辑修改用户
    toEdituser(scope, _auth) {
      if (!_auth) {
        this.getUserAuthList(scope.row.user_id, this.toEdituser, scope)
        return
      }
      if (_auth && _auth[0].authority_name === 'ROLE_ADMIN') {
        if (!this.configGd.isAdmin) {
          this.$message({
            message: '您没有权限修改 [' + scope.row.username + '] 的信息!',
            type: 'warning'
          })
          return
        }
      }
      this.isATyle = 2
      this.adTitle = '修改人员信息'
      this.intSimData()
      for (var I in scope.row) {
        this.editUserData[I] = scope.row[I]
      }
      this.editUserData.password = ''
      this.udShowStyle(false)
      this.imgAutoZoom(this.editUserData.base64_img)
      this.butTitleSubmit = '保存修改'
      this.placeholder_pass = '若留空表示不修改密码'
      this.dialogVisible = true
    },
    // 预览详细信息
    doShowInfo(scope) {
      if (scope && scope.row) {
        this.userInfo = scope.row
      }
      this.InfoDialogVisible = true
      this.getUserAuthList(scope.row.user_id)
    },
    // 批量操作复选框
    handleSelectionChange(val) {
      this.selId = []
      this.selNames = []
      val.forEach((ele, indx) => {
        this.selId.push(ele.user_id)
        this.selNames.push(ele.username)
      })
    },
    // 获取和设置当前选中的人员列表
    getSelList(_item) {
      var mySelIDs = []
      var mySelNames = []
      var mySelNamesStr = ''
      if (_item) {
        mySelNamesStr = _item.username
        mySelIDs.push(_item.user_id)
        mySelNames.push(_item.username)
      } else {
        for (var i = 0; i < this.selNames.length; i++) {
          if (i < 3) {
            mySelNamesStr += this.selNames[i] + ','
            if (i >= 2 && this.selNames.length > 3) {
              mySelNamesStr += '...'
            }
          }
          mySelIDs.push(this.selId[i])
          mySelNames.push(this.selNames[i])
        }
        if (mySelNamesStr.charAt(mySelNamesStr.length - 1) === ',') {
          mySelNamesStr = mySelNamesStr.substr(0, mySelNamesStr.length - 1)
        }
      }
      return {
        SelIDs: mySelIDs,
        SelNames: mySelNames,
        SelNamesStr: mySelNamesStr
      }
    },
    // 分配权限
    async doAuthorized(scope, _auth) {
      var myScope = false
      if (scope && scope.row) {
        myScope = true
      } else if (!this.selId.length) {
        this.$message({
          message: '请选择您需要分配权限的人员!',
          type: 'warning'
        })
        return false
      }
      if (!_auth) {
        this.getUserAuthList(scope.row.user_id, this.doAuthorized, scope)
        return
      }
      if (_auth && _auth[0].authority_name === 'ROLE_ADMIN') {
        if (!this.configGd.isAdmin) {
          this.$message({
            message: '您没有权限分配 [' + scope.row.username + '] 的权限!',
            type: 'warning'
          })
          return
        }
      }
      var mySelList = this.getSelList(scope.row)
      if (mySelList) {
        this.$Storage.localSet('selId', mySelList.SelIDs)
        this.$Storage.localSet('selNames', mySelList.SelNames)
        this.$Storage.localSet('Scope', myScope)
        this.$Storage.localSet('page', {
          name: 'manmessage',
          page: this.currentPage
        })
        // this.$router.push({ path: '/authorized' })
        this.$router.push(
          '/authorized',
          () => {},
          e => {
            console.log('输出报错', e)
          }
        )
      }
    },
    // 删除人员按钮
    async doDel(scope) {
      this.isATyle = 3
      if (scope && scope.row) {
      } else if (!this.selId.length) {
        this.$message({ message: '请选择您需要删除的人员!', type: 'warning' })
        return false
      }
      // return { SelIDs: mySelIDs, SelNames: mySelNames, SelNamesStr: mySelNamesStr }
      var mySelList = this.getSelList(scope.row)
      if (mySelList) {
        var myNumsTip = ''
        if (mySelList.SelIDs.length > 1) {
          myNumsTip = ' 等 ' + mySelList.SelIDs.length + ' 人'
        }
        const confirmResult = await this.$confirm(
          '您确定要删除 [' + mySelList.SelNamesStr + ']' + myNumsTip + ' 吗?',
          '删除人员信息',
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
          .post('/api' + '/user/del', mySelList.SelIDs)
          .then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: '删除人员信息成功！',
                type: 'success'
              })
              this.udShowStyle(false, true)
              this.getUserList()
            } else {
              this.urResponseErr('删除人员信息失败：' + res.data.message)
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.urResponseErr('删除人员信息失败！')
          })
      }
    },
    // 导出：
    doExport(_noAll) {
      if (_noAll && !this.seekCompany && !this.seekName) {
        return
      }
      // scope.row
      var apiUrl = '/api' + '/export/user/info'
      let myparams = {
        // page: this.currentPage,
        // pageSize: this.pageSize
      }
      if (this.seekCompany) {
        // myparams.company_name = this.seekCompany
        myparams.companyName = this.seekCompany
      }
      if (this.seekName) {
        myparams.username = this.seekName
      }
      this.ExportLoading = true
      this.$http
        .get(apiUrl, {
          params: myparams,
          responseType: 'blob'
        })
        .then(res => {
          let myfilename = '_' + new Date().format('yyMMddhhmmss')
          if (this.seekName) {
            myfilename = '_' + this.seekName + myfilename
          }
          if (this.seekCompany) {
            myfilename = '_' + this.seekCompany + myfilename
          }
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '人员信息' + myfilename + '.xlsx')
          document.body.appendChild(link)
          link.click()
          this.ExportLoading = false
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.ExportLoading = false
          this.$message.error('导出人员信息失败：' + err)
        })
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getUserList(this.currentPage)
    },

    // 重置表单：
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.intSimData()
    },

    // 设置上传图片删除图标显示
    selectStyle(_show) {
      this.delicoVisible = _show
      // console.log('selectStyle:', this.delicoVisible)
    },
    // 上传api地址
    uploadUrl: function() {
      // return 'http://127.0.0.1:8081/uploadFile'
      if (this.isATyle === 1) {
        return '/api' + '/user/save'
      } else if (this.isATyle === 2) {
        return '/api' + '/user/update'
      }
    },
    // 加载本地图片：
    addFile(file, fileList) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'jpg'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$message({
          message: '上传文件只能是 jpg 格式!',
          type: 'warning'
        })
        // this.$refs.upload.clearFiles()
        this.$refs.upload.handleRemove(fileList[fileList.length - 1])
        return
      }

      this.fileList = fileList
      // 限制上传文件为5M
      // var sizeIsSatisfy = file.size < 5 * 1024 * 1024 ? true : false
      var sizeIsSatisfy = file.size / 1024 < 20

      var _this = this
      var eventR = event || window.event
      if (!eventR || !eventR.target || !eventR.target.files) {
        return
      }
      var fileR = eventR.target.files[0]
      var reader = new FileReader() // 转base64
      reader.onload = function(e) {
        _this.imgAutoZoom(e.target.result)
      }
      reader.readAsDataURL(fileR)
      this.fileSizeIsSatisfy = true
      this.setUpMsg('')
      if (sizeIsSatisfy) {
        return true
      } else {
        this.fileSizeIsSatisfy = false
        this.setUpMsg('图片文件大小不得超过20KB！')
        return false
      }
    },
    // 照片显示自适应：
    imgAutoZoom(_imgURL) {
      this.imageUrl = _imgURL // 将图片路径赋值给src
      var image = new Image()
      image.src = _imgURL
      var _this = this
      image.onload = function() {
        var myS = this.width / this.height
        var myW = 0
        var myH = 0
        if (myS >= 1) {
          myW = 200
          myH = Math.round(myW / myS)
        } else {
          myH = 200
          myW = Math.round(myH * myS)
        }
        _this.uImgWidth = myW + 'px'
        _this.uImgHeight = myH + 'px'
      }
    },
    // 初始化提交数据：
    intSimData() {
      this.ruleForm = {
        user_id: 0,
        username: '',
        password: '',
        company_name: '',
        sex: '',
        birthday: ''
      }
      this.removeFile()
      if (this.isATyle === 2) {
        for (var I in this.editUserData) {
          this.ruleForm[I] = this.editUserData[I]
        }
        this.imgAutoZoom(this.editUserData.base64_img)
      }
    },
    // 清除上传和显示的图片：
    removeFile() {
      if (this.imageUrl || (this.fileList && this.fileList.length > 0)) {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
        if (this.isATyle !== 2) {
          this.fileList = []
          this.fileSizeIsSatisfy = true
          this.imageUrl = ''
          this.uImgWidth = '200px'
          this.uImgHeight = '200px'
        }
        this.setUpMsg('')
      }
    },
    // // 删除触发事件：
    // handleRemove(file, fileList) {
    //   // this.removeFile()
    //   this.fileList = fileList // 删除某张图片时重新对imglist赋值
    // },
    // // 上传前触发：
    // beforeUpload(file) {
    //   // 检验并格式化生日：
    //   var sData = new Date(this.ruleForm.birthday)
    //   if (!sData || (sData && isNaN(sData.getFullYear()))) {
    //     this.ruleForm.birthday = ''
    //   }
    // },
    // 提交和上传：
    insert(formName) {
      // var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.isATyle === 1) {
          // if (this.fileList.length <= 0) {
          if (this.imageUrl.length <= 0) {
            this.$message({
              message: '请上传人脸照片',
              type: 'warning'
            })
            this.setUpMsg('请上传人脸照片')
            return
          }
          if (this.isATyle === 1 && !this.fileSizeIsSatisfy) {
            this.$message({
              message: '上传失败！图片文件大小不得超过20KB！',
              type: 'warning'
            })
            return
          }
          // }
          // if (this.fileList.length > 0) {
          //   this.$refs.upload.submit()
          // } else {
          //   this.apiSaveUser()
          // }
          this.apiSaveUser()
          // 手动上传文件，在点击确认的时候 校验通过才会去请求上传文件的url
          this.udShowStyle(true)
        } else {
          // this.$message.error('error submit!!')
          // this.$message.error('')
          if (this.imageUrl.length <= 0) {
            this.setUpMsg('请上传人脸照片')
          } else {
            this.$message({
              message: '上传失败！图片文件大小不得超过20KB！',
              type: 'warning'
            })
          }
          return false
        }
      })
    },
    // upHandSuccess(response, file, fileList) {
    //   // upHandSuccess response: {code: -1, data: null, message: "该用户已存在"}
    //   if (response) {
    //     var this.adTitle = '添加人员信息'
    //     if (this.isATyle === 2) {
    //       this.adTitle = '修改人员信息'
    //     }
    //     if (response.code === 0) {
    //       this.dialogVisible = false
    //       this.$message({
    //         message: this.adTitle + '成功！',
    //         type: 'success'
    //       })
    //       this.udShowStyle(false)
    //       this.getUserList()
    //     } else {
    //       this.urResponseErr(this.adTitle + '失败：' + response.message)
    //     }
    //   } else {
    //     this.urResponseErr(this.adTitle + '失败！')
    //   }
    // },
    // // 提交返回失败的处理：
    // urResponseErr(_errmsg) {
    //   if (this.isATyle !== 3) {
    //     this.$refs.upload.abort()
    //     this.$refs.upload.clearFiles()
    //     this.removeFile()
    //   }
    //   this.udShowStyle(false, true)
    //   this.$message.error(_errmsg)
    // },
    // upHandError(err, file, fileList) {
    //   this.udShowStyle(false, true)
    //   this.$refs.upload.abort()
    //   this.dialogVisible = false
    //   this.$message.error('添加人员信息失败：' + ' [' + err.status + ']')
    // },
    // upHandProgress(event, file, fileList) {
    //   // console.log('upHandProgress event:', event)
    //   // console.log('upHandProgress file:', file)
    //   // console.log('upHandProgress fileList:', fileList)
    // },
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
    // 上传照片时要提交的用户数据：
    upData() {
      // var myBirthday = this.ruleForm.birthday
      // if (myBirthday.length > 0) {
      //   myBirthday = new Date(myBirthday).format('yyyy-MM-dd')
      // }
      var sData = new Date(this.ruleForm.birthday)
      if (!sData || (sData && isNaN(sData.getFullYear()))) {
        this.ruleForm.birthday = ''
      }
      return {
        user_id: this.ruleForm.user_id,
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        company_name: this.ruleForm.company_name,
        sex: this.ruleForm.sex,
        birthday: this.ruleForm.birthday
      }
    },
    setUpMsg(_upMsg) {
      this.upMsg = _upMsg
    },
    rules() {
      var myReRules = JSON.parse(JSON.stringify(this.rulesBas))
      myReRules.username[0].validator = this.checkName
      if (this.isATyle === 1) {
      } else if (this.isATyle === 2) {
        myReRules.password[0].required = false
      }
      return myReRules
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

  .upimg-del-ico-show {
    display: block;
  }
  .upimg-del-ico-hide {
    display: none;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
}
</style>
