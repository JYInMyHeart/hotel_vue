<template>
  <div>
    <el-menu
      :default-active="'/notice'"
      router
      mode="horizontal"
      background-color="black"
      text-color="white"
      active-text-color="red"
      style="min-width: 1300px">
      <el-menu-item v-for="(item,i) in menu" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>
      <el-button class="el-icon-switch-button" v-on:click="logout" type="info" style="font-size: 20px;float: right"></el-button>
      <div><img style="height: 40px; width : 60px;float: right;color: white; padding: 10px" :src="logo" /></div>
      <div><a href = "javascript:void(0);" @click="updateMyInfo" ><label style="font-size: 20px;float: right;color: white; padding-top: 10px;padding-right: 10px">{{username}}</label></a> </div>
    </el-menu>
    <!--  修改个人信息 -->
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
</template>

<script>
import { createRouter } from '@/router'
import { mapState } from 'vuex'
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: [
        { name: '/user', navItem: '用户' },
        { name: '/notice', navItem: '通知' },
        { name: '/introduce', navItem: '简介' },
        { name: '/room', navItem: '房间信息' },
        { name: '/picture', navItem: '图片' },
        { name: '/declare', navItem: '宣传' },
        { name: '/floor', navItem: '楼层' },
        { name: '/count', navItem: '统计' }
      ],
      formData: {},
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
      dialogFormVisible4Edit: false,
      imageUrl: '',
      activeName: 'first'// 添加/编辑窗口Tab标签名称

    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.replace('/')
      // 清空路由，防止路由重复加载
      this.$router.matcher = createRouter.matcher
    },

    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    handlePictureCardPreview (file) {
      console.log(file.url)
      if (file.url !== null && file.url !== undefined && file.url !== '') {
        this.dialogImageUrl = file.url
      } else {
        this.dialogImageUrl = this.logo
      }
      this.dialogVisible = true
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
    updateMyInfo () {
      const that = this
      // 发送请求，根据ID获取用户数据
      that.$axios.get('/user/selectUserByIdentityID?identity_id=' + that.userId,
        {
          headers: {
            // 'content-type': 'application/json',
            token: that.token
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 弹出编辑窗口
          that.dialogFormVisible4Edit = true
          // 选中第一个Tab标签
          that.activeName = 'first'
          // 把数据赋值给formData
          that.formData = response.data.data.records[0]
          that.imageUrl = that.logo
        } else {
          that.$message.error(response.data.message)
        }
      })
    },
    handleEdit () {
      const that = this
      // 发送请求，提交表单数据
      that.formData.icon = this.imageUrl === null || that.imageUrl === '' ? that.formData.icon : that.imageUrl
      that.formData.update_time = new Date().Format('yyyy-MM-dd hh:mm:ss')
      that.$axios.post('/user/update', that.formData,
        { headers: { token: this.token } }
      ).then((response) => {
        if (response.data.code === 200) {
          that.$message.success('更新完成')
          that.dialogFormVisible4Edit = false
          that.$store.commit('updateInfo', that.formData)
        } else {
          // 返回失败，提示编辑失败
          that.$message.error(response.data.message)
        }
      })
    }
  },
  computed: {
    menu () {
      // eslint-disable-next-line eqeqeq
      if (this.userRole != 1) {
        return this.navList.filter(n => !n.name.endsWith('user') && !n.name.endsWith('count'))
      } else {
        return this.navList
      }
    },
    ...mapState(['username', 'userRole', 'logo', 'userId', 'token'])
  }
}
</script>

<style scoped>
  a{
    text-decoration: none;
  }
 .el-menu{
   background-color: #B3C0D1;
   color: #333;
 }
  span {
    pointer-events: none;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
