<template>
  <div id="app">
    <div class="content-header">
      <h1><small>楼层管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>楼层管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input placeholder="楼层标题" v-model="keyword" style="width: 10%;"
                    class="filter-item"></el-input>
          <el-button type="primary" class="butT" @click="handleCreate()" v-if="operationVisible">新建</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList.filter(d => d.name.includes(this.keyword))" stripe highlight-current-row>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column label="操作" align="center" v-if="operationVisible">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增标签弹层 -->
        <div class="add-form">
          <el-dialog title="新增楼层" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="40%">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handleAdd()">确定</el-button>
            </div>
          </el-dialog>
        </div>

        <!-- 修改密码 -->
        <div class="add-form">
          <el-dialog title="修改楼层" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="40%">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
              <el-button type="primary" @click="handleEdit()">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'floor',
  data () {
    return {
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      keyword: '',
      edit: {},

      dataList: [], // 列表数据
      formData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的楼层列表数据
      roleIds: [], // 新增和编辑表单中楼层对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false
    }
  },
  computed: {
    operationVisible () {
      // eslint-disable-next-line eqeqeq
      return this.userRole == 1
    },
    ...mapState(['token', 'userRole'])
  },
  created () {
    this.findPage()
  },
  methods: {
    // 编辑
    handleEdit () {
      // 发送请求，提交表单数据
      this.$axios.post('/floor/update', this.formData,
        { headers: { token: this.token } }
      ).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('更新完成')
          this.dialogFormVisible4Edit = false
          this.findPage()
        } else {
          // 返回失败，提示编辑失败
          this.$message.error(response.data.message)
        }
      })
    },
    // 添加
    handleAdd () {
      console.log(this.formData)
      this.$axios.post('/floor/add', this.formData,
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 保存成功，提示正确消息
          this.$message.success('添加成功')
        } else {
          // 保存失败，提示错误消息
          this.$message.error(response.data.message)
        }
      }).finally(() => {
        // 关闭新增窗口
        this.dialogFormVisible = false
        // 无论成功与否刷新当前页面
        this.findPage()
      })
    },

    // 分页查询
    findPage () {
      // 封装分页查询参数

      // 发送请求，获取分页数据
      this.$axios.get('/floor/list',
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        // 把分页数据和总记录数据赋值给模型
        this.dataList = response.data.data.records
      })
    },
    // 重置表单
    resetForm () {
      // 清空检查组表单中的数据
      this.formData = {}
      // 清空检查项列表的数据
      this.roleIds = []
    },
    // 弹出添加窗口
    handleCreate () {
      // 重置表单数据
      this.resetForm()
      // 切换到第一个标签
      this.activeName = 'first'
      // 新增窗口可见
      this.dialogFormVisible = true
    },
    // 弹出编辑窗口
    handleUpdate (row) {
      console.log('楼层:' + row.id)
      // 发送请求，根据ID获取楼层数据
      this.$axios.get('/floor/queryById?floorId=' + row.id,
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 弹出编辑窗口
          this.dialogFormVisible4Edit = true
          // 选中第一个Tab标签
          this.activeName = 'first'
          // 把数据赋值给formData
          this.formData = response.data.data.records[0]
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // 切换页码

    // 删除
    handleDelete (row) {
      this.$confirm('确认删除当前选中的记录吗?', '提示', { type: 'warning' }).then(() => {
        this.$axios.get('/floor/delete?floorId=' + row.id,
          {
            headers: {
              'content-type': 'application/json',
              token: this.token
            }
          }
        ).then(response => {
          if (response.data.code === 200) {
            this.$message.success('删除成功')
          } else {
            (
              this.$message.error(response.data.message)
            )
          }
          this.findPage()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
