<template>
<div class="personal">
    <router-link to="/edit_profile">
        <div class="profile">
            <img  :src="userInfo.head_img||'http://img1.imgtn.bdimg.com/it/u=3757784226,1202878475&fm=26&gp=0.jpghttp://img1.imgtn.bdimg.com/it/u=3757784226,1202878475&fm=26&gp=0.jpg'" alt />
            <div class="profile-center">
                <div class="name">
                    <span class="iconfont" :class="{iconxingbienan: userInfo.gender==1,iconxingbienv: userInfo.gender==0}"></span>{{userInfo.nickname}}
                </div>
                <div class="time">{{new Date()|formatDate}}</div>
            </div>
            <span class="iconfont iconjiantou1"></span>
        </div>
    </router-link>
    <div class="content">
        <van-cell @click="$router.push('/myFollow')" title="我的关注" is-link value="关注的用户" />
        <van-cell title="我的跟帖" is-link value="跟帖/回复" />
        <van-cell @click="$router.push('/myStar')" title="我的收藏" is-link value="文章与视频" />
        <van-cell title="设置" is-link />
    </div>
    <van-button round type="danger" block @click="logout">退出</van-button>
</div>
</template>

<script>
import { personal } from "@/api/user"
export default {
    data(){
        return {
            userInfo: {}
        }
    },
    created(){
        let id = localStorage.getItem("hm-user-id-67");
        personal(id).then(res=>{
            console.log(37,res);
            this.userInfo = res.data.data;
        })
    },
    methods: {
        // 退出功能
        logout(){
            // 清除token和id
            localStorage.removeItem("hm-token-67");
            localStorage.removeItem("hm-user-id-67");
            // 跳转到登录页面
            this.$router.push("/login");
        }
    }
}
</script>
<style lang="less" scoped>
.personal{
    width: 100vw;
    height: 100vh;
    background-color: #eee;
}
a{
    color: #666;
}
.profile {
  display: flex;
  padding: 20px 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 5px #ddd solid;

  img {
    width: (70 / 360) * 100vw;
    height: (70 / 360) * 100vw;
    border-radius: 50%;
  }

  .profile-center {
    flex: 1;
    padding: 0 10px;
  }

  .name {
    span {
      color: #75b9eb;
    }
  }

  .time {
    color: #666;
    font-size: 14px;
    margin-top: 5px;
  }
}
// 框架的组件名就是类名
.van-cell{
    background-color: #eee;
}
.van-button{
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    background: #eb6112;
    width: 90%;
}
</style>