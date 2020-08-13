<!--
 * @Description: 数据管理-操作日志
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-09 17:01:31
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
          <div class="div_inline">
            操作类型:
            <el-select v-model="seekOperationType"
              clearable
              size="small"
              @change="getList"
              @clear="getList"
              style="width:120px; margin-left: 10px;"
              placeholder="请选择类型">
              <el-option
                v-for="label in OperationTypeLabels"
                :key="label"
                :label="label"
                :value="label">
              </el-option>
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
          <div class="div_inline">
            <!-- 筛选按钮 -->
            <el-button @click="getList" class="el-button_co" type="primary" icon="el-icon-search" :loading="diaLoading">搜索</el-button>
            <el-popconfirm
              title="是否要导出全部日志？如果否，请选择或输入筛选条件（注：筛选必须要点击“搜索”按钮后才会生效）。"
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
          <div class="div_inline div_right">日志总数: {{pageTotal}}</div>
        </el-col>
      </el-row>
      <el-row>
        <!-- 表格 -->
        <el-table
          style="width: 100%"
          :header-cell-style="{background:'#eee',color:'#000'}"
          :data="listdata"
          stripe
        >
          <el-table-column prop="logId" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="operationModel" label="操作模块" align="center"></el-table-column>
          <el-table-column prop="operationFunction" label="接口功能" align="center"></el-table-column>
          <el-table-column prop="operationExplain" label="参数说明" align="center"></el-table-column>
          <el-table-column prop="accountInfo" label="用户名" align="center"></el-table-column>
          <el-table-column prop="ip" label="登陆IP" align="center"></el-table-column>
          <el-table-column label="时间" align="center">
            <template scope="scope">
              {{ scope.row.operationTime.substr(0, 16) }}
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      ExportLoading: false, // 正在导出
      diaLoading: false,
      // 操作类型列表：
      OperationTypeLabels: ['添加', '删除', '修改', '查询'],
      // 按时间筛选数据
      seekTime: ['', ''],
      // 按用户名筛选数据
      seekName: '',
      // 按操作类型筛选数据
      seekOperationType: '',
      // 设备表单数据
      listdata: [],
      currentPage: 1,
      pageSize: 13,
      pageTotal: 0
    }
  },
  computed: {
    isExportAll() {
      return (!this.seekOperationType && !this.seekName)
    }
  },
  created() {
    // console.log(new Date().format("yyyy-MM-dd hh:mm:ss"))
    // console.log(this.seekTime)
    const timeStart = new Date()
    timeStart.setTime(timeStart.getTime() - 3600 * 1000 * 24 * 30)
    const timeEnd = new Date()
    this.seekTime = [
      timeStart.format('yyyy-MM-dd hh:mm:ss'),
      timeEnd.format('yyyy-MM-dd hh:mm:ss')
    ]
    this.getList()
    // this.initWebSocket()
  },
  methods: {
    // 获取公司列表数据
    getList() {
      var apiUrl =
        '/api' +
        '/system/log' +
        '?page=' +
        this.currentPage +
        '&pageSize=' +
        this.pageSize +
        '&startTime=' +
        this.seekTime[0] +
        '&endTime=' +
        this.seekTime[1]
      if (this.seekOperationType) {
        apiUrl += '&operationType=' + this.seekOperationType
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
            if ((!this.listdata || this.listdata.length === 0) && this.pageTotal > 0 && this.currentPage > 1) {
              this.currentPage = Math.ceil(this.pageTotal / this.pageSize)
              this.getList()
              return
            }
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取操作日志失败：' + res.data.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取操作日志失败：' + err)
        })
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
    date_picker_change(val) {
      console.log(`时间: ${val}`)
      console.log(this.seekTime)
      this.getList(this.currentPage)
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
    // 导出：
    doExport(_noAll) {
      if (_noAll && !this.seekOperationType && !this.seekName) {
        return
      }
      var apiUrl = '/api' + '/export/system/log'
      let myparams = {
        startTime: this.seekTime[0],
        endTime: this.seekTime[1]
      }
      if (this.seekOperationType) {
        myparams.operationType = this.seekOperationType
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
          if (this.seekOperationType) {
            myfilename = '_' + this.seekOperationType + myfilename
          }
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '操作日志' + myfilename + '.xlsx')
          document.body.appendChild(link)
          link.click()
          this.ExportLoading = false
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.ExportLoading = false
          this.$message.error('导出操作日志失败：' + err)
        })
    }
  }
}
</script>
<style lang="less">

</style>
