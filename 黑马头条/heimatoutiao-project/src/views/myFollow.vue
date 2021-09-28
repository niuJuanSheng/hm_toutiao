<template>
  <div class="list">
    <van-nav-bar title="我的关注" @click-left="$router.back()" left-arrow />
    <div v-for="(item,index) in followList" :key="item.id" class="box">
      <img :src="item.head_img | joinPath" alt="" />
      <div class="center">
        <p>{{ item.nickname }}</p>
        <span>{{ item.create_date? item.create_date : new Date() }}</span>
      </div>
      <span @click="unfollowFn(item.id,index)">取消关注</span>
    </div>
  </div>
</template>

<script>
import { follow_list,user_unfollow } from "@/api/user"
export default {
  data(){
    return {
      followList: [], // 关注列表
    }
  },
  created(){
    // 获取关注列表
    follow_list().then(res=>{
      console.log(20,res);
      this.followList = res.data.data;
    })
  },
  methods: {
    // 取消关注
    unfollowFn(id,index){
      user_unfollow(id).then(res=>{
        console.log(34,res);
        this.$toast({
          message: res.data.message
        })
        // 从列表中删除数据
        if(res.data.message == "取消关注成功"){
          this.followList.splice(index,1);
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.list {
  .box {
    display: flex;
    padding: 25px 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    > img {
      display: block;
      width: (50/360) * 100vw;
      height: (50/360) * 100vw;
      border-radius: 50%;
      padding: 0 10px;
    }
    > .center {
      flex: 1;
      > p {
        line-height: 30px;
        font-size: 14px;
      }
      > span {
        font-size: 12px;
        color: #999;
      }
    }
    > span {
      height: 30px;
      background-color: #eee;
      font-size: 13px;
      border-radius: 30px;
      line-height: 30px;
      padding: 0px 15px;
    }
  }
}
</style>