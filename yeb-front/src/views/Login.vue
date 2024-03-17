<template>
  <div>
    <el-form ref="loginForm"
             v-loading="loading"
             :model="loginForm"
             :rules="rules"
             class="loginContainer"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-spinner="el-icon-loading"
             element-loading-text="正在登录">
      <h3 class="loginTitle">系统登录</h3>
      <!--      输入用户名-->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" auto-complete="false" placeholder="请输入用户名" type="text"></el-input>
      </el-form-item>
      <!--      输入密码-->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" auto-complete="false" placeholder="请输入密码"
                  type="password"></el-input>
      </el-form-item>
      <!--      点击图片更换验证码-->
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="false" placeholder="点击图片更换验证码"
                  style="width: 250px;margin-right: 5px"
                  type="text"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button style="width: 100%" type="primary" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>


export default {
  name: "Login",
  data() {
    return {
      //点击跟换验证码
      captchaUrl: '/captcha?time=' + new Date(),
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      loading: false,
      checked: true,
      rules: {
        // trigger 什么时候触发 blur失去焦点的时候触发
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/captcha?time' + new Date();
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp => {
            if (resp) {
              this.loading = false;
              //存储用户token
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem('tokenStr', tokenStr)
              //跳转首页
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
            }
          })
        } else {
          this.$message.error('请输入所有字段!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer {
  /*边框*/
  border-radius: 15px;
  /*内边距*/
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: aliceblue;
  border: 1px solid #eaeaea;
  /*阴影*/
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

</style>