<template>
  <div id="paper">
    <h1 class="login_title" style="font-family: monospace;padding-top: 40px">房间管理系统</h1>
    <el-tabs v-model="activeName" type="card" class="login-container" label-position="left">
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginForm" ref="loginForm" :rules="rules" label-position="left"
                 label-width="0px" v-loading="loading">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.identity_id"
                      auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.pwd"
                      auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <!-- 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 -->
            <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" class="identifyInput"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="identifyBox">
              <div @click="refreshCode">
                <Code :identifyCode="identifyCode"></Code>
              </div>
              <el-button @click="refreshCode" type='text' class="textBtn">看不清，换一张</el-button>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="login">登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form label-position="left" status-icon label-width="0px" v-loading="loading" ref="formData" :rules="rules1" :model="formData">
          <el-form-item prop="identity_id">
            <el-input v-model="formData.identity_id" placeholder="身份证号"/>
          </el-form-item>

          <el-form-item prop="name">
            <el-input v-model="formData.name" placeholder="用户名"/>
          </el-form-item>

          <el-form-item  prop="pwd">
            <el-input type="password" v-model="formData.pwd" placeholder="密码"/>
          </el-form-item>

          <el-form-item prop="repwd">
            <el-input type="password" v-model="formData.repwd" placeholder="确认密码"/>
          </el-form-item>

<!--          <el-form-item prop="verifyCode">-->
<!--            &lt;!&ndash; 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 &ndash;&gt;-->
<!--            <el-input v-model="formData.verifyCode" placeholder="请输入验证码" class="identifyInput"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <div class="identifyBox">-->
<!--              <div @click="refreshCode">-->
<!--                <Code :identifyCode="identifyCode1"></Code>-->
<!--              </div>-->
<!--              <el-button @click="refreshCode" type='text' class="textBtn">看不清，换一张</el-button>-->
<!--            </div>-->
<!--          </el-form-item>-->
          <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="register">注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Code from '@/components/Code.vue'
import '@/dateFormat'
export default {
  name: 'Login',
  components: {
    Code
  },
  data () {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        console.log('validateVerifyCode:', value)
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }

    return {
      rules: {
        identity_id: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '密码长度最少为4位',
            trigger: 'blur'
          }
        ],
        verifyCode: [
          {
            required: true,
            trigger: 'blur',
            validator: validateVerifyCode
          }
        ]
      },
      rules1: {
        identity_id: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '密码长度最少为4位',
            trigger: 'blur'
          }
        ],
        repwd: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      },
      formData: {},
      checked: true,
      loginForm: {
        identity_id: '',
        pwd: '',
        verifyCode: ''
      },
      loading: false,
      identifyCodes: '1234567890',
      identifyCode: '',
      identifyCode1: '',
      activeName: 'login'
    }
  },
  mounted () {
    // 验证码初始化
    this.identifyCode = ''
    this.identifyCode1 = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    // 登录
    login () {
      const _this = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          _this.$axios.post('/user/login', _this.loginForm,
            { headers: { 'Content-Type': 'application/json' } })
            .then((response) => {
              if (response.data.code === 200) {
                const data = response.data.data
                _this.$store.commit('login', data)
                const path = _this.$route.query.redirect
                _this.$router.replace({ path: path === '/' || path === undefined ? '/main' : path })
              }
            })
        }
      })
    },
    register () {
      const _this = this
      this.formData.update_time = new Date().Format('yyyy-MM-dd hh:mm:ss')
      this.formData.create_time = this.formData.update_time
      this.$refs.formData.validate(valid => {
        if (valid) {
          _this.$axios.post('/user/add', _this.formData,
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          ).then((response) => {
            if (response.data.code === 200) {
              // 保存成功，提示正确消息
              _this.$message.success('添加成功')
              _this.activeName = 'login'
            } else {
              // 保存失败，提示错误消息
              _this.$message.error(response.data.message)
            }
          })
        }
      })
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
        this.identifyCode1 += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
      console.log(this.identifyCode)
      console.log(this.identifyCode1)
    }
  }
}
</script>

<style scoped>
#paper {
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 40px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}

.identifyBox {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
}
</style>
