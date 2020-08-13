<template>
  <div id="app">
    <div class="content-header">
      <h1><small>图片管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container" style="margin-top: 10px">
      <div class="box">
        <div >
<!--          <el-input placeholder="名称/地址" v-model="pagination.queryString" style="width: 200px;" class="filter-item"-->
<!--                    @keyup.enter.native="handleFilter"></el-input>-->
            <el-button type="primary" class="butT" v-if="operationVisible" @click="handleCreate()">增加</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column prop="path" label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.path"  height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center"></el-table-column>
          <el-table-column label="操作" align="center" v-if="operationVisible">
            <template slot-scope="scope">
              <!--<el-button type="primary" size="mini">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>-->
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增标签弹层 -->
        <div class="add-form">
          <el-dialog title="新增图片" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="图片">
                          <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8081/picture/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                    </el-row>
                      <el-row>
                      <el-col :span="12">
                        <el-form-item label="描述">
                          <el-input
                            type="textarea"
                            autosize
                            placeholder="请输入描述内容"
                            v-model="formData.description"/>
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

        <!-- 编辑标签弹层 -->

        <div class="add-form">
          <el-dialog title="编辑图片" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="图片">
                          <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8081/picture/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="描述">
                          <el-input
                            type="textarea"
                            autosize
                            placeholder="请输入描述内容"
                            v-model="formData.description"/>
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
import '@/dateFormat'

export default {
  name: 'Picture',
  data () {
    return {
      autoUpload: true, // 自动上传
      imageUrl: '', // 模型数据，用于上传图片完成后图片预览
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      pagination: { // 分页相关属性
        currentPage: 1,
        pageSize: 6,
        total: 100,
        queryString: null
      },

      dataList: [], // 列表数据
      formData: {
        path: '',
        description: ''
      }, // 表单数据
      wareTypeMap: new Map(),
      wareTypeList: [
        {
          label: '标准仓库',
          value: 0
        },
        {
          label: '规划仓库',
          value: 1
        },
        {
          label: '优质仓库',
          value: 2
        }
      ],
      tableData: [], // 添加表单窗口中检查组列表数据
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false, // 控制编辑窗口显示/隐藏
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created () {
    this.findPage()
  },
  computed: {
    operationVisible () {
      // eslint-disable-next-line eqeqeq
      return this.userRole == 1
    },
    ...mapState(['token', 'userRole'])
  },
  methods: {
    // 添加
    handleAdd () {
      this.$axios.post('/picture/add', this.formData,
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(response.data.message)
        }
      }).finally(() => {
        this.dialogFormVisible = false
        this.findPage()
      })
    },
    // 分页查询
    findPage () {
      // 请求后台数据
      this.$axios.get('/picture/list',
        {
          headers: {
            token: this.token
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.dataList = response.data.data.records
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // 重置表单
    resetForm () {
      this.formData = {}
      this.activeName = 'first'
      this.imageUrl = null
    },
    // 弹出添加窗口
    handleCreate () {
      this.dialogFormVisible = true
      this.resetForm()
      // 发送ajax,获取所有检查组列表数据
      this.$axios.get('/picture/list',
        {
          headers: {
            'content-type': 'application/json',
            token: this.token
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.records
        } else {
          this.$message.error(response.data.message)
        }
      })
    },

    // 弹出编辑窗口
    handleUpdate (row) {
      // 发送请求，根据ID获取用户数据
      this.$axios.get('/picture/queryById?pictureId=' + row.id,
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
          this.imageUrl = this.formData.path
        } else {
          this.$message.error(response.data.message)
        }
      })
    },

    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    beforeAvatarUpload (file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }

      const fd = new FormData()
      fd.append('file', file)
      const that = this

      new Promise(function (resolve) {
        that.$axios.post('/picture/upload', fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              token: that.token
            }
          }).then((response) => {
          that.imgId = response.data.data.src
          that.imageUrl = that.$picturePath + response.data.data.src
          that.formData.path = that.imageUrl
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
      this.formData.path = this.imageUrl === null || this.imageUrl === '' ? this.formData.icon : this.imageUrl

      // 发送请求，提交表单数据
      this.$axios.post('/picture/update', this.formData,
        { headers: { token: this.token } }
      ).then((response) => {
        if (response.data.code === 200) {
          // 返回成功，提示编辑成功
          this.$message.success('更新完成')
          // 隐藏编辑窗口
          this.dialogFormVisible4Edit = false
          // 刷新当前页
          this.findPage()
        } else {
          // 返回失败，提示编辑失败
          this.$message.error(response.data.message)
        }
      })
    },

    // 切换页码
    handleCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.findPage()
    },

    // 删除
    handleDelete (row) {
      this.$confirm('确认删除当前选中的记录吗?', '提示', { type: 'warning' }).then(() => {
        this.$axios.get('/picture/delete?pictureId=' + row.id,
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
</style>
