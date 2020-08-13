<!--
 * @Description: 数据管理-识别记录
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-09 16:46:42
-->

<template>
  <div>
    <el-card class="g_label" v-loading="diaLoading">
      <el-row justify="space-between" type="flex" :gutter="20" class="oneRow">
        <el-col :span="24">
          <div class="div_inline">
            时间:
            <el-date-picker
              class="el-date-picker-suffix"
              v-model="seekTime"
              size="small"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="date_picker_change"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row
        justify="space-between"
        type="flex"
        :gutter="20"
        class="oneRow"
        style="margin-top: -8px;"
      >
        <el-col :span="24">
          <div v-if="this.configGd.isAdmin" class="div_inline">
            企业:
            <el-select
              v-model="companyName"
              clearable
              size="small"
              @change="getList"
              @clear="getList"
              style="width:200px; margin-left: 5px;"
              placeholder="请选择企业"
            >
              <el-option
                v-for="item in comlistdata"
                :key="item.company_name"
                :label="item.company_name"
                :value="item.company_name"
              ></el-option>
            </el-select>
          </div>
          <div class="div_inline" style="margin-left: 10px;">
            <span style="color: #FF0000">异常:</span>
            <el-select
              v-model="alertSeek"
              clearable
              size="small"
              @change="alertChange"
              @clear="alertChange"
              style="width:160px; margin-left: 10px;"
              placeholder="请选择异常"
            >
              <el-option
                v-for="item in alertList"
                :key="item.value"
                :label="item.label"
                :value="{value:item.value, label:item.label}"
              ></el-option>
            </el-select>
          </div>
          <div class="div_inline">
            用户名:
            <el-input
              clearable
              size="small"
              class="el-input_co"
              style="width:132px"
              placeholder="请输入用户名"
              v-model="seekName"
              @keyup.enter.native="getList"
              @clear="getList"
            />
          </div>
          <div class="div_inline_button" style="margin-left: 7px;">
            <!-- 筛选按钮 -->
            <el-button
              @click="getList"
              class="el-button_co"
              type="primary"
              icon="el-icon-search"
              :loading="diaLoading"
            >搜索</el-button>
            <!-- 导出 -->
            <el-popconfirm
              title="是否要导出全部记录？如果否，请选择或输入筛选条件（注：筛选必须要点击“搜索”按钮后才会生效）。"
              confirmButtonText='导出全部'
              cancelButtonText='我要筛选'
              @onConfirm="doExport"
              width="350"
              :disabled="!isExportAll"
              style="margin-left: 7px;"
            >
              <el-button
                slot="reference"
                class="el-button_co"
                type="primary"
                icon="el-icon-download"
                :loading="ExportLoading"
                @click="doExport(true)"
              >导出</el-button>
            </el-popconfirm>
          </div>
          <div class="div_inline_button" style="margin-left: 10px;">
            <!-- 刷新按钮 -->
            <el-button
              @click="getList(true)"
              class="el-button_co"
              type="success"
              icon="el-icon-refresh"
              :loading="diaLoading"
            >刷新</el-button>
          </div>
          <div class="div_inline div_right">记录总数: {{pageTotal}}</div>
        </el-col>
      </el-row>
      <el-row>
        <!-- 表格 -->
        <el-table
          style="width: 100%;"
          :header-cell-style="{background:'#eee',color:'#000'}"
          :data="listdata"
          :cell-style="tableRowStyle"
          stripe
        >
          <el-table-column prop="info_id" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="base64_picture" label="现场照-吹气照" align="center" style="min-width:100px;">
            <template slot-scope="scope" style="min-width:100px;">
              <div class="baseImage" style="min-width:100px;">
                <img style="width:49px;height:80px;object-fit:cover;" :src="getimgurl(scope.row.base64_picture)" />
                <img v-if="scope.row.alcohol_picture" style="width:49px;height:80px;object-fit:cover;margin-left:1px;" :src="getimgurl(scope.row.alcohol_picture)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="用户名" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
              <i :class="getSexIco(scope.row.sex)" style="margin:0 8px;"></i>
            </template>
          </el-table-column>
          <el-table-column prop="temperature" label="体温" align="center" width="90px">
            <template slot-scope="scope">
              <el-card v-if="configGd.noMask" shadow="never" :class="gettemperatureClass(scope.row.passMessage)">
                <div class="temperature_div">
                  <span class="temperature_txt">{{scope.row.temperature}}</span>
                  <img class="temperature_ico" :src="getmaskImg(scope.row.mounthocc)" />
                </div>
              </el-card>
              <span v-else :class="gettemperatureClass(scope.row.passMessage)">{{scope.row.temperature}}</span> ℃
            </template>
          </el-table-column>
          <el-table-column prop="alcohol_content" label="酒检 (gm/ml)" align="center" width="140px">
            <template slot-scope="scope" style="min-width:100px;">
              <!-- <i :class="getIcoClass('alcoholMessage', scope.row.alcoholMessage)" style="font-size:24px;position:absolute;z-index:2;text-align:center;margin:40px 16px;"></i> -->
              <div style="width:120px;position:absolute;z-index:1;text-align:center;margin:22px auto;" :class="getalcoholClass(scope.row.alcoholMessage)">{{scope.row.alcohol_content}}</div>
              <el-progress :width="52" type="dashboard" :percentage="getLalcohol(scope.row.alcohol_content)" :format="alcoholFormat" :color="getColor('alcoholMessage', scope.row.alcoholMessage)" style="margin-top:7px;z-index:0;"></el-progress>
            </template>
          </el-table-column>
          <el-table-column v-if="configGd.passKey==='pass'" prop="pass" label="是否通行" align="left" style="min-width:160px">
            <template slot-scope="scope" style="min-width:160px;">
              <div class="div_inline" style="margin:5px 0 0 0; font-size: 22px;"><i :class="getIcoClass('pass', scope.row.pass)"></i></div>
              <div class="div_inline passTxt temperature_txt" :style="getFoClass('pass', scope.row.pass, 30)" align="left">{{scope.row.pass}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="configGd.passKey==='drinking'" prop="pass" label="酒检结果" align="left" width="100px">
            <template slot-scope="scope">
              <div class="div_inline" style="margin:5px 0 0 0; font-size: 22px;"><i :class="getIcoClass('alcoholMessage', scope.row.alcoholMessage)"></i></div>
              <div class="div_inline passTxt temperature_txt" :style="getFoClass('alcoholMessage', scope.row.alcoholMessage, 30)" align="left">{{scope.row.alcoholMessage}}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="this.configGd.isAdmin"
            prop="company_name"
            label="所属企业"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="serialNo" label="设备序列号" align="center"></el-table-column> -->
          <el-table-column prop="device_address" label="位置" align="left"></el-table-column>
          <el-table-column label="识别时间" align="center">
            <template scope="scope"><span class="g_label-s">{{ scope.row.create_time.substr(0, 16) }}</span></template>
          </el-table-column>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-document" @click="doShowInfo(scope)"></el-button>
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

    <!-- 识别记录详细信息对话框： -->
    <el-dialog
      title="识别记录详细信息"
      :visible.sync="InfoDialogVisible"
      :destroy-on-close="true"
      width="900px"
    >
      <el-row
        justify="space-between"
        type="flex"
        :gutter="0"
        style="margin-top: -20px; margin-bottom: -15px;"
      >
        <el-col :span="3" class="g_label2" style="padding:0; margin: 0;width:80px;" align="left">
          <span class="txt-name" style="color:#666666;line-height:12px;">{{recordInfo.name}}</span>
          <i :class="getSexIco(recordInfo.sex)" style="margin:0 8px;"></i>
        </el-col>
        <el-col :span="3" class="g_label2" style="padding:0; margin: 0;width:90px;" align="left">
          体温: <span :class="gettemperatureClass(recordInfo.passMessage)"
          >{{recordInfo.temperature}}</span> ℃<img v-if="configGd.noMask"
                      :src="getmaskImg(recordInfo.mounthocc, true)"
                      style="width: 14px; margin-top:-2px; margin-left:8px;"
                    />
        </el-col>
        <!-- <el-col :span="4" class="g_label2" style="padding:0; margin: 0;width:150px;" align="left">
          酒精含量: <span :class="getalcoholClass(recordInfo.alcoholMessage)"
          >{{recordInfo.alcohol_content}}</span> mg/100ML
        </el-col> -->
        <el-col v-if="configGd.passKey==='pass'" :span="3" class="g_label2" style="padding:0; margin: 0;width:180px;" align="left">
          是否通行: <i :class="getIcoClass('pass', recordInfo.pass)" style="font-size: 17px; margin-top:-5px; margin-right:3px"></i>
          <span :style="getFoClass('pass', recordInfo.pass)">{{recordInfo.pass}}</span>
        </el-col>
        <el-col v-if="configGd.passKey==='drinking'" :span="3" class="g_label2" style="padding:0; margin: 0;width:270px;" align="left">
          酒检结果: <i :class="getIcoClass('alcoholMessage', recordInfo.alcoholMessage)" style="font-size: 17px; margin-top:-5px; margin-right:3px"></i>
          <span :style="getFoClass('alcoholMessage', recordInfo.alcoholMessage)">{{recordInfo.alcoholMessage}}</span>
          <span :class="getalcoholClass(recordInfo.alcoholMessage)" style="margin-left:10px;">{{recordInfo.alcohol_content}}</span> mg/100ML
        </el-col>
        <el-col
          :span="3"
          class="g_label2"
          style="padding:0; margin: 0;"
        ><i class="g_sex-max gdicondingwei" style="margin-right:5px"></i>{{recordInfo.device_address}}</el-col>
        <el-col :span="4" class="g_label2" style="padding:0; margin: 0;">{{recordInfo.create_time}}</el-col>

        <!-- <el-col :span="6" class="g_label2" style="padding:0; margin: 0;" align="left">
          <el-card
            shadow="never"
            :class="gettemperatureClass(recordInfo.passMessage)"
            style="padding:0; margin: -4px 0 0 15px; width: 72px; height: 24px;"
          >
            <div class="temperature_div" style="margin-left: -3px; margin-top: -7px">
              <span class="temperature_txt">{{recordInfo.temperature}}</span>
              <img class="temperature_ico" :src="getmaskImg(recordInfo.mounthocc)" />
            </div>
          </el-card>
        </el-col>
        <el-col
          :span="6"
          class="g_label2"
          style="padding:0; margin: 0;"
        >{{recordInfo.device_address}}</el-col>
        <el-col :span="5" class="g_label2" style="padding:0; margin: 0;" align="left">
          <span>{{recordInfo.passResult}}</span>
        </el-col>
        <el-col :span="6" class="g_label2" style="padding:0; margin: 0;">{{recordInfo.create_time}}</el-col>
        <el-col :span="1"></el-col> -->
      </el-row>
      <el-divider></el-divider>
      <el-row justify="space-between" type="flex" :gutter="0" style="margin-top: -25px;">
        <el-col :span="24" class="g_labelBox" style="width: 100%;; height: 380px;">
          <!-- <div
            class="div-rc-vp div-rc-photo div-rc-photo-left"
            :style="{backgroundImage:'url(' + getPciSrc(recordInfo.base64_picture) + ')'}"
            align="right"
          ></div>
          <div
            class="div-rc-vp div-rc-photo div-rc-photo-right"
            :style="{backgroundImage:'url(' + getPciSrc(recordInfo.master_map) + ')'}"
            align="left"
          ></div> -->
                <div
                  class="div-rc-vp div-rc-photo div-rc-photo-left"
                  :style="{backgroundImage:'url(' + getPciSrc(recordInfo.base64_picture) + ')', position:'relative'}"
                  align="right"
                >
                  <div class="photo_tip_rc_l" style="right:0">
                      <i v-if="recordInfo.base64_picture==='' || !recordInfo.base64_picture" class="photo_ico el-icon-warning"></i><span>现场抓拍照片</span>
                  </div>
                </div>
                <div
                  class="div-rc-vp div-rc-photo div-rc-photo-center"
                  :style="{backgroundImage:'url(' + (recordInfo.master_map?getPciSrc(recordInfo.master_map):getPciSrc(recordInfo.base64_picture)) + ')', position:'relative'}"
                  align="center"
                >
                  <div class="photo_tip_rc_m" style="margin:auto;right:0;left:0;">
                      <span style="color:#99CCFF">人脸库照片</span><i v-if="recordInfo.master_map==='' || !recordInfo.master_map" class="photo_ico el-icon-warning"></i>
                  </div>
                </div>
                <div
                  class="div-rc-vp div-rc-photo div-rc-photo-right"
                  :style="{backgroundImage:'url(' + (recordInfo.alcohol_picture?getPciSrc(recordInfo.alcohol_picture):getPciSrc(recordInfo.base64_picture)) + ')', position:'relative'}"
                  align="left"
                >
                  <div class="photo_tip_rc_r" style="left:0">
                      <span>吹气过程照片</span><i v-if="recordInfo.alcohol_picture==='' || !recordInfo.alcohol_picture" class="photo_ico el-icon-warning"></i>
                  </div>
                </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
const colorBgGreen = '#002200'
const colorBgRed = '#220000'
const colorBgOrange = '#3F2800'
const colorBgAther = '#031c34'
const colorGreen = '#009900'
const colorRed = '#FF0000'
const colorOrange = '#FF9900' // FF9900
const colorAther = '#7e9aab'

export default {
  data() {
    return {
      ExportLoading: false, // 正在导出
      websock: null,
      diaLoading: false,
      // 按时间筛选数据
      seekTime: ['', ''],
      // 异常筛选 当前label：
      alertSel_label: '',
      // 异常筛选：
      alertSel: {
        all: false,
        unusual: false,
        drinking: false,
        noMask: false,
        stranger: false
      },
      comlistdata: [],
      // 企业总数
      comTotal: 0,
      // 按企业筛选
      companyName: '',
      // 按用户名筛选数据
      seekName: '',
      // 按设备序列号筛选数据
      // seekSerialNo: '',
      // 设备表单数据
      listdata: [],
      // 选择设备
      devicename: [],
      currentPage: 1,
      pageSize: 7,
      pageTotal: 0,
      /** 异常筛选 */
      alertSeek: '',
      alertList: [
        { label: '全部异常', value: 'allaler' },
        { label: '体温异常', value: 'unusual' },
        { label: '酒检异常', value: 'drinking' },
        { label: '未戴口罩', value: 'noMask' },
        { label: '陌生人', value: 'stranger' }
      ],
      InfoDialogVisible: false, // 识别记录详细信息对话框
      // 要查看的识别记录信息：
      recordInfo: {
        info_id: 0,
        name: '',
        create_time: '',
        device_address: '',
        sex: '',
        master_map: '',
        base64_picture: '' // 照片地址
      },
      // colors: [
      //   { color: '#f56c6c', percentage: 20 },
      //   { color: '#e6a23c', percentage: 40 },
      //   { color: '#5cb87a', percentage: 60 },
      //   { color: '#1989fa', percentage: 80 },
      //   { color: '#6f7ad3', percentage: 100 }
      // ]
      colors: [
        { color: '#666666', percentage: 0 },
        { color: '#FF9900', percentage: 79 },
        { color: '#FF0000', percentage: 80 }
      ]
    }
  },
  computed: {
    isExportAll() {
      return (!this.companyName && !this.seekName && !this.alertSel.all && !this.alertSel.unusual && !this.alertSel.drinking && !this.alertSel.noMask && !this.alertSel.stranger)
    }
  },
  created() {
    // console.log(new Date().format("yyyy-MM-dd hh:mm:ss"))
    // console.log(this.seekTime)
    var timeStart = new Date()
    timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
    var timeEnd = new Date()
    this.seekTime = [
      timeStart.format('yyyy-MM-dd hh:mm:ss'),
      timeEnd.format('yyyy-MM-dd hh:mm:ss')
    ]
    this.getList()
    this.getComList()
  },
  destroyed() {
    if (this.websock) {
      this.websock.close() // 离开路由之后断开websocket连接
      this.websock = null
    }
  },
  methods: {
    initWebSocket() {
      // 初始化weosocket
      // const wsuri = 'ws://39.97.104.66:8085/app/'
      const wsuri = this.configGd.wshost + '/app/' // '/ws/app/'
      this.websock = new WebSocket(wsuri + this.configGd.companyName)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      // console.log('WebSocket 连接成功: ')
      // let actions = {"test":"12345"};
      // this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) {
      // 数据接收
      const data = JSON.parse(e.data)
      // console.log('WebSocket 收到消息: ' + data)
      // this.checkuddata(data)
      if (data) {
        // console.log('data.code', data.code, data.data, (data.code === 0), (data.data === 'inform'))
        if (data && data.code === 0 && data.data === 'inform') {
          // console.log('刷新啦！')
          var timeStart = new Date()
          timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
          var timeEnd = new Date()
          this.seekTime = [
            timeStart.format('yyyy-MM-dd hh:mm:ss'),
            timeEnd.format('yyyy-MM-dd hh:mm:ss')
          ]
          this.getList()
        }
      }
    },
    websocketsend(Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      console.log('record 已断开连接', e)
    },
    getList(_res) {
      console.log(
        'this.seekTime:',
        this.seekTime,
        !this.seekTime,
        !this.seekTime[0],
        !this.seekTime[1]
      )
      if (_res || !this.seekTime || !this.seekTime[0] || !this.seekTime[1]) {
        var timeStart = new Date()
        timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
        var timeEnd = new Date()
        this.seekTime = [
          timeStart.format('yyyy-MM-dd hh:mm:ss'),
          timeEnd.format('yyyy-MM-dd hh:mm:ss')
        ]
      }
      var apiUrl =
        '/api' +
        '/device/find/info' +
        '?page=' +
        this.currentPage +
        '&pageSize=' +
        this.pageSize +
        '&startTime=' +
        this.seekTime[0] +
        '&endTime=' +
        this.seekTime[1] +
        '&all=' +
        this.alertSel.all +
        '&unusual=' +
        this.alertSel.unusual +
        '&drinking=' +
        this.alertSel.drinking +
        '&noMask=' +
        this.alertSel.noMask +
        '&stranger=' +
        this.alertSel.stranger
      if (this.seekName) {
        apiUrl += '&username=' + this.seekName
      }
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
            if (
              (!this.listdata || this.listdata.length === 0) &&
              this.pageTotal > 0 &&
              this.currentPage > 1
            ) {
              this.currentPage = Math.ceil(this.pageTotal / this.pageSize)
              this.getList()
              return
            }
            this.udShowStyle(false)
            if (!this.websock) {
              this.initWebSocket()
            }
          } else {
            this.urResponseErr('获取识别记录失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取识别记录失败：' + err)
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
            this.urResponseErr('获取公司列表失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取公司列表失败：' + err)
        })
    },
    // 异常筛选设置：
    alertChange(_item) {
      console.log('alertChange _item:', _item)
      let myVal = ''
      this.alertSel_label = ''
      this.alertSel.all = false
      this.alertSel.unusual = false
      this.alertSel.drinking = false
      this.alertSel.noMask = false
      this.alertSel.stranger = false
      if (_item) {
        this.alertSel_label = _item.label
        myVal = _item.value
        if (myVal) {
          if (myVal === 'allaler') {
            // this.alertSel.unusual = true
            // this.alertSel.noMask = true
            // this.alertSel.stranger = true
            this.alertSel.all = true
          } else {
            this.alertSel[myVal] = true
          }
        }
      }
      console.log('alertChange this.alertSel_label:', this.alertSel_label, myVal)
      this.getList()
    },
    // 查询设备按钮http://localhost:8085/device/find/info?startTime=2020-03-04 18:10:21&endTime=2020-03-04 18:15:23&username=黄新乐
    pictrue(scope) {
      console.log(scope.row)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      console.log(file.url)
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getList()
    },
    date_picker_change(val) {
      console.log(`时间: ${val}`)
      console.log(this.seekTime)
      this.getList()
    },
    // 获取是否戴口罩：
    getmaskImg(_mounthocc) {
      if (_mounthocc === '戴口罩') {
        return require('../../assets/img/mask01.png')
      } else {
        return require('../../assets/img/mask02.png')
      }
    },
    // 获取酒精含量文字样式：
    getalcoholClass: function(_alcoholMessage, _s) {
      if (!_alcoholMessage || _alcoholMessage.length === 0) {
        _alcoholMessage = this.alcoholMessage
      }
      var restr = 'temperature_bas temperature_txt '
      if (_s) {
        restr = 'temperature_bas_s temperature_txt '
      }
      if (_alcoholMessage === '醉酒') {
        return restr + 'temperatureB'
      } else if (_alcoholMessage === '饮酒') {
        return restr + 'temperatureO'
      } else {
        // return restr + 'temperatureNH'
        return restr + 'temperatureA'
      }
    },
    // 获取体温样式：
    gettemperatureClass(_passMessage) {
      if (_passMessage === '体温正常') {
        return 'temperature temperatureA'
      // } else if (_passMessage === '体温过高') {
      //   return 'temperature temperatureB'
      // } else if (_passMessage === '体温过低') {
      //   return 'temperature temperatureC'
      } else {
        return 'temperature temperatureB'
      }
    },
    // 获取照片地址:
    getimgurl(_url) {
      if (_url.length === 0 || _url.substr(0, 4) === 'http') {
        return _url
      } else {
        return 'data:image/jpg;base64,' + _url
      }
    },
    // 预览详细信息接口
    doShowInfo(scope) {
      if (scope && scope.row) {
        this.recordInfo = scope.row
      }
      this.InfoDialogVisible = true
    },
    // 获取面板机实时帧图：
    getPciSrc(_imgurl) {
      // this.NowFaceStyle = this.getNowFaceStyle()
      if (_imgurl && _imgurl.length > 0) {
        return this.getimgurl(_imgurl)
      }
      var _sex = this.sex
      var sexN = 'boy'
      if (_sex === '女') {
        sexN = 'girl'
      }
      var imgURL = require('../../assets/img/face_' + sexN + '_w.png')
      return imgURL
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
    // 表格行样式
    tableRowStyle({ row, rowIndex }) {
      // return 'background-color:pink;font-size:15px;'
      // {padding:'0';min-height:'80'}
      return 'padding:0;min-height:80px;height:80px;'
    },
    // 导出：
    doExport(_noAll) {
      if (_noAll && !this.companyName && !this.seekName && !this.alertSel.all && !this.alertSel.unusual && !this.alertSel.noMask && !this.alertSel.stranger) {
        return
      }
      var apiUrl = '/api' + '/export/capture/record'
      let myparams = {
        startTime: this.seekTime[0],
        endTime: this.seekTime[1],
        all: this.alertSel.all,
        unusual: this.alertSel.unusual,
        drinking: this.alertSel.drinking,
        noMask: this.alertSel.noMask,
        stranger: this.alertSel.stranger
      }
      if (this.companyName) {
        myparams.companyName = this.companyName
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
          if (this.alertSel_label) {
            myfilename = '_' + this.alertSel_label + myfilename
          }
          if (this.companyName) {
            myfilename = '_' + this.companyName + myfilename
          }
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '识别记录' + myfilename + '.xlsx')
          document.body.appendChild(link)
          link.click()
          this.ExportLoading = false
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.ExportLoading = false
          this.$message.error('导出识别记录失败：' + err)
        })
    },

    /** 获取背景样式
     * @param _type  'pass'通过情况，'passMessage'体温情况，'alcoholMessage'饮酒情况，'mounthocc'口罩情况
     */
    getBgClass(_type, _msgv) {
      if (_type === 'pass') {
        if (_msgv && _msgv.indexOf('不通过') >= 0) {
          return { backgroundColor: colorBgRed }
        } else if (_msgv && _msgv === '通过') {
          return { backgroundColor: colorBgGreen }
        } else {
          return { backgroundColor: colorBgAther }
        }
      } else if (_type === 'alcoholMessage') {
        if (_msgv === '醉酒') {
          return { backgroundColor: colorBgRed }
        } else if (_msgv === '饮酒') {
          return { backgroundColor: colorBgOrange }
        } else {
          return { backgroundColor: colorBgAther }
        }
      }
    },

    /** 获取前景样式
     * @param _type  'pass'通过情况，'passMessage'体温情况，'alcoholMessage'饮酒情况，'mounthocc'口罩情况
     */
    getFoClass(_type, _msgv, _lineH = 0) {
      let reStyle = { color: colorAther }
      if (_lineH > 0) {
        reStyle.lineHeight = _lineH + 'px'
      }
      if (_type === 'pass') {
        if (_msgv && _msgv.indexOf('不通过') >= 0) {
          reStyle.color = colorRed
          reStyle.fontWeight = 800
        } else if (_msgv && _msgv === '通过') {
          reStyle.color = colorGreen
          reStyle.fontWeight = 800
        }
      } else if (_type === 'alcoholMessage') {
        reStyle.fontWeight = 800
        if (_msgv === '醉酒') {
          reStyle.color = colorRed
          // reStyle.fontWeight = 800
        } else if (_msgv === '饮酒') {
          reStyle.color = colorOrange
          // reStyle.fontWeight = 800
        } else {
          reStyle.color = colorGreen
        }
        reStyle.textAlign = 'left'
      }
      return reStyle
    },

    getIcoClass(_type, _msgv) {
      if (_type === 'pass') {
        if (_msgv && _msgv.indexOf('不通过') >= 0) {
          return 'color-error el-icon-error'
        } else if (_msgv && _msgv === '通过') {
          return 'color-success el-icon-success'
        } else {
          return 'el-icon-warning-outline'
        }
      } else if (_type === 'alcoholMessage') {
        if (_msgv === '醉酒') {
          return 'color-error el-icon-error'
        } else if (_msgv === '饮酒') {
          return 'color-warning el-icon-warning'
        } else {
          return 'color-success el-icon-success'
        }
      }
    },

    // 获取性别图标：
    getSexIco(_sex, _size = 'max') {
      let Tsize = 'g_sex-' + _size
      if (_sex && _sex.indexOf('男') >= 0) {
        return Tsize + ' gdiconnan1'
      } else if (_sex && _sex.indexOf('女') >= 0) {
        return Tsize + ' gdiconnv1'
      } else {
        return Tsize
      }
    },

    getLalcohol (_alcohol) {
      if (_alcohol && _alcohol > 0) {
        if (_alcohol > 100) {
          _alcohol = 100
        }
        return _alcohol
      } else {
        return 0
      }
    },

    getColor(_type, _msgv) {
      if (_type === 'pass') {
        if (_msgv && _msgv.indexOf('不通过') >= 0) {
          return colorRed
        } else if (_msgv && _msgv === '通过') {
          return colorGreen
        }
      } else if (_type === 'alcoholMessage') {
        if (_msgv === '醉酒') {
          return colorRed
        } else if (_msgv === '饮酒') {
          return colorOrange
        } else {}
      }
      return colorAther
    },

    alcoholFormat(percentage) {
      // return percentage + ''
      return ''
    }
  }
}
</script>
<style lang="less" scoped>
.color-success {
  color: #00AA00;
}
.color-warning {
  color: #FF9900;
}
.color-error {
  color: #EE0000;
}

