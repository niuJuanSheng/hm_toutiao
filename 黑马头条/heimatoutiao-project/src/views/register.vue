<template>
<div class="container">
    <div class="close"><span class="iconfont iconicon-test"></span></div>
    <div class="logo"><span class="iconfont iconnew"></span></div>
    <div class="inputs">
            <hmInput ref="username" v-model="user.username" :reg="/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/" placeholder="请输入手机号"></hmInput>
            <hmInput ref="nickname" v-model="user.nickname" :reg="/^.{1,10}$/" placeholder="昵称"></hmInput>
            <hmInput ref="password" v-model="user.password" type="password" :reg="/^.{3,16}$/" placeholder="请输入密码"></hmInput>
    </div>
    <p class="tips">
        有账号？
        <a href="#/login" class="">去登录</a>
    </p>
    <van-button round type="primary" block @click="registerFn">注册按钮</van-button>
</div>
</template>

<script>
import hmInput from "@/components/hmInput.vue"
import { register } from "@/api/user"
export default {
    components: {
        hmInput
    },
    data(){
        return {
            user: {
                username: "15234345687",
                password: "123",
                nickname: ""
            }
        }
    },
    methods: {
        // 注册
        registerFn(){
            // 获取isOk用于判断用户输入是否正确
            let { username,password,nickname } = this.$refs;
            if(!username.isOk || !password.isOk || !nickname.isOk ){
                this.$toast.fail("内容输入不合法！")
                return
            }
            // 进行注册请求
            register(this.user).then(res=>{
                console.log(45,res);
                if(res.data.message === "注册成功"){
                    this.$router.push({
                        path: "/login"
                    })
                }
                this.$toast({
                    message: res.data.message
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
}

.close {
  span {
    font-size: (27 / 360) * 100vw;
  }
}

.logo {
  display: flex;
  justify-content: center;

  span {
    display: block;
    font-size: (126 / 360) * 100vw;
    color: #d81e06;
  }
}

.inputs {
  input {
    margin-bottom: 20px;
  }
}

.tips {
  text-align: right;
  margin-bottom: 20px;

  a {
    color: #3385ff;
  }
}
</style>