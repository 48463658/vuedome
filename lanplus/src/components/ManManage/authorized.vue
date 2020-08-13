<template>
  <div>
    <el-card class="g_label" v-loading="diaLoading" style="width: 860px; padding: 15px 0 20px 0px">
      <el-row>
        <el-transfer
          :loading="diaLoading"
          filterable
          :titles="['可选权限', '[ '+UsersNames[nowUserIndex]+' ] 已有权限']"
          :filter-method="filterMethod"
          filter-placeholder="请输入权限名"
          v-model="authTransferValue"
          :data="generateData"
          @change="handleChange"
        >
          <div slot-scope="{ option }" style="width: 228px;">
            <div
              v-if="option.isadmin"
              style="color: #ee6600; font-size: 13px; display: inline; width: 80px;"
            >{{ option.label }}</div>
            <div
              v-else
              style="color: #333333; font-size: 13px; display: inline; width: 80px;"
            >{{ option.label }}</div>
            <div
              v-if="option.isadmin"
              style="float: right; color: #c77763; font-size: 13px; text-align:right; display: inline; width: 140px;"
            >{{ option.description }}</div>
            <div
              v-else
              style="float: right; color: #8492a6; font-size: 13px; text-align:right; display: inline; width: 140px;"
            >{{ option.description }}</div>
          </div>
        </el-transfer>
      </el-row>
      <el-row style="padding: 0">
        <div aigin="middle" style="text-align:center; padding: 0; margin: -40px 30px 0 0">
          <el-button
            type="primary"
            icon="el-icon-circle-check"
            @click="saveAuth"
            size="small"
            :loading="diaLoading"
            style="margin-left: 30px;"
          >保存权限</el-button>
        </div>
      </el-row>
    </el-card>
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

      UserNum: 0, // 要添加权限的用户数量
      UsersId: [], // 要添加权限的用户ID数组
      UsersNames: [], // 要添加权限的用户名数组
      UsersAuths: [], // 要添加权限的用户现拥有的权限
      UsersAuthIDs: [], // 要添加权限的用户现拥有的权限ID
      nowUserIndex: 0, // 当前操作的用户索引
      nowUserID: 0, // 当前操作的用户ID
      nowUserName: 0, // 当前操作的用户名

      isAdminID: 0, // 当前内部管理员对应的ID

      authTransferValue: [], // 权限Transfer已选列表

      diaLoading: false,

      delId: [],
      currentPage: 1,
      pageSize: 99,
      pageTotal: 0,
      filterMethod(query, item) {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
        // return true
      }
    }
  },
  computed: {
    // 权限Transfer数据列表
    generateData() {
      var data = []
      if (this.listdata) {
        data = []
        this.listdata.forEach((auth, index) => {
          if (auth.authority_name === 'ROLE_ADMIN' && !this.configGd.isAdmin) {
          } else {
            data.push({
              label: auth.authority_name,
              key: auth.auth_id,
              description: auth.authority_description,
              isadmin: auth.authority_name === 'ROLE_ADMIN',
              disabled: (auth.authority_name === 'ROLE_ADMIN' && !this.configGd.isAdmin)
            })
          }
        })
      }
      return data
    }
  },
  created() {
    if (this.$Storage.localGet('selId')) {
      this.UsersId = this.$Storage.localGet('selId')
      this.UsersNames = this.$Storage.localGet('selNames')
      this.UserNum = this.UsersId.length
    } else {
      // this.$router.push({ path: '/menmessage' })
      this.$router.push(
        '/mammanmessage',
        () => {},
        e => {
          console.log('输出报错', e)
        }
      )
    }
    this.getAuthList()
    this.getUserAuthAll()
  },
  mounted() {},
  methods: {
    // 获取权限信息
    getAuthList() {
      var apiUrl =
        '/api' +
        '/auth/find/list' +
        '?page=' +
        this.currentPage +
        '&pageSize=' +
        this.pageSize
      this.udShowStyle(true)
      this.$http
        .get(apiUrl)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              this.listdata = res.data.data.list
              this.pageTotal = res.data.data.total
              this.listdata.forEach((auth, index) => {
                if (auth.authority_name === 'ROLE_ADMIN') {
                  this.isAdminID = auth.auth_id
                  return false
                }
              })
              this.udShowStyle(false)
            } else {
              this.urResponseErr('获取权限信息失败：' + res.data.message)
            }
          } else {
            this.urResponseErr('获取权限信息失败！')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取人员信息失败：' + err)
        })
    },

    // 获取用户权限-all
    getUserAuthAll() {
      this.UsersAuths = []
      this.UsersAuthIDs = []
      var myApis = []
      for (let i = 0; i < this.UserNum; i++) {
        myApis[i] = this.$http.get(
          '/api' + '/user/find/auth?' + 'userId=' + this.UsersId[i]
        )
      }
      this.udShowStyle(true)
      this.$http
        .all(myApis)
        .then(res => {
          if (res) {
            var myAuths = []
            var myAuthIDs = []
            for (let i = 0; i < res.length; i++) {
              myAuths[i] = []
              myAuthIDs[i] = []
              // this.UsersAuthIDs[i] = []
              if (res[i].data.code === 0) {
                for (let j = 0; j < res[i].data.data.length; j++) {
                  myAuths[i][j] = res[i].data.data[j]
                  myAuthIDs[i][j] = res[i].data.data[j].auth_id
                }
                this.udShowStyle(false)
              } else {
                // this.$set(this.UsersAuths[i], 0, '[' + res[i].data.message + ']')
                myAuths[i][0] = '[' + res[i].data.message + ']'
                this.urResponseErr('获取用户权限失败：' + res.data.message)
              }
            }
            this.nowUserIndex = 0
            this.nowUserID = this.UsersId[0]
            this.nowUserName = this.UsersNames[0]
            this.UsersAuths = myAuths.slice()
            this.UsersAuthIDs = myAuthIDs.slice()
            // this.authTransferValue = this.UsersAuthIDs[this.nowUserIndex]
            this.authTransferValue = this.UsersAuthIDs[this.nowUserIndex].slice()
            // this.getAuthList()
            this.udShowStyle(false)
          } else {
            this.urResponseErr('获取用户权限失败！')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr('获取用户权限失败！' + err)
        })
    },

    // 保存添加权限
    saveAuth(_e, _noDel) {
      this.udShowStyle(true)
      if (!_noDel) {
        this.delId = []
        for (let i = 0; i < this.UsersAuthIDs[this.nowUserIndex].length; i++) {
          if (
            this.authTransferValue.indexOf(
              this.UsersAuthIDs[this.nowUserIndex][i]
            ) === -1
          ) {
            this.delId.push(this.UsersAuthIDs[this.nowUserIndex][i])
          }
        }
        if (this.delId.length > 0) {
          this.delAuth(this.nowUserID, this.delId, this.saveAuth)
          return
        }
      }

      var apiUrl = '/api' + '/user/save/auth'
      var saveAuth = { userId: this.nowUserID, auths: this.authTransferValue }
      var adTitle = '添加用户权限'
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const formData = new FormData()
      for (var I in saveAuth) {
        formData.append(I, saveAuth[I])
      }
      this.$http
        .post(apiUrl, formData, config)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              this.$message({
                message: adTitle + '成功！',
                type: 'success'
              })
              this.getUserAuthAll()
            } else {
              this.urResponseErr(adTitle + '失败：' + res.data.message)
            }
          } else {
            this.urResponseErr(adTitle + '失败！')
          }
          // this.udShowStyle(false)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr(adTitle + '失败:' + err)
          // this.udShowStyle(false)
        })
      // eslint-disable-next-line no-unreachable
    },

    // 保存删除用户权限
    delAuth(_userid, _auths, _callback) {
      this.udShowStyle(true)
      var apiUrl = '/api' + '/user/del/auth'
      var saveAuth = { userId: _userid, auths: _auths }
      var adTitle = '移除用户权限'
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const formData = new FormData()
      for (var I in saveAuth) {
        formData.append(I, saveAuth[I])
      }
      this.$http
        .post(apiUrl, formData, config)
        .then(res => {
          if (res) {
            if (res.data.code === 0) {
              if (_callback) {
                _callback(null, true)
              } else {
                this.$message({
                  message: adTitle + '成功！',
                  type: 'success'
                })
                this.getUserAuthAll()
              }
            } else {
              this.urResponseErr(adTitle + '失败：' + res.data.message)
            }
          } else {
            this.urResponseErr(adTitle + '失败！')
          }
          // this.udShowStyle(false, true)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.urResponseErr(adTitle + '失败:' + err)
          // this.udShowStyle(false)
        })
    },

    // 提交开始或结束
    udShowStyle(_start) {
      this.diaLoading = _start
    },
    // 提交返回失败的处理：
    urResponseErr(_errmsg) {
      this.udShowStyle(false)
      this.$message.error(_errmsg)
    },

    // 批量操作复选框
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        if (this.authTransferValue.length > 0 && this.authTransferValue[0] === this.isAdminID) {
          this.adminOnly()
        } else if (movedKeys.indexOf(this.isAdminID) >= 0) {
          this.adminOnly()
        }
      }
    },

    // 内部管理员排外处理：
    adminOnly() {
      this.authTransferValue = [this.isAdminID]
      this.$message({
        message: '[ 内部管理员 ] 与其他权限不能也无需共存！',
        type: 'warning'
      })
    },

    // 权限小卡样式
    barClass(_index) {
      if (_index % 2 === 0) {
        return 'bar bar-purple-A'
      } else {
        return 'bar bar-purple-B'
      }
    }
  }
}
</script>
<style lang="less">
.bg-purple-dark {
  background: #eeeeee;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-left {
  background: #ffffff;
}
.bar {
  display: inline;
  padding: 2px 4px;
  margin: 0 1px;
  border-radius: 4px;
  border: 1px solid #ddddcd;
}
.bar-purple-A {
  background: #eeeeff;
}
.bar-purple-B {
  background: #ffeeee;
}
.grid-content {
  border-radius: 5px 0 0 5px;
  min-height: 20px;
  margin: 0 3px 0px 0px;
  padding: 4px 8px 0px 8px;
}

.el-transfer {
  height: calc(100% - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-transfer-panel {
  width: 320px;
  height: 100%;
  min-height: 320px;
}
.el-transfer-panel__body {
  height: calc(100% - 40px);
}
.el-transfer-panel__filter {
  margin: 0 15px;
}
.el-transfer-panel .el-transfer-panel__header {
  margin-bottom: 10px;
}
.el-transfer-panel__list.is-filterable {
  margin-top: 10px;
  height: calc(100% - 76px);
}
.el-transfer__buttons {
  .el-button--primary {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50px;
  }
}
</style>
