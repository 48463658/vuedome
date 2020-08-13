<!--
 * @Description: 视频预览,实时数据,异常报警
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-08 20:29:11
-->

<template style="height: 100%">
  <div class="div-vp g_label2">
    <el-container direction="horizontal" class="no-scroll">
      <el-aside class="el-aside-vp" width="180px" style="padding: 5px;">
        <el-alert
          ref="alert"
          class="el-alert-vp"
          :closable="false"
          effect="dark"
          title="请选定设备查看"
          center
          show-icon
          type="info"
        ></el-alert>
        <div class="div-vp">
          <gdtree
            lazy
            node-key="id"
            :default-expanded-keys="[0]"
            ref="tree"
            check-strictly
            check-on-click-node
            show-checkbox
            @check-change="personlist"
            :data="treecomdata"
            :props="props"
            :load="loadNode"
            class="el-aside-vp"
            style=" width: 100%; margin-top: 3px"
          ></gdtree>
        </div>
      </el-aside>
      <el-container
        class="el-container-vpM"
        direction="vertical"
        style="padding-left:8px; padding-right:8px"
      >
        <el-header class="el-0-bas" height="58px">
          <div class="div-num div-num-l" align="middle">
            <div class="div-vp div-vp-d" style="padding-bottom: 5px">人员总数</div>
            <div v-if="v_total > 0" class="div-vp div-vp-n">{{v_total}}</div>
            <div v-else class="div-vp div-vp-n">-</div>
          </div>
          <div class="div-num div-num-l" align="middle">
            <div class="div-vp div-vp-d" style="padding-bottom: 5px">未签到人数</div>
            <div v-if="v_total > 0" class="div-vp div-vp-n">{{v_total-v_totalnum}}</div>
            <div v-else class="div-vp div-vp-n">-</div>
          </div>
          <div class="div-num div-num-l" align="middle">
            <div class="div-vp div-vp-d" style="padding-bottom: 5px">签到人数</div>
            <div v-if="v_total > 0" class="div-vp div-vp-n">{{v_totalnum}}</div>
            <div v-else class="div-vp div-vp-n">-</div>
          </div>
          <div class="div-num div-num-l" align="middle">
            <div class="div-vp div-vp-d" style="padding-bottom: 5px">体温异常</div>
            <div v-if="v_total > 0" class="div-vp div-vp-n">{{v_unusual}}</div>
            <div v-else class="div-vp div-vp-n">-</div>
          </div>
          <div v-if="configGd.noMask" class="div-num div-num-l" align="middle">
            <div class="div-vp div-vp-d" style="padding-bottom: 5px">酒检异常</div>
            <div v-if="v_total > 0" class="div-vp div-vp-n">{{v_drinking}}</div>
            <div v-else class="div-vp div-vp-n">-</div>
          </div>
          <div v-if="configGd.noMask" class="div-num div-num-l" align="middle">
            <div class="div-vp div-vp-d" style="padding-bottom: 5px">未戴口罩</div>
            <div v-if="v_total > 0" class="div-vp div-vp-n">{{v_noMask}}</div>
            <div v-else class="div-vp div-vp-n">-</div>
          </div>

        </el-header>
        <el-main class="el-main-vpB div-middle no-scroll" align="middle">
          <div class="div-vp" style="width: 100%; height: 100%">
            <el-row justify="space-between" type="flex" :gutter="1" class="el-0-bas el-row-photo">
              <el-col :span="8" class="el-0-bas" style="height:100%">
                <div
                  class="div-vp div-photo"
                  :style="{backgroundImage:'url(' + realsrc + ')', position:'relative', width:'100%', height:'100%'}"
                  align="right"
                >
                  <div class="photo_tip_l" style="right:0">
                    <i v-if="realsrc==='' || !realsrc" class="photo_ico el-icon-warning"></i><span>现场抓拍照片</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8" class="el-0-bas" style="height:100%">
                <div
                  class="div-vp div-photo"
                  :style="{backgroundImage:'url(' + realsrc_face + ')', position:'relative', width:'100%', height:'100%'}"
                  align="center"
                >
                  <div class="photo_tip_m" style="margin:auto;right:0;left:0;">
                    <span style="color:#99CCFF">人脸库照片</span><i v-if="realsrc_face==='' || !realsrc_face" class="photo_ico el-icon-warning"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div
              :class="gettemperatureBorClass((configGd.passKey==='pass'?pass:alcoholMessage), false, (configGd.passKey==='pass'?'pass':'alcoholMessage'), false, 'm')"
              style="width:100%; margin:0 auto;"
              align="middle"
            >
              <div class="div-vp div-vp-u now-text" style="height:100%;" align="middle">
                <el-row justify="space-between" type="flex" :gutter="0" class="g_label4" style="width: 96%; height: 100%; font-size:18px;">
                  <el-col :span="4" class="el-0-bas" style="line-height:42px;min-width:140px;">
                    <div v-if="name && name.length > 0" class="div_inline txt-name" style="font-size:26px;">{{name}}<i :class="getSexIco(sex)" style="margin:0 9px;font-size:20px;"></i></div>
                  </el-col>
                  <el-col :span="4" class="el-0-bas" style="line-height:42px;min-width:145px;">
                    <div v-if="temperature" class="div_inline">
                      体温:
                      <span :class="gettemperatureClass(passMessage)" style="font-size:26px;">{{temperature}}</span> ℃
                      <img v-if="configGd.noMask && mounthocc && mounthocc.length > 0"
                           :src="getmaskImg(mounthocc, true)"
                           style="width: 15px; margin-top:-2px; margin-left:8px;"
                      />
                    </div>
                  </el-col>
                  <el-col :span="4" class="el-0-bas" style="line-height:42px;min-width:145px;">
                    <div
                      v-if="device_address && device_address.length > 0"
                      class="div_inline"
                    ><i class="g_sex-max gdicondingwei"></i> {{device_address}}</div>
                  </el-col>
                  <el-col :span="4" class="el-0-bas" style="min-width:175px;font-size:16px;">
                    <div v-if="create_time" class="div_inline"
                    >{{getdatetime(create_time)}}</div>
                  </el-col>
                </el-row>
              </div>

            </div>
          </div>
        </el-main>
        <el-footer class="div-vp el-footer-vp" align="middle">
          <!-- 底下历史记录 -->
          <div class="div-vp el-footer-vp" ref="footerwrap">
            <div
              v-for="(o, index) in listdata.slice(0,histNum)"
              :key="index"
              width="12.5%"
              height="100%"
              class="div_inline-block"
              style="margin: -3px 0 0 0; padding: 0px; position:relative;"
            >
              <div v-if="(histSelIndex===index)" style="position:absolute;width:20px;height:5px;top:4px;left:40px;background-color:#AACCFF;border-radius:9px;"></div>
              <el-card :body-style="{ padding: '0px' }" shadow="never"
                       :class="gettemperatureBorClass((configGd.passKey==='pass'?listdata[index].pass:listdata[index].alcoholMessage), true, (configGd.passKey==='pass'?'pass':'alcoholMessage'), true)"
                       :style="getCarNStyle('hist', index)"
                       @click.native="doShowInfo(listdata[index], 'hist', index)">
                <el-card
                  :body-style="{ padding: '0px' }"
                  shadow="never"
                  class="car-hist-photo-car"
                  :style="getBgClass('pass', listdata[index].pass)"
                >
                  <el-image
                    style="width: 90px; height: 128px; z-index: 0; margin:0;"
                    :src="getimgurl(listdata[index].base64_picture)"
                    fit="cover"
                  ></el-image>

                  <div class="car-hist-table-div-r"
                       :style="getHistTableStyle('passMessage', listdata[index].passMessage, 1, 80)">
                    <img v-if="configGd.noMask"
                         class="temperature_ico_s"
                         :src="getmaskImg(listdata[index].mounthocc, true)"
                    />
                    <span style="font-weight:700;">{{listdata[index].temperature}}</span> ℃
                  </div>
                </el-card>
                <div
                  class="div-vp g_label-s-low small-font"
                  style="font-size: 12px; padding: 2px 0 3px 3px;"
                  align="middle"
                >{{getshorttime(listdata[index].create_time)}}</div>
              </el-card>
            </div>
          </div>
        </el-footer>
      </el-container>
      <el-aside class="el-aside-vp no-scroll" width="235px" align="middle" height="100%">
        <!-- 报警记录 -->
        <div
          class="div-vp"
          height="20px"
          style="padding: 5px 0 2px 8px; color: #ff5b5b"
          align="left"
        >
          <i class="el-icon-message-solid"></i> 报警记录
        </div>
        <div class="div-vp el-aside-right no-scroll" style="padding-top: 6px" ref="rightwrap">
          <div
            v-for="(o, index) in exclistdata.slice(0,excNum)"
            :key="index"
            width="215px"
            height="80px"
            style="margin: 0px 12px 9px 8px; padding: 0; position: relative;"
          >
            <div v-if="(warnSelIndex===index)" style="position:absolute;width:5px;height:20px;top:31px;left:-8px;background-color:#AACCFF;border-radius:9px;"></div>
            <el-card
              :body-style="{ padding: '0px' }"
              shadow="never"
              :class="gettemperatureBorClass((configGd.passKey==='pass'?exclistdata[index].pass:exclistdata[index].alcoholMessage), true, (configGd.passKey==='pass'?'pass':'alcoholMessage'), true)"
              style="border-radius: 5px; margin: 0; margin:0; width: 215px; height: 80px; cursor: pointer;"
              @click.native="doShowInfo(exclistdata[index], 'warn', index)"
            >
              <el-image
                style="width: 64px; height: 80px; margin:0px 1px -3px 0px;"
                :src="getimgurl(exclistdata[index].base64_picture)"
                fit="cover"
              ></el-image>
              <el-image
                style="width: 64px; height: 80px; margin:0px 0px -3px 0px;"
                :src="exclistdata[index].master_map?getfaceurl(exclistdata[index].master_map, exclistdata[index].sex):getimgurl(exclistdata[index].base64_picture)"
                fit="cover"
              ></el-image>
              <div
                class="div-vp div_inline-block g_label3"
                style="width:77px; height: 80px; margin:0px 0px -3px 0px;"
                align="left"
              >
                <el-row :gutter="0" style="margin-bottom: 2px;">
                  <el-col :span="24" style="padding: 3px 0 0 0;">
                    <span
                      class="txt-name"
                      style="font-size: 13px; font-weight: 800; padding: 0 0 4px 5px;"
                    >{{exclistdata[index].name}}</span><i :class="getSexIco(exclistdata[index].sex, 'small')" style="margin:0 5px;"></i>
                  </el-col>
                </el-row>
                <el-row :gutter="0" style="margin-bottom: 3px">
                  <el-col :span="20">
                    <span
                      :class="gettemperatureClass(exclistdata[index].passMessage, true)"
                      style="font-size: 12px;"
                    >{{exclistdata[index].temperature}} ℃</span>
                  </el-col>
                  <el-col :span="4">
                    <img v-if="configGd.noMask"
                         class="temperature_ico_s"
                         :src="getmaskImg(exclistdata[index].mounthocc, true)"
                         style="width: 12px; margin-top:0px; margin-left:50px;"
                    />
                  </el-col>
                </el-row>
                <el-row :gutter="0" style="margin-bottom: 2px; margin-top: 2px">
                  <el-col :span="24">
                    <span
                      :class="getalcoholClass(exclistdata[index].alcoholMessage, true)"
                      style="font-size: 12px;"
                    >{{exclistdata[index].alcohol_content}} {{configGd.drinkingUnit}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span="24">
                    <div
                      class="div-vp g_label-s-low small-font"
                      style="font-size: 12px; padding: 5px 0 4px 6px; width:86px;"
                    >{{getshorttime(exclistdata[index].create_time)}}</div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>
<script>
  import gdtree from '.././tree/src/tree.vue'
  const colorBgGreen = '#002200'
  const colorBgOrange = '#3F2800'
  const colorBgRed = '#220000'
  const colorBgAther = '#031c34'
  const colorGreen = '#009900'
  const colorOrange = '#FF9900'
  const colorRed = '#FF0000'

  const colorAther = '#7e9aab'

  export default {
    data() {
      return {
        websock: null,
        centerDialogVisible: true,
        // 按时间筛选数据
        seekTime: ['', ''],
        // 识别记录数据
        listdata: [],
        // 异常记录数据
        exclistdata: [],
        // 异常记录总数
        excTotal: 0,
        // 企业列表数据
        comlistdata: [],
        // 企业树形列表数据
        treecomdata: [],
        // 企业总数
        comTotal: 0,
        // 设备列表数据：
        eqListdata: [],
        // 设备树形列表数据
        treeEqdata: [],
        // 设备总数：
        eqTotal: 0,
        // 正展开的企业(用来拉取设备列表)
        nowCompanyOpen: '',
        // 当前企业:
        nowCompany: '',
        // 当前设备[序列号,可以多个]
        nowEquipment: '',
        // 公司与设备id计数：
        nowTreeID: 0,
        // 第1家企业第1个设备id：
        nowOneComOneEq: -1,
        currentPage: 1,
        pageSize: 99,
        pageTotal: 0,
        // 实时数据：>>>>>>
        info_id: '0',
        name: '', // 未识别人脸
        sex: '', // 男性
        pass: '', // 未识别
        temperature: '', // 36.8
        mounthocc: '', // 戴口罩
        passResult: '', // 通行成功
        passMessage: '', // 体温正常
        serialNo: '', // 5L96X010213
        device_address: '', // 大门
        create_time: 0, // 1584247976336
        base64_picture: '', // 帧图
        alcoholMessage: '', // 是否饮酒
        alcohol_content: 0, // 酒精含量
        alcohol_picture: '', // 酒精吹气照片
        master_map: '', // 对库人脸

        // NowFaceStyle: {},
        imgW: 0,
        imgH: 0,

        realsrc_width: 0,
        realsrc_height: 0,
        // 实时数据<<<<<<
        props: {
          label: 'label',
          children: 'zones',
          isLeaf: 'leaf'
        },
        histNum: 9,
        excNum: 9,
        // 数据统计：
        v_totalnum: 0,//访客签到人数
        v_total: 0, // 访客未签到人数
        v_unusual: 0, // 异常人数
        v_noMask: 0, // 未待口罩
        v_drinking: 0, // 酒检异常
        v_stranger: 0, // 陌生人

        InfoDialogVisible: false, // 识别记录详细信息对话框
        // 要查看的识别记录信息：
        recordInfo: {
          info_id: 0,
          name: '',
          create_time: '',
          device_address: '',
          sex: '',
          master_map: '',
          base64_picture: '', // 照片地址
          alcohol_picture: '' // 酒精吹气照片地址
        },

        onAlcoholTherm: true, // 是否显示酒精测温
        histSelIndex: -1, // 当前选中的底下的历史记录
        warnSelIndex: -1 // 当前选中的底下的报警记录
      }
    },
    components: {
      gdtree: gdtree
    },
    computed: {
      // 获取面板机实时帧图：
      realsrc: function() {
        // this.NowFaceStyle = this.getNowFaceStyle()
        if (this.base64_picture && this.base64_picture.length > 0) {
          return this.getimgurl(this.base64_picture)
        }
        var _sex = this.sex
        var sexN = 'boy'
        if (_sex === '女') {
          sexN = 'girl'
        }
        var imgURL = require('../../assets/img/face_' + sexN + '.png')
        // var _this = this
        // let img = new Image()
        // img.src = imgURL
        // img.onload = function() {
        //   _this.imgW = img.width
        //   _this.imgH = img.height
        //   _this.NowFaceStyle = _this.getNowFaceStyle()
        // }
        return imgURL
      },
      /** 获取酒精吹气图 */
      realsrc_alcoho: function() {
        // this.NowFaceStyle = this.getNowFaceStyle()
        if (this.alcohol_picture && this.alcohol_picture.length > 0) {
          return this.getimgurl(this.alcohol_picture)
        }
        return ''
        // return this.realsrc
        // var _sex = this.sex
        // var sexN = 'boy'
        // if (_sex === '女') {
        //   sexN = 'girl'
        // }
        // var imgURL = require('../../assets/img/face_' + sexN + '.png')
        // var _this = this
        // let img = new Image()
        // img.src = imgURL
        // img.onload = function() {
        //   _this.imgW = img.width
        //   _this.imgH = img.height
        //   _this.NowFaceStyle = _this.getNowFaceStyle()
        // }
        // return imgURL
      },
      // 获取对库人脸：
      realsrc_face: function() {
        if (this.master_map && this.master_map.length > 0) {
          return this.getimgurl(this.master_map)
        }
        return ''
        // return this.realsrc
        // var _sex = this.sex
        // var sexN = 'boy'
        // if (_sex === '女') {
        //   sexN = 'girl'
        // }
        // return require('../../assets/img/face_' + sexN + '.png')
      },
      // 实时数据：
      videoNowData: function() {
        return {
          info_id: this.info_id,
          name: this.name, // 未识别人脸
          sex: this.sex, // 男性
          pass: this.pass, // 未识别
          temperature: this.temperature, // 36.8
          mounthocc: this.mounthocc, // 戴口罩
          passResult: this.passResult, // 通行成功
          passMessage: this.passMessage, // 体温正常
          serialNo: this.serialNo, // 5L96X010213
          device_address: this.device_address, // 大门
          create_time: this.create_time, // 1584247976336
          base64_picture: this.base64_picture, // 帧图
          alcoholMessage: this.alcoholMessage, // 是否饮酒
          alcohol_content: this.alcohol_content, // 酒精含量
          alcohol_picture: this.alcohol_picture, // 酒精吹气
          master_map: this.master_map // 对库人脸
        }
      }
    },
    created() {
      this.getComList()
    },
    destroyed() {
      if (this.websock) {
        this.websock.close() // 离开路由之后断开websocket连接
        this.websock = null
      }
    },
    mounted() {
      this.histNum = Math.floor(
        parseInt(window.getComputedStyle(this.$refs.footerwrap).width) / 110
      )
      this.excNum = Math.floor(
        parseInt(window.getComputedStyle(this.$refs.rightwrap).height) / 90
      )
      // var myThis = this
      // 注：window.onresize只能在项目内触发1次
      this.resizefun = () => {
        this.histNum = Math.floor(
          parseInt(window.getComputedStyle(this.$refs.footerwrap).width) / 110
        )
        this.excNum = Math.floor(
          parseInt(window.getComputedStyle(this.$refs.rightwrap).height) / 90
        )
        // this.NowFaceStyle = this.getNowFaceStyle()
      }
      window.addEventListener('resize', this.resizefun)
      this.openNotifyTopLeft('选定1个或多个设备，以实时查看识别画面与数据。')
      // this.NowFaceStyle = this.getNowFaceStyle()
      // var _this = this
      // this.$nextTick(() => {
      //   _this.NowFaceStyle = _this.getNowFaceStyle()
      // })
    },
    // 移除事件监听，避免内存泄漏
    beforeDestroy() {
      window.removeEventListener('resize', this.resizefun)
      this.resizefun = null
    },
    methods: {
      initWebSocket() {
        // 初始化weosocket
        // const wsuri = 'ws://39.97.104.66:8085/app/'
        const wsuri = this.configGd.wshost + '/app/' // '/ws/app/'
        this.websock = new WebSocket(wsuri + this.nowCompany)
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
            timeStart.setHours(0)
            timeStart.setMinutes(0)
            timeStart.setSeconds(0)
            //timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
            var timeEnd = new Date()
            this.seekTime = [
              timeStart.format('yyyy-MM-dd hh:mm:ss'),
              timeEnd.format('yyyy-MM-dd hh:mm:ss')
            ]
            this.getStats()
            this.gettotalnum()
            this.getList()
            this.getList(true)
          }
          // if (data && data.mounthocc && data.mounthocc.length > 0) {
          //   this.getStats()
          //   this.getList()
          //   this.getList(true)
          // }
        }
      },
      websocketsend(Data) {
        // 数据发送
        this.websock.send(Data)
      },
      websocketclose(e) {
        // 关闭
        console.log('videopreview 已断开连接', e)
      },
      // 检测与更新实时数据：
      checkuddata(data) {
        console.log('checkuddata data:', data)
        if (!data) {
          this.info_id = '0'
          this.name = ''
          this.sex = ''
          this.pass = ''
          this.temperature = ''
          this.mounthocc = ''
          this.passResult = ''
          this.passMessage = ''
          this.serialNo = ''
          this.device_address = ''
          this.create_time = 0
          this.base64_picture = ''
          this.alcoholMessage = '' // 是否饮酒
          this.alcohol_content = 0 // 酒精含量
          this.alcohol_picture = ''
          this.master_map = ''
          this.$Storage.localRemove('videoNowData')
          return
        }
        if (data && data.name) {
          if (
            this.nowEquipment &&
            this.nowEquipment.indexOf(data.serialNo) >= 0
          ) {
            this.info_id = data.info_id
            this.name = data.name
            this.sex = data.sex
            this.pass = data.pass
            this.temperature = data.temperature
            this.mounthocc = data.mounthocc
            this.passResult = data.passResult
            this.passMessage = data.passMessage
            this.serialNo = data.serialNo
            this.device_address = data.device_address
            this.create_time = data.create_time
            this.alcoholMessage = data.alcoholMessage
            this.alcohol_content = data.alcohol_content
            // this.alcohol_content = 80
            this.base64_picture = this.getimgurl(data.base64_picture)
            this.alcohol_picture = this.getimgurl(data.alcohol_picture)
            this.master_map = this.getimgurl(data.master_map)
            // this.udData(true)
            this.$Storage.localSet('videoNowData', this.videoNowData)
          }
        } else {
          var SGdata = this.$Storage.localGet('videoNowData')
          if (SGdata && SGdata.name) {
            this.checkuddata(SGdata)
          }
        }
      },
      // 初始化seekTime：
      intSeekTime() {
        if (!this.seekTime || !this.seekTime[0]) {
          var timeStart = new Date()
          var timeEnd = new Date()
          timeStart.setHours(0)
          timeStart.setMinutes(0)
          timeStart.setSeconds(0)
          //timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
          this.seekTime = [
            timeStart.format('yyyy-MM-dd hh:mm:ss'),
            timeEnd.format('yyyy-MM-dd hh:mm:ss')
          ]
        }
      },
      // 获得最新的识别记录：
      getList(_exception) {
        var unusual = false
        if (_exception) {
          unusual = true
        }
        this.intSeekTime()
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
          '&unusual=' +
          unusual +
          '&r=' + ('' + this.getRan(1000, 9999))
        if (this.nowEquipment) {
          apiUrl += '&serialNo=' + this.nowEquipment
        }
        if (this.seekName) {
          apiUrl += '&username=' + this.seekName
        }
        if (this.nowCompany) {
          apiUrl += '&companyName=' + this.nowCompany
        }
        this.$http
          .get(apiUrl)
          .then(res => {
            if (res.data.code === 0 && res.data.data) {
              if (_exception) {
                this.exclistdata = res.data.data.list
                this.excTotal = res.data.data.total
              } else {
                this.listdata = res.data.data.list
                this.pageTotal = res.data.data.total
                this.checkuddata(this.listdata[0])
              }
            } else {
              if (_exception) {
                this.$message.error('获取报警记录失败：' + res.data.message)
              } else {
                this.$message.error('获取识别记录失败：' + res.data.message)
              }
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            if (_exception) {
              this.$message.error('获取报警记录失败：' + err)
            } else {
              this.$message.error('获取识别记录失败：' + err)
            }
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
              if (this.comTotal > 0 && this.comlistdata) {
                this.nowTreeID = 0
                this.treecomdata = []
                for (var i = 0; i < this.comlistdata.length; i++) {
                  // eslint-disable-next-line standard/object-curly-even-spacing
                  this.treecomdata.push({
                    id: i,
                    label: this.comlistdata[i].company_name,
                    type: 0
                  })
                  this.nowTreeID = i
                }
              }
            } else {
              this.$message.error('获取公司列表失败：' + res.data.message)
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.$message.error('获取公司列表失败：' + err)
          })
      },
      // 拉取设备列表：
      getEqList(resolve) {
        var apiUrl =
          '/api' +
          '/device/find/list' +
          '?page=' +
          this.currentPage +
          '&pageSize=4'
        if (this.seekIP) {
          apiUrl += '&deviceIp=' + this.seekIP
        }
        if (this.nowEquipment) {
          apiUrl += '&serialNo=' + this.nowEquipment
        }
        if (this.nowCompanyOpen) {
          apiUrl += '&companyName=' + this.nowCompanyOpen
        }
        this.$http
          .get(apiUrl)
          .then(res => {
            if (res.data.code === 0 && res.data.data) {
              this.eqListdata = res.data.data.list
              this.eqTotal = res.data.data.total
              if (this.eqTotal > 0 && this.eqListdata) {
                this.treeEqdata = []
                // var eqNowID = 0
                for (var i = 0; i < this.eqListdata.length; i++) {
                  this.treeEqdata.push({
                    id: 'eq' + this.eqListdata[i].device_id,
                    label: this.eqListdata[i].device_address, // device_address device_name
                    eqdata: this.eqListdata[i],
                    type: 1,
                    leaf: true
                  })
                }
                if (this.nowOneComOneEq === -1) {
                  this.nowOneComOneEq = this.nowTreeID + 1
                }
              }
              resolve(this.treeEqdata)
            } else {
              this.$message.error('获取设备列表失败：' + res.data.message)
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.$message.error('获取设备列表失败：' + err)
          })
      },
      // 拉取统计数据：
      getStats() {
        this.intSeekTime()
        var apiUrl =
          '/api' +
          '/chart/stats/record?' +
          '&startTime=' +
          this.seekTime[0] +
          '&endTime=' +
          this.seekTime[1] +
          '&r=' + ('' + this.getRan(1000, 9999))
        if (this.nowEquipment) {
          apiUrl += '&serialNo=' + this.nowEquipment
        }
        if (this.nowCompany) {
          apiUrl += '&companyName=' + this.nowCompany
        }
        this.$http
          .get(apiUrl)
          .then(res => {
            if (this.eqTotal > 0 && this.eqListdata) {
              const data = res.data.data
              for (var i in data) {
                this['v_' + data[i].describe] = data[i].sum
              }
            } else {
              this.$message.error('获取统计数据失败：' + res.data.message)
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.$message.error('获取统计数据失败：' + err)
          })
      },
      //查询访客已签到人数
      gettotalnum(){
        var apiUrl =
          '/api' +
          '/user/queryVisitorCount'
        this.$http
          .post(apiUrl)
          .then(res => {
            const data = res.data.data
            this.v_totalnum = data.SignIn
            this.v_total=data.NSignIn
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.$message.error('获取统计数据失败：' + err)
          })
      },

      // 获取网址随机数
      getRan(minNum, maxNum) {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      },
      // 获取体温文字样式：
      gettemperatureClass: function(_passMessage, _s) {
        if (!_passMessage || _passMessage.length === 0) {
          _passMessage = this.passMessage
        }
        var restr = 'temperature_bas temperature_txt '
        if (_s) {
          restr = 'temperature_bas_s temperature_txt '
        }
        if (_passMessage === '体温正常') {
          return restr + 'temperatureA'
        } else if (_passMessage === '体温过高' || _passMessage === '体温过低') {
          return restr + 'temperatureB'
          // } else if (_passMessage === '体温过低') {
          //   return restr + 'temperatureC'
        } else {
          return restr + 'temperatureN'
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
      // 获取体温边框样式：
      gettemperatureBorClass: function(_passMessage, _s, _pass, _hove = false, _brclass = '') {
        let Thove = ''
        if (_hove) {
          Thove = ' car-hove'
        }
        let brclass = 'user-info'
        if (_brclass === 'm') {
          brclass = 'user-info-m'
        }
        if (!_passMessage || _passMessage.length === 0) {
          if (!this.passMessage || this.passMessage.length === 0) {
            return 'el-0-bas ' + brclass + ' user-info-no' + Thove
          }
          _passMessage = this.passMessage
        }
        if (_pass === 'pass') {
          if (_passMessage.indexOf('不通过') >= 0) {
            return 'el-0-bas ' + brclass + ' ' + brclass + '-red' + Thove
          } else if (_passMessage === '通过') {
            return 'el-0-bas ' + brclass + ' ' + brclass + '-green' + Thove
          } else {
            return 'el-0-bas ' + brclass + ' ' + brclass + '-blue' + Thove
          }
        } else if (_pass === 'alcoholMessage') {
          if (_passMessage === '醉酒') {
            return 'el-0-bas ' + brclass + ' ' + brclass + '-red' + Thove
          } else if (_passMessage === '饮酒') {
            return 'el-0-bas ' + brclass + ' ' + brclass + '-orange' + Thove
          } else {
            return 'el-0-bas ' + brclass + ' ' + brclass + '-green' + Thove
          }
        }
        if (_passMessage === '体温正常' || _passMessage === '通过') {
          return 'el-0-bas ' + brclass + ' ' + brclass + '-green'
        } else if (_passMessage === '体温过高') {
          return 'el-0-bas ' + brclass + ' ' + brclass + '-red'
        } else if (_passMessage === '体温过低') {
          return 'el-0-bas ' + brclass + ' ' + brclass + '-blue'
        }
      },
      // 获取是否戴口罩：
      getmaskImg: function(_mounthocc, _s) {
        if (!_mounthocc || _mounthocc.length === 0) {
          _mounthocc = this.mounthocc
        }
        var furl = ''
        if (_s) {
          furl += 's'
        }
        if (_mounthocc === '戴口罩') {
          return require('../../assets/img/mask' + furl + '01.png')
        } else {
          return require('../../assets/img/mask' + furl + '02.png')
        }
      },
      // 获取时间格式
      getdatetime: function(_datetime) {
        return new Date(_datetime).format('yyyy-MM-dd hh:mm:ss')
      },
      // 获取短时间格式
      getshorttime: function(_datetime) {
        return new Date(_datetime).format('MM-dd hh:mm:ss')
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

      // 获取性别
      getSex(_sex) {
        if (_sex && _sex.length > 0) {
          return _sex
        }
        return '[未注册]'
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
      // 拉取刷新数据
      udData(_noWebSocket) {
        this.checkuddata(null)
        if (
          this.nowCompany &&
          this.nowCompany.length > 0 &&
          this.nowEquipment &&
          this.nowEquipment.length > 0
        ) {
          this.$refs.alert.visible = false
          this.getStats()
          this.gettotalnum()
          this.getList()
          this.getList(true)
          if (_noWebSocket) {
          } else {
            // if (this.nowCompany.length > 0 && this.nowEquipment.length > 0) {
            if (this.websock) {
              this.websock.close()
            }
            // }
            this.initWebSocket()
          }
        } else {
          this.$refs.alert.visible = true
          this.listdata = []
          this.exclistdata = []
          this.comlistdata = []
          this.eqListdata = []
          this.v_total = 0
          this.v_totalnum = 0
          this.v_unusual = 0
          this.v_noMask = 0
          this.v_drinking = 0
          this.v_stranger = 0
        }
      },
      // 获取与加载企业与设备列表：
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.comlistdata)
        }
        if (node.data.label) {
          this.nowCompanyOpen = node.data.label
        }
        if (node.level > 1) return resolve([])
        this.getEqList(resolve)
      },
      personlist(_item, _check) {
        // console.log('gdtree personlist:', _item.label, _item, _check)
        if (_item.label) {
          if (_item.type === 0) {
          } else if (_item.type === 1) {
            this.resNowData(_item, _check)
          }
        }
      },
      // 刷新设备与订阅
      resNowData(_item, _check) {
        if (_check) {
          if (this.nowCompany !== _item.eqdata.company_name) {
            this.nowCompany = _item.eqdata.company_name
            this.nowEquipment = ''
            this.$refs.tree.setCheckedKeys([_item.id])
          }
          if (this.nowEquipment && this.nowEquipment.length > 0) {
            this.nowEquipment += ','
          }
          this.nowEquipment += _item.eqdata.serial
        } else {
          this.nowEquipment = this.nowEquipment.replace(
            new RegExp(_item.eqdata.serial, 'g'), // _item.label
            ''
          )
          this.nowEquipment = this.nowEquipment.replace(
            new RegExp(',,', 'g'),
            ','
          )
          if (this.nowEquipment.charAt(0) === ',') {
            this.nowEquipment = this.nowEquipment.substr(1)
          }
          if (
            this.nowEquipment &&
            this.nowEquipment.charAt(this.nowEquipment.length - 1) === ','
          ) {
            this.nowEquipment = this.nowEquipment.substr(
              0,
              this.nowEquipment.length - 1
            )
          }
        }
        this.udData()
      },
      // 获取照片地址:
      getimgurl(_url) {
        if (!_url || _url.length === 0) {
          return ''
        }
        if (_url.length === 0 || _url.substr(0, 4) === 'http') {
          return _url
        } else {
          return 'data:image/jpg;base64,' + _url
        }
      },
      // 获取对库人脸:
      getfaceurl(_url, _sex) {
        if (!_url || _url.length === 0) {
          var sexN = 'boy'
          if (_sex && _sex === '女') {
            sexN = 'girl'
          }
          return require('../../assets/img/face_' + sexN + '110.png')
        } else {
          return this.getimgurl(_url)
        }
      },
      // 左上角操作指引提示：
      openNotifyTopLeft(_msg) {
        this.$message(_msg)
      },
      // 获得右侧比对人脸的大小与图片样式：
      // getNowFaceStyle() {
      //   var reStyle = {
      //     backgroundImage: 'url(' + this.realsrc_face + ')'
      //   }
      //   if (this.$refs.ref_realsrc && this.imgW > 0) {
      //     console.log(
      //       'getNowFaceStyle:',
      //       this.$refs.ref_realsrc.offsetWidth,
      //       this.$refs.ref_realsrc.offsetHeight
      //     )
      //     // eslint-disable-next-line no-unused-vars
      //     var imgS = this.imgW / this.imgH
      //     reStyle.width = this.$refs.ref_realsrc.offsetWidth + 'px'
      //     reStyle.height = this.$refs.ref_realsrc.offsetHeight + 'px'
      //   }
      //   console.log('getNowFaceStyle:', reStyle)
      //   return reStyle
      // },
      // 预览详细信息接口
      doShowInfo(data, _type, _index) {
        console.log('doShowInfo data:', data, _type, _index)
        if (data) {
          this.recordInfo = data
          this.checkuddata(data)
        }
        if (_type === 'hist') {
          this.warnSelIndex = -1
          this.histSelIndex = _index
        } else if (_type === 'warn') {
          this.histSelIndex = -1
          this.warnSelIndex = _index
        }
        // this.InfoDialogVisible = true
      },
      getCarNStyle(_type, _index) {
        let mStyle = { width: '90px', height: '148px', cursor: 'pointer', margin: '11px 5px 0 5px' }
        console.log('getCarNStyle _type:', _type, _index, (_index === this.histSelIndex))
        // if ((_type === 'hist' && _index === this.histSelIndex) || (_type === 'warn' && _index === this.warnSelIndex)) {
        //   mStyle.margin = '2px 5px 0 5px'
        //   console.log('getCarNStyle 111')
        // } else {
        //   mStyle.margin = '11px 5px 0 5px'
        //   console.log('getCarNStyle 222')
        // }
        console.log('mStyle.margin:', mStyle.margin)
        return mStyle
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
        var imgURL = require('../../assets/img/face_' + sexN + '_b.png')
        return imgURL
      },
      // 获取体温样式：
      gettemperatureClass_di(_passMessage) {
        if (_passMessage === '体温正常') {
          return 'di_temperature di_temperatureA'
        } else if (_passMessage === '体温过高') {
          return 'di_temperature di_temperatureB'
        } else if (_passMessage === '体温过低') {
          return 'di_temperature di_temperatureC'
        }
      },

      /** 获取历史卡标签div样式 */
      getHistTableStyle (_type, _msgv, _bottom, _width) {
        if (_type === 'passMessage') {
          if (_msgv === '体温正常') {
            return { color: '#a2b9d0', backgroundColor: colorBgAther, bottom: _bottom + 'px', width: _width + '%' }
          } else {
            return { color: '#FF0000', backgroundColor: colorBgRed, bottom: _bottom + 'px', width: _width + '%' }
          }
        } else if (_type === 'alcoholMessage') {
          if (_msgv === '醉酒') {
            return { color: '#FF0000', backgroundColor: colorBgRed, bottom: _bottom + 'px', width: _width + '%' }
          } else if (_msgv === '饮酒') {
            return { color: colorOrange, backgroundColor: colorBgOrange, bottom: _bottom + 'px', width: _width + '%' }
          } else {
            return { color: colorGreen, backgroundColor: colorBgGreen, bottom: _bottom + 'px', width: _width + '%' }
          }
        }
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
        }
      },

      /** 获取前景样式
       * @param _type  'pass'通过情况，'passMessage'体温情况，'alcoholMessage'饮酒情况，'mounthocc'口罩情况
       */
      getFoClass(_type, _msgv, _addStyle) {
        let reStyle = { color: colorAther }
        if (_addStyle) {
          for (let I in _addStyle) {
            reStyle[I] = _addStyle[I]
          }
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
      }
    }
  }
</script>
<style lang="less">
  // scoped
  @subh: 340px; //370px 358px 350px
  @subhc: calc(100vh - @subh);
  @userif_h: 45px; //用户信息条高度 25px
  @photo_h: calc(100% - @userif_h - 6px); //105px 110px 10px
  .div-vp,
  .el-main-vp,
  .el-main-vpB,
  .el-0-bas {
    margin: 0;
    padding: 0;
  }
  .div-vp-c {
    padding: 10px;
  }
  .div-vp-d {
    padding: 5px;
    text-align: center;
  }
  .div-vp-n {
    font-size: 23px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
  }
  .div-vp-u {
    width: 100%;
    height: @userif_h;
    padding: 1px 5px 0px 2px;
  }
  .sw100 {
    height: 100%;
  }
  .now-text {
    font-size: 15px;
    font-weight: 600;
  }
  .div-middle,
  .el-0-bas {
    display: flex;
    align-items: center;
  }
  .sh100,
  .div-photo,
  .div-num {
    height: 100%;
  }
  .el-row-photo {
    min-height: @photo_h;
    height: @photo_h;
    margin-bottom: 3px;
  }
  .div-photo {
    // width: 50%;
    display: inline-block;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: bottom; // center
    background-size: cover; // cover contain
  }
  .div-photo-left {
    margin-right: 2px;
    background-position-x: right;
  }
  .div-photo-center {
    margin-right: 2px;
    margin-left: 2px;
    background-position-x: center;
  }
  .div-photo-right {
    margin-left: 2px;
    background-position-x: left;
  }
  .img-photo {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .oneRow-vp {
    color: #3c4e86;
    padding: 0;
  }
  .div-num {
    width: 25%;
    display: inline-block;
    background-color: #00162c;
    margin: 0;
  }
  .div-num-l {
    margin-right: 8px;
  }
  .div-num-r {
    margin-left: 0px;
  }
  .div-main {
    min-height: calc(100vh - @subh);
  }
  .el-aside-vp {
    padding: 0;
    width: 200px;
    background: #00162c;
  }
  .el-aside-right {
    height: calc(100% - 32px); //105px 110px
  }
  .el-container-vpM {
    background-color: #01101e;
    padding: 0px 10px 0px 10px;
  }
  .el-0-bas,
  .el-main-vp,
  .el-main-vpB,
  .el-footer-vp {
    min-width: 0;
    min-height: 0;
  }
  .el-main-vpB {
    min-height: @subhc;
    height: @subhc;
    margin: 10px 0px 0px 0px;
  }
  .user-info, .user-info-m {
    box-sizing: border-box;
  }
  .user-info, .user-info-m {
    background-color: #00162c;
    border-radius: 6px !important; // 5px
  }
  .user-info-m {
    border-radius: 0px !important; // 5px
  }
  .user-info-m-green {
    background-color: #00220b;
  }
  .user-info-m-orange {
    background-color: #3F2800;
  }
  .user-info-m-red {
    background-color: #44000b;
  }
  .user-info-green {
    border: 1px solid #00330b;
    background-color: #00220b;
  }
  .user-info-green:hover {
    border: 1px solid #00a20b;
    background-color: #00550b;
  }
  .user-info-orange {
    border: 1px solid #50000b;
    background-color: #3F2800;
  }
  .user-info-orange:hover {
    border: 1px solid #FF9900;
    background-color: #3F2800
  }
  .user-info-red {
    border: 1px solid #50000b;
    background-color: #44000b;
  }
  .user-info-red:hover {
    border: 1px solid #d20010;
    background-color: #77000b
  }
  .user-info-blue {
    border: 1px solid #001b6a;
    background-color: #001b3a;
  }
  .user-info-blue:hover {
    border: 1px solid #0061d1;
    background-color: #003a75;
  }
  .user-info-no {
    border: 1px solid #00162c;
    background-color: #00162c;
  }

  .el-footer-vp {
    background-color: #00162c;
    font-size: 13px;
    //border-radius: 7px;
    width: 100%;
    height: 162px !important; // 170
  }
  .car-hist {
    border-radius: 6px !important; // 5px
    margin: 6px;
    border: 1px solid #042648;
    background-color: #031c34;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  .car-hist:hover {
    border: 1px solid #0a5bad;
    background-color: #05315c;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  .car-hist-photo-car {
    border-radius: 6px 6px 0 0 !important;
    margin: 0 !important;
    position: relative;
    padding: 0;
    border-width: 0;
    height: 128px;
  }
  .car-hist-table-div-l, .car-hist-table-div-c, .car-hist-table-div-r {
    width: 80%;
    height: 16px;
    position:absolute;
    z-index: 1;
    background-color: #000000;
    opacity: 0.85;
    font-size: 12px;
    color: #a2b9d0;
  }
  .car-hist-table-div-l {
    padding: 0 0 0 3px;
    border-radius: 0 10px 10px 0;
    left: 0px;
    text-align: left;
  }
  .car-hist-table-div-c {
    padding: 0;
    border-radius: 10px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
  .car-hist-table-div-r {
    padding: 0 5px 0 0;
    border-radius: 10px 0 0 10px;
    right: 0px;
    text-align: right;
  }

  .temperature_txt {
    margin-left: 0px;
    margin-top: 0px;
  }
  .temperature_ico {
    width: 26px;
    margin-left: 6px;
    margin-right: 4px;
    margin-top: -2px; // -14px
  }
  .temperature_ico_s {
    position: absolute;
    width: 12px; // 16px 14px
    float: right;
    left: 2px;
    top: 2px;
  }
  .temperature_bas {
    font-size: 15px; //18px
    font-weight: 600;
  }
  .temperature_bas_s {
    float: left;
    margin-left: 5px;
    margin-top: -1px;
    font-size: 12px; //15px
    font-weight: 550;
  }
  .temperatureA {
    color: #00aa00;
    //border-color: #8cd28f;
  }
  .temperatureB {
    color: #ff0000;
    // border-color: #e60012;
    // background-color: #e60012;
  }
  .temperatureO {
    color: #FF9900;
    // border-color: #e60012;
    // background-color: #e60012;
  }
  .temperatureC {
    color: #00ffff;
    // border-color: #0080ff;
    // background-color: #0080ff;
  }
  .temperatureN {
    color: #555555;
    // border-color: #0080ff;
    // background-color: #0080ff;
  }
  .temperatureNH {
    color: #99bbcc;
    // border-color: #0080ff;
    // background-color: #0080ff;
  }

  .el-alert-vp {
    color: #80ffff !important;
    background: #062a4b !important;
  }

  .el-tree {
    color: #70879a;
    background: none;
  }
  .el-tree-node__content:hover {
    background-color: #00366c;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #00162c;
  }

  .di_temperature {
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
    .di_temperature_div {
      margin-top: -6px;
    }
    .di_temperature_txt {
      margin-left: -8px;
      margin-top: 0px;
    }
    .di_temperature_ico {
      margin-left: 30px;
      margin-top: -14px;
    }
  }
  .di_temperatureA {
    color: #008e2b;
    border-color: #8cd28f;
  }
  .di_temperatureB {
    color: #ffffff;
    border-color: #e60012;
    background-color: #e60012;
  }
  .di_temperatureC {
    color: #ffffff;
    border-color: #0080ff;
    background-color: #0080ff;
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
    background-size: contain;
  }
  .div-rc-photo-left {
    margin-right: 2px;
    background-position-x: right;
  }
  .div-rc-photo-center {
    margin-right: 2px;
    margin-left: 2px;
    background-position-x: right;
  }
  .div-rc-photo-right {
    margin-left: 2px;
    background-position-x: left;
  }

  .el-dialog-vi {
    .el-dialog {
      background: #062a4b;
      -webkit-box-sizing: border-box;
      .el-dialog__title {
        color: #97c2e6;
      }
    }
  }

  .vi_divider {
    background-color: #174679;
    position: relative;
  }

  /** 照片标签 */
  .photo_tip_l, .photo_tip_m, .photo_tip_r {
    position:absolute;
    // background:#000000;
    // opacity: 0.7;
    background-color: rgba(0,0,0,0.5);
    height:27px;
    bottom:3px;
  }
  .photo_tip_l, .photo_tip_m, .photo_tip_r span {
    color: #FFF;
    font-size: 17px;
    font-weight: 600;
    line-height: 25px;
  }
  .photo_tip_l {
    width:175px;
    right:0;
    border-radius: 15px 0 0 15px;
    padding: 2px 8px 0px 0;
  }
  .photo_tip_m {
    width:200px;
    margin:auto;right:0;left:0;
    border-radius: 15px;
    padding: 2px 0 0px 0;
  }
  .photo_tip_r {
    width:175px;
    left:0;
    border-radius: 0 15px 15px 0;
    padding: 2px 0 0px 8px;
  }
  .photo_ico {
    margin: 0 3px;
    color: #FF0000;
  }

  .car-hove {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  .car-hove:hover {
    -webkit-transform: scale(1.08);
    transform: scale(1.08);
  }

  .color-success {
    color: #00AA00;
  }
  .color-warning {
    color: #FF9900;
  }
  .color-error {
    color: #EE0000;
  }
</style>
