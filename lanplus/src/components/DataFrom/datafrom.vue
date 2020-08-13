<!--
 * @Description: 数据分析/数据报表
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-08 16:15:14
-->

<template style="height: 100%">
  <div>
    <el-card
      :body-style="{ padding: '10px' }"
      class="g_label card-inside div_bas0"
      shadow="hover"
      style="width: 100%; height: 52px; margin-bottom: 10px;"
    >
      <el-row
        justify="space-between"
        type="flex"
        :gutter="20"
        class="oneRow div_bas0"
        style="width: 100%; height: 52px;"
        v-loading="diaLoading"
      >
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
          <div v-if="this.configGd.isAdmin" class="div_inline">
            企业:
            <el-select
              v-model="nowCompany"
              clearable
              size="small"
              @change="change_Company"
              @clear="change_Company"
              style="width:160px; margin-left: 10px;"
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
          <div class="div_inline">
            设备:
            <el-select
              v-model="nowEquipment"
              clearable
              size="small"
              @change="change_Equipment"
              @clear="change_Equipment"
              style="width:160px; margin-left: 10px;"
              placeholder="请选择设备"
            >
              <el-option
                v-for="item in eqListdata"
                :key="item.serial"
                :label="item.device_address"
                :value="item.serial"
              ></el-option>
            </el-select>
          </div>
          <div class="div_inline_button" style="margin-left: 10px;">
            <!-- 刷新按钮 -->
            <el-button
              @click="date_picker_change(null, true)"
              class="el-button_co"
              type="success"
              icon="el-icon-refresh"
              :loading="diaLoading"
            >刷新</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row
      justify="space-between"
      type="flex"
      :gutter="0"
      class="twoRow div_bas0"
      style="width: 100%; height: 58px;"
    >
      <el-col :span="spanNum" style="margin: 0 6px 0 0;">
        <el-card :body-style="{ padding: '8px' }" class="car-num" shadow="hover" align="middle">
          <div
            v-if="v_total > 0"
            class="div_bas0 div-df-n"
            style="padding-bottom: 5px; width: 100%; height: 22px;"
          >{{v_total}}</div>
          <div v-else class="div_bas0 div-df-n">-</div>
          <div class="div_bas0 g_label-s label-num">识别总数</div>
        </el-card>
      </el-col>
      <el-col :span="spanNum" style="margin: 0 6px;">
        <el-card :body-style="{ padding: '8px' }" class="car-num" shadow="hover" align="middle">
          <div
            v-if="v_total > 0"
            class="div_bas0 div-df-n"
            style="padding-bottom: 5px; width: 100%; height: 22px;"
          >{{v_unusual}}</div>
          <div v-else class="div_bas0 div-df-n">-</div>
          <div class="div_bas0 g_label-s label-num">体温异常</div>
        </el-card>
      </el-col>
      <el-col :span="spanNum" style="margin: 0 6px;">
        <el-card :body-style="{ padding: '8px' }" class="car-num" shadow="hover" align="middle">
          <div
            v-if="v_total > 0"
            class="div_bas0 div-df-n"
            style="padding-bottom: 5px; width: 100%; height: 22px;"
          >{{v_drinking}}</div>
          <div v-else class="div_bas0 div-df-n">-</div>
          <div class="div_bas0 g_label-s label-num">酒检异常</div>
        </el-card>
      </el-col>
      <el-col v-if="configGd.noMask" :span="spanNum" style="margin: 0 6px;">
        <el-card :body-style="{ padding: '8px' }" class="car-num" shadow="hover" align="middle">
          <div
            v-if="v_total > 0"
            class="div_bas0 div-df-n"
            style="padding-bottom: 5px; width: 100%; height: 22px;"
          >{{v_noMask}}</div>
          <div v-else class="div_bas0 div-df-n">-</div>
          <div class="div_bas0 g_label-s label-num">未戴口罩</div>
        </el-card>
      </el-col>
      <el-col :span="spanNum" style="margin: 0 0 0 6px;">
        <el-card :body-style="{ padding: '8px' }" class="car-num" shadow="hover" align="middle">
          <div
            v-if="v_total > 0"
            class="div_bas0 div-df-n"
            style="padding-bottom: 5px; width: 100%; height: 22px;"
          >{{v_stranger}}</div>
          <div v-else class="div_bas0 div-df-n">-</div>
          <div class="div_bas0 g_label-s label-num">陌生人</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card
      :body-style="{ padding: '10px' }"
      class="g_label card-inside div_bas0"
      shadow="hover"
      style="width: 100%; height: 300px; margin-bottom: 0px;"
    >
      <div id="chhistory" ref="chhistoryref" class="div_bas0" style="width: 100%; height: 300px;"></div>
    </el-card>
    <el-row
      justify="space-between"
      type="flex"
      :gutter="0"
      class="twoRow div_bas0"
      style="width: 100%; height: 150px;"
    >
      <el-col :span="spanNum" style="margin: 0 6px 0 0;">
        <el-card
          :body-style="{ padding: '8px' }"
          class="g_label card-inside div_bas0"
          shadow="hover"
        >
          <div id="chtotalT" ref="chtotalrefT" class="div_bas0" style="width: 100%; height: 150px;"></div>
        </el-card>
      </el-col>
      <el-col :span="spanNum" style="margin: 0 6px;">
        <el-card
          :body-style="{ padding: '8px' }"
          class="g_label card-inside div_bas0"
          shadow="hover"
        >
          <div id="chtotalF" ref="chtotalrefF" class="div_bas0" style="width: 100%; height: 150px;"></div>
        </el-card>
      </el-col>
      <el-col :span="spanNum" style="margin: 0 6px;">
        <el-card
          :body-style="{ padding: '8px' }"
          class="g_label card-inside div_bas0"
          shadow="hover"
        >
          <div id="chtotalH" ref="chtotalrefH" class="div_bas0" style="width: 100%; height: 150px;"></div>
        </el-card>
      </el-col>
      <el-col :span="spanNum" :style="{margin:(configGd.noMask?'0 0 0 6px':'margin: 0 6px')}">
        <el-card
          :body-style="{ padding: '8px' }"
          class="g_label card-inside div_bas0"
          shadow="hover"
        >
          <div id="chtotalM" ref="chtotalrefM" class="div_bas0" style="width: 100%; height: 150px;"></div>
        </el-card>
      </el-col>
      <el-col v-if="configGd.noMask" :span="spanNum" style="margin: 0 0 0 6px;">
        <el-card
          :body-style="{ padding: '8px' }"
          class="g_label card-inside div_bas0"
          shadow="hover"
        >
          <div id="chtotalK" ref="chtotalrefK" class="div_bas0" style="width: 100%; height: 150px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {},
      websock: null,
      diaLoading: false, // 是否正在
      centerDialogVisible: true,
      // 按时间筛选数据
      seekTime: ['', ''],
      // 识别记录数据
      listdata: [],
      // 企业列表数据
      comlistdata: [],
      // 企业总数
      comTotal: 0,
      // 设备列表数据：
      eqListdata: [],
      // 设备总数：
      eqTotal: 0,
      // 当前企业:
      nowCompany: '',
      // 当前设备[序列号,可以多个]
      nowEquipment: '',
      currentPage: 1,
      pageSize: 99,
      pageTotal: 0,
      // 数据统计：
      v_total: 0, // 识别总人数
      v_unusual: 0, // 异常人数
      v_noMask: 0, // 未待口罩
      v_drinking: 0, // 酒检异常
      v_stranger: 0, // 陌生人
      v_blacklist: 0, // 黑名单
      // 图表数据：
      chtitle: {
        t: '报警统计',
        f: '人脸识别统计',
        // m: '口罩佩戴统计',
        m: '酒检异常统计',
        h: '体温统计',
        k: '口罩佩戴统计'
      },
      // chdataT_title: ['体温异常', '未戴口罩', '陌生人'],
      // chdataT_title: ['体温异常', '酒检异常', '未戴口罩', '陌生人'],
      chdataF_title: ['通过', '陌生人'],
      // chdataM_title: ['戴口罩', '未戴口罩'],
      chdataK_title: ['戴口罩', '未戴口罩'],
      chdataM_title: ['酒检正常', '酒检异常'],
      chdataH_title: ['体温正常', '体温异常'],
      // chdataT_color: ['#FF0000', '#FF8800', '#ff60c2', '#0055BB'],
      chdataF_color: ['#339900', '#0055BB'],
      chdataM_color: ['#339900', '#FF0000'],
      chdataH_color: ['#339900', '#FF0000'],
      chdataK_color: ['#ff60c2', '#999999']
    }
  },
  components: {
    // gdtree: gdtree
  },
  computed: {
    // computed
    chdataT_title () {
      if (this.configGd.noMask) {
        return ['体温异常', '酒检异常', '未戴口罩', '陌生人']
      } else {
        return ['体温异常', '酒检异常', '陌生人']
      }
    },
    chdataT_color () {
      if (this.configGd.noMask) {
        return ['#FF0000', '#FF8800', '#ff60c2', '#0055BB']
      } else {
        return ['#FF0000', '#FF8800', '#0055BB']
      }
    },

    spanNum () {
      let reN = 7
      if (this.configGd.noMask) {
        reN--
      }
      if (this.configGd.drinking) {
        reN--
      }
      return reN
    },

    chdataT_data() {
      if (this.configGd.noMask) {
        return [
          { value: this.v_unusual, name: '体温异常' },
          { value: this.v_drinking, name: '酒检异常' },
          { value: this.v_noMask, name: '未戴口罩' },
          { value: this.v_stranger, name: '陌生人' }
        ]
      } else {
        return [
          { value: this.v_unusual, name: '体温异常' },
          { value: this.v_drinking, name: '酒检异常' },
          { value: this.v_stranger, name: '陌生人' }
        ]
      }
    },
    chdataF_data() {
      return [
        { value: this.v_total - this.v_stranger, name: '通过' },
        { value: this.v_noMask, name: '陌生人' }
      ]
    },
    chdataM_data() {
      return [
        { value: this.v_total - this.v_drinking, name: '酒检正常' },
        { value: this.v_drinking, name: '酒检异常' }
      ]
    },
    chdataH_data() {
      return [
        { value: this.v_total - this.v_unusual, name: '体温正常' },
        { value: this.v_unusual, name: '体温异常' }
      ]
    },
    chdataK_data() {
      return [
        { value: this.v_total - this.v_noMask, name: '戴口罩' },
        { value: this.v_noMask, name: '未戴口罩' }
      ]
    }
  },
  created() {
    var timeStart = new Date()
    timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
    var timeEnd = new Date()
    this.seekTime = [
      timeStart.format('yyyy-MM-dd hh:mm:ss'),
      timeEnd.format('yyyy-MM-dd hh:mm:ss')
    ]
    this.getStats()
    this.getLine()
    this.getComList()
    this.getEqList()
  },
  destroyed() {
    if (this.websock) {
      this.websock.close() // 离开路由之后断开websocket连接
      this.websock = null
    }
  },
  mounted() {
    // this.showCharts()
    this.resizefun = () => {
      this.$echarts.init(document.getElementById('chhistory')).resize()
      this.$echarts.init(document.getElementById('chtotalT')).resize()
      this.$echarts.init(document.getElementById('chtotalF')).resize()
      this.$echarts.init(document.getElementById('chtotalM')).resize()
      this.$echarts.init(document.getElementById('chtotalH')).resize()
      if (this.configGd.noMask) {
        this.$echarts.init(document.getElementById('chtotalK')).resize()
      }
    }
    window.addEventListener('resize', this.resizefun)
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
          this.getStats()
          this.getLine()
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
      console.log('datafrom 已断开连接', e)
    },
    // 公司选择改变：
    change_Company() {
      this.nowEquipment = ''
      this.getEqList()
      this.getStats()
      this.getLine()
    },
    // 设备选择改变：
    change_Equipment() {
      this.getStats()
      this.getLine()
    },
    showCharts(_title, _titles, _datas, _fefs, _colors) {
      // 异常统计：
      // var chtotalT = this.$refs.chtotalrefT
      var chtotalID = _fefs
      var myChtotal = this.$echarts.init(chtotalID)
      var myChoption = {
        title: {
          show: true,
          text: _title,
          textStyle: {
            fontSize: 13,
            fontStyle: 'normal',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          show: false
        },
        legend: {
          orient: 'vertical',
          left: 3,
          top: 25,
          data: _titles
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['67%', '50%'],
            color: _colors,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                formatter: '{b}\n{at|{c}}\n{per|{d}%}',
                show: true,
                lineHeight: 14,
                rich: {
                  at: {
                    fontSize: '13',
                    fontWeight: 'bold',
                    align: 'center'
                  },
                  ab: {
                    fontWeight: 900
                  },
                  per: {
                    color: '#eee',
                    fontSize: '11',
                    backgroundColor: '#556677',
                    padding: [2, 4, 4, 4],
                    borderRadius: 4
                  }
                }
              }
            },
            labelLine: {
              show: false
            },
            data: _datas
          }
        ]
      }
      // var i = 0
      // if (_titles) {
      //   myChoption.legend.data = []
      //   myChoption.series[0].data = []
      //   for (i = 0; i < _titles.length; i++) {
      //     myChoption.legend.data[i] = _titles[i]
      //     myChoption.series[0].data[i] = _datas[i]
      //   }
      // }
      myChtotal.setOption(myChoption)
    },
    showChartHistory(_source, _nowdata) {
      // 异常记录：
      var chhistory = this.$refs.chhistoryref
      var myChhistory = this.$echarts.init(chhistory)
      let legendData = []
      let pieColor = []
      if (this.configGd.noMask) {
        legendData = ['体温异常', '酒检异常', '未戴口罩', '陌生人'] // '体温异常', '未戴口罩', '陌生人'
        pieColor = ['#FF0000', '#FF8800', '#ff60c2', '#0055BB']
      } else {
        legendData = ['体温异常', '酒检异常', '陌生人'] // '体温异常', '未戴口罩', '陌生人'
        pieColor = ['#FF0000', '#FF8800', '#0055BB']
      }
      var myChoptionH = {
        title: {
          show: true,
          text: '异常报警',
          textStyle: {
            fontSize: 13,
            fontStyle: 'normal',
            fontWeight: 'bold'
          }
        },
        legend: {
          orient: 'horizontal',
          left: 80,
          top: 1,
          data: legendData // '体温异常', '未戴口罩', '陌生人'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   showContent: false
        // },
        tooltip: {
          trigger: 'axis',
          showContent: false,
          axisPointer: {
            type: 'cross',
            label: {
              // show: false // 不显示指示器的文本标签
            }
          }
        },
        dataset: {
          // source: [
          //   ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
          //   ['体温异常', 100, 30.4, 65.1, 53.3, 83.8, 98.7],
          //   ['未戴口罩', 0, 92.1, 85.7, 83.1, 73.4, 55.1],
          //   ['陌生人', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5]
          // ]
          source: _source
        },
        xAxis: { type: 'category' },
        yAxis: {
          gridIndex: 0,
          axisPointer: {
            show: false // 不显示竖向的指示器
          }
        },
        grid: { top: '14%', left: '3%', right: '32%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            color: '#FF0000'
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            color: '#ff60c2'
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            color: '#FF8800'
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            color: '#0000FF'
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '40%',
            center: ['82%', '45%'],
            color: pieColor,
            label: {
              // formatter: '{at|}{b} {ab|{@2017}}\n{per|{d}%}',
              formatter: '{at|}{b} {ab|{@' + _nowdata + '}}\n{per|{d}%}',
              rich: {
                at: {
                  color: '#999',
                  lineHeight: 15,
                  align: 'center'
                },
                ab: {
                  fontWeight: 900
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#556677',
                  padding: [2, 4, 4, 4],
                  borderRadius: 4
                }
              }
            },
            encode: {
              itemName: 'product',
              value: _nowdata,
              tooltip: _nowdata
            }
          }
        ]
      }
      if (!this.configGd.noMask) {
        myChoptionH.series.splice(2, 1)
      }
      myChhistory.on('updateAxisPointer', function(event) {
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          myChhistory.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{at|}{b} {ab|{@[' + dimension + ']}}\n{per|{d}%}'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
      myChhistory.setOption(myChoptionH)
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
    // 拉取设备列表：
    getEqList() {
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
      if (this.nowCompany) {
        apiUrl += '&companyName=' + this.nowCompany
      }
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            this.eqListdata = res.data.data.list
            this.eqTotal = res.data.data.total
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取设备列表失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取设备列表失败：' + err)
        })
    },
    // 拉取统计数据：
    getStats() {
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
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data.code === 0 && res.data.data) {
            const data = res.data.data
            for (var i in data) {
              this['v_' + data[i].describe] = data[i].sum
            }
            this.showCharts(
              this.chtitle.t,
              this.chdataT_title,
              this.chdataT_data,
              this.$refs.chtotalrefT,
              this.chdataT_color
            )
            this.showCharts(
              this.chtitle.f,
              this.chdataF_title,
              this.chdataF_data,
              this.$refs.chtotalrefF,
              this.chdataF_color
            )
            this.showCharts(
              this.chtitle.m,
              this.chdataM_title,
              this.chdataM_data,
              this.$refs.chtotalrefM,
              this.chdataM_color
            )
            this.showCharts(
              this.chtitle.h,
              this.chdataH_title,
              this.chdataH_data,
              this.$refs.chtotalrefH,
              this.chdataH_color
            )
            if (this.configGd.noMask) {
              this.showCharts(
                this.chtitle.k,
                this.chdataK_title,
                this.chdataK_data,
                this.$refs.chtotalrefK,
                this.chdataK_color
              )
            }
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取统计数据失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取统计数据失败：' + err)
        })
    },
    // 拉取拆线数据：chart/line
    getLine() {
      var apiUrl =
        '/api' +
        '/chart/line?' +
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
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res.data && res.data.code === 0) {
            if (res.data.data && res.data.data.length > 0) {
              const data = res.data.data
              var _source = [
                ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                ['体温异常', 100, 30.4, 65.1, 53.3, 83.8, 98.7],
                // ['未戴口罩', 0, 92.1, 85.7, 83.1, 73.4, 55.1],
                ['酒检异常', 0, 92.1, 85.7, 83.1, 73.4, 55.1],
                ['未戴口罩', 0, 92.1, 85.7, 83.1, 73.4, 55.1],
                ['陌生人', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5]
              ]
              var _nowdata = '2017'
              if (this.configGd.noMask) {
                _source = [['product'], ['体温异常'], ['酒检异常'], ['未戴口罩'], ['陌生人']]
              } else {
                _source = [['product'], ['体温异常'], ['酒检异常'], ['陌生人']]
              }
              for (var i = 0; i < data.length; i++) {
                // console.log('getLine:', i, data[i])
                _source[0].push(data[i].day)
                _source[1].push(data[i].unusual)
                _source[2].push(data[i].drinking)
                if (this.configGd.noMask) {
                  _source[3].push(data[i].noMask)
                  _source[4].push(data[i].stranger)
                } else {
                  _source[3].push(data[i].stranger)
                }
                _nowdata = data[i].day
              }
              this.showChartHistory(_source, _nowdata)
            }
            this.udShowStyle(false)
            if (!this.websock) {
              this.initWebSocket()
            }
          } else {
            this.urResponseErr('获取拆线数数据失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取拆线数数据失败：' + err)
        })
    },
    // 获取网址随机数
    getRan(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    },
    // 转换时间格式
    getdatetime: function(_datetime) {
      return new Date(_datetime).format('yyyy-MM-dd hh:mm:ss')
    },
    // 转换短时间格式
    getshorttime: function(_datetime) {
      return new Date(_datetime).format('MM-dd hh:mm:ss')
    },
    // 获取性别
    getSex(_sex) {
      if (_sex && _sex.length > 0) {
        return _sex
      }
      return '[未注册]'
    },
    date_picker_change(val, _res) {
      if (_res) {
        var timeStart = new Date()
        timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
        var timeEnd = new Date()
        this.seekTime = [
          timeStart.format('yyyy-MM-dd hh:mm:ss'),
          timeEnd.format('yyyy-MM-dd hh:mm:ss')
        ]
      }
      console.log(`时间: ${val}`)
      console.log(this.seekTime)
      this.getStats()
      this.getLine()
    },

    // 提交返回失败的处理：
    urResponseErr(_errmsg) {
      this.udShowStyle(false)
      this.$message.error(_errmsg)
    },
    // 提交开始或结束
    udShowStyle(_start) {
      this.diaLoading = _start
    }
  }
}
</script>
<style lang="less">
// scoped
.car-num {
  width: 100%;
  height: 58px;
  margin: 0 !important;
  padding: 0 !important;
}

.label-num {
  width: 100%;
  height: 15px;
}

.div-df-n {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
}

.el-alert-df {
  color: #80ffff !important;
  background: #062a4b !important;
}
</style>
