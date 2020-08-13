<template>
  <div>
    <el-card>

      <el-row justify="space-between" type="flex" :gutter="20" class="oneRow">
        <el-col :span="24">
          <div class="g_label">
            <div class="div_inline">
              角色名:
              <el-input
                size="small"
                clearable
                class="el-input_co"
                style="width:150px"
                placeholder="请输入角色名"
                v-model="seekrolesName"
              />
            </div>
            <div class="div_inline">
              角色标题:
              <el-input
                size="small"
                clearable
                class="el-input_co"
                style="width:150px"
                placeholder="请输入角色标题"
                v-model="seekRolesTitle"
              />
            </div>
            <div class="g_label div_inline">
              <!-- 筛选按钮 -->
              <el-button
                @click="getRolesList"
                class="el-button_co"
                type="primary"
                icon="el-icon-search"
              >搜索</el-button>
            </div>
            <div class="g_label div_inline div_right">角色总数: {{pageTotal}}</div>
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
            >添加</el-button>
            <!-- 删除 -->
            <el-button
              @click="doDel"
              class="el-button_co"
              type="danger"
              icon="el-icon-remove-outline"
            >删除</el-button>
            <!-- 分配权限 -->
            <el-button
              class="el-button_co el-button_coco"
              type="primary"
              icon="el-icon-s-custom"
            >分配权限</el-button>
          </el-button-group>
        </el-col>
      </el-row>

      <el-row>
        <!-- 表格 -->
        <el-table style="width: 100%"
                  :header-cell-style="{background:'#eee',color:'#000'}"
                  :data="listdata"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="序号"
                           align="center"
                           type="index"
                           width="60px">
          </el-table-column>
          <el-table-column prop=""
                           label="角色名"
                           align="center">
          </el-table-column>
          <el-table-column prop=""
                           label="角色标题"
                           align="center">
          </el-table-column>
          <el-table-column prop=""
                           label="备注"
                           align="center">
          </el-table-column>
          <el-table-column prop=""
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <!-- 分配角色 -->
              <i style="padding: 0 0.08rem;"
                 @click="isPermission(scope)"><img src="../../assets/img/a_permission01.png"></i>
              <!-- 编辑角色 -->
              <i style="padding: 0 0.08rem;"
                 @click="isEdit(scope)"><img src="../../assets/img/a_edit01.png"></i>
              <!-- 删除角色 -->
              <i style="padding: 0 0.08rem;"
                 @click="isDel(scope)"><img src="../../assets/img/a_del201.png"></i>
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
  data () {
    return {
      // 筛选按钮数据
      seekrolesName: '',
      seekRolesTitle: '',
      // 添加角色数据
      addRoles: {
        dialogVisible: false,
        rolesName: '',
        rolesTitle: '',
        rolesRemark: ''
      },
      // 表格数据
      listdata: [],
      currentPage: 1,
      pageSize: 13,
      pageTotal: 0
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色信息
    getRolesList () {
      this.$http.get('/api' + "/user/find/role")
      .then(res => {
          this.listdata = res.data.data.list
          this.pageTotal = res.data.data.total
            if ((!this.listdata || this.listdata.length === 0) && this.pageTotal > 0 && this.currentPage > 1) {
              this.currentPage = Math.ceil(this.pageTotal / this.pageSize)
              this.getUserList()
              return
            }
      }).catch(err => {
        console.log("获取人员信息失败")
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getUserList(this.currentPage)
    },
    // 添加按钮 
    isAddRoles () {
      this.addRoles.dialogVisible = true
    },
    // 确认保存添加
    isconfirm () {

    },
    // 删除角色
    isDelRoles () {

    },
    // 分配权限
    permissionRoles () {

    },
    //操作下面的分配角色
    isPermission () {

    },
    // 编辑角色
    isEdit () {

    },
    // 删除角色
    isDel () {

    },
    // 表格最前面的复选框
    handleSelectionChange () {
    }
  },

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
