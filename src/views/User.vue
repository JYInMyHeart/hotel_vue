<template>
  <div>
    <div class="content-header">
      <h1><small>用户管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-row>
            <el-col :span="12">
              <el-input placeholder="用户名称" v-model="username" style="width: 200px;"
                        class="filter-item"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="butT" @click="delAll">批量删除</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="butT" @click="exportExcel">导出</el-button>
            </el-col>
            <el-col :span="6">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://localhost:8081/user/uploadUser"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="importExcel">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过30mb</div>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList.filter(d => d.name.includes(username))"
                  ref="multipleTable" @selection-change="handleSelectionChange" stripe highlight-current-row id="out-table">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="identity_id" label="工号" align="center"></el-table-column>
          <el-table-column prop="name" label="用户名" align="center"></el-table-column>
          <el-table-column prop="icon" label="头像" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.icon"  height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="pwd" label="密码" align="center"></el-table-column>
          <el-table-column prop="active" label="用户状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.active === 1 ? '已激活' : '未激活' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" :formatter="dateFormat" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="update_time" :formatter="dateFormat" label="更新时间" align="center"></el-table-column>
          <el-table-column prop="delete_time" :formatter="dateFormat" label="删除时间" align="center"></el-table-column>
          <el-table-column prop="role" label="用户权限" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.role === 1 ? '管理员' : '用户' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增标签弹层 -->
        <div class="add-form">
          <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="身份证号">
                          <el-input v-model="formData.identity_id"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="用户名">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="头像">
                          <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8081/user/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="密码">
                          <el-input type="password" v-model="formData.pwd"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="权限">
                          <el-select v-model="formData.authority" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in userRoleList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
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
          <el-dialog title="修改密码" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="身份证号">
                          <el-input v-model="formData.identity_id"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="用户名">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="头像">
                          <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8081/user/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="密码">
                          <el-input type="password" v-model="formData.pwd"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="权限">
                          <el-select v-model="formData.role" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in userRoleList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" >
                        <el-form-item label="是否激活">
                          <el-select v-model="formData.active" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in deletedList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
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

          <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import '@/dateFormat'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'

export default {
  name: 'User',
  data () {
    return {
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      edit: {},
      dataList: [], // 列表数据
      fileList: [],
      deletedList: [
        {
          label: '已激活',
          value: 1
        },
        {
          label: '未激活',
          value: 2
        }
      ],
      genderList: [
        {
          label: '女',
          value: 0
        },
        {
          label: '男',
          value: 1
        }
      ],
      userRoleList: [
        {
          label: '管理员',
          value: 1
        },
        {
          label: '用户',
          value: 2
        }
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      username: '',
      imageUrl: '',
      formData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的用户列表数据
      roleIds: [], // 新增和编辑表单中用户对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false, // 控制编辑窗口显示/隐藏
      delVisible: false, // 删除提示弹框的状态
      msg: '', // 记录每一条的信息，便于取id
      delarr: [], // 存放删除的数据
      multipleSelection: []
    }
  },
  created () {
    this.findPage()
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    importExcel: function () {
      this.$refs.upload.submit()
      this.findPage()
    },
    exportExcel: function () {
      const a = document.createElement('a')
      // 给a标签设置链接属性
      a.href = this.$axios.defaults.baseURL + '/user/excel'
      // 调用点击事件
      a.click()
    },
    refresh () {
      this.$forceUpdate()
    },
    // 批量删除
    delAll () {
      this.delVisible = true// 显示删除弹框
      const length = this.multipleSelection.length
      console.log(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].id)
      }
    },
    // 操作多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    deleteRow () {
      this.$axios.get('/user/delete', {
        params: {
          userId: this.delarr.join(',')
        },
        headers: {
          token: this.token
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      }).finally(() => {
        this.findPage()
        this.delVisible = false// 关闭删除提示模态框
      })
    },

    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 时间格式化
    dateFormat: function (row, column) {
      const date = row[column.property]
      if (date === undefined || date === null) {
        return ''
      }
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    beforeAvatarUpload (file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      const fd = new FormData()
      fd.append('file', file)
      const that = this

      new Promise(function (resolve) {
        that.$axios.post('/user/upload', fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              token: that.token
            }
          }).then((response) => {
          that.imgId = response.data.data.src
          that.imageUrl = that.$picturePath + response.data.data.src
          // resolve(that.imgId)
        }).catch(() => {
          this.$message.error('头像上传失败，请重新上传!')
        })
      }).then(function (id) {
        // that.$axios.get('/user/view/' + id)
        //   .then((response) => {
        //     that.imageUrl = response.request.responseURL
        //   })
      })
      return isJPGOrPNG && isLt2M
    },
    // 编辑
    handleEdit () {
      // 发送请求，提交表单数据
      this.formData.icon = this.imageUrl === null || this.imageUrl === '' ? this.formData.icon : this.imageUrl
      this.formData.update_time = new Date().Format('yyyy-MM-dd hh:mm:ss')
      this.$axios.post('/user/update', this.formData,
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
        this.findPage()
      })
    },
    // 添加
    handleAdd () {
      console.log(this.formData)
      this.formData.update_time = new Date().Format('yyyy-MM-dd hh:mm:ss')
      this.formData.create_time = this.formData.update_time
      this.formData.icon = this.imageUrl
      this.$axios.post('/user/add', this.formData,
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
      // 发送请求，获取分页数据
      this.$axios.get('/user/list',
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        // 把分页数据和总记录数据赋值给模型
        console.log(response.data.data)
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
      console.log('用户:' + row.identity_id)
      // 发送请求，根据ID获取用户数据
      this.$axios.get('/user/selectUserByIdentityID?identity_id=' + row.identity_id,
        {
          headers: {
            // 'content-type': 'application/json',
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
          this.imageUrl = this.formData.icon
        } else {
          this.$message.error(response.data.message)
        }
        this.findPage()
      })
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确认删除当前选中的记录吗?', '提示', { type: 'warning' }).then(() => {
        this.$axios.get('/user/delete?userId=' + row.id,
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
  },
  computed: {
    ...mapState(['token'])
  }
}
</script>

<style scoped>
.datatable {
  position: relative;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: rgb(96, 98, 102);
  overflow: hidden;
  flex: 1 1 0%;
}

.datatable td, .datatable th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
