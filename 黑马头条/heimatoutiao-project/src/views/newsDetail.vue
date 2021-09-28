<template>
<div class="articaldetail">
    <div class="header">
        <div class="left">
            <van-icon name="arrow-left back"
                      @click="$router.back()" />
            <span class="iconfont iconnew new"></span>
        </div>
        <span @click="followFn" :class="{active: newsObj.has_follow}">{{ newsObj.has_follow?'已关注':'关注' }}</span>
    </div>
    <div class="detail">
        <div class="title">{{newsObj.title}}</div>
        <div class="desc">
            <span>{{newsObj.user&&newsObj.user.nickname}}</span> &nbsp;&nbsp;
            <span>2019-9-9</span>
        </div>
        <!-- 内容 start -->
        <div v-if="newsObj.type==1" class="content" v-html="newsObj.content"></div>
        <div v-if="newsObj.type==2" class="content" >
          <video :poster="videoCover" :src="newsObj.content" controls></video>
        </div>
        <!-- 内容 end -->
        <div class="opt">
            <span class="like" @click="likeFn" :class="{red: newsObj.has_like}">
                <van-icon name="good-job-o" />
                {{ newsObj.like_length>=0?newsObj.like_length:"点赞" }}
            </span>
            <span class="chat">
                <van-icon name="chat"
                          class="w" />微信
            </span>
        </div>
    </div>
    <!-- 精彩跟帖 -->
    <div class="keeps">
        <h2>精彩跟帖</h2>
        <div class="item">
            <div class="head">
                <img src=""
                     alt />
                <div>
                    <p>火星网友</p>
                    <span>2小时前</span>
                </div>
                <span>回复</span>
            </div>
            <div class="text">文章说得很有道理</div>
        </div>
        <div class="more">更多跟帖</div>
    </div>
    <!-- 底部评论块 -->
    <hmComment :newsObj="newsObj"></hmComment>
</div>
</template>

<script>
import { newsDetail, post_like } from "@/api/newsDetail"
// import videoCover from "@/assets/小何同学.png"
import videoCover from "@/assets/高木同学.jpg"
import { user_follows,user_unfollow } from "@/api/user"
import hmComment from "@/components/hmComment.vue"
export default {
  components: {hmComment},
  data(){
    return {
      newsObj: {},
      videoCover
    }
  },
  created(){
    // 请求新闻文章详情
    let id = this.$route.query.id;
    newsDetail(id).then(res=>{
      console.log(57,res);
      this.newsObj = res.data.data;
    })
  },
  methods: {
    // 点赞、取消点赞
    likeFn(){
      post_like(this.newsObj.id).then(res=>{
        console.log(78,res);
        // 实时同步效果
        this.newsObj.has_like = !this.newsObj.has_like;
        this.newsObj.has_like?this.newsObj.like_length++:this.newsObj.like_length--;
        this.$toast({
          message: res.data.message
        })
      })
    },
    // 关注、取消关注
    followFn(){
      console.log(this.newsObj);
      if(this.newsObj.has_follow){
        // 已关注
        // 取消关注
        user_unfollow(this.newsObj.user.id).then(res=>{
          this.$toast({
            message: res.data.message
          })
          if(res.data.message=="取消关注成功"){
            this.newsObj.has_follow = false;
          }
        })
      }else{
        // 未关注，需要进行关注
        user_follows(this.newsObj.user.id).then(res=>{
          console.log(77,res);
          this.$toast({
            message: res.data.message
          })
          if(res.data.message=="关注成功"){
            this.newsObj.has_follow = true;
          }
        })
      }

 
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  padding: 0px 10px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  > .left {
    height: 100%;
    vertical-align: middle;
    position: relative;
    .van-icon {
      position: absolute;
      top: 15px;
      left: 0;
    }
    > span {
      margin-left: 22px;
      font-size: 50px;
    }
  }
  > span {
    padding: 5px 15px;
    background-color: #f00;
    color: #fff;
    text-align: center;
    border-radius: 15px;
    font-size: 13px;
    &.active{
      background-color: #fff;
      color: #000;
      border: 1px solid rgb(31, 31, 31);
    }
  }
}
.detail {
  padding: 15px;
  .title {
    font-size: 18px;
    font-weight: bold;
    padding: 10px 0;
  }
  .desc {
    line-height: 30px;
    color: #999;
    font-size: 13px;
  }
  .content {
    // text-indent: 2em;
    line-height: 24px;
    font-size: 15px;
    padding-bottom: 30px;
    width: 100%;
    /deep/ img{
      width: 100%;
    }
  }
}
.opt {
  display: flex;
  justify-content: space-around;
  .like,
  .chat {
    height: 25px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 15px;
  }
  .w {
    color: rgb(84, 163, 5);
  }
  .red{
    color: red;
  }
}
.keeps {
  border-top: 5px solid #ddd;
  padding: 0 15px;
  > h2 {
    line-height: 50px;
    text-align: center;
  }
  .item {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > img {
        width: (50/360) * 100vw;
        height: (50/360) * 100vw;
        display: block;
        border-radius: 50%;
      }
      > div {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        > span {
          font-size: 12px;
          color: #999;
          line-height: 25px;
        }
      }
      > span {
        color: #999;
        font-size: 13px;
      }
    }
    .text {
      font-size: 14px;
      color: #333;
      padding: 20px 0 10px 0;
    }
  }
  .more {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 15px;
    margin: 20px auto;
    font-size: 13px;
  }
}
</style>