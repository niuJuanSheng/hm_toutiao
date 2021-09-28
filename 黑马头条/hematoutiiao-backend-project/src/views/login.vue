<template>
    <div class="login">
        <div class="container">
            <div class="avatar">
                <img src="../assets/avatar.jpg" alt="">
            </div>
            <div>
                <el-input
                    v-model="user.username"
                    placeholder="请输入手机号码"
                    prefix-icon="el-icon-user-solid">
                </el-input>
                <el-input
                    show-password
                    v-model="user.password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-key">
                </el-input>
                <el-button @click="loginFn" class="login-btn" type="primary">登录</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import { login } from "@/api/user"
export default {
    data(){
        return {
            user: {
                username: "17354567678",
                password: "123"
            }
        }
    },
    methods: {
        // 登录
        loginFn(){
            // 校验用户输入内容
            let phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
            let pwRge = /^.{3,10}$/;
            // if(!phoneReg.test(this.user.username) || !pwRge.test(this.user.password)){
            //     this.$message({
            //         message: "输入内容不合法！",
            //         type: "warning"
            //     })
            //     return
            // }
            // 通过校验，进行登录
            login(this.user).then(res=>{
                if(res.data.message == "登录成功"){
                    localStorage.setItem("hm-token-backend",res.data.data.token);
                    localStorage.setItem("hm-userid-backend",res.data.data.user.id);
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    // 登录成功跳转到首页
                    this.$router.push("/index/home")
                }else{
                    this.$message.error(res.data.message);
                }

            })
        }
    }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .el-input{
        margin-bottom: 20px;
    }
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>