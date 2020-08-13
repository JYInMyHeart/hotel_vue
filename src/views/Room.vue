<template>
  <div id="app">
    <div class="content-header">
      <h1><small>房间管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>房间管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input placeholder="房间标题" v-model="keyword" style="width: 10%;"
                    class="filter-item"></el-input>
          <el-button type="primary" class="butT" @click="handleCreate()" v-if="operationVisible">新增房间</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList.filter(d => d.name.includes(this.keyword) || d.floor_name.includes(this.keyword))" stripe highlight-current-row>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="id" label="房间号" align="center"></el-table-column>
          <el-table-column prop="name" label="房间名称" align="center"></el-table-column>
          <el-table-column prop="description" label="房间描述" align="center"></el-table-column>
          <el-table-column prop="floor_name" label="楼层名称" align="center"></el-table-column>
          <el-table-column label="操作" align="center" v-if="operationVisible">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增标签弹层 -->
        <div class="add-form">
          <el-dialog title="新增房间" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="40%">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="房间名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="楼层">
                          <el-select v-model="formData.floor_id" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in floorList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="房间描述">
                          <el-input v-model="formData.description" type="textarea"></el-input>
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
          <el-dialog title="修改房间信息" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="40%">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="房间名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="楼层">
                          <el-select v-model="formData.floor_id" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in floorList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="房间描述">
                          <el-input v-model="formData.description" type="textarea"></el-input>
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
  name: 'Room',
  data () {
    return {
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      keyword: '',
      edit: {},
      floorList: [],
      dataList: [], // 列表数据
      formData: {}, // 表单数据
      floorFormData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的销售商列表数据
      roleIds: [], // 新增和编辑表单中销售商对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false,
      floorFormVisible: false,
      floorFormVisible4Edit: false
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
    refresh () {
      this.$forceUpdate()
    },
    // 编辑
    handleEdit () {
      // 发送请求，提交表单数据
      this.$axios.post('/room/update', this.formData,
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
      this.$axios.post('/room/add', this.formData,
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
      this.$axios.get('/room/list',
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
      this.floorFormData = {}
      this.floorList = []
    },

    // 弹出添加窗口
    handleCreate () {
      // 重置表单数据
      this.resetForm()
      // 切换到第一个标签
      this.activeName = 'first'
      // 新增窗口可见
      this.dialogFormVisible = true
      const that = this
      that.$axios.get('/floor/list',
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        const tmp = response.data.data.records
        for (const r of tmp) {
          that.floorList.push(
            {
              label: r.name,
              value: r.id
            }
          )
        }
      })
    },
    // 弹出编辑窗口
    handleUpdate (row) {
      this.resetForm()
      // 发送请求，根据ID获取销售商数据
      this.$axios.get('/room/queryById?roomId=' + row.id + '&floorId=' + row.floor_id,
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
        this.$axios.get('/room/delete?roomId=' + row.id + '&floorId=' + row.floor_id,
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
