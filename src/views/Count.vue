<template>
  <div id="app">
    <div class="content-header">
      <h1><small>统计管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="user" label="用户" align="center"></el-table-column>
          <el-table-column prop="notice" label="通知" align="center"></el-table-column>
          <el-table-column prop="introduce" label="简介" align="center"></el-table-column>
          <el-table-column prop="room" label="房间" align="center"></el-table-column>
          <el-table-column prop="picture" label="图片" align="center"></el-table-column>
          <el-table-column prop="declare" label="宣传" align="center"></el-table-column>
          <el-table-column prop="floor" label="楼层" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Count',
  data () {
    return {
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      edit: {},
      dataList: [], // 列表数据
      formData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的统计列表数据
      roleIds: [], // 新增和编辑表单中统计对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  created () {
    this.findPage()
  },
  methods: {

    // 分页查询
    findPage () {
      // 封装分页查询参数

      // 发送请求，获取分页数据
      this.$axios.get('/user/count',
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
    }
  },
  computed: {
    ...mapState(['token'])
  }
}
</script>

<style scoped>

</style>