.passTxt {
  margin: 0;
  padding: 0 0 0 3px;
  text-align: left;
  min-width: 120px;
}

.temperature {
  width: 80px;
  height: 30px;
  margin: 0 auto;
  border-radius: 15px;
  text-align: left;
  line-height: 0px;
  font-size: 14px;
  font-weight: 600;
  border-width: 2px;
  margin-top: 0px;
  .temperature_div {
    margin-top: -6px;
  }
  .temperature_txt {
    margin-left: -8px;
    margin-top: 0px;
  }
  .temperature_ico {
    margin-left: 30px;
    margin-top: -14px;
  }
}
.temperatureA {
  color: #008e2b;
  // border-color: #8cd28f;
  border-color: #cfe2cf;
}
.temperatureB {
  // color: #ffffff;
  color: #e60012;
  border-color: #e60012;
  // background-color: #e60012;
}
.temperatureC {
  // color: #ffffff;
  color: #0080ff;
  border-color: #0080ff;
  // background-color: #0080ff;
}
.temperatureN {
  color: #777777;
  // border-color: #0080ff;
  // background-color: #0080ff;
}
.temperatureNH {
  color: #777777;
  // border-color: #0080ff;
  // background-color: #0080ff;
}

.checkbox-un {
  color: #ff0006 !important;
  border-color: #ff0006 !important;
  //background-color: #ffb9b7 !important;
}

