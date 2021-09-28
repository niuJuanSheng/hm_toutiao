<template>
<div id="app">
    <div class="container">
        <div class="close"><span class="iconfont iconicon-test"></span></div>
        <div class="logo"><span class="iconfont iconnew"></span></div>
        <div class="inputs">
            <!-- <input placeholder="请输入手机号" class="input">
            <input placeholder="密码" class="input" type="password"> -->
            <!-- 
                使用自定义组件的时候，当我们给标签设置属性，
                这些属性会自动成为组件内根标签的属性，（props中的属性除外）
             -->
             <!-- 
                 v-model: 
                 功能一：能双休绑定表单元素的value属性
                 功能二：能够监听表单元素的input事件，
                 并将input事件中传递过来的数据同步给v-model绑定的变量。
              -->
            <hmInput ref="username" v-model="user.username" :reg="/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/" placeholder="请输入手机号"></hmInput>
            <hmInput ref="password" v-model="user.password" :reg="/^.{3,16}$/" placeholder="请输入密码"></hmInput>
        </div>
        <p class="tips">
            没有账号？
            <a href="#/register" class="">去注册</a>
        </p>
        <!-- <van-icon name="star-o" /> -->
        <van-button icon="star-o" round type="danger" block @click="loginFn">登录按钮</van-button>
    </div>
</div>
</template>

<script>
import hmInput from "@/components/hmInput.vue"
import { login } from "@/api/user"
export default {
    components: { hmInput },
    data(){
        return {
            user: {
                username: "17354567678",
                password: ""
            }
        }
    },
    methods: {
        // 登录
        loginFn(){
            
            // 添加判断-当用户输入内容不正确的时候 添加判断阻止请求
            // 可以直接拿到封装组件中的isOk进行判断
            let { username,password } = this.$refs;
            if(!username.isOk || !password.isOk){
                this.$toast.fail("输入内容不合法！")
                return
            }
            login(this.user).then(res=>{
                if(res.data.statusCode){
                    // 登录失败
                }else{
                    // 保存用户信息
                    console.log(61,res);
                    // localstorage
                    localStorage.setItem("hm-token-67",res.data.data.token);
                    localStorage.setItem("hm-user-id-67",res.data.data.user.id);
                    // 登录成功，跳转首页
                    console.log(69,this.$route.hash);
                    if(this.$route.hash){
                        // 当从其他页面跳转到登录页面的时候，登录成功需要跳转回去
                        this.$router.push(this.$route.hash.split("#")[1]);
                    }else{
                        // 直接访问登录页面，登录成功后跳转到首页
                        this.$router.push("/index")
                    }
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