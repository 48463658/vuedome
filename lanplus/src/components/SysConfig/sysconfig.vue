<!--
 * @Description: 设置配置
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-09 11:23:55
 -->

<template>
  <div>
    <el-card class="g_label" v-loading="diaLoading">
      <div style="padding: 0 15px 0 15px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="LOGO与标题" name="first" class="g-tab-pane">
            <el-row
              justify="space-between"
              type="flex"
              :gutter="20"
              class="oneRow"
              style="min-height:85px;height:85px;padding-left:8px;"
            >
              <el-col :span="1" style="min-width:200px;width:200px;padding-top:8px;" align="left">
                <span class="card-title-s">网站标题图标favicon</span>(.ico)
                <br />
                <span
                  style="color:#aaaaaa;font-size:12px;"
                >16/64x16/64px, &lt;12KB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </el-col>
              <el-col :span="1" style="width:194px;padding:0;" align="left">
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
              style="min-height:120px;height:120px;padding-left:8px;"
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
                style="width:314px;height:314px;padding:5px 5px 10px 5px;"
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
              style="min-height:120px;height:40px;margin-top:15px;padding-left:8px;"
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-row justify="space-between" type="flex" :gutter="20" class="twoRow">
        <el-col :span="24">
          <el-divider></el-divider>
          <div class="div_content div-bottom-button div_right">
            <!-- 保存按钮 -->
            <el-button
              @click="insert"
              class="el-button_co"
              type="primary"
              icon="el-icon-circle-check"
              :loading="diaLoading"
              :disabled="!configGd.Auth.write"
              style="width:98px;"
            >保存设置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
// import store from '../../store/store.js'

export default {
  data() {
    return {
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

      diaLoading: false,
      activeName: 'first',

      warnId: 0,
      company_id: 0,
      company_name: '蓝普金睛', // 当前配置公司名
      ico: '',
      logo: '',
      title: ''
    }
  },
  created() {
    // var item = { title: '蓝普啦', ico: 'ico1', logo: 'logo1' }
    // // store.dispatch('setComVI', item)
    // store.commit('setComVI', item)

    this.company_name = this.$Storage.localGet('companyName')
    this.getComList()
  },
  mounted() {
    this.setUpMsg(0, '')
  },
  computed: {},
  methods: {
    // 获取企业列表数据
    getComList() {
      this.fileSizeIsSatisfy = true
      var apiUrl =
        '/api' +
        '/company/find/list' +
        '?page=1&pageSize=1' +
        '&company_name=' +
        this.company_name
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data && res.data.data.list) {
            this.company_id = res.data.data.list[0].company_id
            this.company_name = res.data.data.list[0].company_name
            this.ico = res.data.data.list[0].ico
            this.logo = res.data.data.list[0].logo
            this.title = res.data.data.list[0].title
            if (this.ico) {
              this.imageUrl = this.ico
            }
            if (this.logo) {
              this.imageUrl2 = this.logo
            }
            if (this.title) {
              this.sysTitle = this.title
            }
            let comVI = {
              company_id: this.company_id,
              company_name: this.company_name,
              ico: this.ico,
              logo: this.logo,
              title: this.title
            }
            this.configGd.saveComVI(this, comVI)
            // store.commit('setComVI', comVI)
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

    // 提交返回失败的处理：
    urResponseErr(_errmsg) {
      this.udShowStyle(false)
      this.$message.error(_errmsg)
    },
    // 提交开始或结束
    udShowStyle(_start) {
      this.diaLoading = _start
    },

    beforeUpload2(file) {
      console.log(file)
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'jpg'
      const extension2 = testmsg === 'png'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 jpg、png 格式!',
          type: 'warning'
        })
      }
      // if(!isLt2M) {
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      //         type: 'warning'
      //     });
      // }
      // return (extension || extension2) && isLt2M
      return extension || extension2
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
    insert() {
      if (!this.fileSizeIsSatisfy) {
        return
      }
      if (!this.fileSizeIsSatisfy2) {
        return
      }
      if (!this.checkSysTitle()) {
        return
      }
      this.apiSaveUser()
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
    // 提交信息
    apiSaveUser() {
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const formData = new FormData()
      formData.append('company_id', this.company_id)
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
      this.udShowStyle(true)
      this.$http
        .post('/api' + '/company/update', formData, config)
        // .post('/api' + '/company/update', jsonData)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: '设置LOGO和标题成功！',
                type: 'success'
              })
              this.removeFile()
              this.getComList()
              this.udShowStyle(false)
            } else {
              this.urResponseErr('设置LOGO和标题失败：' + res.data.message)
            }
          } else {
            this.urResponseErr('设置LOGO和标题失败！')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('设置LOGO和标题失败:' + err)
        })
    },
    base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64)
      var binaryLen = binaryString.length
      var bytes = new Uint8Array(binaryLen)
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i)
        bytes[i] = ascii
      }
      return bytes
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
    }
  }
}
</script>
<style lang="less" scoped>
.g-tab-pane {
  padding: 10px 0 10px 0;
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