.baseImage {
  img {
    height: 80px;
  }
}

.div-rc-vp {
  margin: 0;
  padding: 0;
}
.div-rc-photo {
  width: 284px; // 48% 32%
  height: 380px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center; //center bottom
  background-size: cover; // cover contain
}
.div-rc-photo-left {
  margin-right: 1px;
  background-position-x: right;
}
.div-rc-photo-center {
  margin-right: 1px;
  margin-left: 1px;
  background-position-x: right;
}
.div-rc-photo-right {
  margin-left: 1px;
  background-position-x: left;
}
// .isTemperature {
//   img {

//   }
// }

/** 照片标签 */
.photo_tip_rc_l, .photo_tip_rc_m, .photo_tip_rc_r {
  position:absolute;
  // background:#000000;
  // opacity: 0.7;
  background-color: rgba(0,0,0,0.5);
  height:22px;
  bottom:3px;
}
.photo_tip_rc_l, .photo_tip_rc_m, .photo_tip_rc_r span {
  color: #FFF;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}
.photo_tip_rc_l {
  width:175px;
  right:0;
  border-radius: 15px 0 0 15px;
  padding: 2px 8px 0px 0;
}
.photo_tip_rc_m {
  width:200px;
  margin:auto;right:0;left:0;
  border-radius: 15px;
  padding: 2px 0 0px 0;
}
.photo_tip_rc_r {
  width:175px;
  left:0;
  border-radius: 0 15px 15px 0;
  padding: 2px 0 0px 8px;
}
.photo_ico {
  margin: 0 3px;
  color: #FF0000;
}
</style>
